import React, {useState, useMemo} from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Swiper from 'react-native-swiper';
import {Search, X} from 'lucide-react-native';
import {useTheme} from '../../../theme';
import {EHText} from '../../../components';
import {InstalledApp, DrawerGrid} from '../../../types/models';
import {AppsService} from '../../../services';
import {useAppSelector} from '../../../store';

export interface HomeV2AppsViewProps {
  installedApps: InstalledApp[];
  isLoading?: boolean;
}

export function HomeV2AppsView({
  installedApps,
  isLoading = false,
}: HomeV2AppsViewProps) {
  const {colors, isDark, borderRadius} = useTheme();
  const [query, setQuery] = useState('');
  const appListLayout =
    useAppSelector(state => state.settings.appearance.appListLayout) ||
    'vertical';
  const drawerGrid: DrawerGrid =
    useAppSelector(state => state.settings.appearance.drawerGrid) || '4x5';

  // Parse grid configuration: '3x5' | '3x6' | '4x5' | '4x6'
  const [colStr, rowStr] = (drawerGrid || '4x5').split('x');
  const columns = parseInt(colStr, 10) || 4;
  const rowsPerPage = parseInt(rowStr, 10) || 5;
  const appsPerPage = columns * rowsPerPage;

  const filteredApps = useMemo(() => {
    if (!query.trim()) return installedApps;
    const lower = query.toLowerCase();
    return installedApps.filter(
      app =>
        app.appName.toLowerCase().includes(lower) ||
        app.packageName.toLowerCase().includes(lower),
    );
  }, [installedApps, query]);

  // Chunk apps into pages for Swiper layout
  const pages = useMemo(() => {
    const chunks: InstalledApp[][] = [];
    for (let i = 0; i < filteredApps.length; i += appsPerPage) {
      chunks.push(filteredApps.slice(i, i + appsPerPage));
    }
    return chunks.length > 0 ? chunks : [[]];
  }, [filteredApps, appsPerPage]);

  const handleLaunch = async (pkg: string, name: string) => {
    try {
      await AppsService.launchApp(pkg);
    } catch (error: any) {
      Alert.alert('Cannot Open App', error?.message || `Failed to open ${name}`);
    }
  };

  const is3x = columns === 3;
  const is6Rows = rowsPerPage === 6;

  const itemWidth = is3x ? '31%' : '23%';
  const iconBoxSize = is3x ? (is6Rows ? 50 : 56) : (is6Rows ? 44 : 50);
  const iconImgSize = is3x ? (is6Rows ? 42 : 48) : (is6Rows ? 38 : 42);
  const iconRadius = is3x ? 15 : 13;
  const labelFontSize = is6Rows ? 10 : 11;
  const labelLineHeight = is6Rows ? 12 : 13;

  const renderAppItem = (item: InstalledApp) => {
    const iconUri = item.icon
      ? item.icon.startsWith('data:')
        ? item.icon
        : `data:image/png;base64,${item.icon}`
      : null;

    return (
      <TouchableOpacity
        key={item.packageName}
        style={[styles.appGridItem, {width: itemWidth}]}
        activeOpacity={0.7}
        onPress={() => handleLaunch(item.packageName, item.appName)}
        accessibilityRole="button"
        accessibilityLabel={item.appName}>
        <View
          style={[
            styles.iconContainer,
            {
              width: iconBoxSize,
              height: iconBoxSize,
              borderRadius: iconRadius,
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(255, 255, 255, 0.88)',
              borderColor: isDark
                ? 'rgba(255, 255, 255, 0.14)'
                : 'rgba(0, 0, 0, 0.06)',
            },
          ]}>
          {iconUri ? (
            <Image
              source={{uri: iconUri}}
              style={{
                width: iconImgSize,
                height: iconImgSize,
                borderRadius: is3x ? 12 : 10,
              }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.placeholderIcon,
                {
                  width: iconImgSize,
                  height: iconImgSize,
                  borderRadius: is3x ? 12 : 10,
                  backgroundColor: colors.primaryLight,
                },
              ]}>
              <EHText variant="body" weight="700" color={colors.primary}>
                {item.appName.charAt(0)}
              </EHText>
            </View>
          )}
        </View>

        <EHText
          variant="caption"
          weight="600"
          numberOfLines={2}
          style={[
            styles.appNameText,
            {
              color: colors.textPrimary,
              fontSize: labelFontSize,
              lineHeight: labelLineHeight,
            },
          ]}>
          {item.appName}
        </EHText>
      </TouchableOpacity>
    );
  };

  // Render a full-space swiper page with structured rows
  const renderSwiperPage = (pageApps: InstalledApp[], pageIndex: number) => {
    const rows: InstalledApp[][] = [];
    for (let r = 0; r < rowsPerPage; r++) {
      const rowSlice = pageApps.slice(r * columns, (r + 1) * columns);
      if (rowSlice.length > 0) {
        rows.push(rowSlice);
      }
    }

    return (
      <View key={`swiper-page-${pageIndex}`} style={styles.swiperPageContainer}>
        {rows.map((row, rIdx) => (
          <View key={`row-${rIdx}`} style={styles.swiperRow}>
            {row.map(item => renderAppItem(item))}
            {/* Pad incomplete last row with invisible placeholders */}
            {Array.from({length: columns - row.length}).map((_, emptyIdx) => (
              <View
                key={`empty-${emptyIdx}`}
                style={{width: itemWidth}}
              />
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Frosted Translucent Search Header */}
      <View
        style={[
          styles.searchCard,
          {
            backgroundColor: isDark
              ? 'rgba(15, 23, 42, 0.75)'
              : 'rgba(255, 255, 255, 0.85)',
            borderColor: isDark
              ? 'rgba(255, 255, 255, 0.15)'
              : 'rgba(255, 255, 255, 0.65)',
          },
        ]}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.04)',
              borderColor: isDark
                ? 'rgba(255, 255, 255, 0.12)'
                : 'rgba(0, 0, 0, 0.08)',
              borderRadius: borderRadius.md,
            },
          ]}>
          <Search size={18} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, {color: colors.textPrimary}]}
            placeholder="Search all apps..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery('')}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <X size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Frosted Translucent All-Apps Container */}
      <View
        style={[
          styles.appsContainerCard,
          {
            backgroundColor: isDark
              ? 'rgba(15, 23, 42, 0.65)'
              : 'rgba(255, 255, 255, 0.75)',
            borderColor: isDark
              ? 'rgba(255, 255, 255, 0.15)'
              : 'rgba(255, 255, 255, 0.7)',
          },
        ]}>
        {isLoading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            <EHText variant="body" style={styles.loaderText}>
              Loading applications...
            </EHText>
          </View>
        ) : filteredApps.length === 0 ? (
          <View style={styles.emptyBox}>
            <EHText variant="body" color={colors.textSecondary}>
              No apps found matching "{query}"
            </EHText>
          </View>
        ) : appListLayout === 'paginated' ? (
          /* OneUI Horizontal Swiper Layout (3x5, 3x6, 4x5, 4x6) */
          <View style={styles.swiperWrapper}>
            <Swiper
              loop={false}
              showsPagination={pages.length > 1}
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
              {pages.map((pageApps, idx) => renderSwiperPage(pageApps, idx))}
            </Swiper>
          </View>
        ) : (
          /* Vertical Scroll FlatList Layout */
          <FlatList
            key={`flatlist-${columns}`}
            data={filteredApps}
            keyExtractor={item => item.packageName}
            numColumns={columns}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            renderItem={({item}) => renderAppItem(item)}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 4,
  },
  searchCard: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    minHeight: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 6,
  },
  appsContainerCard: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
    overflow: 'hidden',
  },
  swiperWrapper: {
    flex: 1,
  },
  swiperPageContainer: {
    flex: 1,
    justifyContent: 'space-around',
    paddingHorizontal: 4,
    paddingBottom: 16,
  },
  swiperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  listContent: {
    paddingTop: 4,
    paddingBottom: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  appGridItem: {
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 4,
    overflow: 'hidden',
  },
  placeholderIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  appNameText: {
    textAlign: 'center',
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loaderText: {
    marginTop: 12,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  pagination: {
    bottom: -2,
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
