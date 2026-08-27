import {useContext} from 'react';
import {ThemeContext} from './ThemeProvider';
import {ThemeContextValue} from './types';
import {
  THEME_PALETTES,
  THEME_PRESETS,
  TYPOGRAPHY_TOKENS,
  SPACING_TOKENS,
  BORDER_RADIUS_TOKENS,
  DIMENSION_TOKENS,
  ELEVATION_TOKENS,
} from './tokens';

// Fallback default theme context value for usage outside provider / in unit tests
const fallbackTheme: ThemeContextValue = {
  themeName: 'warm',
  appearance: 'light',
  textSize: 'large',
  iconSize: 'large',
  buttonSize: 'large',
  colors: THEME_PALETTES.warm.light,
  typography: TYPOGRAPHY_TOKENS.large,
  spacing: SPACING_TOKENS,
  borderRadius: BORDER_RADIUS_TOKENS,
  dimensions: DIMENSION_TOKENS.large,
  elevation: ELEVATION_TOKENS,
  isDark: false,
  wallpaper: null,
  hasWallpaper: false,
  presetInfo: THEME_PRESETS[3],
};

/**
 * Hook to access current resolved EasyHome theme values, colors, typography, and spacing.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  return context || fallbackTheme;
}
