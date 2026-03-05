import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

const BODY_FEATURES = [
  'Shoulders', 'Arms', 'Chest / Bust', 'Waist', 'Hips', 'Legs', 'Height', 'Back', 'Curves',
];

const SILHOUETTE_TIPS: Record<string, string[]> = {
  Shoulders: ['Structured jackets that define the frame', 'Wide-neck or off-shoulder styles'],
  Arms: ['Three-quarter sleeves for balanced length', 'Soft, draped fabrics over the arm'],
  'Chest / Bust': ['V-necks to elongate the neckline', 'Wrap styles that define the waist'],
  Waist: ['Belts to create definition', 'Wrap dresses and A-line skirts'],
  Hips: ['Flared and A-line skirts to balance', 'Straight-leg or wide-leg trousers'],
  Legs: ['Vertical stripe trousers to elongate', 'Midi lengths that show the ankle'],
  Height: ['Monochrome dressing to elongate', 'Vertical lines and high-waisted styles'],
  Back: ['Open-back styles to celebrate this feature', 'Halter and crossback silhouettes'],
  Curves: ['Jersey and fluid fabrics that move with you', 'Wrap and fit-and-flare silhouettes'],
};

function FeatureChip({ label, selected, mode, onPress }: { label: string; selected: boolean; mode: 'love' | 'downplay'; onPress: () => void }) {
  const colors = mode === 'love'
    ? { active: '#EAF2E7', border: C.success, text: C.success }
    : { active: C.accentLight, border: C.accent, text: C.accent };
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && { borderColor: colors.border, backgroundColor: colors.active }]}
    >
      <Text style={[styles.chipText, selected && { color: colors.text }]}>{label}</Text>
    </Pressable>
  );
}

export default function OnboardingBody() {
  const insets = useSafeAreaInsets();
  const { updateUserProfile, updateBodyProfile } = useApp();
  const [loves, setLoves] = useState<string[]>([]);
  const [downplay, setDownplay] = useState<string[]>([]);

  function toggle(list: string[], setList: (l: string[]) => void, item: string) {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  }

  function handleNext() {
    const silhouetteGuidance = loves.flatMap(f => SILHOUETTE_TIPS[f] || []);
    const layeringTips = ['Layer a tailored blazer over basics for instant polish', 'Use cardigans and kimonos to add depth without bulk'];
    const fabricSuggestions = ['Opt for structured fabrics to hold shape', 'Fluid fabrics like silk and jersey drape beautifully over curves'];
    updateUserProfile({ bodyLoves: loves, bodyDownplay: downplay });
    updateBodyProfile({ silhouetteGuidance, layeringTips, fabricSuggestions });
    router.push('/onboarding/style');
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={C.primary} />
        </Pressable>
        <View style={styles.progress}>
          {[1, 2, 3, 4].map(i => (
            <View key={i} style={[styles.dot, i <= 3 && styles.dotActive]} />
          ))}
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.step}>Step 3 of 4</Text>
        <Text style={styles.title}>Celebrate your body</Text>
        <Text style={styles.subtitle}>Tell us what you love about yourself, and what you prefer to dress around. All bodies are beautiful — this helps us tailor your suggestions.</Text>

        <View style={styles.infoCard}>
          <Ionicons name="heart" size={16} color={C.success} />
          <Text style={styles.infoText}>We never use body type labels. Your data is private and used only to personalise your experience.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Features I love to show off</Text>
          <View style={styles.chips}>
            {BODY_FEATURES.map(f => (
              <FeatureChip
                key={f} label={f} mode="love"
                selected={loves.includes(f)}
                onPress={() => toggle(loves, setLoves, f)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Features I prefer to work around</Text>
          <View style={styles.chips}>
            {BODY_FEATURES.map(f => (
              <FeatureChip
                key={f} label={f} mode="downplay"
                selected={downplay.includes(f)}
                onPress={() => toggle(downplay, setDownplay, f)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 16) }]}>
        <Pressable
          style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.85 : 1 }]}
          onPress={handleNext}
        >
          <Text style={styles.btnText}>Continue</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFF" />
        </Pressable>
        <Pressable onPress={handleNext} style={styles.skip}>
          <Text style={styles.skipText}>Skip this step</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  progress: { flexDirection: 'row', gap: 6 },
  dot: { width: 24, height: 4, borderRadius: 2, backgroundColor: C.border },
  dotActive: { backgroundColor: C.accent, width: 40 },
  scroll: { paddingHorizontal: 24, paddingBottom: 24, gap: 24 },
  step: { fontFamily: 'Inter_500Medium', fontSize: 13, color: C.accent, letterSpacing: 1, textTransform: 'uppercase', marginTop: 8 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 30, color: C.primary, lineHeight: 36, marginTop: 8 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 15, color: C.textSecondary, lineHeight: 22 },
  infoCard: { flexDirection: 'row', gap: 10, backgroundColor: C.successLight, borderRadius: 12, padding: 14, alignItems: 'flex-start' },
  infoText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.success, flex: 1, lineHeight: 19 },
  section: { gap: 12 },
  label: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: C.primary },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1.5, borderColor: C.border, borderRadius: 24, paddingHorizontal: 14, paddingVertical: 9, backgroundColor: C.white },
  chipText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: C.secondary },
  footer: { paddingHorizontal: 24, paddingTop: 12, gap: 10 },
  btn: {
    backgroundColor: C.accent, borderRadius: 14, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  btnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#FFF' },
  skip: { alignItems: 'center', paddingVertical: 6 },
  skipText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.muted },
});
