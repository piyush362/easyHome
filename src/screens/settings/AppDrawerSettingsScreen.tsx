import React from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {
  List,
  Layers,
  Check,
  Smartphone,
  LayoutGrid,
} from 'lucide-react-native';
import type {RootStackScreenProps} from '../../navigation/types';
import {
  useAppDispatch,
  useAppSelector,
  setAppListLayout,
  setDrawerGrid,
  setDrawerIconShape,
} from '../../store';
import {useTheme} from '../../theme';
import {
  ScreenWrapper,
  HeaderNavigation,
  EHText,
  EHCard,
  EHSection,
} from '../../components';
import {AppListLayout, DrawerGrid, IconShape} from '../../types/models';

export default function AppDrawerSettingsScreen({
  navigation,
}: RootStackScreenProps<'AppDrawerSettings'>) {
  const {colors, spacing, isDark, borderRadius} = useTheme();
  const dispatch = useAppDispatch();
  const settings = useAppSelector(state => state.settings.appearance);

  const activeLayout: AppListLayout = settings.appListLayout || 'vertical';
  const activeGrid: DrawerGrid = settings.drawerGrid || '4x5';
  const activeShape: IconShape = settings.drawerIconShape || 'circle';

  const [activeColsStr, activeRowsStr] = activeGrid.split('x');
  const activeCols = parseInt(activeColsStr, 10) || 4;

  const layoutOptions: {
    id: AppListLayout;
    title: string;
    description: string;
    icon: (selected: boolean) => React.ReactNode;
  }[] = [
    {
      id: 'vertical',
      title: 'Vertical Scroll',
      description: 'Continuous smooth vertical scrolling grid',
      icon: selected => (
        <List
          size={22}
          color={selected ? colors.primary : colors.textSecondary}
        />
      ),
    },
    {
      id: 'paginated',
      title: 'OneUI Swiper',
      description: 'Horizontal paginated pages with dot navigation',
      icon: selected => (
        <Layers
          size={22}
          color={selected ? colors.primary : colors.textSecondary}
        />
      ),
    },
  ];

  const gridOptions: {
    grid: DrawerGrid;
    title: string;
    subtitle: string;
  }[] = [
    {
      grid: '3x5',
      title: '3x5 Grid',
      subtitle: '3 cols × 5 rows • 15 apps per page • Large',
    },
    {
      grid: '3x6',
      title: '3x6 Grid',
      subtitle: '3 cols × 6 rows • 18 apps per page • Tall',
    },
    {
      grid: '4x5',
      title: '4x5 Grid',
      subtitle: '4 cols × 5 rows • 20 apps per page • Standard',
    },
    {
      grid: '4x6',
      title: '4x6 Grid',
      subtitle: '4 cols × 6 rows • 24 apps per page • Compact',
    },
  ];

  const shapeOptions: {
    id: IconShape;
    label: string;
    borderRadius: number;
  }[] = [
    {id: 'circle', label: 'Circle', borderRadius: 24},
    {id: 'rounded', label: 'Rounded', borderRadius: 14},
    {id: 'square', label: 'Square', borderRadius: 6},
  ];

  const getRadiusForShape = (shape: IconShape, size: number) => {
    switch (shape) {
      case 'circle':
        return size / 2;
      case 'rounded':
        return size * 0.28;
      case 'square':
        return 6;
      default:
        return size / 2;
    }
  };

  return (
    <ScreenWrapper
      headerComponent={
        <HeaderNavigation
          label="App Drawer & Grid"
          onBack={() => navigation.goBack()}
        />
      }>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={[styles.container, {padding: spacing.md}]}
        showsVerticalScrollIndicator={false}>
        {/* Live Interactive Preview */}
        <EHCard style={styles.previewCard} elevation="low">
          <View style={styles.previewHeaderRow}>
            <LayoutGrid size={22} color={colors.primary} />
            <EHText variant="body" weight="700">
              Preview ({activeGrid} • {activeLayout === 'paginated' ? 'OneUI Swiper' : 'Vertical'})
            </EHText>
          </View>

          {/* Visual Mockup */}
          <View
            style={[
              styles.mockupContainer,
              {
                backgroundColor: isDark
                  ? 'rgba(15, 23, 42, 0.6)'
                  : 'rgba(241, 245, 249, 0.8)',
                borderColor: colors.border,
              },
            ]}>
            <View style={styles.mockupGridRow}>
              {Array.from({length: activeCols}).map((_, idx) => {
                const sampleColors = [
                  colors.primary,
                  colors.secondary,
                  colors.success,
                  colors.warning,
                  colors.error,
                ];
                const sampleColor = sampleColors[idx % sampleColors.length];
                const radius = getRadiusForShape(activeShape, 44);

                return (
                  <View key={idx} style={styles.mockupItem}>
                    <View
                      style={[
                        styles.mockupIcon,
                        {
                          backgroundColor: sampleColor,
                          borderRadius: radius,
                        },
                      ]}>
                      <Smartphone size={20} color="#FFFFFF" />
                    </View>
                    <View
                      style={[
                        styles.mockupLabel,
                        {
                          backgroundColor: isDark
                            ? 'rgba(255,255,255,0.15)'
                            : 'rgba(0,0,0,0.15)',
                        },
                      ]}
                    />
                  </View>
                );
              })}
            </View>
          </View>
        </EHCard>

        {/* 1. Layout Mode Section */}
        <EHSection title="App List Layout">
          <View style={styles.optionsList}>
            {layoutOptions.map(opt => {
              const isSelected = activeLayout === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  activeOpacity={0.8}
                  onPress={() => dispatch(setAppListLayout(opt.id))}
                  style={[
                    styles.optionCard,
                    {
                      backgroundColor: isSelected
                        ? isDark
                          ? 'rgba(99, 102, 241, 0.15)'
                          : 'rgba(99, 102, 241, 0.08)'
                        : isDark
                        ? 'rgba(255, 255, 255, 0.05)'
                        : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                      borderRadius: borderRadius.md,
                    },
                  ]}>
                  <View style={styles.optionLeftRow}>
                    <View
                      style={[
                        styles.iconBadge,
                        {
                          backgroundColor: isSelected
                            ? isDark
                              ? 'rgba(99, 102, 241, 0.25)'
                              : 'rgba(99, 102, 241, 0.12)'
                            : isDark
                            ? 'rgba(255, 255, 255, 0.08)'
                            : 'rgba(0, 0, 0, 0.04)',
                        },
                      ]}>
                      {opt.icon(isSelected)}
                    </View>
                    <View style={styles.optionTextCol}>
                      <EHText variant="body" weight="700">
                        {opt.title}
                      </EHText>
                      <EHText variant="caption" color={colors.textSecondary}>
                        {opt.description}
                      </EHText>
                    </View>
                  </View>

                  {isSelected && (
                    <View
                      style={[
                        styles.checkCircle,
                        {backgroundColor: colors.primary},
                      ]}>
                      <Check size={14} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </EHSection>

        {/* 2. Grid Size Section (3x5, 3x6, 4x5, 4x6) */}
        <EHSection title="Grid Size (OneUI Swiper & Drawer)">
          <View style={styles.gridCardsWrap}>
            {gridOptions.map(opt => {
              const isSelected = activeGrid === opt.grid;
              return (
                <TouchableOpacity
                  key={opt.grid}
                  activeOpacity={0.8}
                  onPress={() => dispatch(setDrawerGrid(opt.grid))}
                  style={[
                    styles.gridSizeCard,
                    {
                      backgroundColor: isSelected
                        ? isDark
                          ? 'rgba(99, 102, 241, 0.15)'
                          : 'rgba(99, 102, 241, 0.08)'
                        : isDark
                        ? 'rgba(255, 255, 255, 0.05)'
                        : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                      borderRadius: borderRadius.md,
                    },
                  ]}>
                  <View style={styles.gridSizeLeft}>
                    <EHText variant="body" weight="800" color={isSelected ? colors.primary : colors.textPrimary}>
                      {opt.title}
                    </EHText>
                    <EHText variant="caption" color={colors.textSecondary}>
                      {opt.subtitle}
                    </EHText>
                  </View>

                  {isSelected && (
                    <View
                      style={[
                        styles.checkCircle,
                        {backgroundColor: colors.primary},
                      ]}>
                      <Check size={14} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </EHSection>

        {/* 3. Icon Shape Section */}
        <EHSection title="Icon Shape">
          <View style={styles.shapeRow}>
            {shapeOptions.map(opt => {
              const isSelected = activeShape === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  activeOpacity={0.8}
                  onPress={() => dispatch(setDrawerIconShape(opt.id))}
                  style={[
                    styles.shapeCard,
                    {
                      backgroundColor: isSelected
                        ? isDark
                          ? 'rgba(99, 102, 241, 0.15)'
                          : 'rgba(99, 102, 241, 0.08)'
                        : isDark
                        ? 'rgba(255, 255, 255, 0.05)'
                        : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                      borderRadius: borderRadius.md,
                    },
                  ]}>
                  <View
                    style={[
                      styles.shapeIconPreview,
                      {
                        borderRadius: opt.borderRadius,
                        backgroundColor: isSelected
                          ? colors.primary
                          : colors.primaryLight,
                      },
                    ]}>
                    <Smartphone
                      size={20}
                      color={isSelected ? '#FFFFFF' : colors.primary}
                    />
                  </View>
                  <EHText
                    variant="caption"
                    weight={isSelected ? '700' : '500'}
                    color={isSelected ? colors.primary : colors.textPrimary}>
                    {opt.label}
                  </EHText>
                </TouchableOpacity>
              );
            })}
          </View>
        </EHSection>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    gap: 20,
    paddingBottom: 32,
  },
  previewCard: {
    padding: 16,
    borderRadius: 20,
  },
  previewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  mockupContainer: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  mockupGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  mockupItem: {
    alignItems: 'center',
    gap: 6,
  },
  mockupIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockupLabel: {
    width: 32,
    height: 6,
    borderRadius: 3,
  },
  optionsList: {
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  optionLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTextCol: {
    flex: 1,
    gap: 2,
  },
  gridCardsWrap: {
    gap: 8,
  },
  gridSizeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  gridSizeLeft: {
    flex: 1,
    gap: 2,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  shapeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  shapeCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  shapeIconPreview: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
