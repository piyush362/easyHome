import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Palette, ArrowRight, ArrowLeft, Sun, Moon, Check, Image as ImageIcon} from 'lucide-react-native';
import type {FamilySetupScreenProps} from '../../../navigation/types';
import {useTheme, THEME_PRESETS} from '../../../theme';
import {useAppDispatch, setTheme, setAppearanceMode} from '../../../store';
import {
  ScreenWrapper,
  HeaderNavigation,
  EHText,
  EHCard,
  EHButton,
} from '../../../components';

export default function AppearanceStepScreen({
  navigation,
}: FamilySetupScreenProps<'Appearance'>) {
  const {colors, spacing, themeName, appearance, isDark} = useTheme();
  const dispatch = useAppDispatch();

  const wallpaperThemes = THEME_PRESETS.filter(p => p.category === 'wallpaper');
  const solidThemes = THEME_PRESETS.filter(p => p.category === 'solid');

  return (
    <ScreenWrapper
      headerComponent={
        <HeaderNavigation
          label="Appearance & Themes"
          subtitle="Step 5 of 8: Visual Preferences"
          onBack={() => navigation.goBack()}
        />
      }>
      <View style={[styles.container, {padding: spacing.md}]}>
        {/* 1. Wallpaper Themes */}
        <EHCard style={styles.card} elevation="low">
          <EHText variant="heading2" weight="700">
            🖼 Wallpaper Themes
          </EHText>
          <EHText variant="caption" color={colors.textSecondary}>
            Beautiful home wallpapers with matching color palettes
          </EHText>

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
                      borderRadius: 14,
                    },
                  ]}>
                  <View style={styles.thumbnailBox}>
                    {preset.wallpaper ? (
                      <Image
                        source={preset.wallpaper}
                        style={styles.thumbnailImg}
                        resizeMode="cover"
                      />
                    ) : (
                      <ImageIcon size={20} color={colors.primary} />
                    )}
                  </View>

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
                          <Check size={12} color="#FFFFFF" />
                        </View>
                      )}
                    </View>

                    <EHText
                      variant="caption"
                      color={colors.textSecondary}
                      numberOfLines={1}>
                      {preset.subtitle}
                    </EHText>

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
        </EHCard>

        {/* 2. Solid Color Themes */}
        <EHCard style={styles.card} elevation="low">
          <EHText variant="heading2" weight="700">
            🎨 Solid Color Palettes
          </EHText>

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
                      borderRadius: 12,
                    },
                  ]}>
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
                        <Check size={10} color="#FFFFFF" />
                      </View>
                    )}
                  </View>
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

          <EHText variant="heading2" weight="700" style={styles.subHeading}>
            Appearance Mode
          </EHText>
          <View style={styles.btnRow}>
            <EHButton
              label="Light"
              icon={<Sun size={18} color={appearance === 'light' ? '#FFF' : colors.primary} />}
              variant={appearance === 'light' ? 'primary' : 'outline'}
              onPress={() => dispatch(setAppearanceMode('light'))}
              style={styles.halfBtn}
            />
            <EHButton
              label="Dark"
              icon={<Moon size={18} color={appearance === 'dark' ? '#FFF' : colors.primary} />}
              variant={appearance === 'dark' ? 'primary' : 'outline'}
              onPress={() => dispatch(setAppearanceMode('dark'))}
              style={styles.halfBtn}
            />
          </View>
        </EHCard>

        {/* Action buttons */}
        <View style={styles.btnRow}>
          <EHButton
            label="Back"
            icon={<ArrowLeft size={18} color={colors.textPrimary} />}
            variant="outline"
            onPress={() => navigation.goBack()}
            style={styles.halfBtn}
          />
          <EHButton
            label="Next: Reminders"
            icon={<ArrowRight size={18} color="#FFFFFF" />}
            variant="primary"
            onPress={() => navigation.navigate('Reminders')}
            style={styles.halfBtn}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  card: {
    padding: 18,
    gap: 12,
  },
  themeCardsCol: {
    gap: 10,
    marginTop: 4,
  },
  themeCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  thumbnailBox: {
    width: 52,
    height: 64,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
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
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paletteDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
  },
  colorDotSmall: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  solidThemesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  solidThemeCard: {
    width: '48%',
    flexGrow: 1,
    padding: 10,
    gap: 4,
  },
  subHeading: {
    marginTop: 12,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  halfBtn: {
    flex: 1,
    minHeight: 56,
  },
});
