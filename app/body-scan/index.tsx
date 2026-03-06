import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { C } from '@/constants/colors';

const STEPS = [
  { icon: 'scan-outline', title: '3D Scan', desc: 'Use your camera to scan your body from multiple angles' },
  { icon: 'resize-outline', title: 'Auto-Measure', desc: 'AI automatically extracts your precise body measurements' },
  { icon: 'body-outline', title: '3D Avatar', desc: 'Get a photorealistic 3D avatar for virtual try-ons' },
];

export default function BodyScanIntro() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={24} color={C.primary} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.iconWrap}>
          <Ionicons name="scan-outline" size={48} color={C.accent} />
        </Animated.View>

        <Animated.Text entering={FadeInDown.delay(200).duration(500)} style={styles.title}>
          3D Body Scan
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(300).duration(500)} style={styles.subtitle}>
          Create a photorealistic 3D avatar. Our AI scans your body to extract precise measurements automatically.
        </Animated.Text>

        <View style={styles.steps}>
          {STEPS.map((step, i) => (
            <Animated.View key={step.title} entering={FadeInDown.delay(400 + i * 100).duration(500)} style={styles.stepRow}>
              <View style={styles.stepIcon}>
                <Ionicons name={step.icon as any} size={22} color={C.accent} />
              </View>
              <View style={styles.stepText}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDesc}>{step.desc}</Text>
              </View>
            </Animated.View>
          ))}
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 24) }]}>
        <Pressable
          style={({ pressed }) => [styles.startBtn, { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }]}
          onPress={() => router.push('/body-scan/capture-3d')}
        >
          <Text style={styles.startBtnText}>Start 3D Scan</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  content: { flex: 1, paddingHorizontal: 28, justifyContent: 'center', gap: 20 },
  iconWrap: { width: 88, height: 88, borderRadius: 28, backgroundColor: C.accentLight, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  title: { fontFamily: 'Inter_700Bold', fontSize: 32, color: C.primary, textAlign: 'center' },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 15, color: C.textSecondary, textAlign: 'center', lineHeight: 22 },
  steps: { gap: 14, marginTop: 12 },
  stepRow: { flexDirection: 'row', gap: 14, alignItems: 'center', backgroundColor: C.white, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.border },
  stepIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: C.accentLight, alignItems: 'center', justifyContent: 'center' },
  stepText: { flex: 1, gap: 3 },
  stepTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: C.primary },
  stepDesc: { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.textSecondary },
  footer: { paddingHorizontal: 20, paddingTop: 16 },
  startBtn: { backgroundColor: C.accent, borderRadius: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  startBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#FFF' },
});
