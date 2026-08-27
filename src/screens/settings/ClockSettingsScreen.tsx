import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {Check, Clock} from 'lucide-react-native';
import type {RootStackScreenProps} from '../../navigation/types';
import {useAppDispatch, useAppSelector, setClockStyle} from '../../store';
import {useTheme} from '../../theme';
import {
  ScreenWrapper,
  HeaderNavigation,
  EHText,
  EHSection,
  WallpaperWrapper,
} from '../../components';
import {HomeHeader} from '../home/components';
import {ClockStyle} from '../../types/models';

interface ClockOption {
  id: ClockStyle;
  label: string;
  badge: string;
}

const CLOCK_OPTIONS: ClockOption[] = [
  {
    id: 'frosted',
    label: 'Frosted Glass',
    badge: 'Recommended',
  },
  {
    id: 'minimal',
    label: 'Minimal Floating',
    badge: 'Modern',
  },
  {
    id: 'classic',
    label: 'Classic Dual-Tone',
    badge: 'High Contrast',
  },
];

export default function ClockSettingsScreen({
  navigation,
}: RootStackScreenProps<'ClockSettings'>) {
  const {colors, spacing, borderRadius, isDark} = useTheme();
  const dispatch = useAppDispatch();
  const currentClockStyle =
    useAppSelector(state => state.settings.appearance.clockStyle) || 'frosted';

  const [currentTime, setCurrentTime] = useState('09:41 AM');
  const [currentDate, setCurrentDate] = useState('Thursday, August 28');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, '0');
      setCurrentTime(`${displayHours}:${displayMinutes} ${ampm}`);

      const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      setCurrentDate(
        `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`,
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectClock = (style: ClockStyle) => {
    dispatch(setClockStyle(style));
  };

  return (
    <ScreenWrapper
      headerComponent={
        <HeaderNavigation
          label="Clock Style"
          onBack={() => navigation.goBack()}
        />
      }>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.container, {padding: spacing.md}]}>
        {/* 1. Live Preview Section */}
        <EHSection title="Live Preview">
          <View style={styles.previewOuter}>
            <WallpaperWrapper style={styles.previewWallpaper}>
              <View style={styles.previewInner}>
                <HomeHeader
                  parentName="Mom"
                  currentTime={currentTime}
                  currentDate={currentDate}
                  clockStyle={currentClockStyle}
                />
              </View>
            </WallpaperWrapper>
          </View>
        </EHSection>

        {/* 2. Clock Personalization Options */}
        <EHSection title="Select Style">
          <View style={styles.optionsList}>
            {CLOCK_OPTIONS.map(opt => {
              const isSelected = currentClockStyle === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  activeOpacity={0.8}
                  onPress={() => handleSelectClock(opt.id)}
                  style={[
                    styles.optionCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                      borderRadius: borderRadius.lg,
                    },
                  ]}>
                  {/* Left Icon */}
                  <View
                    style={[
                      styles.iconCircle,
                      {
                        backgroundColor: isSelected
                          ? colors.primaryLight
                          : isDark
                          ? 'rgba(255,255,255,0.06)'
                          : 'rgba(0,0,0,0.04)',
                      },
                    ]}>
                    <Clock
                      size={22}
                      color={isSelected ? colors.primary : colors.textSecondary}
                    />
                  </View>

                  {/* Title & Badge */}
                  <View style={styles.infoCol}>
                    <EHText variant="body" weight="700">
                      {opt.label}
                    </EHText>
                    <EHText variant="caption" color={colors.textSecondary}>
                      {opt.badge}
                    </EHText>
                  </View>

                  {/* Selection Indicator */}
                  <View
                    style={[
                      styles.radioCircle,
                      {
                        borderColor: isSelected
                          ? colors.primary
                          : colors.border,
                        backgroundColor: isSelected
                          ? colors.primary
                          : 'transparent',
                      },
                    ]}>
                    {isSelected && <Check size={14} color="#FFFFFF" />}
                  </View>
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
  container: {
    gap: 24,
    paddingBottom: 32,
  },
  previewOuter: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.25)',
  },
  previewWallpaper: {
    padding: 16,
    minHeight: 180,
    justifyContent: 'center',
  },
  previewInner: {
    width: '100%',
  },
  optionsList: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    minHeight: 72,
    gap: 14,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCol: {
    flex: 1,
    gap: 2,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
