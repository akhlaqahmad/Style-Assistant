import React, { useEffect } from 'react';
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
import { SelectionCard } from '@/components/ui/SelectionCard';

const TOTAL_STEPS = 12;
const STEP = 10;

const AESTHETICS = [
  { name: 'Classic', sub: 'Timeless, tailored, polished' },
  { name: 'Minimal / Modern', sub: 'Clean lines, neutral palettes' },
  { name: 'Sporty / Casual', sub: 'Relaxed, functional' },
  { name: 'Elegant / Refined', sub: 'Sophisticated, polished' },
  { name: 'Creative / Artistic', sub: 'Unique, expressive' },
  { name: 'Romantic / Soft', sub: 'Feminine details, flowing fabrics' },
  { name: 'Edgy / Contemporary', sub: 'Bold, structured' },
  { name: 'Relaxed / Effortless', sub: 'Comfortable, easy silhouettes' },
  { name: 'Trend-forward / Fashion-led', sub: 'Enjoys experimenting' },
];

export default function OnboardingStyles() {
  const insets = useSafeAreaInsets();
  const { updateUserProfile } = useApp();
  const [selected, setSelected] = React.useState<string[]>([]);

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

  function toggle(name: string) {
    setSelected(prev => prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function handleNext() {
    updateUserProfile({ preferredStyles: selected });
    router.push('/onboarding/lifestyle');
  }

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
          <ThemedText variant="headingXL" style={styles.question}>Which styles feel{'\n'}most like you?</ThemedText>
          <ThemedText variant="bodyM" color="rgba(245,240,232,0.45)" style={styles.sub}>Pick as many as you like — your style is uniquely yours.</ThemedText>
        </Animated.View>

        <View style={styles.grid}>
          {AESTHETICS.map((item, i) => (
            <View key={item.name} style={styles.cardWrap}>
              <SelectionCard
                label={item.name}
                hint={item.sub}
                selected={selected.includes(item.name)}
                onPress={() => toggle(item.name)}
                style={styles.card}
              />
            </View>
          ))}
        </View>

        {selected.length > 0 && (
          <ThemedText variant="bodyS" style={styles.selectedCount}>{selected.length} selected</ThemedText>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 24) }]}>
        <Button 
          title={selected.length === 0 ? 'Skip' : 'Continue'} 
          onPress={handleNext} 
          icon={<Ionicons name="arrow-forward" size={18} color="#FFF" />}
          style={{ flexDirection: 'row-reverse' }}
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
  scrollContent: { paddingHorizontal: 28, paddingBottom: 20, gap: 28 },
  header: { gap: 12 },
  stepBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(193,123,88,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  stepText: { color: C.accent, letterSpacing: 0.5 },
  question: { color: C.text, lineHeight: 48, letterSpacing: -1.5 },
  sub: { lineHeight: 22 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cardWrap: { width: '100%' }, // Changed to 100% to use SelectionCard properly, or keep it grid?
  // SelectionCard is designed as a row. Let's make it 100% width vertical list for consistency with other screens?
  // Or if we want grid, we need a vertical SelectionCard.
  // The original design had 2 columns.
  // Let's stick to 1 column for consistency with Skin/Gender screens, or use a new VerticalSelectionCard.
  // I will use 100% width for now as it's cleaner with the new SelectionCard.
  card: { paddingVertical: 12, paddingHorizontal: 16 },
  selectedCount: { color: C.accent, textAlign: 'center' },
  footer: { paddingHorizontal: 28, paddingTop: 12 },
});
