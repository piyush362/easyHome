import React, {useState, useMemo, useEffect} from 'react';
import {
  View,
  Modal,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Search, X, Check} from 'lucide-react-native';
import {useTheme} from '../../../theme';
import {EHText, EHButton} from '../../../components';
import {InstalledApp} from '../../../types/models';

export interface HomeV2AppPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSavePackages: (selectedPackages: string[]) => void;
  installedApps: InstalledApp[];
  selectedPackages: string[];
}

/**
 * Direct Package Name Search for 6 default apps:
 * Phone, Message, WhatsApp, YouTube, Camera, Gallery/Photos
 */
export function detectDefaultPackages(apps: InstalledApp[]): string[] {
  const result: string[] = [];

  // 1. Phone / Dialer package
  const phone = apps.find(a => {
    const p = a.packageName.toLowerCase();
    return (
      p === 'com.google.android.dialer' ||
      p === 'com.samsung.android.dialer' ||
      p === 'com.android.dialer' ||
      p === 'com.android.phone' ||
      p.endsWith('.dialer') ||
      p.includes('.telecom') ||
      p.includes('dialer')
    );
  });
  if (phone) result.push(phone.packageName);

  // 2. Message package
  const msg = apps.find(a => {
    const p = a.packageName.toLowerCase();
    return (
      !result.includes(a.packageName) &&
      (p === 'com.google.android.apps.messaging' ||
        p === 'com.samsung.android.messaging' ||
        p === 'com.android.mms' ||
        p.endsWith('.messaging') ||
        p.includes('.mms') ||
        p.includes('messaging'))
    );
  });
  if (msg) result.push(msg.packageName);

  // 3. WhatsApp package
  const wa = apps.find(a => {
    const p = a.packageName.toLowerCase();
    return (
      !result.includes(a.packageName) &&
      (p === 'com.whatsapp' || p === 'com.whatsapp.w4b')
    );
  });
  if (wa) result.push(wa.packageName);

  // 4. YouTube package
  const yt = apps.find(a => {
    const p = a.packageName.toLowerCase();
    return (
      !result.includes(a.packageName) &&
      (p === 'com.google.android.youtube')
    );
  });
  if (yt) result.push(yt.packageName);

  // 5. Camera package
  const cam = apps.find(a => {
    const p = a.packageName.toLowerCase();
    return (
      !result.includes(a.packageName) &&
      (p === 'com.google.android.googlecamera' ||
        p === 'com.sec.android.app.camera' ||
        p === 'com.android.camera' ||
        p.endsWith('.camera') ||
        p.includes('camera'))
    );
  });
  if (cam) result.push(cam.packageName);

  // 6. Gallery / Photos package
  const gal = apps.find(a => {
    const p = a.packageName.toLowerCase();
    return (
      !result.includes(a.packageName) &&
      (p === 'com.google.android.apps.photos' ||
        p === 'com.sec.android.gallery3d' ||
        p === 'com.android.gallery3d' ||
        p.endsWith('.gallery') ||
        p.includes('gallery') ||
        p.includes('photos'))
    );
  });
  if (gal) result.push(gal.packageName);

  return result;
}

export function HomeV2AppPickerModal({
  visible,
  onClose,
  onSavePackages,
  installedApps,
  selectedPackages: initialSelected,
}: HomeV2AppPickerModalProps) {
  const {colors, isDark, borderRadius} = useTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      if (initialSelected && initialSelected.length > 0) {
        setSelected(initialSelected);
      } else {
        setSelected(detectDefaultPackages(installedApps));
      }
      setQuery('');
    }
  }, [visible, initialSelected, installedApps]);

  const filteredApps = useMemo(() => {
    if (!query.trim()) return installedApps;
    const lower = query.toLowerCase();
    return installedApps.filter(app =>
      app.appName.toLowerCase().includes(lower),
    );
  }, [installedApps, query]);

  const togglePackage = (pkg: string) => {
    setSelected(prev =>
      prev.includes(pkg) ? prev.filter(p => p !== pkg) : [...prev, pkg],
    );
  };

  const handleSave = () => {
    onSavePackages(selected);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top + 8,
          },
        ]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTextCol}>
            <EHText variant="heading1" weight="700">
              Select Favorite Apps
            </EHText>
            <EHText variant="caption" color={colors.textSecondary}>
              Tap to add or remove ({selected.length} selected)
            </EHText>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={[
              styles.closeBtn,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.06)',
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Close">
            <X size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.md,
            },
          ]}>
          <Search size={18} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, {color: colors.textPrimary}]}
            placeholder="Search installed apps..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <X size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* 4-Column Grid of Installed Apps */}
        <FlatList
          data={filteredApps}
          keyExtractor={item => item.packageName}
          numColumns={4}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => {
            const isSelected = selected.includes(item.packageName);
            return (
              <TouchableOpacity
                style={styles.gridItem}
                activeOpacity={0.7}
                onPress={() => togglePackage(item.packageName)}
                accessibilityRole="checkbox"
                accessibilityState={{checked: isSelected}}
                accessibilityLabel={item.appName}>
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: isSelected
                        ? isDark
                          ? 'rgba(99, 102, 241, 0.25)'
                          : 'rgba(99, 102, 241, 0.12)'
                        : isDark
                        ? 'rgba(255, 255, 255, 0.06)'
                        : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}>
                  {item.icon ? (
                    <Image
                      source={{
                        uri: item.icon.startsWith('data:')
                          ? item.icon
                          : `data:image/png;base64,${item.icon}`,
                      }}
                      style={styles.appIcon}
                    />
                  ) : (
                    <View
                      style={[
                        styles.placeholderIcon,
                        {backgroundColor: colors.primaryLight},
                      ]}>
                      <EHText variant="body" weight="600" color={colors.primary}>
                        {item.appName.charAt(0)}
                      </EHText>
                    </View>
                  )}

                  {/* Checkmark Badge */}
                  {isSelected && (
                    <View
                      style={[
                        styles.checkBadge,
                        {backgroundColor: colors.primary},
                      ]}>
                      <Check size={11} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  )}
                </View>

                <EHText
                  variant="caption"
                  numberOfLines={1}
                  style={[
                    styles.appLabel,
                    {
                      color: isSelected
                        ? colors.primary
                        : colors.textPrimary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}>
                  {item.appName}
                </EHText>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <EHText variant="body" color={colors.textSecondary}>
                No apps found matching "{query}"
              </EHText>
            </View>
          }
        />

        {/* Footer with Safe Area Insets */}
        <View
          style={[
            styles.footer,
            {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
              paddingBottom: Math.max(insets.bottom, 14),
            },
          ]}>
          <EHButton
            label={`Save Favorites (${selected.length})`}
            variant="primary"
            onPress={handleSave}
            style={styles.saveBtn}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTextCol: {
    flex: 1,
    gap: 2,
    paddingRight: 8,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    minHeight: 46,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  gridItem: {
    width: '22%',
    alignItems: 'center',
  },
  iconContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    position: 'relative',
    marginBottom: 4,
  },
  appIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  placeholderIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  appLabel: {
    fontSize: 11,
    lineHeight: 13,
    textAlign: 'center',
    width: '100%',
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  saveBtn: {
    width: '100%',
  },
});
