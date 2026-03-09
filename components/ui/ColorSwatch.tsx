import React from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { C } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { ThemedText } from './ThemedText';

interface ColorSwatchProps {
  color: string;
  label: string;
  selected: boolean;
  onPress: () => void;
  size?: number;
  style?: ViewStyle;
}

export function ColorSwatch({ color, label, selected, onPress, size = 52, style }: ColorSwatchProps) {
  const scale = useSharedValue(1);

  const handlePress = () => {
    scale.value = withSpring(0.9, { damping: 10 }, () => {
      scale.value = withSpring(1);
    });
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isLight = ['#F0EDDE', '#E8C97A', '#transparent', '#FFFFFF'].includes(color);
  const isTransparent = color === 'transparent';

  return (
    <Animated.View style={[styles.container, style]}>
      <Pressable onPress={handlePress} style={styles.pressable}>
        <Animated.View style={animatedStyle}>
          <View
            style={[
              styles.circle,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: isTransparent ? 'transparent' : color,
              },
              isTransparent && styles.rainbow,
              selected && { borderWidth: 3, borderColor: C.text },
            ]}
          >
            {selected && (
              <Ionicons
                name="checkmark"
                size={size * 0.35}
                color={isLight && !isTransparent ? '#000' : '#FFF'}
              />
            )}
          </View>
        </Animated.View>
        <ThemedText
          variant="caption"
          color={selected ? C.text : C.textMuted}
          style={styles.label}
        >
          {label}
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressable: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(245,240,232,0.1)',
  },
  rainbow: {
    borderWidth: 2,
    borderColor: C.accent,
    backgroundColor: '#C47A50', // Fallback or gradient logic if needed
  },
  label: {
    textAlign: 'center',
  },
});
