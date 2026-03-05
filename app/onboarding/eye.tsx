import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, ScrollView } from 'react-native';
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
const STEP = 4;

const EYE_COLOURS = [
  { label: 'Blue', colour: '#5B8AC5' },
  { label: 'Green', colour: '#4A8B5C' },
  { label: 'Hazel', colour: '#8B6B3D' },
  { label: 'Brown', colour: '#7A4F2E' },
  { label: 'Dark Brown', colour: '#3D2010' },
  { label: 'Grey', colour: '#7A8A94' },
  { label: 'Amber', colour: '#C18B2E' },
];

function EyeOption({ item, selected, onPress, index }: { item: typeof EYE_COLOURS[0]; selected: boolean; onPress: () => void; index: number }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const y = useSharedValue(16);

  useEffect(() => {
    opacity.value = withDelay(180 + index * 55, withTiming(1, { duration: 400 }));
    y.value = withDelay(180 + index * 55, withTiming(0, { duration: 400, easing: Easing.out(Easing.quad) }));
  }, []);

  function handlePress() {
    scale.value = withSpring(1.18, { damping: 8 }, () => {
      scale.value = withSpring(1, { damping: 12 });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  }

  const circleStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const wrapStyle = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ translateY: y.value }] }));

  return (
    <Animated.View style={[styles.eyeOption, wrapStyle]}>
      <Pressable onPress={handlePress} style={styles.eyePressable}>
        <Animated.View style={circleStyle}>
          <View style={[styles.eyeCircle, { backgroundColor: item.colour }, selected && styles.eyeCircleSelected]}>
            {selected && <Ionicons name="checkmark" size={20} color="#FFF" />}
          </View>
        </Animated.View>
        <Text style={[styles.eyeLabel, selected && styles.eyeLabelSelected]}>{item.label}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function OnboardingEye() {
  const insets = useSafeAreaInsets();
  const { userProfile, updateUserProfile } = useApp();
  const [selected, setSelected] = React.useState(userProfile.eyeColour || '');

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
    updateUserProfile({ eyeColour: selected });
    router.push('/onboarding/hair');
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
        <Text style={styles.question}>What colour{'\n'}are your eyes?</Text>
        <Text style={styles.sub}>Eye colour is one of the key signals for your personal tone palette.</Text>
      </Animated.View>

      <View style={styles.grid}>
        {EYE_COLOURS.map((item, i) => (
          <EyeOption key={item.label} item={item} index={i} selected={selected === item.label} onPress={() => setSelected(item.label)} />
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
  grid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 0, alignContent: 'center' },
  eyeOption: { width: '25%', alignItems: 'center', marginBottom: 28 },
  eyePressable: { alignItems: 'center', gap: 8 },
  eyeCircle: {
    width: 64, height: 64, borderRadius: 32,
    borderWidth: 3, borderColor: 'transparent',
    alignItems: 'center', justifyContent: 'center',
  },
  eyeCircleSelected: { borderColor: '#F5F0E8', borderWidth: 3 },
  eyeLabel: { fontFamily: 'Inter_500Medium', fontSize: 12, color: 'rgba(245,240,232,0.45)', textAlign: 'center' },
  eyeLabelSelected: { color: '#F5F0E8' },
  footer: { paddingTop: 12 },
  nextBtn: {
    backgroundColor: C.accent, borderRadius: 16, paddingVertical: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  nextBtnDisabled: { opacity: 0.35 },
  nextBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#FFF' },
});
