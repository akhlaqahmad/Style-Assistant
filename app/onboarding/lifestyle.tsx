import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay, withSpring, Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

const LIFESTYLES = ['Office professional', 'Creative work', 'Work from home', 'Physical / active work', 'Student', 'Parent life', 'Social butterfly', 'Outdoors lover', 'Homebody', 'Frequent traveller'];
const BUDGETS = ['I love a bargain', 'Mid-range is my sweet spot', 'I invest in quality pieces', 'A mix — it depends'];

function AnimChip({ label, selected, onPress, delay }: { label: string; selected: boolean; onPress: () => void; delay: number }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 350 }));
  }, []);

  function handlePress() {
    scale.value = withSpring(0.9, { damping: 8 }, () => {
      scale.value = withSpring(1.06, { damping: 10 }, () => {
        scale.value = withSpring(1);
      });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }

  const chipStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }], opacity: opacity.value }));

  return (
    <Animated.View style={chipStyle}>
      <Pressable onPress={handlePress} style={[styles.chip, selected && styles.chipSelected]}>
        {selected && <Ionicons name="checkmark" size={13} color={C.accent} />}
        <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function OnboardingLifestyle() {
  const insets = useSafeAreaInsets();
  const { updateUserProfile } = useApp();
  const [life, setLife] = React.useState<string[]>([]);
  const [budget, setBudget] = React.useState('');

  const progress = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const headerY = useSharedValue(20);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.quad) });
    headerOpacity.value = withDelay(60, withTiming(1, { duration: 500 }));
    headerY.value = withDelay(60, withTiming(0, { duration: 500, easing: Easing.out(Easing.quad) }));
  }, []);

  const progressStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` as any }));
  const headerStyle = useAnimatedStyle(() => ({ opacity: headerOpacity.value, transform: [{ translateY: headerY.value }] }));

  function toggleLife(l: string) {
    setLife(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]);
  }

  function handleComplete() {
    updateUserProfile({ lifestyle: life, budgetRange: budget, onboardingComplete: true });
    router.replace('/onboarding/complete');
  }

  const canContinue = life.length > 0 && budget !== '';

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={14}>
          <Ionicons name="arrow-back" size={22} color="rgba(245,240,232,0.6)" />
        </Pressable>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>
        <Text style={styles.almostText}>Almost done!</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.header, headerStyle]}>
          <View style={styles.stepBadge}><Text style={styles.stepText}>Last step</Text></View>
          <Text style={styles.question}>A few final{'\n'}details</Text>
          <Text style={styles.sub}>Help us understand what occasions to dress you for.</Text>
        </Animated.View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Your lifestyle</Text>
          <View style={styles.chips}>
            {LIFESTYLES.map((l, i) => (
              <AnimChip key={l} label={l} selected={life.includes(l)} onPress={() => toggleLife(l)} delay={200 + i * 30} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Budget approach</Text>
          <View style={styles.chips}>
            {BUDGETS.map((b, i) => (
              <AnimChip key={b} label={b} selected={budget === b} onPress={() => setBudget(b)} delay={500 + i * 40} />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 24) }]}>
        <Pressable
          style={({ pressed }) => [styles.nextBtn, !canContinue && styles.nextBtnDisabled, { opacity: pressed ? 0.85 : 1 }]}
          onPress={handleComplete}
        >
          <Text style={styles.nextBtnText}>Reveal my style profile</Text>
          <Ionicons name="sparkles" size={18} color="#FFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0D0B' },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 16, paddingHorizontal: 28 },
  progressTrack: { flex: 1, height: 3, backgroundColor: 'rgba(245,240,232,0.1)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: C.accent, borderRadius: 2 },
  almostText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: C.accent },
  scrollContent: { paddingHorizontal: 28, paddingBottom: 20, gap: 32 },
  header: { gap: 12 },
  stepBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(193,123,88,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  stepText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: C.accent, letterSpacing: 0.5 },
  question: { fontFamily: 'Inter_700Bold', fontSize: 40, color: '#F5F0E8', lineHeight: 48, letterSpacing: -1.5 },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 15, color: 'rgba(245,240,232,0.45)', lineHeight: 22 },
  section: { gap: 16 },
  sectionLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: 'rgba(245,240,232,0.7)' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1.5, borderRadius: 24,
    borderColor: 'rgba(245,240,232,0.1)',
    backgroundColor: 'rgba(245,240,232,0.05)',
    paddingHorizontal: 14, paddingVertical: 10,
  },
  chipSelected: { borderColor: C.accent, backgroundColor: 'rgba(193,123,88,0.15)' },
  chipText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: 'rgba(245,240,232,0.55)' },
  chipTextSelected: { color: '#F5F0E8' },
  footer: { paddingHorizontal: 28, paddingTop: 12 },
  nextBtn: {
    backgroundColor: C.accent, borderRadius: 16, paddingVertical: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  nextBtnDisabled: { opacity: 0.35 },
  nextBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#FFF' },
});
