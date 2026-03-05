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
const STEP = 3;
const OPTIONS = [
  { value: 'Woman', icon: 'person' as const },
  { value: 'Man', icon: 'person' as const },
  { value: 'Non-binary', icon: 'person' as const },
  { value: 'Prefer not to say', icon: 'ellipsis-horizontal' as const },
];

function GenderCard({ option, selected, onPress, index }: { option: typeof OPTIONS[0]; selected: boolean; onPress: () => void; index: number }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const x = useSharedValue(24);

  useEffect(() => {
    opacity.value = withDelay(160 + index * 80, withTiming(1, { duration: 400 }));
    x.value = withDelay(160 + index * 80, withTiming(0, { duration: 400, easing: Easing.out(Easing.quad) }));
  }, []);

  function handlePress() {
    scale.value = withSpring(0.96, { damping: 10 }, () => {
      scale.value = withSpring(1.02, { damping: 12 }, () => {
        scale.value = withSpring(1);
      });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  }

  const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const wrapStyle = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ translateX: x.value }] }));

  return (
    <Animated.View style={wrapStyle}>
      <Animated.View style={cardStyle}>
        <Pressable onPress={handlePress} style={[styles.card, selected && styles.cardSelected]}>
          <Text style={[styles.cardLabel, selected && styles.cardLabelSelected]}>{option.value}</Text>
          {selected
            ? <View style={styles.checkCircle}><Ionicons name="checkmark" size={16} color="#FFF" /></View>
            : <View style={styles.emptyCircle} />}
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

export default function OnboardingGender() {
  const insets = useSafeAreaInsets();
  const { userProfile, updateUserProfile } = useApp();
  const [selected, setSelected] = React.useState(userProfile.gender || '');

  const progress = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const headerY = useSharedValue(20);

  useEffect(() => {
    progress.value = withTiming(STEP / TOTAL_STEPS, { duration: 600, easing: Easing.out(Easing.quad) });
    headerOpacity.value = withDelay(60, withTiming(1, { duration: 500 }));
    headerY.value = withDelay(60, withTiming(0, { duration: 500, easing: Easing.out(Easing.quad) }));
  }, []);

  const progressStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` as any }));
  const headerStyle = useAnimatedStyle(() => ({ opacity: headerOpacity.value, transform: [{ translateY: headerY.value }] }));

  function handleNext() {
    if (!selected) return;
    updateUserProfile({ gender: selected });
    router.push('/onboarding/eye');
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

      <Animated.View style={[styles.header, headerStyle]}>
        <View style={styles.stepBadge}><Text style={styles.stepText}>{STEP} of {TOTAL_STEPS}</Text></View>
        <Text style={styles.question}>How do you{'\n'}identify?</Text>
        <Text style={styles.sub}>Helps us personalise language and clothing guidance.</Text>
      </Animated.View>

      <View style={styles.cards}>
        {OPTIONS.map((opt, i) => (
          <GenderCard key={opt.value} option={opt} index={i} selected={selected === opt.value} onPress={() => setSelected(opt.value)} />
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
  header: { gap: 12, marginBottom: 36 },
  stepBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(193,123,88,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  stepText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: C.accent, letterSpacing: 0.5 },
  question: { fontFamily: 'Inter_700Bold', fontSize: 40, color: '#F5F0E8', lineHeight: 48, letterSpacing: -1.5 },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 15, color: 'rgba(245,240,232,0.45)', lineHeight: 22 },
  cards: { flex: 1, gap: 12 },
  card: {
    backgroundColor: 'rgba(245,240,232,0.06)', borderRadius: 20,
    borderWidth: 1.5, borderColor: 'rgba(245,240,232,0.1)',
    paddingVertical: 22, paddingHorizontal: 22,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  cardSelected: { borderColor: C.accent, backgroundColor: 'rgba(193,123,88,0.15)' },
  cardLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 20, color: 'rgba(245,240,232,0.65)' },
  cardLabelSelected: { color: '#F5F0E8' },
  emptyCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: 'rgba(245,240,232,0.2)' },
  checkCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' },
  footer: { paddingTop: 20 },
  nextBtn: {
    backgroundColor: C.accent, borderRadius: 16, paddingVertical: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  nextBtnDisabled: { opacity: 0.35 },
  nextBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#FFF' },
});
