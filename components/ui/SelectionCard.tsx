import React from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { C } from '@/constants/colors';
import { Radius } from '@/constants/layout';
import { Spacing } from '@/constants/spacing';
import { ThemedText } from './ThemedText';

interface SelectionCardProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: ViewStyle;
  icon?: keyof typeof Ionicons.glyphMap;
  hint?: string;
}

export function SelectionCard({ label, selected, onPress, style, icon, hint }: SelectionCardProps) {
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

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        style={[
          styles.card,
          selected && styles.cardSelected,
          style,
        ]}
      >
        {icon && (
          <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
            <Ionicons name={icon} size={20} color={selected ? C.accent : 'rgba(245,240,232,0.4)'} />
          </View>
        )}
        
        <View style={styles.textContainer}>
          <ThemedText
            variant="bodyM"
            color={selected ? C.text : C.textSecondary}
            style={styles.label}
          >
            {label}
          </ThemedText>
          {hint && (
            <ThemedText
              variant="caption"
              color={selected ? 'rgba(245,240,232,0.55)' : 'rgba(245,240,232,0.3)'}
            >
              {hint}
            </ThemedText>
          )}
        </View>
        
        {selected ? (
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={14} color="#FFF" />
          </View>
        ) : (
          <View style={styles.emptyCircle} />
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(245,240,232,0.06)',
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(245,240,232,0.1)',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  cardSelected: {
    borderColor: C.accent,
    backgroundColor: 'rgba(193,123,88,0.15)',
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontWeight: '600',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(245,240,232,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapSelected: {
    backgroundColor: 'rgba(193,123,88,0.2)',
  },
  emptyCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: 'rgba(245,240,232,0.2)',
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
