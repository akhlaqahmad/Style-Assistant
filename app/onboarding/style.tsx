import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

const STYLES = [
  { id: 'classic', label: 'Classic', desc: 'Timeless, polished, understated' },
  { id: 'minimal', label: 'Minimalist', desc: 'Clean, simple, intentional' },
  { id: 'bohemian', label: 'Bohemian', desc: 'Relaxed, artistic, free-spirited' },
  { id: 'streetwear', label: 'Streetwear', desc: 'Urban, casual, expressive' },
  { id: 'romantic', label: 'Romantic', desc: 'Feminine, soft, elegant' },
  { id: 'edgy', label: 'Edgy', desc: 'Bold, unconventional, daring' },
  { id: 'sporty', label: 'Sporty', desc: 'Active, functional, athletic' },
  { id: 'eclectic', label: 'Eclectic', desc: 'Mixed, creative, unique' },
];

const LIFESTYLE = [
  'Office / Corporate', 'Remote / Home-based', 'Creative industry', 'Active / Outdoor',
  'Parent / Caregiver', 'Student', 'Social events / Going out', 'Casual everyday',
];

function StyleCard({ item, selected, onPress }: { item: typeof STYLES[0]; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.styleCard, selected && styles.styleCardSelected]}>
      {selected && <View style={styles.styleCheck}><Ionicons name="checkmark" size={12} color="#FFF" /></View>}
      <Text style={[styles.styleLabel, selected && styles.styleLabelSelected]}>{item.label}</Text>
      <Text style={[styles.styleDesc, selected && styles.styleDescSelected]}>{item.desc}</Text>
    </Pressable>
  );
}

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export default function OnboardingStyle() {
  const insets = useSafeAreaInsets();
  const { updateUserProfile, completeOnboarding, formatPrice } = useApp();
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedLifestyle, setSelectedLifestyle] = useState<string[]>([]);
  const [budget, setBudget] = useState('');

  const budgets = [
    `Under ${formatPrice(50)}/month`,
    `${formatPrice(50)}–${formatPrice(150)}/month`,
    `${formatPrice(150)}–${formatPrice(300)}/month`,
    `${formatPrice(300)}+ /month`
  ];

  function toggle(list: string[], setList: (l: string[]) => void, item: string) {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  }

  function handleFinish() {
    updateUserProfile({
      preferredStyles: selectedStyles,
      lifestyle: selectedLifestyle,
      budgetRange: budget,
      onboardingComplete: true,
    });
    completeOnboarding();
    router.replace('/onboarding/complete');
  }

  const canProceed = selectedStyles.length > 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={C.primary} />
        </Pressable>
        <View style={styles.progress}>
          {[1, 2, 3, 4].map(i => (
            <View key={i} style={[styles.dot, styles.dotActive]} />
          ))}
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.step}>Step 4 of 4</Text>
        <Text style={styles.title}>Your style identity</Text>
        <Text style={styles.subtitle}>Pick what resonates. You can always update this later.</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Style aesthetics that speak to you</Text>
          <View style={styles.styleGrid}>
            {STYLES.map(s => (
              <StyleCard
                key={s.id} item={s}
                selected={selectedStyles.includes(s.id)}
                onPress={() => toggle(selectedStyles, setSelectedStyles, s.id)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Your lifestyle</Text>
          <View style={styles.chips}>
            {LIFESTYLE.map(l => (
              <Chip key={l} label={l} selected={selectedLifestyle.includes(l)} onPress={() => toggle(selectedLifestyle, setSelectedLifestyle, l)} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Monthly clothing budget</Text>
          <View style={styles.chips}>
            {budgets.map(b => (
              <Chip key={b} label={b} selected={budget === b} onPress={() => setBudget(b)} />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 16) }]}>
        <Pressable
          style={({ pressed }) => [styles.btn, !canProceed && styles.btnDisabled, { opacity: pressed && canProceed ? 0.85 : 1 }]}
          onPress={handleFinish}
          disabled={!canProceed}
        >
          <Ionicons name="sparkles" size={18} color="#FFF" />
          <Text style={styles.btnText}>Build my style profile</Text>
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
  scroll: { paddingHorizontal: 24, paddingBottom: 24, gap: 28 },
  step: { fontFamily: 'Inter_500Medium', fontSize: 13, color: C.accent, letterSpacing: 1, textTransform: 'uppercase', marginTop: 8 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 30, color: C.primary, lineHeight: 36, marginTop: 8 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 15, color: C.textSecondary, lineHeight: 22 },
  section: { gap: 12 },
  label: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: C.primary },
  styleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  styleCard: {
    width: '47%', borderWidth: 1.5, borderColor: C.border,
    borderRadius: 14, padding: 14, backgroundColor: C.white, gap: 4,
  },
  styleCardSelected: { borderColor: C.accent, backgroundColor: C.accentLight },
  styleCheck: {
    position: 'absolute', top: 10, right: 10,
    width: 20, height: 20, borderRadius: 10, backgroundColor: C.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  styleLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: C.primary },
  styleLabelSelected: { color: C.accent },
  styleDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.muted },
  styleDescSelected: { color: C.accentDark },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1.5, borderColor: C.border, borderRadius: 24, paddingHorizontal: 14, paddingVertical: 9, backgroundColor: C.white },
  chipSelected: { borderColor: C.accent, backgroundColor: C.accentLight },
  chipText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: C.secondary },
  chipTextSelected: { color: C.accent },
  footer: { paddingHorizontal: 24, paddingTop: 12 },
  btn: {
    backgroundColor: C.accent, borderRadius: 14, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  btnDisabled: { opacity: 0.4 },
  btnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#FFF' },
});
