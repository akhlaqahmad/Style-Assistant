import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: boolean;
  safeArea?: boolean;
}

export function Screen({ children, style, padding = true, safeArea = true }: ScreenProps) {
  const insets = useSafeAreaInsets();
  
  const containerStyle = [
    styles.container,
    safeArea && { 
      paddingTop: insets.top, 
      paddingBottom: insets.bottom 
    },
    padding && styles.padding,
    style
  ];

  return (
    <View style={containerStyle}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  padding: {
    paddingHorizontal: Spacing.lg,
  },
});
