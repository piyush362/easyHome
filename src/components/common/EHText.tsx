import React from 'react';
import {Text, TextStyle, StyleProp} from 'react-native';
import {useTheme} from '../../theme';

export interface EHTextProps {
  variant?: 'heading1' | 'heading2' | 'body' | 'caption' | 'button';
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  weight?: '400' | '500' | '600' | '700' | '800';
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

export function EHText({
  variant = 'body',
  color,
  align,
  weight,
  numberOfLines,
  style,
  children,
}: EHTextProps) {
  const {typography, colors} = useTheme();
  const token = typography[variant] || typography.body;

  const defaultColor =
    variant === 'caption' ? colors.textSecondary : colors.textPrimary;

  const textStyle: TextStyle = {
    fontSize: token.fontSize,
    lineHeight: token.lineHeight,
    fontWeight: weight || token.fontWeight,
    color: color || defaultColor,
    textAlign: align,
  };

  return (
    <Text
      style={[textStyle, style]}
      numberOfLines={numberOfLines}
      accessibilityRole="text">
      {children}
    </Text>
  );
}
