import React from 'react';
import {
  View,
  Switch,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '../../theme';
import {EHText} from './EHText';

export interface EHSwitchProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function EHSwitch({
  value,
  onValueChange,
  label,
  description,
  disabled = false,
  style,
  testID,
}: EHSwitchProps) {
  const {colors, borderRadius} = useTheme();

  return (
    <TouchableOpacity
      testID={testID}
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: borderRadius.md,
        },
        style,
      ]}
      onPress={() => !disabled && onValueChange(!value)}
      activeOpacity={0.8}
      accessibilityRole="switch"
      accessibilityState={{checked: value, disabled}}>
      <View style={styles.textContainer}>
        <EHText variant="body" weight="600">
          {label}
        </EHText>
        {description && (
          <EHText
            variant="caption"
            color={colors.textSecondary}
            style={styles.description}>
            {description}
          </EHText>
        )}
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: colors.border,
          true: colors.primary,
        }}
        thumbColor={colors.surface}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    minHeight: 64,
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  description: {
    marginTop: 3,
  },
});
