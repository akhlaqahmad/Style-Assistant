import React from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { C } from '@/constants/colors';
import { Radius } from '@/constants/layout';
import { Spacing } from '@/constants/spacing';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  variant?: 'default' | 'outlined' | 'elevated' | 'flat';
  padding?: boolean;
}

export function Card({ children, onPress, style, variant = 'default', padding = true }: CardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'outlined':
        return styles.outlined;
      case 'elevated':
        return styles.elevated;
      case 'flat':
        return styles.flat;
      default:
        return styles.default;
    }
  };

  const flattenedStyle = StyleSheet.flatten([
    styles.base,
    getVariantStyles(),
    padding && styles.padding,
    style
  ]);

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          flattenedStyle,
          pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={flattenedStyle}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  padding: {
    padding: Spacing.lg,
  },
  default: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: C.border,
  },
  elevated: {
    backgroundColor: C.card,
  },
  flat: {
    backgroundColor: 'rgba(245,240,232,0.05)',
  },
});
