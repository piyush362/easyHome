import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {
  Palette,
  Sparkles,
  Smartphone,
  Sliders,
  ChevronRight,
  Sun,
  Moon,
  LayoutGrid,
  Circle,
  Check,
  Image as ImageIcon,
} from 'lucide-react-native';
import type {RootStackScreenProps} from '../../navigation/types';
import {
  useAppSelector,
  useAppDispatch,
  setTheme,
  setAppearanceMode,
  setDrawerColumns,
  setDrawerIconShape,
} from '../../store';
import {useTheme, THEME_PRESETS} from '../../theme';
import {
  ScreenWrapper,
  HeaderNavigation,
  EHText,
  EHCard,
  EHListItem,
  EHSection,
  EHButton,
} from '../../components';
import {DrawerColumns, IconShape} from '../../types/models';

export default function SettingsScreen({
  navigation,
}: RootStackScreenProps<'Settings'>) {
  const {colors, spacing, themeName, appearance, hasWallpaper, isDark, presetInfo} =
    useTheme();
  const dispatch = useAppDispatch();
  const settings = useAppSelector(state => state.settings.appearance);

  const activeColumns: DrawerColumns = settings.drawerColumns || 5;
  const activeShape: IconShape = settings.drawerIconShape || 'circle';

  const columnOptions: DrawerColumns[] = [3, 4, 5];
  const shapeOptions: {id: IconShape; label: string}[] = [
    {id: 'circle', label: 'Circle'},
    {id: 'rounded', label: 'Rounded'},
    {id: 'square', label: 'Square'},
  ];

  const wallpaperThemes = THEME_PRESETS.filter(p => p.category === 'wallpaper');
  const solidThemes = THEME_PRESETS.filter(p => p.category === 'solid');

  return (
    <ScreenWrapper
      headerComponent={
        <HeaderNavigation
          label="Settings"
          subtitle="Themes, layout & preferences"
          onBack={() => navigation.goBack()}
        />
      }>
      <View style={[styles.container, {padding: spacing.md}]}>
        {/* Appearance Summary Card */}
        <EHCard style={styles.summaryCard} elevation="low">
          <View style={styles.summaryRow}>
            <View
              style={[
                styles.summaryIconBox,
                {backgroundColor: colors.primaryLight},
              ]}>
              <Palette size={26} color={colors.primary} />
            </View>
            <View style={styles.summaryTextCol}>
              <EHText variant="body" weight="700">
                {presetInfo?.label || themeName.toUpperCase()}
              </EHText>
              <EHText variant="caption" color={colors.textSecondary}>
                Mode: {appearance.toUpperCase()} • {hasWallpaper ? '🖼 Wallpaper Background' : '🎨 Solid Palette'}
              </EHText>
              <EHText variant="caption" color={colors.textMuted}>
                App Drawer: {activeColumns} cols • Shape: {activeShape}
              </EHText>
            </View>
          </View>
        </EHCard>

        {/* 1. Wallpaper Themes (With Homescreen Background) */}
        <EHSection
          title="Wallpaper Themes"
          subtitle="Artistic preset wallpapers with image-matched color palettes">
          <View style={styles.themeCardsCol}>
            {wallpaperThemes.map(preset => {
              const isSelected = themeName === preset.id;
              return (
                <TouchableOpacity
                  key={preset.id}
                  activeOpacity={0.8}
                  onPress={() => dispatch(setTheme(preset.id))}
                  style={[
                    styles.themeCardItem,
                    {
                      backgroundColor: isSelected
                        ? isDark
                          ? 'rgba(56, 189, 248, 0.12)'
                          : 'rgba(2, 132, 199, 0.08)'
                        : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                      borderRadius: 16,
                    },
                  ]}>
                  {/* Wallpaper Thumbnail */}
                  <View style={styles.thumbnailBox}>
                    {preset.wallpaper ? (
                      <Image
                        source={preset.wallpaper}
                        style={styles.thumbnailImg}
                        resizeMode="cover"
                      />
                    ) : (
                      <ImageIcon size={24} color={colors.primary} />
                    )}
                    <View
                      style={[
                        styles.wpBadge,
                        {backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.85)'},
                      ]}>
                      <EHText variant="caption" weight="700" style={styles.badgeText}>
                        HD
                      </EHText>
                    </View>
                  </View>

                  {/* Details */}
                  <View style={styles.themeDetailsCol}>
                    <View style={styles.titleRow}>
                      <EHText variant="body" weight="700">
                        {preset.label}
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
                    </View>

                    <EHText
                      variant="caption"
                      color={colors.textSecondary}
                      numberOfLines={1}>
                      {preset.subtitle}
                    </EHText>

                    {/* Palette preview dots */}
                    <View style={styles.paletteDotsRow}>
                      {preset.palettePreview.map((hex, idx) => (
                        <View
                          key={idx}
                          style={[
                            styles.colorDot,
                            {backgroundColor: hex, borderColor: colors.border},
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </EHSection>

        {/* 2. Solid Color Themes */}
        <EHSection
          title="Solid Color Palettes"
          subtitle="Clean, high-contrast solid backgrounds with vibrant accents">
          <View style={styles.solidThemesGrid}>
            {solidThemes.map(preset => {
              const isSelected = themeName === preset.id;
              return (
                <TouchableOpacity
                  key={preset.id}
                  activeOpacity={0.8}
                  onPress={() => dispatch(setTheme(preset.id))}
                  style={[
                    styles.solidThemeCard,
                    {
                      backgroundColor: isSelected
                        ? isDark
                          ? 'rgba(56, 189, 248, 0.12)'
                          : 'rgba(2, 132, 199, 0.08)'
                        : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                      borderRadius: 14,
                    },
                  ]}>
                  <View style={styles.solidCardTop}>
                    <EHText variant="body" weight="700">
                      {preset.label}
                    </EHText>
                    {isSelected && (
                      <View
                        style={[
                          styles.activeCheckBadgeSmall,
                          {backgroundColor: colors.primary},
                        ]}>
                        <Check size={12} color="#FFFFFF" />
                      </View>
                    )}
                  </View>

                  <EHText
                    variant="caption"
                    color={colors.textSecondary}
                    numberOfLines={1}
                    style={styles.solidSubtitle}>
                    {preset.subtitle}
                  </EHText>

                  {/* Palette preview dots */}
                  <View style={styles.paletteDotsRow}>
                    {preset.palettePreview.map((hex, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.colorDotSmall,
                          {backgroundColor: hex, borderColor: colors.border},
                        ]}
                      />
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </EHSection>

        {/* 3. Appearance Mode */}
        <EHSection
          title="Appearance Mode"
          subtitle="Toggle between light high-contrast and night dark modes">
          <EHCard style={styles.cardPadding} elevation="low">
            <View style={styles.btnRow}>
              <EHButton
                label="Light Mode"
                icon={<Sun size={18} color={appearance === 'light' ? '#FFFFFF' : colors.primary} />}
                variant={appearance === 'light' ? 'primary' : 'outline'}
                onPress={() => dispatch(setAppearanceMode('light'))}
                style={styles.flexBtn}
              />
              <EHButton
                label="Dark Mode"
                icon={<Moon size={18} color={appearance === 'dark' ? '#FFFFFF' : colors.primary} />}
                variant={appearance === 'dark' ? 'primary' : 'outline'}
                onPress={() => dispatch(setAppearanceMode('dark'))}
                style={styles.flexBtn}
              />
            </View>
          </EHCard>
        </EHSection>

        {/* 4. App Drawer Customization */}
        <EHSection
          title="App Drawer Customization"
          subtitle="Customize grid density and icon shapes for the app list">
          <EHCard style={styles.cardPadding} elevation="low">
            {/* Grid Density */}
            <View style={styles.sectionHeaderRow}>
              <LayoutGrid size={20} color={colors.primary} />
              <EHText variant="body" weight="700">
                Items per Row (Min 3 — Max 5)
              </EHText>
            </View>
            <View style={styles.btnRow}>
              {columnOptions.map(cols => (
                <EHButton
                  key={cols}
                  label={`${cols} per Row`}
                  variant={activeColumns === cols ? 'primary' : 'outline'}
                  onPress={() => dispatch(setDrawerColumns(cols))}
                  style={styles.flexBtn}
                />
              ))}
            </View>

            {/* Icon Shape */}
            <View style={[styles.sectionHeaderRow, styles.marginTop14]}>
              <Circle size={20} color={colors.primary} />
              <EHText variant="body" weight="700">
                App Icon Shape
              </EHText>
            </View>
            <View style={styles.btnRow}>
              {shapeOptions.map(shape => (
                <EHButton
                  key={shape.id}
                  label={shape.label}
                  variant={activeShape === shape.id ? 'primary' : 'outline'}
                  onPress={() => dispatch(setDrawerIconShape(shape.id))}
                  style={styles.flexBtn}
                />
              ))}
            </View>
          </EHCard>
        </EHSection>

        {/* 5. System & Launcher */}
        <EHSection title="System & Launcher">
          <EHListItem
            title="Launcher Setup & Permissions"
            subtitle="Set EasyHome as default launcher & check status"
            left={<Smartphone size={22} color={colors.primary} />}
            right={<ChevronRight size={20} color={colors.textMuted} />}
            onPress={() => navigation.navigate('LauncherSetup')}
          />
          <EHListItem
            title="Setup Wizard"
            subtitle="Re-run the step-by-step phone configuration"
            left={<Sliders size={22} color={colors.primary} />}
            right={<ChevronRight size={20} color={colors.textMuted} />}
            onPress={() => navigation.navigate('FamilySetup')}
          />
          <EHListItem
            title="Design System Showcase"
            subtitle="Test all 10 accessible components, buttons, and tokens"
            left={<Sparkles size={22} color={colors.primary} />}
            right={<ChevronRight size={20} color={colors.textMuted} />}
            onPress={() => navigation.navigate('ComponentShowcase')}
          />
        </EHSection>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  summaryCard: {
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  summaryTextCol: {
    flex: 1,
  },
  cardPadding: {
    padding: 16,
  },
  themeCardsCol: {
    gap: 10,
  },
  themeCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 14,
  },
  thumbnailBox: {
    width: 60,
    height: 72,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
  },
  wpBadge: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 9,
    lineHeight: 11,
  },
  themeDetailsCol: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeCheckBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCheckBadgeSmall: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paletteDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  colorDotSmall: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
  },
  solidThemesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  solidThemeCard: {
    width: '48%',
    flexGrow: 1,
    padding: 12,
    gap: 4,
  },
  solidCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  solidSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  labelMargin: {
    marginBottom: 8,
  },
  marginTop14: {
    marginTop: 14,
    marginBottom: 8,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  flexBtn: {
    flex: 1,
    minHeight: 46,
  },
});
