import React from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ImageResizeMode,
} from 'react-native';
import {useTheme} from '../../theme';

export interface WallpaperWrapperProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /**
   * Whether to automatically use the active theme's wallpaper if available (default: true)
   */
  useThemeWallpaper?: boolean;
  /**
   * Custom wallpaper image source override
   */
  customWallpaper?: any;
  /**
   * Image resize mode (default: 'cover')
   */
  resizeMode?: ImageResizeMode;
  /**
   * Optional custom background color for fallback solid mode
   */
  backgroundColor?: string;
}

/**
 * WallpaperWrapper dynamically renders an ImageBackground if a theme/custom wallpaper is active,
 * or a clean solid-color View container if no wallpaper is present.
 */
export function WallpaperWrapper({
  children,
  style,
  useThemeWallpaper = true,
  customWallpaper,
  resizeMode = 'cover',
  backgroundColor,
}: WallpaperWrapperProps) {
  const {colors, wallpaper, hasWallpaper} = useTheme();

  const activeWallpaper =
    customWallpaper || (useThemeWallpaper && hasWallpaper ? wallpaper : null);

  if (activeWallpaper) {
    return (
      <ImageBackground
        source={activeWallpaper}
        style={[styles.container, style]}
        resizeMode={resizeMode}>
        {children}
      </ImageBackground>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: backgroundColor || colors.background},
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
