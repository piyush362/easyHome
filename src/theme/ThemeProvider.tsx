import React, {createContext, useMemo} from 'react';
import {useAppSelector} from '../store/hooks';
import {ThemeContextValue} from './types';
import {
  THEME_PALETTES,
  THEME_WALLPAPERS,
  THEME_PRESETS,
  TYPOGRAPHY_TOKENS,
  SPACING_TOKENS,
  BORDER_RADIUS_TOKENS,
  DIMENSION_TOKENS,
  ELEVATION_TOKENS,
} from './tokens';

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({children}: ThemeProviderProps) {
  const appearanceSettings = useAppSelector(
    state => state?.settings?.appearance,
  );

  const themeValue = useMemo<ThemeContextValue>(() => {
    const themeName = appearanceSettings?.theme || 'warm';
    const appearance = appearanceSettings?.appearance || 'light';
    const textSize = appearanceSettings?.textSize || 'large';
    const iconSize = appearanceSettings?.iconSize || 'large';
    const buttonSize = appearanceSettings?.buttonSize || 'large';

    const colors = THEME_PALETTES[themeName]
      ? THEME_PALETTES[themeName][appearance]
      : THEME_PALETTES.warm[appearance];
    const typography = TYPOGRAPHY_TOKENS[textSize] || TYPOGRAPHY_TOKENS.large;
    const dimensions = DIMENSION_TOKENS[buttonSize] || DIMENSION_TOKENS.large;
    const wallpaper = THEME_WALLPAPERS[themeName] || null;
    const presetInfo =
      THEME_PRESETS.find(p => p.id === themeName) || THEME_PRESETS[0];

    return {
      themeName,
      appearance,
      textSize,
      iconSize,
      buttonSize,
      colors,
      typography,
      spacing: SPACING_TOKENS,
      borderRadius: BORDER_RADIUS_TOKENS,
      dimensions,
      elevation: ELEVATION_TOKENS,
      isDark: appearance === 'dark',
      wallpaper,
      hasWallpaper: Boolean(wallpaper),
      presetInfo,
    };
  }, [appearanceSettings]);

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
}
