import React from 'react';
import { Pressable, type PressableProps, StyleSheet, View, type ViewStyle } from 'react-native';
import { C } from '@/constants/colors';
import { Radius } from '@/constants/layout';
import { Spacing } from '@/constants/spacing';
import { ThemedText } from './ThemedText';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = PressableProps & {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  isLoading?: boolean;
};

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  icon,
  isLoading,
  style,
  disabled,
  ...rest
}: ButtonProps) {
  const getBackgroundColor = (pressed: boolean) => {
    if (disabled) return C.muted;
    switch (variant) {
      case 'primary':
        return pressed ? C.accentDark : C.accent;
      case 'secondary':
        return pressed ? 'rgba(245,240,232,0.6)' : C.secondary;
      case 'outline':
        return pressed ? 'rgba(245,240,232,0.05)' : 'transparent';
      case 'ghost':
        return pressed ? 'rgba(245,240,232,0.05)' : 'transparent';
      case 'danger':
        return pressed ? C.danger : C.danger;
      default:
        return C.accent;
    }
  };

  const getTextColor = () => {
    if (disabled) return C.textMuted;
    switch (variant) {
      case 'primary':
        return '#FFFFFF'; // Assuming white text on accent
      case 'secondary':
        return C.background; // Dark text on light secondary
      case 'outline':
        return C.text;
      case 'ghost':
        return C.text;
      case 'danger':
        return '#FFFFFF';
      default:
        return '#FFFFFF';
    }
  };

  const getBorderColor = () => {
    if (variant === 'outline') return C.border;
    return 'transparent';
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md, height: 32 };
      case 'md':
        return { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, height: 48 };
      case 'lg':
        return { paddingVertical: Spacing.lg, paddingHorizontal: Spacing['2xl'], height: 56 };
      default:
        return { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, height: 48 };
    }
  };

  const getTextVariant = () => {
    switch (size) {
      case 'sm': return 'bodyS';
      case 'md': return 'button';
      case 'lg': return 'button';
      default: return 'button';
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        getSizeStyles(),
        {
          backgroundColor: getBackgroundColor(pressed),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        style as ViewStyle,
      ]}
      disabled={disabled || isLoading}
      {...rest}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <ThemedText
        variant={getTextVariant()}
        color={getTextColor()}
        style={{ fontWeight: '600' }}
      >
        {isLoading ? 'Loading...' : title}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
  },
  iconContainer: {
    marginRight: Spacing.sm,
  },
});
