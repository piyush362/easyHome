import React from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  StyleProp,
  ViewStyle,
  StatusBarStyle,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../theme';

export interface ScreenWrapperProps {
  children: React.ReactNode;
  /**
   * Optional custom background color for the screen
   */
  backgroundColor?: string;
  /**
   * Optional custom status bar color
   */
  statusBarColor?: string;
  /**
   * Optional custom status bar content style (light-content | dark-content)
   */
  statusBarStyle?: StatusBarStyle;
  /**
   * Top navigation / header component (e.g., <HeaderNavigation label="Title" />)
   */
  headerComponent?: React.ReactNode;
  /**
   * If true, disables the KeyboardAwareScrollView and renders a standard View
   */
  disableScroll?: boolean;
  /**
   * Custom style for the scroll view content container
   */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Custom style for the inner container
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Extra scroll height when keyboard opens (default: 100)
   */
  extraScrollHeight?: number;
  /**
   * Whether to apply safe area inset at the top when no headerComponent is provided (default: true)
   */
  enableSafeAreaTop?: boolean;
  /**
   * Whether to apply safe area inset at the bottom (default: false)
   */
  enableSafeAreaBottom?: boolean;
}

export function ScreenWrapper({
  children,
  backgroundColor,
  statusBarColor,
  statusBarStyle,
  headerComponent,
  disableScroll = false,
  contentContainerStyle,
  style,
  extraScrollHeight = 100,
  enableSafeAreaTop = true,
  enableSafeAreaBottom = false,
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();

  const screenBg = backgroundColor || colors.background;
  const barStyle = statusBarStyle || colors.statusBar;

  // If headerComponent is present, the header handles top insets directly to blend with the status bar
  const topPadding = headerComponent
    ? 0
    : enableSafeAreaTop
    ? insets.top
    : 0;

  return (
    <View
      style={[
        styles.mainContainer,
        {
          backgroundColor: screenBg,
          paddingTop: topPadding,
          paddingBottom: enableSafeAreaBottom ? insets.bottom : 0,
        },
      ]}>
      <StatusBar barStyle={barStyle} />

      {/* Header Component extending seamlessly to top of status bar */}
      {headerComponent && headerComponent}

      {/* Main Content Area */}
      {!disableScroll ? (
        <KeyboardAwareScrollView
          style={[styles.container, style]}
          contentContainerStyle={[
            styles.scrollContent,
            contentContainerStyle,
          ]}
          extraScrollHeight={extraScrollHeight}
          enableOnAndroid={true}
          keyboardOpeningTime={0}
          enableAutomaticScroll={true}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {children}
        </KeyboardAwareScrollView>
      ) : (
        <View style={[styles.container, style]}>{children}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
});
