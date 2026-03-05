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
const STEP = 5;

const HAIR_COLOURS = [
  { label: 'Platinum', colour: '#F0EDDE' },
  { label: 'Blonde', colour: '#E8C97A' },
  { label: 'Strawberry', colour: '#D4917A' },
  { label: 'Light Brown', colour: '#A67850' },
  { label: 'Brown', colour: '#7A5230' },
  { label: 'Dark Brown', colour: '#3D2318' },
  { label: 'Black', colour: '#1A1208' },
  { label: 'Red / Auburn', colour: '#8B3520' },
  { label: 'Grey / Silver', colour: '#9A9898' },
  { label: 'Coloured', colour: 'transparent' },
];

function HairSwatch({ item, selected, onPress, index }: { item: typeof HAIR_COLOURS[0]; selected: boolean; onPress: () => void; index: number }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const y = useSharedValue(14);

  useEffect(() => {
    opacity.value = withDelay(160 + index * 45, withTiming(1, { duration: 380 }));
    y.value = withDelay(160 + index * 45, withTiming(0, { duration: 380, easing: Easing.out(Easing.quad) }));
  }, []);

  function handlePress() {
    scale.value = withSpring(1.2, { damping: 8 }, () => { scale.value = withSpring(1, { damping: 12 }); });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  }

  const scaleStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const wrapStyle = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ translateY: y.value }] }));

  const isLight = item.colour === '#F0EDDE' || item.colour === '#E8C97A' || item.colour === 'transparent';

  return (
    <Animated.View style={[styles.swatchWrap, wrapStyle]}>
      <Pressable onPress={handlePress} style={styles.swatchPressable}>
        <Animated.View style={scaleStyle}>
          <View style={[
            styles.swatch,
            { backgroundColor: item.colour === 'transparent' ? 'transparent' : item.colour },
            item.colour === 'transparent' && styles.swatchRainbow,
            selected && styles.swatchSelected,
          ]}>
            {selected && <Ionicons name="checkmark" size={16} color={isLight ? '#1A1208' : '#FFF'} />}
          </View>
        </Animated.View>
        <Text style={[styles.swatchLabel, selected && styles.swatchLabelSelected]}>{item.label}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function OnboardingHair() {
  const insets = useSafeAreaInsets();
  const { userProfile, updateUserProfile } = useApp();
  const [selected, setSelected] = React.useState(userProfile.hairColour || '');

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
    updateUserProfile({ hairColour: selected });
    router.push('/onboarding/skin');
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
        <Text style={styles.question}>Your natural{'\n'}hair colour?</Text>
        <Text style={styles.sub}>Choose your natural shade — not your current dye!</Text>
      </Animated.View>

      <View style={styles.grid}>
        {HAIR_COLOURS.map((item, i) => (
          <HairSwatch key={item.label} item={item} index={i} selected={selected === item.label} onPress={() => setSelected(item.label)} />
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
  header: { gap: 12, marginBottom: 32 },
  stepBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(193,123,88,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  stepText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: C.accent, letterSpacing: 0.5 },
  question: { fontFamily: 'Inter_700Bold', fontSize: 40, color: '#F5F0E8', lineHeight: 48, letterSpacing: -1.5 },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 15, color: 'rgba(245,240,232,0.45)', lineHeight: 22 },
  grid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', gap: 0 },
  swatchWrap: { width: '20%', alignItems: 'center', marginBottom: 20 },
  swatchPressable: { alignItems: 'center', gap: 7 },
  swatch: {
    width: 52, height: 52, borderRadius: 26,
    borderWidth: 2, borderColor: 'rgba(245,240,232,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  swatchRainbow: {
    borderWidth: 2, borderColor: C.accent,
    backgroundColor: '#C47A50',
  },
  swatchSelected: { borderColor: '#F5F0E8', borderWidth: 3 },
  swatchLabel: { fontFamily: 'Inter_500Medium', fontSize: 10, color: 'rgba(245,240,232,0.4)', textAlign: 'center' },
  swatchLabelSelected: { color: '#F5F0E8' },
  footer: { paddingTop: 12 },
  nextBtn: {
    backgroundColor: C.accent, borderRadius: 16, paddingVertical: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  nextBtnDisabled: { opacity: 0.35 },
  nextBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#FFF' },
});
