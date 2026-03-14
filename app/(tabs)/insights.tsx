import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '@/constants/colors';

export default function InsightsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Insights</Text>
        <Text style={styles.subtitle}>Your personal style analytics</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.placeholder}>Insights coming soon...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 30, color: C.primary },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textSecondary, marginTop: 2 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  placeholder: { fontFamily: 'Inter_500Medium', fontSize: 16, color: C.textSecondary },
});
