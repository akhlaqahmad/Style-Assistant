import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
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
const STEP = 6;

const OPTIONS = [
  { label: 'I burn and stay pale', icon: 'sunny-outline', hint: 'Very fair, cool undertones', tone: 'cool' },
  { label: 'I burn then tan lightly', icon: 'partly-sunny-outline', hint: 'Fair to medium, often cool', tone: 'cool' },
  { label: 'I tan easily and evenly', icon: 'sunny', hint: 'Medium to olive, can be neutral', tone: 'neutral' },
  { label: 'I rarely burn, tan deeply', icon: 'flame-outline', hint: 'Warm golden undertones', tone: 'warm' },
  { label: 'My skin is naturally deep', icon: 'moon', hint: 'Rich, warm or cool depth', tone: 'warm' },
];

function SkinOption({ item, selected, onPress, index }: { item: typeof OPTIONS[0]; selected: boolean; onPress: () => void; index: number }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const x = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(180 + index * 70, withTiming(1, { duration: 420 }));
    x.value = withDelay(180 + index * 70, withTiming(0, { duration: 420, easing: Easing.out(Easing.quad) }));
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
          <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
            <Ionicons name={item.icon as any} size={20} color={selected ? C.accent : 'rgba(245,240,232,0.4)'} />
          </View>
          <View style={styles.cardText}>
            <Text style={[styles.cardLabel, selected && styles.cardLabelSelected]}>{item.label}</Text>
            <Text style={[styles.cardHint, selected && styles.cardHintSelected]}>{item.hint}</Text>
          </View>
          {selected
            ? <View style={styles.check}><Ionicons name="checkmark" size={14} color="#FFF" /></View>
            : <View style={styles.emptyCheck} />}
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

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

    updateToneProfile({ toneType, palette: palettes[toneType], guidance: guidance[toneType] });
    router.push('/onboarding/loves');
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
        <Text style={styles.question}>How does your{'\n'}skin react to sun?</Text>
        <Text style={styles.sub}>This helps determine your underlying skin undertone.</Text>
      </Animated.View>

      <View style={styles.list}>
        {OPTIONS.map((item, i) => (
          <SkinOption key={item.label} item={item} index={i} selected={selected === item.label} onPress={() => setSelected(item.label)} />
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
  header: { gap: 12, marginBottom: 28 },
  stepBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(193,123,88,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  stepText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: C.accent, letterSpacing: 0.5 },
  question: { fontFamily: 'Inter_700Bold', fontSize: 36, color: '#F5F0E8', lineHeight: 44, letterSpacing: -1.2 },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 15, color: 'rgba(245,240,232,0.45)', lineHeight: 22 },
  list: { flex: 1, gap: 10 },
  card: {
    backgroundColor: 'rgba(245,240,232,0.05)', borderRadius: 18,
    borderWidth: 1.5, borderColor: 'rgba(245,240,232,0.08)',
    padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  cardSelected: { borderColor: C.accent, backgroundColor: 'rgba(193,123,88,0.12)' },
  iconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(245,240,232,0.06)', alignItems: 'center', justifyContent: 'center' },
  iconWrapSelected: { backgroundColor: 'rgba(193,123,88,0.2)' },
  cardText: { flex: 1, gap: 2 },
  cardLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: 'rgba(245,240,232,0.65)' },
  cardLabelSelected: { color: '#F5F0E8' },
  cardHint: { fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(245,240,232,0.3)' },
  cardHintSelected: { color: 'rgba(245,240,232,0.55)' },
  check: { width: 22, height: 22, borderRadius: 11, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' },
  emptyCheck: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: 'rgba(245,240,232,0.2)' },
  footer: { paddingTop: 16 },
  nextBtn: {
    backgroundColor: C.accent, borderRadius: 16, paddingVertical: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  nextBtnDisabled: { opacity: 0.35 },
  nextBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#FFF' },
});
