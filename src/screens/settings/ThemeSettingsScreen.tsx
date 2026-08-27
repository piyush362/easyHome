import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {
  Sun,
  Moon,
  Check,
  Image as ImageIcon,
  Type,
  Maximize2,
} from 'lucide-react-native';
import type {RootStackScreenProps} from '../../navigation/types';
import {
  useAppDispatch,
  useAppSelector,
  setTheme,
  setAppearanceMode,
  setTextSize,
  setButtonSize,
} from '../../store';
import {useTheme, THEME_PRESETS} from '../../theme';
import {
  ScreenWrapper,
  HeaderNavigation,
  EHText,
  EHCard,
  EHSection,
  EHButton,
} from '../../components';
import {SizeScale} from '../../types/models';

export default function ThemeSettingsScreen({
  navigation,
}: RootStackScreenProps<'ThemeSettings'>) {
  const {
    colors,
    spacing,
    themeName,
    appearance,
    isDark,
    textSize,
    buttonSize,
  } = useTheme();
  const dispatch = useAppDispatch();
  const settings = useAppSelector(state => state.settings.appearance);

  const activeTextSize: SizeScale = settings.textSize || textSize;
  const activeButtonSize: SizeScale = settings.buttonSize || buttonSize;

  const wallpaperThemes = THEME_PRESETS.filter(p => p.category === 'wallpaper');
  const solidThemes = THEME_PRESETS.filter(p => p.category === 'solid');

  const textSizeOptions: {id: SizeScale; label: string}[] = [
    {id: 'large', label: 'Standard'},
    {id: 'extraLarge', label: 'Large'},
  ];

  const buttonSizeOptions: {id: SizeScale; label: string}[] = [
    {id: 'large', label: 'Standard'},
    {id: 'extraLarge', label: 'Large'},
  ];

  return (
    <ScreenWrapper
      headerComponent={
        <HeaderNavigation
          label="Theme & Appearance"
          onBack={() => navigation.goBack()}
        />
      }>
      <View style={[styles.container, {padding: spacing.md}]}>
        {/* 1. Appearance Mode Switcher */}
        <EHSection title="Appearance Mode">
          <EHCard style={styles.cardPadding} elevation="low">
            <View style={styles.btnRow}>
              <EHButton
                label="Light Mode"
                icon={
                  <Sun
                    size={18}
                    color={appearance === 'light' ? '#FFFFFF' : colors.primary}
                  />
                }
                variant={appearance === 'light' ? 'primary' : 'outline'}
                onPress={() => dispatch(setAppearanceMode('light'))}
                style={styles.flexBtn}
              />
              <EHButton
                label="Dark Mode"
                icon={
                  <Moon
                    size={18}
                    color={appearance === 'dark' ? '#FFFFFF' : colors.primary}
                  />
                }
                variant={appearance === 'dark' ? 'primary' : 'outline'}
                onPress={() => dispatch(setAppearanceMode('dark'))}
                style={styles.flexBtn}
              />
            </View>
          </EHCard>
        </EHSection>

        {/* 2. Wallpaper Themes */}
        <EHSection title="Wallpaper Themes">
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
                        {
                          backgroundColor: isDark
                            ? 'rgba(0,0,0,0.7)'
                            : 'rgba(255,255,255,0.85)',
                        },
                      ]}>
                      <EHText
                        variant="caption"
                        weight="700"
                        style={styles.badgeText}>
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

        {/* 3. Solid Color Themes */}
        <EHSection title="Solid Color Themes">
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

        {/* 4. Text & Button Sizing */}
        <EHSection title="Text & Button Sizing">
          <EHCard style={styles.cardPadding} elevation="low">
            {/* Text Size */}
            <View style={styles.sectionHeaderRow}>
              <Type size={18} color={colors.primary} />
              <EHText variant="body" weight="700">
                Text Size
              </EHText>
            </View>
            <View style={styles.btnRow}>
              {textSizeOptions.map(opt => (
                <EHButton
                  key={opt.id}
                  label={opt.label}
                  variant={activeTextSize === opt.id ? 'primary' : 'outline'}
                  onPress={() => dispatch(setTextSize(opt.id))}
                  style={styles.flexBtn}
                />
              ))}
            </View>

            {/* Button Size */}
            <View style={[styles.sectionHeaderRow, styles.marginTop14]}>
              <Maximize2 size={18} color={colors.primary} />
              <EHText variant="body" weight="700">
                Button Size
              </EHText>
            </View>
            <View style={styles.btnRow}>
              {buttonSizeOptions.map(opt => (
                <EHButton
                  key={opt.id}
                  label={opt.label}
                  variant={activeButtonSize === opt.id ? 'primary' : 'outline'}
                  onPress={() => dispatch(setButtonSize(opt.id))}
                  style={styles.flexBtn}
                />
              ))}
            </View>
          </EHCard>
        </EHSection>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  cardPadding: {
    padding: 16,
  },
  themeCardsCol: {
    gap: 14,
  },
  themeCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 14,
  },
  thumbnailBox: {
    width: 54,
    height: 64,
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
    gap: 6,
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
    gap: 14,
  },
  solidThemeCard: {
    width: '47%',
    flexGrow: 1,
    padding: 14,
    gap: 8,
  },
  solidCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
