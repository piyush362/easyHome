import React, {createContext, useMemo} from 'react';
import {useAppSelector} from '../store';
import {ThemeContextValue} from './types';
import {
  THEME_PALETTES,
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
    state => state.settings.appearance,
  );

  const themeValue = useMemo<ThemeContextValue>(() => {
    const themeName = appearanceSettings?.theme || 'warm';
    const appearance = appearanceSettings?.appearance || 'light';
    const textSize = appearanceSettings?.textSize || 'large';
    const iconSize = appearanceSettings?.iconSize || 'large';
    const buttonSize = appearanceSettings?.buttonSize || 'large';

    const colors = THEME_PALETTES[themeName][appearance];
    const typography = TYPOGRAPHY_TOKENS[textSize];
    const dimensions = DIMENSION_TOKENS[buttonSize];

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
    };
  }, [appearanceSettings]);

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
}
