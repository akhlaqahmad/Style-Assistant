import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/ui/ThemedText';
import { SelectionCard } from '@/components/ui/SelectionCard';

const TOTAL_STEPS = 8;
const STEP = 2;
const AGE_RANGES = ['18–24', '25–34', '35–44', '45–54', '55–64', '65+'];

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

  function handleSelect(val: string) {
    setSelected(val);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0), paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 24) }]}>
      <View style={styles.topBar}>
        <Button variant="ghost" size="sm" icon={<Ionicons name="arrow-back" size={22} color="rgba(245,240,232,0.6)" />} onPress={() => router.back()} title="" style={{ width: 40, paddingHorizontal: 0 }} />
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>
      </View>

      <Animated.View style={[styles.content, contentStyle]}>
        <View style={styles.stepBadge}><ThemedText variant="caption" style={styles.stepText}>{STEP} of {TOTAL_STEPS}</ThemedText></View>
        <ThemedText variant="headingXL" style={styles.question}>How old{'\n'}are you?</ThemedText>
        <ThemedText variant="bodyM" color="rgba(245,240,232,0.45)" style={styles.sub}>This helps us tailor silhouette suggestions to suit you.</ThemedText>
      </Animated.View>

      <View style={styles.grid}>
        {AGE_RANGES.map((a, i) => (
          <SelectionCard 
            key={a} 
            label={a} 
            selected={selected === a} 
            onPress={() => handleSelect(a)}
            style={styles.card}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <Button 
          title="Continue" 
          onPress={handleNext} 
          disabled={!selected}
          icon={<Ionicons name="arrow-forward" size={18} color="#FFF" />}
          style={{ flexDirection: 'row-reverse' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background, paddingHorizontal: 28 },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 16 },
  progressTrack: { flex: 1, height: 3, backgroundColor: 'rgba(245,240,232,0.1)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: C.accent, borderRadius: 2 },
  content: { gap: 12, marginBottom: 32 },
  stepBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(193,123,88,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  stepText: { color: C.accent, letterSpacing: 0.5 },
  question: { color: C.text, lineHeight: 48, letterSpacing: -1.5 },
  sub: { lineHeight: 22 },
  grid: { flex: 1, gap: 10 },
  card: { paddingVertical: 16 }, // slightly smaller vertical padding for list
  footer: { paddingTop: 20 },
});
