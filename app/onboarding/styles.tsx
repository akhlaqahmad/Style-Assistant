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

const TOTAL_STEPS = 8;
const STEP = 8;

const AESTHETICS = [
  { name: 'Classic', sub: 'Timeless, tailored' },
  { name: 'Minimalist', sub: 'Clean lines, no excess' },
  { name: 'Romantic', sub: 'Feminine, soft details' },
  { name: 'Edgy', sub: 'Bold, avant-garde' },
  { name: 'Boho', sub: 'Free-spirited, earthy' },
  { name: 'Sporty', sub: 'Casual, functional' },
  { name: 'Preppy', sub: 'Polished, collegiate' },
  { name: 'Maximalist', sub: 'More is more' },
  { name: 'Sophisticated', sub: 'Elegant, elevated' },
  { name: 'Natural', sub: 'Organic, effortless' },
];

function StyleCard({ item, selected, onPress, index }: { item: typeof AESTHETICS[0]; selected: boolean; onPress: () => void; index: number }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const y = useSharedValue(12);

  useEffect(() => {
    opacity.value = withDelay(200 + index * 40, withTiming(1, { duration: 380 }));
    y.value = withDelay(200 + index * 40, withTiming(0, { duration: 380, easing: Easing.out(Easing.quad) }));
  }, []);

  function handlePress() {
    scale.value = withSpring(selected ? 0.96 : 1.06, { damping: 8 }, () => {
      scale.value = withSpring(1, { damping: 12 });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }

  const cardStyle = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ scale: scale.value }, { translateY: y.value }] }));

  return (
    <Animated.View style={[styles.cardWrap, cardStyle]}>
      <Pressable onPress={handlePress} style={[styles.card, selected && styles.cardSelected]}>
        {selected && <View style={styles.checkBadge}><Ionicons name="checkmark" size={11} color="#FFF" /></View>}
        <Text style={[styles.cardName, selected && styles.cardNameSelected]}>{item.name}</Text>
        <Text style={[styles.cardSub, selected && styles.cardSubSelected]}>{item.sub}</Text>
      </Pressable>
    </Animated.View>
  );
}

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
  }

  function handleNext() {
    updateUserProfile({ preferredStyles: selected });
    router.push('/onboarding/lifestyle');
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
          <Text style={styles.question}>Which aesthetics{'\n'}speak to you?</Text>
          <Text style={styles.sub}>Pick as many as you like — your style is uniquely yours.</Text>
        </Animated.View>

        <View style={styles.grid}>
          {AESTHETICS.map((item, i) => (
            <StyleCard
              key={item.name}
              item={item}
              index={i}
              selected={selected.includes(item.name)}
              onPress={() => toggle(item.name)}
            />
          ))}
        </View>

        {selected.length > 0 && (
          <Text style={styles.selectedCount}>{selected.length} selected</Text>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 24) }]}>
        <Pressable
          style={({ pressed }) => [styles.nextBtn, selected.length === 0 && styles.nextBtnDisabled, { opacity: pressed ? 0.85 : 1 }]}
          onPress={handleNext}
        >
          <Text style={styles.nextBtnText}>{selected.length === 0 ? 'Skip' : 'Continue'}</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFF" />
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
  scrollContent: { paddingHorizontal: 28, paddingBottom: 20, gap: 28 },
  header: { gap: 12 },
  stepBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(193,123,88,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  stepText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: C.accent, letterSpacing: 0.5 },
  question: { fontFamily: 'Inter_700Bold', fontSize: 40, color: '#F5F0E8', lineHeight: 48, letterSpacing: -1.5 },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 15, color: 'rgba(245,240,232,0.45)', lineHeight: 22 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cardWrap: { width: '47%' },
  card: {
    backgroundColor: 'rgba(245,240,232,0.05)', borderRadius: 20,
    borderWidth: 1.5, borderColor: 'rgba(245,240,232,0.08)',
    padding: 20, gap: 5, position: 'relative',
    minHeight: 90, justifyContent: 'flex-end',
  },
  cardSelected: { borderColor: C.accent, backgroundColor: 'rgba(193,123,88,0.15)' },
  checkBadge: {
    position: 'absolute', top: 12, right: 12,
    width: 20, height: 20, borderRadius: 10, backgroundColor: C.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  cardName: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: 'rgba(245,240,232,0.7)' },
  cardNameSelected: { color: '#F5F0E8' },
  cardSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(245,240,232,0.3)' },
  cardSubSelected: { color: 'rgba(245,240,232,0.55)' },
  selectedCount: { fontFamily: 'Inter_500Medium', fontSize: 13, color: C.accent, textAlign: 'center' },
  footer: { paddingHorizontal: 28, paddingTop: 12 },
  nextBtn: {
    backgroundColor: C.accent, borderRadius: 16, paddingVertical: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  nextBtnDisabled: { opacity: 0.6 },
  nextBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#FFF' },
});
