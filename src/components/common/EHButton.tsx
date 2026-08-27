import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  View,
} from 'react-native';
import {useTheme} from '../../theme';
import {EHText} from './EHText';
import {SizeScale} from '../../types/models';

export interface EHButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: SizeScale;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

export function EHButton({
  label,
  onPress,
  variant = 'primary',
  size,
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  testID,
}: EHButtonProps) {
  const {colors, borderRadius, dimensions, typography, buttonSize, elevation} =
    useTheme();

  const activeSize = size || buttonSize;
  const height =
    activeSize === 'extraLarge' ? dimensions.buttonHeight : 56;

  // Determine button container styles based on variant
  let containerBg = colors.primary;
  let borderColor = 'transparent';
  let borderWidth = 0;
  let labelColor = colors.textInverse;
  let shadowStyle = elevation.low;

  switch (variant) {
    case 'secondary':
      containerBg = colors.primaryLight;
      labelColor = colors.primary;
      shadowStyle = elevation.none;
      break;
    case 'outline':
      containerBg = colors.surface;
      borderColor = colors.border;
      borderWidth = 2;
      labelColor = colors.textPrimary;
      shadowStyle = elevation.none;
      break;
    case 'ghost':
      containerBg = 'transparent';
      labelColor = colors.primary;
      shadowStyle = elevation.none;
      break;
    case 'danger':
      containerBg = colors.error;
      labelColor = '#FFFFFF';
      shadowStyle = elevation.low;
      break;
    case 'primary':
    default:
      containerBg = colors.primary;
      labelColor = colors.textInverse;
      shadowStyle = elevation.low;
      break;
  }

  if (disabled) {
    containerBg = colors.borderSubtle;
    labelColor = colors.textMuted;
    borderColor = 'transparent';
    shadowStyle = elevation.none;
  }

  const containerStyle: ViewStyle = {
    minHeight: height,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: borderRadius.lg,
    backgroundColor: containerBg,
    borderColor,
    borderWidth,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: disabled ? 0.6 : 1,
    ...shadowStyle,
  };

  return (
    <TouchableOpacity
      testID={testID}
      style={[containerStyle, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{disabled: disabled || loading, busy: loading}}>
      {loading ? (
        <ActivityIndicator color={labelColor} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <EHText
            variant="button"
            color={labelColor}
            weight="600"
            style={textStyle}>
            {label}
          </EHText>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 10,
  },
});
