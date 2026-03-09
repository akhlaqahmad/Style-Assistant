import React from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { C } from '@/constants/colors';
import { Radius } from '@/constants/layout';
import { Spacing } from '@/constants/spacing';
import { ThemedText } from './ThemedText';

export type ChipVariant = 'default' | 'success' | 'accent';

interface ChipProps {
  label: string;
  selected?: boolean;
  variant?: ChipVariant;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
}

export function Chip({ label, selected, variant = 'default', onPress, icon, style }: ChipProps) {
  const scale = useSharedValue(1);

  const handlePress = () => {
    scale.value = withSpring(0.96, { damping: 10 }, () => {
      scale.value = withSpring(1);
    });
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getColors = () => {
    // Priority: Explicit Variant > Selection State > Default State
    
    if (variant === 'success') {
      return {
        bg: C.successLight,
        border: C.success,
        text: '#A8D4A0',
        icon: C.success,
      };
    }

    // "Accent" variant is typically used for active/selected states in lists
    if (variant === 'accent') {
      return {
        bg: 'rgba(193,123,88,0.15)',
        border: C.accent,
        text: C.accent, // Fixed: ensure text is accent color, not generic text color
        icon: C.accent,
      };
    }

    // Default variant but selected (fallback to accent-like look)
    if (selected && variant === 'default') {
      return {
        bg: 'rgba(193,123,88,0.15)',
        border: C.accent,
        text: C.accent,
        icon: C.accent,
      };
    }

    // Default unselected state
    return {
      bg: 'rgba(245,240,232,0.05)',
      border: 'rgba(245,240,232,0.1)',
      text: C.textMuted,
      icon: C.textMuted,
    };
  };

  const colors = getColors();

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        style={[
          styles.chip,
          { backgroundColor: colors.bg, borderColor: colors.border },
          style,
        ]}
      >
        {icon && <Ionicons name={icon} size={14} color={colors.icon} />}
        <ThemedText variant="bodyS" style={{ color: colors.text, fontWeight: '600' }}>
          {label}
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1.5,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8, // Fixed height consistency
  },
});
