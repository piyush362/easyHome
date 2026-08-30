import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Swiper from 'react-native-swiper';
import {
  Plus,
  Sliders,
  LayoutGrid,
} from 'lucide-react-native';
import {useTheme} from '../../../theme';
import {EHText, EHCard} from '../../../components';
import {InstalledApp} from '../../../types/models';
import {
  HomeV2AppPickerModal,
  detectDefaultPackages,
} from './HomeV2AppPickerModal';
import {getItem, setItem} from '../../../database/storage';
import {AppsService, ContactsService} from '../../../services';

export interface FavoriteAppSlot {
  id: string;
  label: string;
  type: 'action' | 'app';
  actionKey?: string;
  packageName?: string;
  iconBase64?: string;
  bgColor: string;
  iconColor: string;
}

const STORAGE_KEY_FAV_PACKAGES = 'easyhome_fav_packages_v10';

export interface HomeV2FavoriteAppsGridProps {
  installedApps: InstalledApp[];
  onLaunchApp?: (app: FavoriteAppSlot) => void;
  onOpenDrawer: () => void;
}

interface GridTileItem {
  id: string;
  isAdd: boolean;
  packageName?: string;
  appName: string;
  icon?: string | null;
}

export function HomeV2FavoriteAppsGrid({
  installedApps,
  onOpenDrawer,
}: HomeV2FavoriteAppsGridProps) {
  const {colors, isDark} = useTheme();
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [pickerVisible, setPickerVisible] = useState(false);

  // Initialize selected packages on load
  useEffect(() => {
    try {
      const saved = getItem<string[]>(STORAGE_KEY_FAV_PACKAGES);
      if (saved && Array.isArray(saved) && saved.length > 0) {
        setSelectedPackages(saved);
        return;
      }
    } catch {
      // Fallback
    }

    if (installedApps.length > 0) {
      const defaults = detectDefaultPackages(installedApps);
      if (defaults.length > 0) {
        setSelectedPackages(defaults);
      }
    }
  }, [installedApps]);

  const handleSavePackages = (newPackages: string[]) => {
    setSelectedPackages(newPackages);
    try {
      setItem(STORAGE_KEY_FAV_PACKAGES, newPackages);
    } catch {
      // Ignore
    }
  };

  const handleTilePress = async (item: GridTileItem) => {
    if (item.isAdd) {
      setPickerVisible(true);
      return;
    }

    if (item.packageName) {
      const pkgLower = item.packageName.toLowerCase();
      if (
        pkgLower.includes('dialer') ||
        pkgLower.includes('telecom') ||
        item.appName.toLowerCase() === 'phone'
      ) {
        try {
          await ContactsService.openDialer();
          return;
        } catch {
          // Fallback to launchApp
        }
      }
      await AppsService.launchApp(item.packageName);
    }
  };

  // Build tile list: selected apps + '+' Add slots up to multiple of 9
  const tiles = useMemo(() => {
    const list: GridTileItem[] = selectedPackages.map((pkg, idx) => {
      const app = installedApps.find(a => a.packageName === pkg);
      return {
        id: `app-${pkg}-${idx}`,
        isAdd: false,
        packageName: pkg,
        appName: app?.appName || pkg,
        icon: app?.icon,
      };
    });

    const targetCount = Math.max(9, Math.ceil(list.length / 9) * 9);
    while (list.length < targetCount) {
      list.push({
        id: `add-slot-${list.length + 1}`,
        isAdd: true,
        appName: 'Add',
      });
    }

    return list;
  }, [selectedPackages, installedApps]);

  // Chunk tiles into pages of 9 for 3x3 Swiper
  const pages = useMemo(() => {
    const chunks: GridTileItem[][] = [];
    for (let i = 0; i < tiles.length; i += 9) {
      chunks.push(tiles.slice(i, i + 9));
    }
    return chunks.length > 0 ? chunks : [[]];
  }, [tiles]);

  // Render a 3x3 page (3 explicit rows with original squircle proportions)
  const renderGridPage = (pageItems: GridTileItem[], pageIndex: number) => {
    const row1 = pageItems.slice(0, 3);
    const row2 = pageItems.slice(3, 6);
    const row3 = pageItems.slice(6, 9);
    const rows = [row1, row2, row3];

    return (
      <View key={`page-${pageIndex}`} style={styles.gridPageContainer}>
        {rows.map((row, rowIndex) => (
          <View key={`row-${pageIndex}-${rowIndex}`} style={styles.gridRow}>
            {row.map((item, colIndex) => (
              <TouchableOpacity
                key={item.id || `tile-${pageIndex}-${rowIndex}-${colIndex}`}
                activeOpacity={0.75}
                onPress={() => handleTilePress(item)}
                onLongPress={() => setPickerVisible(true)}
                style={styles.gridItem}
                accessibilityRole="button"
                accessibilityLabel={item.appName}>
                {/* Squircle Tile with original natural proportions */}
                <View
                  style={[
                    styles.tileSquircle,
                    item.isAdd
                      ? {
                          backgroundColor: isDark
                            ? 'rgba(255, 255, 255, 0.03)'
                            : 'rgba(0, 0, 0, 0.02)',
                          borderColor: isDark
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(0, 0, 0, 0.08)',
                          borderStyle: 'dashed',
                          borderWidth: 1,
                        }
                      : {
                          backgroundColor: isDark
                            ? 'rgba(255, 255, 255, 0.08)'
                            : '#F8FAFC',
                          borderColor: isDark
                            ? 'rgba(255, 255, 255, 0.12)'
                            : 'rgba(0, 0, 0, 0.06)',
                        },
                  ]}>
                  {item.isAdd ? (
                    <Plus
                      size={22}
                      color={
                        isDark
                          ? 'rgba(255, 255, 255, 0.3)'
                          : 'rgba(0, 0, 0, 0.25)'
                      }
                      strokeWidth={1.8}
                    />
                  ) : item.icon ? (
                    <Image
                      source={{
                        uri: item.icon.startsWith('data:')
                          ? item.icon
                          : `data:image/png;base64,${item.icon}`,
                      }}
                      style={styles.customIconImg}
                    />
                  ) : (
                    <LayoutGrid size={26} color={colors.primary} />
                  )}
                </View>

                {/* Tile Label */}
                <EHText
                  variant="caption"
                  weight={item.isAdd ? '400' : '600'}
                  numberOfLines={1}
                  style={[
                    styles.tileLabel,
                    {
                      color: item.isAdd
                        ? colors.textMuted
                        : colors.textPrimary,
                      opacity: item.isAdd ? 0.6 : 1,
                    },
                  ]}>
                  {item.appName}
                </EHText>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <EHCard style={styles.gridCard} elevation="low">
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerTitleRow}>
          <EHText variant="heading2" weight="600">
            Favorite Apps
          </EHText>
          {selectedPackages.length > 9 && (
            <View
              style={[
                styles.countBadge,
                {
                  backgroundColor: isDark
                    ? 'rgba(99, 102, 241, 0.22)'
                    : 'rgba(99, 102, 241, 0.12)',
                },
              ]}>
              <EHText variant="caption" color={colors.primary} weight="600">
                {selectedPackages.length}
              </EHText>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => setPickerVisible(true)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Customize favorite apps">
          <Sliders size={13} color={colors.primary} style={styles.editIcon} />
          <EHText variant="caption" color={colors.primary} weight="600">
            Edit
          </EHText>
        </TouchableOpacity>
      </View>

      {/* 3x3 Grid with Swiper */}
      <View style={styles.contentWrapper}>
        {pages.length > 1 ? (
          <Swiper
            loop={false}
            showsPagination={true}
            paginationStyle={styles.pagination}
            dotStyle={[
              styles.dot,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(0, 0, 0, 0.15)',
              },
            ]}
            activeDotStyle={[
              styles.activeDot,
              {backgroundColor: colors.primary},
            ]}>
            {pages.map((pageItems, pageIndex) =>
              renderGridPage(pageItems, pageIndex),
            )}
          </Swiper>
        ) : (
          renderGridPage(pages[0] || [], 0)
        )}
      </View>

      {/* App Picker Modal */}
      <HomeV2AppPickerModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onSavePackages={handleSavePackages}
        installedApps={installedApps}
        selectedPackages={selectedPackages}
      />
    </EHCard>
  );
}

const styles = StyleSheet.create({
  gridCard: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 1,
    paddingHorizontal: 4,
  },
  editIcon: {
    marginRight: 3,
  },
  contentWrapper: {
    flex: 1,
  },
  gridPageContainer: {
    flex: 1,
    justifyContent: 'space-around',
    paddingBottom: 8,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  gridItem: {
    width: '31%',
    alignItems: 'center',
  },
  tileSquircle: {
    width: '100%',
    aspectRatio: 1.18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 3,
  },
  tileLabel: {
    fontSize: 11,
    lineHeight: 13,
    textAlign: 'center',
  },
  customIconImg: {
    width: 42,
    height: 42,
    borderRadius: 10,
  },
  pagination: {
    bottom: -6,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginHorizontal: 3,
  },
  activeDot: {
    width: 14,
    height: 5,
    borderRadius: 2.5,
    marginHorizontal: 3,
  },
});
