import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {useTheme} from '../../theme';
import {useAppDispatch, useAppSelector, fetchInstalledApps} from '../../store';
import {AppsService} from '../../services';
import {InstalledApp} from '../../types/models';
import type {RootStackScreenProps} from '../../navigation/types';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const NUM_COLUMNS = 4;
const ITEM_WIDTH = (SCREEN_WIDTH - 32) / NUM_COLUMNS;

export default function AppsScreen({navigation}: RootStackScreenProps<'Apps'>) {
  const {colors, appearance, isDark} = useTheme();
  const dispatch = useAppDispatch();

  const installedApps = useAppSelector(state => state.apps.installedApps);
  const isLoading = useAppSelector(state => state.apps.isLoading);

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch installed apps on mount
  useEffect(() => {
    dispatch(fetchInstalledApps(false));
  }, [dispatch]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchInstalledApps(true));
    setRefreshing(false);
  }, [dispatch]);

  // Filter apps based on search query
  const filteredApps = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return installedApps;
    }
    return installedApps.filter(
      app =>
        app.appName.toLowerCase().includes(query) ||
        app.packageName.toLowerCase().includes(query),
    );
  }, [installedApps, searchQuery]);

  const handleLaunchApp = async (app: InstalledApp) => {
    try {
      await AppsService.launchApp(app.packageName);
    } catch (error: any) {
      console.warn(`[AppsScreen] Failed to launch ${app.appName}:`, error);
      Alert.alert(
        'Cannot Open App',
        `Unable to launch ${app.appName}.\n\nError: ${error?.message || 'Unknown error'}`,
      );
    }
  };

  const renderAppItem = ({item}: {item: InstalledApp}) => {
    return (
      <TouchableOpacity
        style={styles.appGridItem}
        onPress={() => handleLaunchApp(item)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={item.appName}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
              borderColor: isDark ? '#334155' : '#E2E8F0',
            },
          ]}>
          {item.icon ? (
            <Image
              source={{uri: item.icon}}
              style={styles.appIcon}
              resizeMode="contain"
            />
          ) : (
            <Text
              style={[
                styles.fallbackIconText,
                {color: colors.primary},
              ]}>
              {item.appName.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>

        <Text
          style={[
            styles.appNameText,
            {color: colors.textPrimary},
          ]}
          numberOfLines={1}
          ellipsizeMode="tail">
          {item.appName}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />

      {/* Top Pixel-style Search Bar */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          accessibilityLabel="Go back to Home">
          <Text style={[styles.backIcon, {color: colors.textPrimary}]}>←</Text>
        </TouchableOpacity>

        <View
          style={[
            styles.searchPill,
            {
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderColor: isDark ? '#334155' : '#E2E8F0',
            },
          ]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, {color: colors.textPrimary}]}
            placeholder="Search apps..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
              activeOpacity={0.7}
              accessibilityLabel="Clear search">
              <Text style={[styles.clearIcon, {color: colors.textMuted}]}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Apps Count / Search Results Info */}
      <View style={styles.statusBarRow}>
        <Text style={[styles.countText, {color: colors.textSecondary}]}>
          {searchQuery
            ? `${filteredApps.length} results found`
            : `${installedApps.length} applications`}
        </Text>
      </View>

      {/* Apps Grid */}
      {isLoading && installedApps.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, {color: colors.textSecondary}]}>
            Loading applications...
          </Text>
        </View>
      ) : filteredApps.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={[styles.emptyTitle, {color: colors.textPrimary}]}>
            No Apps Found
          </Text>
          <Text style={[styles.emptySubtitle, {color: colors.textSecondary}]}>
            No application matches "{searchQuery}"
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredApps}
          keyExtractor={item => item.packageName}
          renderItem={renderAppItem}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
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
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    fontWeight: '600',
  },
  searchPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 26,
    paddingHorizontal: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
    padding: 0,
  },
  clearButton: {
    padding: 6,
  },
  clearIcon: {
    fontSize: 14,
    fontWeight: '700',
  },
  statusBarRow: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  countText: {
    fontSize: 13,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 8,
  },
  appGridItem: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    marginVertical: 12,
    paddingHorizontal: 4,
  },
  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  appIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  fallbackIconText: {
    fontSize: 24,
    fontWeight: '800',
  },
  appNameText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
  },
});
