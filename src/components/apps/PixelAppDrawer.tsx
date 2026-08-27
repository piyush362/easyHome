import React, {
  forwardRef,
  useState,
  useMemo,
  useCallback,
  useImperativeHandle,
  useRef,
  useEffect,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
  BackHandler,
  Platform,
} from 'react-native';
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RotateCw, Search, X} from 'lucide-react-native';
import {useTheme} from '../../theme';
import {useAppDispatch, useAppSelector, fetchInstalledApps} from '../../store';
import {AppsService} from '../../services';
import {InstalledApp, DrawerColumns, IconShape} from '../../types/models';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const HORIZONTAL_PADDING = 12;

export interface PixelAppDrawerProps {
  onClose?: () => void;
  onOpen?: () => void;
}

export interface PixelAppDrawerRef {
  open: () => void;
  close: () => void;
  expand: () => void;
  collapse: () => void;
  isOpen: () => boolean;
}

const PixelAppDrawerComponent = forwardRef<PixelAppDrawerRef, PixelAppDrawerProps>(
  ({onClose, onOpen}, ref) => {
    const {colors, isDark} = useTheme();
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const sheetRef = useRef<BottomSheet>(null);

    const installedApps = useAppSelector(state => state.apps.installedApps);
    const isLoading = useAppSelector(state => state.apps.isLoading);
    const drawerColumns: DrawerColumns =
      useAppSelector(state => state.settings.appearance.drawerColumns) || 5;
    const drawerIconShape: IconShape =
      useAppSelector(state => state.settings.appearance.drawerIconShape) ||
      'circle';

    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Stop below the status bar with safe insets
    const topInset = insets.top > 0 ? insets.top + 8 : 32;
    const bottomPadding = insets.bottom > 0 ? insets.bottom + 90 : 110;
    const snapPoints = useMemo(() => ['94%'], []);

    // Dynamic measurements based on drawerColumns (3, 4, 5)
    const itemWidth = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2) / drawerColumns;

    const {containerSize, iconSize, labelSize} = useMemo(() => {
      switch (drawerColumns) {
        case 3:
          return {containerSize: 64, iconSize: 56, labelSize: 13};
        case 4:
          return {containerSize: 56, iconSize: 48, labelSize: 12};
        case 5:
        default:
          return {containerSize: 48, iconSize: 42, labelSize: 11};
      }
    }, [drawerColumns]);

    // Border radius based on drawerIconShape
    const {containerRadius, iconRadius} = useMemo(() => {
      switch (drawerIconShape) {
        case 'rounded':
          return {containerRadius: 14, iconRadius: 12};
        case 'square':
          return {containerRadius: 4, iconRadius: 4};
        case 'circle':
        default:
          return {
            containerRadius: containerSize / 2,
            iconRadius: iconSize / 2,
          };
      }
    }, [drawerIconShape, containerSize, iconSize]);

    useImperativeHandle(
      ref,
      () => ({
        open: () => {
          sheetRef.current?.snapToIndex(0);
          setIsOpen(true);
        },
        expand: () => {
          sheetRef.current?.expand();
          setIsOpen(true);
        },
        close: () => {
          sheetRef.current?.close();
          setIsOpen(false);
        },
        collapse: () => {
          sheetRef.current?.collapse();
        },
        isOpen: () => isOpen,
      }),
      [isOpen],
    );

    // Handle back button when drawer is open
    useEffect(() => {
      if (!isOpen) return;

      const onBackPress = () => {
        sheetRef.current?.close();
        setIsOpen(false);
        onClose?.();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => subscription.remove();
    }, [isOpen, onClose]);

    const handleSheetChange = useCallback(
      (index: number) => {
        const opened = index >= 0;
        setIsOpen(opened);
        if (opened) {
          onOpen?.();
        } else {
          setSearchQuery('');
          onClose?.();
        }
      },
      [onClose, onOpen],
    );

    const handleRefresh = useCallback(async () => {
      if (refreshing) return;
      setRefreshing(true);
      try {
        await dispatch(fetchInstalledApps(true));
      } finally {
        setRefreshing(false);
      }
    }, [dispatch, refreshing]);

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
        sheetRef.current?.close();
        setIsOpen(false);
      } catch (error: any) {
        console.warn(`[PixelAppDrawer] Failed to launch ${app.appName}:`, error);
        Alert.alert(
          'Cannot Open App',
          `Unable to launch ${app.appName}.\n\nError: ${
            error?.message || 'Unknown error'
          }`,
        );
      }
    };

    // Custom Backdrop with clean dark overlay
    const renderBackdrop = useCallback(
      (backdropProps: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...backdropProps}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
          opacity={0.65}
        />
      ),
      [],
    );

    const renderAppItem = ({item}: {item: InstalledApp}) => {
      return (
        <TouchableOpacity
          style={[styles.appGridItem, {width: itemWidth}]}
          onPress={() => handleLaunchApp(item)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={item.appName}>
          <View
            style={[
              styles.iconContainer,
              {
                width: containerSize,
                height: containerSize,
                borderRadius: containerRadius,
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                borderColor: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.06)',
              },
            ]}>
            {item.icon ? (
              <Image
                source={{uri: item.icon}}
                style={{
                  width: iconSize,
                  height: iconSize,
                  borderRadius: iconRadius,
                }}
                resizeMode="contain"
              />
            ) : (
              <Text
                style={[
                  styles.fallbackIconText,
                  {
                    color: colors.primary,
                    fontSize: containerSize * 0.45,
                  },
                ]}>
                {item.appName.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>

          <Text
            style={[
              styles.appNameText,
              {
                color: isDark ? '#F8FAFC' : '#0F172A',
                fontSize: labelSize,
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {item.appName}
          </Text>
        </TouchableOpacity>
      );
    };

    const headerBg = isDark
      ? 'rgba(15, 23, 42, 0.98)'
      : 'rgba(248, 250, 252, 0.98)';

    const iconColor = isDark ? '#94A3B8' : '#64748B';

    // Sticky Pinned Search Header inside FlatList
    const renderHeader = useCallback(
      () => (
        <View
          style={[
            styles.pinnedHeader,
            {
              backgroundColor: headerBg,
              borderBottomColor: isDark
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.05)',
            },
          ]}>
          <View
            style={[
              styles.searchPill,
              {
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                borderColor: isDark ? '#334155' : '#E2E8F0',
              },
            ]}>
            <View style={styles.leftSearchIcon}>
              <Search size={18} color={iconColor} strokeWidth={2.2} />
            </View>

            <TextInput
              style={[
                styles.searchInput,
                {color: isDark ? '#F8FAFC' : '#0F172A'},
              ]}
              placeholder="Search all apps"
              placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />

            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.actionButton}
                activeOpacity={0.7}
                accessibilityLabel="Clear search">
                <X size={18} color={iconColor} strokeWidth={2.4} />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={handleRefresh}
              style={styles.actionButton}
              activeOpacity={0.7}
              disabled={refreshing}
              accessibilityLabel="Refresh app list">
              {refreshing ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <RotateCw size={19} color={iconColor} strokeWidth={2.2} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      ),
      [
        headerBg,
        isDark,
        iconColor,
        searchQuery,
        handleRefresh,
        refreshing,
        colors.primary,
      ],
    );

    return (
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        topInset={topInset}
        enablePanDownToClose={true}
        enableDynamicSizing={false}
        onChange={handleSheetChange}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={[
          styles.dragHandle,
          {backgroundColor: isDark ? '#64748B' : '#94A3B8'},
        ]}
        backgroundStyle={[
          styles.bottomSheetBg,
          {
            backgroundColor: isDark
              ? 'rgba(15, 23, 42, 0.96)'
              : 'rgba(248, 250, 252, 0.96)',
          },
        ]}>
        {isLoading && installedApps.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text
              style={[
                styles.loadingText,
                {color: isDark ? '#CBD5E1' : '#475569'},
              ]}>
              Loading applications...
            </Text>
          </View>
        ) : (
          <BottomSheetFlatList
            key={`drawer-grid-${drawerColumns}`}
            style={styles.flatList}
            data={filteredApps}
            keyExtractor={(item: InstalledApp) => item.packageName}
            renderItem={renderAppItem}
            numColumns={drawerColumns}
            ListHeaderComponent={renderHeader}
            stickyHeaderIndices={[0]}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>🔍</Text>
                <Text
                  style={[
                    styles.emptyTitle,
                    {color: isDark ? '#F8FAFC' : '#0F172A'},
                  ]}>
                  No Apps Found
                </Text>
                <Text
                  style={[
                    styles.emptySubtitle,
                    {color: isDark ? '#94A3B8' : '#64748B'},
                  ]}>
                  No application matches "{searchQuery}"
                </Text>
              </View>
            }
            contentContainerStyle={[
              styles.listContent,
              {paddingBottom: bottomPadding},
            ]}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            initialNumToRender={25}
            maxToRenderPerBatch={25}
            windowSize={11}
          />
        )}
      </BottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  bottomSheetBg: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  drawerContainer: {
    flex: 1,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
  pinnedHeader: {
    marginHorizontal: -HORIZONTAL_PADDING,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
    borderBottomWidth: 1,
    zIndex: 10,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.10)',
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 14,
    borderWidth: 1,
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.08)',
  },
  leftSearchIcon: {
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
    paddingVertical: 0,
    paddingHorizontal: 4,
  },
  actionButton: {
    padding: 6,
    marginLeft: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 8,
  },
  appGridItem: {
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 2,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 6,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.10)',
  },
  fallbackIconText: {
    fontWeight: '700',
  },
  appNameText: {
    fontWeight: '500',
    textAlign: 'center',
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    paddingTop: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export const PixelAppDrawer = React.memo(PixelAppDrawerComponent);

