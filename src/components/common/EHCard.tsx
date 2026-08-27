import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {useTheme} from '../../theme';

export interface EHCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  elevation?: 'none' | 'low' | 'medium' | 'high';
  backgroundColor?: string;
  borderColor?: string;
  style?: StyleProp<ViewStyle>;
  activeOpacity?: number;
  testID?: string;
}

export function EHCard({
  children,
  onPress,
  elevation = 'low',
  backgroundColor,
  borderColor,
  style,
  activeOpacity = 0.8,
  testID,
}: EHCardProps) {
  const {colors, borderRadius, elevation: elevationTokens} = useTheme();

  const cardBg = backgroundColor || colors.card;
  const cardBorder = borderColor || colors.border;
  const shadow = elevationTokens[elevation];

  const containerStyle: ViewStyle = {
    backgroundColor: cardBg,
    borderRadius: borderRadius.lg,
    borderColor: cardBorder,
    borderWidth: 1,
    padding: 16,
    ...shadow,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        testID={testID}
        style={[containerStyle, style]}
        onPress={onPress}
        activeOpacity={activeOpacity}
        accessibilityRole="button">
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View testID={testID} style={[containerStyle, style]}>
      {children}
    </View>
  );
}
