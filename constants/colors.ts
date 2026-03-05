const C = {
  background: '#FAF8F5',
  card: '#FFFFFF',
  cardAlt: '#F5F0E8',
  primary: '#1C1C1A',
  accent: '#C17B58',
  accentLight: '#F5EDE6',
  accentDark: '#9A5E3F',
  secondary: '#8B7B6B',
  border: '#E8E2DA',
  muted: '#B5ADA4',
  success: '#7A9B6A',
  successLight: '#EAF2E7',
  warning: '#D4A96A',
  warningLight: '#FAF1E2',
  danger: '#C0605A',
  dangerLight: '#FAECEA',
  white: '#FFFFFF',
  black: '#000000',
  text: '#1C1C1A',
  textSecondary: '#6B6460',
  textMuted: '#A89E98',
  overlay: 'rgba(28,28,26,0.5)',
};

export default {
  light: {
    tint: C.accent,
    tabIconDefault: C.muted,
    tabIconSelected: C.accent,
    ...C,
  },
};

export { C };
