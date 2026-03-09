import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const Layout = {
  window: {
    width,
    height,
  },
  screen: {
    padding: 20,
    maxWidth: 600,
  },
  isSmallDevice: width < 375,
};
