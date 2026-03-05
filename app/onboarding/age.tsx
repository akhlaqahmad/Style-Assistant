import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay,
  withSpring, Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

const TOTAL_STEPS = 8;
const STEP = 2;
const AGE_RANGES = ['18–24', '25–34', '35–44', '45–54', '55–64', '65+'];

function AgeCard({ label, selected, onPress, index }: { label: string; selected: boolean; onPress: () => void; index: number }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const y = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(200 + index * 70, withTiming(1, { duration: 400 }));
    y.value = withDelay(200 + index * 70, withTiming(0, { duration: 400, easing: Easing.out(Easing.quad) }));
  }, []);

  function handlePress() {
    scale.value = withSpring(0.94, { damping: 10 }, () => {
      scale.value = withSpring(1.04, { damping: 12 }, () => {
        scale.value = withSpring(1);
      });
    });
    onPress();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  const translateStyle = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));

  return (
    <Animated.View style={translateStyle}>
      <Animated.View style={cardStyle}>
        <Pressable onPress={handlePress} style={[styles.ageCard, selected && styles.ageCardSelected]}>
          <Text style={[styles.ageLabel, selected && styles.ageLabelSelected]}>{label}</Text>
          {selected && (
            <View style={styles.check}>
              <Ionicons name="checkmark" size={14} color="#FFF" />
            </View>
          )}
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

export default function OnboardingAge() {
  const insets = useSafeAreaInsets();
  const { userProfile, updateUserProfile } = useApp();
  const [selected, setSelected] = React.useState(userProfile.ageRange || '');

  const progress = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentY = useSharedValue(28);

  useEffect(() => {
    progress.value = withTiming(STEP / TOTAL_STEPS, { duration: 600, easing: Easing.out(Easing.quad) });
    contentOpacity.value = withDelay(80, withTiming(1, { duration: 500 }));
    contentY.value = withDelay(80, withTiming(0, { duration: 500, easing: Easing.out(Easing.quad) }));
  }, []);

  const progressStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` as any }));
  const contentStyle = useAnimatedStyle(() => ({ opacity: contentOpacity.value, transform: [{ translateY: contentY.value }] }));

  function handleNext() {
    if (!selected) return;
    updateUserProfile({ ageRange: selected });
    router.push('/onboarding/gender');
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0), paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 24) }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={14}>
          <Ionicons name="arrow-back" size={22} color="rgba(245,240,232,0.6)" />
        </Pressable>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>
      </View>

      <Animated.View style={[styles.content, contentStyle]}>
        <View style={styles.stepBadge}><Text style={styles.stepText}>{STEP} of {TOTAL_STEPS}</Text></View>
        <Text style={styles.question}>How old{'\n'}are you?</Text>
        <Text style={styles.sub}>This helps us tailor silhouette suggestions to suit you.</Text>
      </Animated.View>

      <View style={styles.grid}>
        {AGE_RANGES.map((a, i) => (
          <AgeCard key={a} label={a} index={i} selected={selected === a} onPress={() => setSelected(a)} />
        ))}
      </View>

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [styles.nextBtn, !selected && styles.nextBtnDisabled, { opacity: pressed ? 0.85 : 1 }]}
          onPress={handleNext}
          disabled={!selected}
        >
          <Text style={styles.nextBtnText}>Continue</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0D0B', paddingHorizontal: 28 },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 16 },
  progressTrack: { flex: 1, height: 3, backgroundColor: 'rgba(245,240,232,0.1)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: C.accent, borderRadius: 2 },
  content: { gap: 12, marginBottom: 32 },
  stepBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(193,123,88,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  stepText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: C.accent, letterSpacing: 0.5 },
  question: { fontFamily: 'Inter_700Bold', fontSize: 40, color: '#F5F0E8', lineHeight: 48, letterSpacing: -1.5 },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 15, color: 'rgba(245,240,232,0.45)', lineHeight: 22 },
  grid: { flex: 1, gap: 10 },
  ageCard: {
    backgroundColor: 'rgba(245,240,232,0.06)', borderRadius: 18,
    borderWidth: 1.5, borderColor: 'rgba(245,240,232,0.1)',
    paddingVertical: 20, paddingHorizontal: 24,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  ageCardSelected: { borderColor: C.accent, backgroundColor: 'rgba(193,123,88,0.15)' },
  ageLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 20, color: 'rgba(245,240,232,0.7)' },
  ageLabelSelected: { color: '#F5F0E8' },
  check: { width: 24, height: 24, borderRadius: 12, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' },
  footer: { paddingTop: 20 },
  nextBtn: {
    backgroundColor: C.accent, borderRadius: 16, paddingVertical: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  nextBtnDisabled: { opacity: 0.35 },
  nextBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#FFF' },
});
