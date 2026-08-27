import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {useTheme} from '../../theme';
import {EHText} from './EHText';

export interface EHListItemProps {
  title: string;
  subtitle?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function EHListItem({
  title,
  subtitle,
  left,
  right,
  onPress,
  disabled = false,
  style,
  testID,
}: EHListItemProps) {
  const {colors, borderRadius} = useTheme();

  const content = (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: borderRadius.md,
        },
        style,
      ]}>
      {left && <View style={styles.leftWrapper}>{left}</View>}
      <View style={styles.textWrapper}>
        <EHText variant="body" weight="600" numberOfLines={1}>
          {title}
        </EHText>
        {subtitle && (
          <EHText
            variant="caption"
            color={colors.textSecondary}
            numberOfLines={1}
            style={styles.subtitle}>
            {subtitle}
          </EHText>
        )}
      </View>
      {right && <View style={styles.rightWrapper}>{right}</View>}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        testID={testID}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
        accessibilityRole="button">
        {content}
      </TouchableOpacity>
    );
  }

  return <View testID={testID}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    minHeight: 64,
  },
  leftWrapper: {
    marginRight: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  subtitle: {
    marginTop: 2,
  },
  rightWrapper: {
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
