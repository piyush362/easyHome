import {ColorTheme, SizeScale} from '../types/models';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  card: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  success: string;
  successLight: string;
  error: string;
  errorLight: string;
  warning: string;
  warningLight: string;
  border: string;
  borderSubtle: string;
  shadow: string;
  accent: string;
  statusBar: 'light-content' | 'dark-content';
}

export interface TypographyToken {
  fontSize: number;
  lineHeight: number;
  fontWeight: '400' | '500' | '600' | '700' | '800';
  letterSpacing?: number;
}

export interface TypographyScale {
  heading1: TypographyToken;
  heading2: TypographyToken;
  body: TypographyToken;
  caption: TypographyToken;
  button: TypographyToken;
}

export interface SpacingScale {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface BorderRadiusScale {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  round: number;
}

export interface DimensionTokens {
  buttonHeight: number;
  iconSize: number;
  avatarSize: number;
  minTouchTarget: number;
}

export interface ElevationShadow {
  shadowColor: string;
  shadowOffset: {width: number; height: number};
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface ElevationScale {
  none: ElevationShadow;
  low: ElevationShadow;
  medium: ElevationShadow;
  high: ElevationShadow;
}

export interface ThemeContextValue {
  themeName: ColorTheme;
  appearance: 'light' | 'dark';
  textSize: SizeScale;
  iconSize: SizeScale;
  buttonSize: SizeScale;
  colors: ThemeColors;
  typography: TypographyScale;
  spacing: SpacingScale;
  borderRadius: BorderRadiusScale;
  dimensions: DimensionTokens;
  elevation: ElevationScale;
  isDark: boolean;
}
