import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ChevronLeft} from 'lucide-react-native';
import {useTheme} from '../../theme';

export interface HeaderNavigationProps {
  /**
   * Main title text or label
   */
  label?: string;
  title?: string;
  /**
   * Optional subtitle under the main label
   */
  subtitle?: string;
  subTitle?: string;
  /**
   * If true, hides or disables the back button
   */
  disableBack?: boolean;
  /**
   * Custom back action callback (defaults to navigation.goBack())
   */
  onBack?: () => void;
  /**
   * Optional right side custom action or icon
   */
  rightComponent?: React.ReactNode;
  /**
   * Optional custom background color
   */
  backgroundColor?: string;
  /**
   * Optional custom text color
   */
  textColor?: string;
  /**
   * Custom container style
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Whether to display a subtle bottom border (defaults to true)
   */
  borderBottom?: boolean;
  /**
   * Custom bottom border radius for left and right corners (default: 24)
   */
  bottomBorderRadius?: number;
}

export function HeaderNavigation({
  label,
  title,
  subtitle,
  subTitle,
  disableBack = false,
  onBack,
  rightComponent,
  backgroundColor,
  textColor,
  style,
  borderBottom = true,
  bottomBorderRadius = 24,
}: HeaderNavigationProps) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {colors, isDark, typography} = useTheme();

  const displayTitle = label || title || '';
  const displaySubtitle = subtitle || subTitle;

  const handleBackPress = () => {
    if (onBack) {
      onBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const headerBg =
    backgroundColor || (isDark ? colors.surface : '#FFFFFF');
  const titleColor = textColor || colors.textPrimary;
  const backIconColor = textColor || colors.textPrimary;

  // Safe area top padding so the header extends under the status bar
  const safeTopPadding = insets.top > 0 ? insets.top + 6 : 14;

  return (
    <View
      style={[
        styles.headerContainer,
        {
          backgroundColor: headerBg,
          paddingTop: safeTopPadding,
          borderBottomLeftRadius: bottomBorderRadius,
          borderBottomRightRadius: bottomBorderRadius,
          borderBottomColor: borderBottom
            ? isDark
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(0, 0, 0, 0.06)'
            : 'transparent',
          borderBottomWidth: borderBottom ? StyleSheet.hairlineWidth : 0,
        },
        style,
      ]}>
      <View style={styles.headerContentRow}>
        {/* Left Back Button slot */}
        <View style={styles.leftContainer}>
          {!disableBack && (
            <TouchableOpacity
              style={[
                styles.backButton,
                {
                  backgroundColor: isDark
                    ? 'rgba(255, 255, 255, 0.06)'
                    : 'rgba(0, 0, 0, 0.04)',
                },
              ]}
              onPress={handleBackPress}
              activeOpacity={0.7}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
              accessibilityRole="button"
              accessibilityLabel="Go back">
              <ChevronLeft size={26} color={backIconColor} strokeWidth={2.5} />
            </TouchableOpacity>
          )}
        </View>

        {/* Center Title & Subtitle */}
        <View style={styles.centerContainer}>
          <Text
            style={[
              styles.titleText,
              {
                color: titleColor,
                fontSize: typography.heading2.fontSize,
                fontWeight: '700',
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {displayTitle}
          </Text>
          {!!displaySubtitle && (
            <Text
              style={[
                styles.subtitleText,
                {
                  color: colors.textSecondary,
                  fontSize: typography.caption.fontSize,
                },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {displaySubtitle}
            </Text>
          )}
        </View>

        {/* Right Component slot */}
        <View style={styles.rightContainer}>
          {rightComponent ? rightComponent : <View style={styles.emptyRight} />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    zIndex: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  headerContentRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftContainer: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  titleText: {
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  subtitleText: {
    marginTop: 2,
    textAlign: 'center',
  },
  rightContainer: {
    width: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  emptyRight: {
    width: 40,
  },
});
