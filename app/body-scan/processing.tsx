import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { C } from '@/constants/colors';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export default function ProcessingScreen() {
  const [stage, setStage] = useState('Analysing geometry...');

  useEffect(() => {
    const t1 = setTimeout(() => setStage('Extracting measurements...'), 1000);
    const t2 = setTimeout(() => setStage('Generating 3D model...'), 2000);
    const t3 = setTimeout(() => {
      router.push('/body-scan/review');
    }, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.content}>
        <ActivityIndicator size="large" color={C.accent} style={{ transform: [{ scale: 1.5 }] }} />
        <Text style={styles.title}>Processing Scan</Text>
        <Text style={styles.subtitle}>{stage}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background, alignItems: 'center', justifyContent: 'center' },
  content: { alignItems: 'center', gap: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: C.primary, marginTop: 20 },
  subtitle: { fontSize: 16, color: C.textSecondary, marginTop: 8 },
});
