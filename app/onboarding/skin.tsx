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
const STEP = 6;

const OPTIONS = [
  { label: 'I burn and stay pale', icon: 'sunny-outline', hint: 'Very fair, cool undertones', tone: 'cool' },
  { label: 'I burn then tan lightly', icon: 'partly-sunny-outline', hint: 'Fair to medium, often cool', tone: 'cool' },
  { label: 'I tan easily and evenly', icon: 'sunny', hint: 'Medium to olive, can be neutral', tone: 'neutral' },
  { label: 'I rarely burn, tan deeply', icon: 'flame-outline', hint: 'Warm golden undertones', tone: 'warm' },
  { label: 'My skin is naturally deep', icon: 'moon', hint: 'Rich, warm or cool depth', tone: 'warm' },
];

export default function OnboardingSkin() {
  const insets = useSafeAreaInsets();
  const { userProfile, updateUserProfile, updateToneProfile } = useApp();
  const [selected, setSelected] = React.useState(userProfile.tanningBehaviour || '');

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
    updateUserProfile({ tanningBehaviour: selected });

    const { eyeColour, hairColour } = userProfile;
    const warmEyes = ['Brown', 'Dark Brown', 'Hazel', 'Amber'];
    const warmHair = ['Strawberry', 'Brown', 'Light Brown', 'Dark Brown', 'Red / Auburn'];
    const selectedOption = OPTIONS.find(o => o.label === selected);
    const skinTone = selectedOption?.tone || 'neutral';

    let warm = 0, cool = 0;
    if (warmEyes.includes(eyeColour)) warm++;
    if (['Blue', 'Green', 'Grey'].includes(eyeColour)) cool++;
    if (warmHair.includes(hairColour)) warm++;
    if (['Platinum', 'Black', 'Grey / Silver'].includes(hairColour)) cool++;
    if (skinTone === 'warm') warm += 2;
    if (skinTone === 'cool') cool += 2;

    const toneType = warm > cool ? 'warm' : cool > warm ? 'cool' : 'neutral';
    const palettes = {
      warm: ['#C17B58', '#D4A96A', '#8B5E3C', '#E8D5B0', '#7A5230', '#C9956C', '#F0E0CC'],
      cool: ['#7B9BBF', '#6B8CAE', '#4A7299', '#B0C8E8', '#3D6480', '#8FAECE', '#D5E5F5'],
      neutral: ['#8B8070', '#A09080', '#C4B5A5', '#E0D5C8', '#6B6055', '#B0A595', '#D5CCBF'],
    };
    const guidance = {
      warm: 'Your colouring has warm golden undertones. Terracotta, camel, olive, and rich burnt orange will make you glow.',
      cool: 'Your colouring has cool blue undertones. Navy, burgundy, emerald, and pure white will make your features stand out.',
      neutral: 'You have beautifully balanced neutral undertones — both warm and cool shades work for you. Focus on mid-tones.',
    };

    updateToneProfile({ toneType, palette: palettes[toneType as keyof typeof palettes], guidance: guidance[toneType as keyof typeof guidance] });
    router.push('/onboarding/loves');
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
        <ThemedText variant="headingXL" style={styles.question}>How does your{'\n'}skin react to sun?</ThemedText>
        <ThemedText variant="bodyM" color="rgba(245,240,232,0.45)" style={styles.sub}>This helps us determine your underlying skin undertone.</ThemedText>
      </Animated.View>

      <View style={styles.list}>
        {OPTIONS.map((item, i) => (
          <SelectionCard 
            key={item.label} 
            label={item.label} 
            hint={item.hint}
            icon={item.icon as any}
            selected={selected === item.label} 
            onPress={() => handleSelect(item.label)} 
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
  header: { gap: 12, marginBottom: 28 },
  stepBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(193,123,88,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  stepText: { color: C.accent, letterSpacing: 0.5 },
  question: { color: C.text, lineHeight: 44, letterSpacing: -1.2 },
  sub: { lineHeight: 22 },
  list: { flex: 1, gap: 10 },
  card: { padding: 16 },
  footer: { paddingTop: 16 },
});
