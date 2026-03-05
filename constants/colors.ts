const C = {
  background: '#0F0D0B',
  card: '#1A1714',
  cardAlt: '#141210',
  primary: '#F5F0E8',
  accent: '#C17B58',
  accentLight: 'rgba(193,123,88,0.15)',
  accentDark: '#9A5E3F',
  secondary: 'rgba(245,240,232,0.5)',
  border: 'rgba(245,240,232,0.1)',
  muted: 'rgba(245,240,232,0.35)',
  success: '#7A9B6A',
  successLight: 'rgba(122,155,106,0.2)',
  warning: '#D4A96A',
  warningLight: 'rgba(212,169,106,0.2)',
  danger: '#C0605A',
  dangerLight: 'rgba(192,96,90,0.2)',
  white: '#1A1714',
  black: '#000000',
  text: '#F5F0E8',
  textSecondary: 'rgba(245,240,232,0.55)',
  textMuted: 'rgba(245,240,232,0.35)',
  overlay: 'rgba(0,0,0,0.5)',
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
