import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

const EYE_COLOURS = ['Blue', 'Green', 'Hazel', 'Brown', 'Dark Brown', 'Grey', 'Amber'];
const HAIR_COLOURS = ['Platinum / White', 'Blonde', 'Strawberry Blonde', 'Light Brown', 'Medium Brown', 'Dark Brown', 'Black', 'Red / Auburn', 'Grey / Silver', 'Dyed'];
const TANNING = ["I burn and stay pale", "I burn then tan lightly", "I tan easily", "I rarely burn and tan deeply", "My skin is naturally deep"];

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export default function OnboardingTone() {
  const insets = useSafeAreaInsets();
  const { updateUserProfile, updateToneProfile } = useApp();
  const [eyeColour, setEyeColour] = useState('');
  const [hairColour, setHairColour] = useState('');
  const [tanning, setTanning] = useState('');

  function deriveTone(): 'warm' | 'cool' | 'neutral' {
    const warmEyes = ['Brown', 'Dark Brown', 'Hazel', 'Amber'];
    const warmHair = ['Strawberry Blonde', 'Blonde', 'Light Brown', 'Medium Brown', 'Dark Brown', 'Red / Auburn'];
    const warmTan = ["I tan easily", "I rarely burn and tan deeply", "My skin is naturally deep"];
    const coolEyes = ['Blue', 'Green', 'Grey'];
    const coolHair = ['Platinum / White', 'Black', 'Grey / Silver'];
    const coolTan = ["I burn and stay pale", "I burn then tan lightly"];

    let warm = 0;
    let cool = 0;
    if (warmEyes.includes(eyeColour)) warm++;
    if (coolEyes.includes(eyeColour)) cool++;
    if (warmHair.includes(hairColour)) warm++;
    if (coolHair.includes(hairColour)) cool++;
    if (warmTan.includes(tanning)) warm++;
    if (coolTan.includes(tanning)) cool++;

    if (warm > cool) return 'warm';
    if (cool > warm) return 'cool';
    return 'neutral';
  }

  function handleNext() {
    const toneType = deriveTone();
    const palettes = {
      warm: ['#C17B58', '#D4A96A', '#8B5E3C', '#E8D5B0', '#7A5230', '#C9956C', '#F0E0CC'],
      cool: ['#7B9BBF', '#6B8CAE', '#4A7299', '#B0C8E8', '#3D6480', '#8FAECE', '#D5E5F5'],
      neutral: ['#8B8070', '#A09080', '#C4B5A5', '#E0D5C8', '#6B6055', '#B0A595', '#D5CCBF'],
    };
    const guidance = {
      warm: 'Your colouring has warm golden and earthy undertones. You\'ll shine in terracotta, camel, olive, warm whites, and rich jewel tones like burnt orange and mustard.',
      cool: 'Your colouring has cool, blueish undertones. You\'ll look stunning in navy, burgundy, pure white, sage green, cool greys, and jewel tones like sapphire and emerald.',
      neutral: 'You have a balanced, neutral undertone — the most versatile of all! Both warm and cool shades work for you. Focus on medium-intensity tones and avoid extremes.',
    };
    updateUserProfile({ eyeColour, hairColour, tanningBehaviour: tanning });
    updateToneProfile({ toneType, palette: palettes[toneType], guidance: guidance[toneType] });
    router.push('/onboarding/body');
  }

  const canProceed = !!eyeColour && !!hairColour && !!tanning;

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={C.primary} />
        </Pressable>
        <View style={styles.progress}>
          {[1, 2, 3, 4].map(i => (
            <View key={i} style={[styles.dot, i <= 2 && styles.dotActive]} />
          ))}
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.step}>Step 2 of 4</Text>
        <Text style={styles.title}>Your natural tones</Text>
        <Text style={styles.subtitle}>We use your colouring to find shades that make you glow.</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Eye colour</Text>
          <View style={styles.chips}>
            {EYE_COLOURS.map(c => <Chip key={c} label={c} selected={eyeColour === c} onPress={() => setEyeColour(c)} />)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Natural hair colour</Text>
          <View style={styles.chips}>
            {HAIR_COLOURS.map(c => <Chip key={c} label={c} selected={hairColour === c} onPress={() => setHairColour(c)} />)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>How does your skin respond to sun?</Text>
          <View style={styles.radioList}>
            {TANNING.map(t => (
              <Pressable key={t} onPress={() => setTanning(t)} style={[styles.radio, tanning === t && styles.radioSelected]}>
                <View style={[styles.radioCircle, tanning === t && styles.radioCircleFilled]} />
                <Text style={[styles.radioText, tanning === t && styles.radioTextSelected]}>{t}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 16) }]}>
        <Pressable
          style={({ pressed }) => [styles.btn, !canProceed && styles.btnDisabled, { opacity: pressed && canProceed ? 0.85 : 1 }]}
          onPress={handleNext}
          disabled={!canProceed}
        >
          <Text style={styles.btnText}>Continue</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
  },
  progress: { flexDirection: 'row', gap: 6 },
  dot: { width: 24, height: 4, borderRadius: 2, backgroundColor: C.border },
  dotActive: { backgroundColor: C.accent, width: 40 },
  scroll: { paddingHorizontal: 24, paddingBottom: 24, gap: 28 },
  step: { fontFamily: 'Inter_500Medium', fontSize: 13, color: C.accent, letterSpacing: 1, textTransform: 'uppercase', marginTop: 8 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 30, color: C.primary, lineHeight: 36, marginTop: 8 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 15, color: C.textSecondary, lineHeight: 22 },
  section: { gap: 12 },
  label: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: C.primary },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1.5, borderColor: C.border, borderRadius: 24, paddingHorizontal: 14, paddingVertical: 9, backgroundColor: C.white },
  chipSelected: { borderColor: C.accent, backgroundColor: C.accentLight },
  chipText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: C.secondary },
  chipTextSelected: { color: C.accent },
  radioList: { gap: 8 },
  radio: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1.5, borderColor: C.border, borderRadius: 12,
    padding: 14, backgroundColor: C.white,
  },
  radioSelected: { borderColor: C.accent, backgroundColor: C.accentLight },
  radioCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: C.muted },
  radioCircleFilled: { borderColor: C.accent, backgroundColor: C.accent },
  radioText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.secondary, flex: 1 },
  radioTextSelected: { color: C.accent, fontFamily: 'Inter_500Medium' },
  footer: { paddingHorizontal: 24, paddingTop: 12 },
  btn: {
    backgroundColor: C.accent, borderRadius: 14, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  btnDisabled: { opacity: 0.4 },
  btnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#FFF' },
});
