import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 11 Pro)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

// Scale functions
export const scaleWidth = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

export const scaleHeight = (size: number): number => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

export const scaleFont = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Responsive padding and margin
export const responsivePadding = {
  xs: scaleWidth(4),
  sm: scaleWidth(8),
  md: scaleWidth(16),
  lg: scaleWidth(24),
  xl: scaleWidth(32),
};

export const responsiveMargin = {
  xs: scaleWidth(4),
  sm: scaleWidth(8),
  md: scaleWidth(16),
  lg: scaleWidth(24),
  xl: scaleWidth(32),
};

// Device type detection
export const isTablet = (): boolean => {
  return SCREEN_WIDTH >= 768;
};

export const isSmallScreen = (): boolean => {
  return SCREEN_WIDTH < 375;
};

export const isLargeScreen = (): boolean => {
  return SCREEN_WIDTH > 414;
};

// Responsive font sizes
export const responsiveFontSize = {
  xs: scaleFont(10),
  sm: scaleFont(12),
  md: scaleFont(14),
  lg: scaleFont(16),
  xl: scaleFont(18),
  xxl: scaleFont(20),
  xxxl: scaleFont(24),
};

// Screen dimensions
export const screenData = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isTablet: isTablet(),
  isSmallScreen: isSmallScreen(),
  isLargeScreen: isLargeScreen(),
};

// Responsive grid
export const getResponsiveColumns = (): number => {
  if (isTablet()) {
    return 3; // 3 columns for tablets
  } else if (isLargeScreen()) {
    return 2; // 2 columns for large phones
  } else {
    return 2; // 2 columns for normal phones
  }
};

// Responsive card width
export const getCardWidth = (): number => {
  const columns = getResponsiveColumns();
  const padding = responsivePadding.md;
  const gap = responsivePadding.sm;
  
  return (SCREEN_WIDTH - (padding * 2) - (gap * (columns - 1))) / columns;
};