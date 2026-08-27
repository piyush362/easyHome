import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {
  LayoutGrid,
  Circle,
  Square,
  Sparkles,
  Check,
  Smartphone,
} from 'lucide-react-native';
import type {RootStackScreenProps} from '../../navigation/types';
import {
  useAppDispatch,
  useAppSelector,
  setDrawerColumns,
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
import {DrawerColumns, IconShape} from '../../types/models';

export default function AppDrawerSettingsScreen({
  navigation,
}: RootStackScreenProps<'AppDrawerSettings'>) {
  const {colors, spacing, isDark} = useTheme();
  const dispatch = useAppDispatch();
  const settings = useAppSelector(state => state.settings.appearance);

  const activeColumns: DrawerColumns = settings.drawerColumns || 5;
  const activeShape: IconShape = settings.drawerIconShape || 'circle';

  const columnOptions: {cols: DrawerColumns; label: string}[] = [
    {cols: 3, label: '3 Apps Per Row (Largest)'},
    {cols: 4, label: '4 Apps Per Row (Medium)'},
    {cols: 5, label: '5 Apps Per Row (Standard)'},
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
          label="App Drawer"
          onBack={() => navigation.goBack()}
        />
      }>
      <View style={[styles.container, {padding: spacing.md}]}>
        {/* Live Interactive Preview */}
        <EHCard style={styles.previewCard} elevation="low">
          <View style={styles.previewHeaderRow}>
            <LayoutGrid size={22} color={colors.primary} />
            <EHText variant="body" weight="700">
              Preview ({activeColumns} Columns • {activeShape.toUpperCase()})
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
              {Array.from({length: activeColumns}).map((_, idx) => {
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

        {/* 1. Grid Density */}
        <EHSection title="Grid Density">
          <View style={styles.optionsList}>
            {columnOptions.map(opt => {
              const isSelected = activeColumns === opt.cols;
              return (
                <TouchableOpacity
                  key={opt.cols}
                  activeOpacity={0.8}
                  onPress={() => dispatch(setDrawerColumns(opt.cols))}
                  style={[
                    styles.optionCard,
                    {
                      backgroundColor: isSelected
                        ? isDark
                          ? 'rgba(56, 189, 248, 0.12)'
                          : 'rgba(2, 132, 199, 0.08)'
                        : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}>
                  <EHText variant="body" weight="700" style={styles.flexText}>
                    {opt.label}
                  </EHText>

                  {isSelected && (
                    <View
                      style={[
                        styles.activeCheckBadge,
                        {backgroundColor: colors.primary},
                      ]}>
                      <Check size={14} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </EHSection>

        {/* 2. Icon Shape */}
        <EHSection title="Icon Shape">
          <View style={styles.optionsList}>
            {shapeOptions.map(shape => {
              const isSelected = activeShape === shape.id;
              return (
                <TouchableOpacity
                  key={shape.id}
                  activeOpacity={0.8}
                  onPress={() => dispatch(setDrawerIconShape(shape.id))}
                  style={[
                    styles.optionCard,
                    {
                      backgroundColor: isSelected
                        ? isDark
                          ? 'rgba(56, 189, 248, 0.12)'
                          : 'rgba(2, 132, 199, 0.08)'
                        : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}>
                  <View
                    style={[
                      styles.shapeSampleBox,
                      {
                        backgroundColor: colors.primaryLight,
                        borderColor: isSelected
                          ? colors.primary
                          : colors.border,
                        borderRadius: shape.borderRadius,
                      },
                    ]}>
                    {shape.id === 'circle' && (
                      <Circle size={20} color={colors.primary} />
                    )}
                    {shape.id === 'rounded' && (
                      <Sparkles size={20} color={colors.primary} />
                    )}
                    {shape.id === 'square' && (
                      <Square size={20} color={colors.primary} />
                    )}
                  </View>

                  <EHText variant="body" weight="700" style={styles.flexText}>
                    {shape.label}
                  </EHText>

                  {isSelected && (
                    <View
                      style={[
                        styles.activeCheckBadge,
                        {backgroundColor: colors.primary},
                      ]}>
                      <Check size={14} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </EHSection>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  previewCard: {
    padding: 16,
  },
  previewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  mockupContainer: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockupLabel: {
    width: 32,
    height: 6,
    borderRadius: 3,
  },
  optionsList: {
    gap: 14,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    gap: 12,
  },
  shapeSampleBox: {
    width: 40,
    height: 40,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexText: {
    flex: 1,
  },
  activeCheckBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
