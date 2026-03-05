import React, { useEffect, useRef } from 'react';
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

const TOTAL_STEPS = 8;
const STEP = 7;

const FEATURES = ['Shoulders', 'Arms', 'Chest', 'Waist', 'Hips', 'Legs', 'Height', 'Back', 'Curves', 'Neck', 'Decolletage', 'Ankles'];

const TIPS: Record<string, string[]> = {
  Shoulders: ['Structured blazers that frame the frame beautifully', 'Boat necks and wide-collar styles'],
  Arms: ['Three-quarter sleeves to balance', 'Soft draped fabrics'],
  Chest: ['V-necks to draw the eye', 'Wrap styles that define the waist'],
  Waist: ['Wide belts to define', 'Wrap dresses and A-line skirts'],
  Hips: ['A-line silhouettes that celebrate curves', 'Wide-leg trousers for balance'],
  Legs: ['Vertical stripe trousers to elongate', 'Midi lengths that show the ankle'],
  Height: ['Monochrome dressing for elongation', 'High-waisted styles'],
  Back: ['Open-back details to celebrate', 'Halter and crossback silhouettes'],
  Curves: ['Jersey and fluid fabrics that move', 'Wrap and fit-and-flare silhouettes'],
  Neck: ['Scoop necks and open collars', 'Long pendant necklaces'],
  Decolletage: ['Square necklines and bardot styles', 'Delicate jewellery to accent'],
  Ankles: ['Cropped trousers to showcase', 'Ankle-strap sandals'],
};

function FeatureChip({ label, state, onPress, index }: { label: string; state: 'none' | 'love' | 'downplay'; onPress: () => void; index: number }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(200 + index * 30, withTiming(1, { duration: 350 }));
  }, []);

  function handlePress() {
    scale.value = withSpring(0.9, { damping: 8 }, () => {
      scale.value = withSpring(1.08, { damping: 10 }, () => {
        scale.value = withSpring(1);
      });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }

  const chipStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }], opacity: opacity.value }));

  const colors =
    state === 'love' ? { bg: 'rgba(122,155,106,0.2)', border: C.success, text: '#A8D4A0' }
    : state === 'downplay' ? { bg: 'rgba(193,123,88,0.18)', border: C.accent, text: C.accent }
    : { bg: 'rgba(245,240,232,0.05)', border: 'rgba(245,240,232,0.1)', text: 'rgba(245,240,232,0.55)' };

  return (
    <Animated.View style={chipStyle}>
      <Pressable onPress={handlePress} style={[styles.chip, { backgroundColor: colors.bg, borderColor: colors.border }]}>
        {state === 'love' && <Ionicons name="heart" size={12} color={C.success} />}
        {state === 'downplay' && <Ionicons name="remove-circle" size={12} color={C.accent} />}
        <Text style={[styles.chipText, { color: colors.text }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function OnboardingLoves() {
  const insets = useSafeAreaInsets();
  const { updateUserProfile, updateBodyProfile } = useApp();
  const [states, setStates] = React.useState<Record<string, 'none' | 'love' | 'downplay'>>(
    Object.fromEntries(FEATURES.map(f => [f, 'none']))
  );

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

  function cycle(feature: string) {
    setStates(prev => {
      const cur = prev[feature];
      const next = cur === 'none' ? 'love' : cur === 'love' ? 'downplay' : 'none';
      return { ...prev, [feature]: next };
    });
  }

  function handleNext() {
    const loves = FEATURES.filter(f => states[f] === 'love');
    const downplay = FEATURES.filter(f => states[f] === 'downplay');
    const silhouetteGuidance = loves.flatMap(f => TIPS[f] || []);
    updateUserProfile({ bodyLoves: loves, bodyDownplay: downplay });
    updateBodyProfile({
      silhouetteGuidance,
      layeringTips: ['Layer a tailored blazer over basics for instant polish', 'Use cardigans to add depth without bulk'],
      fabricSuggestions: ['Structured fabrics hold silhouette beautifully', 'Fluid fabrics like silk drape over curves'],
    });
    router.push('/onboarding/styles');
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={14}>
          <Ionicons name="arrow-back" size={22} color="rgba(245,240,232,0.6)" />
        </Pressable>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.header, headerStyle]}>
          <View style={styles.stepBadge}><Text style={styles.stepText}>{STEP} of {TOTAL_STEPS}</Text></View>
          <Text style={styles.question}>Celebrate{'\n'}your body</Text>
          <Text style={styles.sub}>Tap once to highlight a feature you love, twice to note what you prefer to work around. Skip any you're unsure about.</Text>
        </Animated.View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: C.success }]} />
            <Text style={styles.legendText}>Love</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: C.accent }]} />
            <Text style={styles.legendText}>Work around</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: 'rgba(245,240,232,0.2)' }]} />
            <Text style={styles.legendText}>Neutral</Text>
          </View>
        </View>

        <View style={styles.chips}>
          {FEATURES.map((f, i) => (
            <FeatureChip key={f} label={f} index={i} state={states[f]} onPress={() => cycle(f)} />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 24) }]}>
        <Pressable
          style={({ pressed }) => [styles.nextBtn, { opacity: pressed ? 0.85 : 1 }]}
          onPress={handleNext}
        >
          <Text style={styles.nextBtnText}>Continue</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFF" />
        </Pressable>
        <Pressable onPress={handleNext} style={styles.skip}>
          <Text style={styles.skipText}>Skip this step</Text>
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
  scrollContent: { paddingHorizontal: 28, paddingBottom: 20, gap: 24 },
  header: { gap: 12 },
  stepBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(193,123,88,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  stepText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: C.accent, letterSpacing: 0.5 },
  question: { fontFamily: 'Inter_700Bold', fontSize: 40, color: '#F5F0E8', lineHeight: 48, letterSpacing: -1.5 },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 15, color: 'rgba(245,240,232,0.45)', lineHeight: 22 },
  legend: { flexDirection: 'row', gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: 'rgba(245,240,232,0.45)' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1.5, borderRadius: 24, paddingHorizontal: 14, paddingVertical: 10 },
  chipText: { fontFamily: 'Inter_500Medium', fontSize: 14 },
  footer: { paddingHorizontal: 28, paddingTop: 12, gap: 10 },
  nextBtn: {
    backgroundColor: C.accent, borderRadius: 16, paddingVertical: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  nextBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#FFF' },
  skip: { alignItems: 'center', paddingVertical: 4 },
  skipText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: 'rgba(245,240,232,0.3)' },
});
