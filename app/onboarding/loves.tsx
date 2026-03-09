import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay, withSpring, Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/ui/ThemedText';
import { Chip, ChipVariant } from '@/components/ui/Chip';

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

  const getVariant = (state: 'none' | 'love' | 'downplay'): ChipVariant => {
    if (state === 'love') return 'success';
    if (state === 'downplay') return 'accent';
    return 'default';
  };

  const getIcon = (state: 'none' | 'love' | 'downplay') => {
    if (state === 'love') return 'heart';
    if (state === 'downplay') return 'remove-circle';
    return undefined;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.topBar}>
        <Button variant="ghost" size="sm" icon={<Ionicons name="arrow-back" size={22} color="rgba(245,240,232,0.6)" />} onPress={() => router.back()} title="" style={{ width: 40, paddingHorizontal: 0 }} />
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.header, headerStyle]}>
          <View style={styles.stepBadge}><ThemedText variant="caption" style={styles.stepText}>{STEP} of {TOTAL_STEPS}</ThemedText></View>
          <ThemedText variant="headingXL" style={styles.question}>Celebrate{'\n'}your body</ThemedText>
          <ThemedText variant="bodyM" color="rgba(245,240,232,0.45)" style={styles.sub}>Tap once to highlight a feature you love, twice to note what you prefer to work around. Skip any you're unsure about.</ThemedText>
        </Animated.View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: C.success }]} />
            <ThemedText variant="caption" style={styles.legendText}>Love</ThemedText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: C.accent }]} />
            <ThemedText variant="caption" style={styles.legendText}>Work around</ThemedText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: 'rgba(245,240,232,0.2)' }]} />
            <ThemedText variant="caption" style={styles.legendText}>Neutral</ThemedText>
          </View>
        </View>

        <View style={styles.chips}>
          {FEATURES.map((f, i) => (
            <Chip 
              key={f} 
              label={f} 
              variant={getVariant(states[f])} 
              icon={getIcon(states[f])}
              onPress={() => cycle(f)} 
            />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 24) }]}>
        <Button 
          title="Continue" 
          onPress={handleNext} 
          icon={<Ionicons name="arrow-forward" size={18} color="#FFF" />}
          style={{ flexDirection: 'row-reverse' }}
        />
        <Button 
          title="Skip this step" 
          variant="ghost" 
          size="sm" 
          onPress={handleNext} 
          style={styles.skip}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 16, paddingHorizontal: 28 },
  progressTrack: { flex: 1, height: 3, backgroundColor: 'rgba(245,240,232,0.1)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: C.accent, borderRadius: 2 },
  scrollContent: { paddingHorizontal: 28, paddingBottom: 20, gap: 24 },
  header: { gap: 12 },
  stepBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(193,123,88,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  stepText: { color: C.accent, letterSpacing: 0.5 },
  question: { color: C.text, lineHeight: 48, letterSpacing: -1.5 },
  sub: { lineHeight: 22 },
  legend: { flexDirection: 'row', gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: 'rgba(245,240,232,0.45)' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  footer: { paddingHorizontal: 28, paddingTop: 12, gap: 10 },
  skip: { alignSelf: 'center', paddingVertical: 4 },
});
