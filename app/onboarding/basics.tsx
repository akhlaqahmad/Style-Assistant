import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/constants/colors';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useApp } from '@/context/AppContext';

const AGE_RANGES = ['18–24', '25–34', '35–44', '45–54', '55–64', '65+'];
const GENDERS = ['Woman', 'Man', 'Non-binary', 'Prefer not to say'];

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export default function OnboardingBasics() {
  const insets = useSafeAreaInsets();
  const { updateUserProfile } = useApp();
  const [name, setName] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [gender, setGender] = useState('');

  function handleNext() {
    updateUserProfile({ name, ageRange, gender });
    router.push('/onboarding/tone');
  }

  const canProceed = !!ageRange && !!gender;

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={C.primary} />
        </Pressable>
        <View style={styles.progress}>
          {[1, 2, 3, 4].map(i => (
            <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
          ))}
        </View>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAwareScrollViewCompat contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.step}>Step 1 of 4</Text>
        <Text style={styles.title}>Let's get to know you</Text>
        <Text style={styles.subtitle}>Your profile helps us tailor styling guidance just for you.</Text>

        <View style={styles.section}>
          <Text style={styles.label}>First name (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor={C.muted}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Age range</Text>
          <View style={styles.chips}>
            {AGE_RANGES.map(a => (
              <Chip key={a} label={a} selected={ageRange === a} onPress={() => setAgeRange(a)} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>How do you identify?</Text>
          <View style={styles.chips}>
            {GENDERS.map(g => (
              <Chip key={g} label={g} selected={gender === g} onPress={() => setGender(g)} />
            ))}
          </View>
        </View>
      </KeyboardAwareScrollViewCompat>

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
  input: {
    borderWidth: 1.5, borderColor: C.border, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    fontFamily: 'Inter_400Regular', fontSize: 15, color: C.primary,
    backgroundColor: C.white,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1.5, borderColor: C.border, borderRadius: 24,
    paddingHorizontal: 16, paddingVertical: 10, backgroundColor: C.white,
  },
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
