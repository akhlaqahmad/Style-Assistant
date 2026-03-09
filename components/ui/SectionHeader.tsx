import React from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { ThemedText } from './ThemedText';

interface SectionHeaderProps {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  actionLabel?: string;
}

export function SectionHeader({ title, onPress, style, actionLabel }: SectionHeaderProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.container, style, { opacity: pressed ? 0.7 : 1 }]}
    >
      <ThemedText variant="headingS" style={styles.title}>{title}</ThemedText>
      {onPress && (
        <View style={styles.action}>
          {actionLabel && <ThemedText variant="bodyS" color={C.accent}>{actionLabel}</ThemedText>}
          <Ionicons name="chevron-forward" size={18} color={C.accent} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  title: {
    flex: 1,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
});
