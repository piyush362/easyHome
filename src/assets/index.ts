/**
 * Centralized Asset Registry for EasyHome
 * Provides strongly-typed, centralized access to all app icons, wallpapers, and images.
 */

export const ICONS = {
  torchOn: require('./icons/tourch_on.png'),
  torchOff: require('./icons/tourch_off.png'),
  touchOn: require('./icons/tourch_on.png'),
  touchOff: require('./icons/tourch_off.png'),
} as const;

export const IMAGES = {
  theme: {
    theme1: require('./images/theme/theme-1.jpg'),
    theme2: require('./images/theme/theme-2.jpg'),
  },
  wallpapers: {
    midnightBloom: require('./images/theme/theme-1.jpg'),
    sunsetWave: require('./images/theme/theme-2.jpg'),
    auroraCyan: require('./images/theme/theme-2.jpg'),
  },
} as const;

export type IconKey = keyof typeof ICONS;
export type ImageKey = keyof typeof IMAGES;
