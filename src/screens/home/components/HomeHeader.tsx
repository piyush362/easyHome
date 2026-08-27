import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Sun} from 'lucide-react-native';
import {useTheme} from '../../../theme';
import {EHText} from '../../../components';

export interface HomeHeaderProps {
  parentName?: string;
  currentTime: string;
  currentDate: string;
}

export function HomeHeader({
  parentName,
  currentTime,
  currentDate,
}: HomeHeaderProps) {
  const {colors, isDark} = useTheme();

  return (
    <View style={styles.topSection}>
      {parentName ? (
        <EHText
          variant="caption"
          color={colors.textSecondary}
          style={styles.greetingText}>
          Welcome, {parentName}
        </EHText>
      ) : null}

      <EHText variant="heading1" weight="800" style={styles.clockText}>
        {currentTime}
      </EHText>

      <EHText variant="body" color={colors.textSecondary} weight="500">
        {currentDate}
      </EHText>

      {/* Weather pill badge */}
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
    marginBottom: 20,
  },
  greetingText: {
    marginBottom: 4,
  },
  clockText: {
    letterSpacing: 1,
    marginVertical: 2,
  },
  weatherPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  weatherIcon: {
    marginRight: 6,
  },
});
