import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Text,
} from 'react-native';
import {useTheme} from '../../theme';
import {EHText} from './EHText';
import {SizeScale} from '../../types/models';

export interface EHIconButtonProps {
  icon: string | React.ReactNode;
  label: string;
  onPress: () => void;
  subtitle?: string;
  badge?: string | number;
  backgroundColor?: string;
  size?: SizeScale;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function EHIconButton({
  icon,
  label,
  onPress,
  subtitle,
  badge,
  backgroundColor,
  size,
  disabled = false,
  style,
  testID,
}: EHIconButtonProps) {
  const {colors, borderRadius, elevation, iconSize: themeIconSize} = useTheme();

  const activeSize = size || themeIconSize;
  const isExtraLarge = activeSize === 'extraLarge';
  const iconFontSize = isExtraLarge ? 42 : 34;

  const cardBg = backgroundColor || colors.card;

  return (
    <TouchableOpacity
      testID={testID}
      style={[
        styles.container,
        {
          backgroundColor: cardBg,
          borderRadius: borderRadius.xl,
          borderColor: colors.border,
          ...elevation.low,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`${label} ${subtitle || ''}`}>
      {badge !== undefined && (
        <View style={[styles.badge, {backgroundColor: colors.error}]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}

      <View style={styles.iconWrapper}>
        {typeof icon === 'string' ? (
          <Text style={[styles.emojiIcon, {fontSize: iconFontSize}]}>
            {icon}
          </Text>
        ) : (
          icon
        )}
      </View>

      <EHText
        variant="heading2"
        align="center"
        numberOfLines={1}
        style={styles.label}>
        {label}
      </EHText>

      {subtitle && (
        <EHText
          variant="caption"
          align="center"
          color={colors.textSecondary}
          numberOfLines={1}
          style={styles.subtitle}>
          {subtitle}
        </EHText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 110,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  iconWrapper: {
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiIcon: {
    textAlign: 'center',
  },
  label: {
    marginTop: 2,
  },
  subtitle: {
    marginTop: 2,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
