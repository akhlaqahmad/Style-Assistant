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
import { ColorSwatch } from '@/components/ui/ColorSwatch';

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

      <Animated.View style={[styles.header, headerStyle]}>
        <View style={styles.stepBadge}><ThemedText variant="caption" style={styles.stepText}>{STEP} of {TOTAL_STEPS}</ThemedText></View>
        <ThemedText variant="headingXL" style={styles.question}>Your natural{'\n'}hair colour?</ThemedText>
        <ThemedText variant="bodyM" color="rgba(245,240,232,0.45)" style={styles.sub}>Choose your natural shade — not your current dye!</ThemedText>
      </Animated.View>

      <View style={styles.grid}>
        {HAIR_COLOURS.map((item, i) => (
          <View key={item.label} style={styles.swatchWrap}>
            <ColorSwatch 
              color={item.colour}
              label={item.label} 
              selected={selected === item.label} 
              onPress={() => handleSelect(item.label)}
              size={52}
            />
          </View>
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
  header: { gap: 12, marginBottom: 32 },
  stepBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(193,123,88,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  stepText: { color: C.accent, letterSpacing: 0.5 },
  question: { color: C.text, lineHeight: 48, letterSpacing: -1.5 },
  sub: { lineHeight: 22 },
  grid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', gap: 0 },
  swatchWrap: { width: '20%', alignItems: 'center', marginBottom: 20 },
  footer: { paddingTop: 12 },
});
