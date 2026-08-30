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
import {Search, X, LayoutGrid} from 'lucide-react-native';
import {useTheme} from '../../../theme';
import {EHText, EHCard} from '../../../components';
import {InstalledApp} from '../../../types/models';
import {AppsService} from '../../../services';

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

  const filteredApps = useMemo(() => {
    if (!query.trim()) return installedApps;
    const lower = query.toLowerCase();
    return installedApps.filter(app =>
      app.appName.toLowerCase().includes(lower),
    );
  }, [installedApps, query]);

  const handleLaunch = async (pkg: string) => {
    try {
      await AppsService.launchApp(pkg);
    } catch (error: any) {
      Alert.alert('Cannot Open App', error?.message || 'Failed to open app');
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <EHCard style={styles.searchCard} elevation="low">
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.05)',
              borderColor: colors.border,
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
            <TouchableOpacity onPress={() => setQuery('')}>
              <X size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </EHCard>

      {/* Loading or App Grid */}
      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <EHText variant="body" style={styles.loaderText}>
            Loading applications...
          </EHText>
        </View>
      ) : (
        <FlatList
          data={filteredApps}
          keyExtractor={item => item.packageName}
          numColumns={4}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.appGridItem}
              activeOpacity={0.7}
              onPress={() => handleLaunch(item.packageName)}
              accessibilityRole="button"
              accessibilityLabel={item.appName}>
              {item.icon ? (
                <Image
                  source={{uri: `data:image/png;base64,${item.icon}`}}
                  style={styles.appIconImg}
                />
              ) : (
                <View
                  style={[
                    styles.placeholderIcon,
                    {backgroundColor: colors.primaryLight},
                  ]}>
                  <EHText variant="body" weight="700" color={colors.primary}>
                    {item.appName.charAt(0)}
                  </EHText>
                </View>
              )}
              <EHText
                variant="caption"
                weight="600"
                numberOfLines={2}
                style={styles.appNameText}>
                {item.appName}
              </EHText>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <EHText variant="body" color={colors.textSecondary}>
                No apps found matching "{query}"
              </EHText>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchCard: {
    padding: 12,
    borderRadius: 20,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    minHeight: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 6,
  },
  listContent: {
    paddingBottom: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  appGridItem: {
    width: '22%',
    alignItems: 'center',
  },
  appIconImg: {
    width: 54,
    height: 54,
    borderRadius: 14,
    marginBottom: 6,
  },
  placeholderIcon: {
    width: 54,
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  appNameText: {
    fontSize: 11,
    lineHeight: 14,
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
    paddingVertical: 40,
  },
});
