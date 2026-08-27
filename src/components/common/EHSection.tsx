import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {useTheme} from '../../theme';
import {EHText} from './EHText';

export interface EHSectionProps {
  title?: string;
  subtitle?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function EHSection({
  title,
  subtitle,
  action,
  children,
  style,
  testID,
}: EHSectionProps) {
  const {colors, spacing} = useTheme();

  return (
    <View testID={testID} style={[styles.container, style]}>
      {(title || action) && (
        <View style={[styles.headerRow, {marginBottom: spacing.sm}]}>
          <View style={styles.titleContainer}>
            {title && (
              <EHText variant="heading2" weight="700">
                {title}
              </EHText>
            )}
            {subtitle && (
              <EHText
                variant="caption"
                color={colors.textSecondary}
                style={styles.subtitle}>
                {subtitle}
              </EHText>
            )}
          </View>
          {action && (
            <TouchableOpacity
              onPress={action.onPress}
              activeOpacity={0.7}
              accessibilityRole="button">
              <EHText variant="body" color={colors.primary} weight="600">
                {action.label}
              </EHText>
            </TouchableOpacity>
          )}
        </View>
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 4,
  },
  titleContainer: {
    flex: 1,
  },
  subtitle: {
    marginTop: 2,
  },
  content: {
    width: '100%',
    gap: 12,
  },
});
