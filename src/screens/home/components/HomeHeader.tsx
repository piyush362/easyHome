import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Sun, Calendar, Sparkles} from 'lucide-react-native';
import {useTheme} from '../../../theme';
import {useAppSelector} from '../../../store';
import {EHText, EHCard} from '../../../components';
import {ClockStyle} from '../../../types/models';

export interface HomeHeaderProps {
  parentName?: string;
  currentTime: string;
  currentDate: string;
  clockStyle?: ClockStyle;
}

export function HomeHeader({
  parentName,
  currentTime,
  currentDate,
  clockStyle: propClockStyle,
}: HomeHeaderProps) {
  const {colors, isDark, hasWallpaper, borderRadius} = useTheme();
  const reduxClockStyle = useAppSelector(
    state => state.settings.appearance.clockStyle,
  );
  const activeClockStyle: ClockStyle =
    propClockStyle || reduxClockStyle || 'frosted';

  const textShadowStyle = hasWallpaper
    ? {
        textShadowColor: isDark
          ? 'rgba(0, 0, 0, 0.85)'
          : 'rgba(255, 255, 255, 0.9)',
        textShadowOffset: {width: 0, height: 1},
        textShadowRadius: 4,
      }
    : undefined;

  // 1. FROSTED CLOCK STYLE
  if (activeClockStyle === 'frosted') {
    return (
      <View style={styles.topSection}>
        <EHCard style={styles.frostedCard} elevation="low">
          {parentName ? (
            <View style={styles.frostedGreetingRow}>
              <Sparkles size={14} color={colors.primary} />
              <EHText variant="caption" color={colors.primary} weight="700">
                Welcome, {parentName}
              </EHText>
            </View>
          ) : null}

          <EHText
            variant="heading1"
            weight="800"
            style={styles.frostedClockText}>
            {currentTime}
          </EHText>

          <View style={styles.frostedBottomRow}>
            <EHText
              variant="body"
              color={colors.textSecondary}
              weight="600">
              {currentDate}
            </EHText>

            <View
              style={[
                styles.weatherPill,
                {
                  backgroundColor: isDark
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.05)',
                  borderColor: colors.border,
                },
              ]}>
              <Sun size={14} color={colors.warning} style={styles.weatherIcon} />
              <EHText variant="caption" weight="700">
                29°C
              </EHText>
            </View>
          </View>
        </EHCard>
      </View>
    );
  }

  // 2. CLASSIC DUAL-TONE CLOCK STYLE
  if (activeClockStyle === 'classic') {
    return (
      <View style={styles.topSection}>
        <View
          style={[
            styles.classicContainer,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.lg,
            },
          ]}>
          {/* Top Banner with Date */}
          <View
            style={[
              styles.classicBanner,
              {
                backgroundColor: colors.primary,
                borderTopLeftRadius: borderRadius.lg - 1,
                borderTopRightRadius: borderRadius.lg - 1,
              },
            ]}>
            <Calendar size={14} color="#FFFFFF" />
            <EHText
              variant="caption"
              weight="700"
              color="#FFFFFF"
              style={styles.classicBannerText}>
              {currentDate.toUpperCase()}
            </EHText>
          </View>

          {/* Body with Clock and Weather */}
          <View style={styles.classicBody}>
            {parentName ? (
              <EHText variant="caption" color={colors.textSecondary} weight="600">
                Hello, {parentName}
              </EHText>
            ) : null}

            <EHText
              variant="heading1"
              weight="800"
              style={styles.classicClockText}>
              {currentTime}
            </EHText>

            <View style={styles.classicWeatherRow}>
              <Sun size={15} color={colors.warning} />
              <EHText variant="caption" color={colors.textSecondary} weight="600">
                29°C • Sunny Day
              </EHText>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // 3. MINIMAL DIGITAL CLOCK STYLE (Default Fallback)
  return (
    <View style={styles.topSection}>
      {parentName ? (
        <EHText
          variant="caption"
          color={colors.textSecondary}
          style={[styles.greetingText, textShadowStyle]}>
          Welcome, {parentName}
        </EHText>
      ) : null}

      <EHText
        variant="heading1"
        weight="800"
        style={[styles.minimalClockText, textShadowStyle]}>
        {currentTime}
      </EHText>

      <EHText
        variant="body"
        color={colors.textSecondary}
        weight="600"
        style={textShadowStyle}>
        {currentDate}
      </EHText>

      <View
        style={[
          styles.weatherPill,
          {
            backgroundColor: isDark
              ? 'rgba(30, 41, 59, 0.8)'
              : 'rgba(241, 245, 249, 0.9)',
            borderColor: colors.border,
          },
        ]}>
        <Sun size={15} color={colors.warning} style={styles.weatherIcon} />
        <EHText variant="caption" weight="600">
          29°C • Sunny • Home
        </EHText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topSection: {
    alignItems: 'center',
    marginBottom: 12,
  },
  // Frosted Style
  frostedCard: {
    width: '100%',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    gap: 6,
  },
  frostedGreetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  frostedClockText: {
    fontSize: 40,
    lineHeight: 46,
    letterSpacing: 1,
  },
  frostedBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(150, 150, 150, 0.2)',
  },
  // Classic Dual-Tone Style
  classicContainer: {
    width: '100%',
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  classicBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  classicBannerText: {
    letterSpacing: 0.5,
  },
  classicBody: {
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  classicClockText: {
    fontSize: 38,
    lineHeight: 44,
    letterSpacing: 1,
  },
  classicWeatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  // Minimal Style
  greetingText: {
    marginBottom: 4,
  },
  minimalClockText: {
    fontSize: 44,
    lineHeight: 50,
    letterSpacing: 1.5,
    marginVertical: 2,
  },
  weatherPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 6,
  },
  weatherIcon: {
    marginRight: 4,
  },
});
