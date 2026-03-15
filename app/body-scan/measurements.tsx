import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { C } from '@/constants/colors';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useApp } from '@/context/AppContext';

const FIELDS = [
  { key: 'heightCm', label: 'Height', unit: 'cm', icon: 'arrow-up-outline', placeholder: '170' },
  { key: 'shoulderWidth', label: 'Shoulder width', unit: 'cm', icon: 'resize-outline', placeholder: '42' },
  { key: 'bust', label: 'Bust', unit: 'cm', icon: 'ellipse-outline', placeholder: '90' },
  { key: 'waist', label: 'Waist', unit: 'cm', icon: 'remove-outline', placeholder: '72' },
  { key: 'hips', label: 'Hips', unit: 'cm', icon: 'ellipse-outline', placeholder: '96' },
  { key: 'inseam', label: 'Inseam', unit: 'cm', icon: 'arrow-down-outline', placeholder: '78' },
] as const;

const SKIN_TONES = ['#F5D6B8', '#E8B898', '#D4A06A', '#C08A5A', '#A0714A', '#7A5A3A', '#5A3E2A', '#3D2B1F'];

function deriveBodyShape(bust: number, waist: number, hips: number): string {
  if (!bust || !waist || !hips) return '';
  const bustHipDiff = Math.abs(bust - hips);
  const waistRatio = waist / Math.max(bust, hips);
  if (waistRatio <= 0.75 && bustHipDiff <= 5) return 'Hourglass';
  if (hips > bust + 5 && waistRatio < 0.85) return 'Pear';
  if (bust > hips + 5 && waistRatio > 0.75) return 'Inverted Triangle';
  if (waistRatio > 0.85 && bustHipDiff <= 5) return 'Rectangle';
  if (waist > bust || waist > hips) return 'Apple';
  return 'Balanced';
}

export default function Measurements() {
  const insets = useSafeAreaInsets();
  const { avatarProfile, updateAvatarProfile } = useApp();
  const [values, setValues] = useState<Record<string, string>>({
    heightCm: avatarProfile.heightCm ? String(avatarProfile.heightCm) : '',
    shoulderWidth: avatarProfile.shoulderWidth ? String(avatarProfile.shoulderWidth) : '',
    bust: avatarProfile.bust ? String(avatarProfile.bust) : '',
    waist: avatarProfile.waist ? String(avatarProfile.waist) : '',
    hips: avatarProfile.hips ? String(avatarProfile.hips) : '',
    inseam: avatarProfile.inseam ? String(avatarProfile.inseam) : '',
  });
  const [skinTone, setSkinTone] = useState(avatarProfile.skinTone || '#D4A06A');

  function handleNext() {
    const nums: Record<string, number> = {};
    for (const f of FIELDS) {
      nums[f.key] = parseFloat(values[f.key]) || 0;
    }
    const shape = deriveBodyShape(nums.bust, nums.waist, nums.hips);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateAvatarProfile({
      heightCm: nums.heightCm,
      shoulderWidth: nums.shoulderWidth,
      bust: nums.bust,
      waist: nums.waist,
      hips: nums.hips,
      inseam: nums.inseam,
      skinTone,
      bodyShape: shape,
    });
    router.push('/body-scan/capture');
  }

  const canProceed = FIELDS.every(f => parseFloat(values[f.key]) > 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Measurements</Text>
        <View style={styles.step}>
          <Text style={styles.stepText}>1/3</Text>
        </View>
      </View>

      <KeyboardAwareScrollViewCompat contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 40) }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Enter your body measurements</Text>
        <Text style={styles.sublabel}>These are used to generate a proportional avatar. All values in centimetres.</Text>

        <View style={styles.fields}>
          {FIELDS.map(f => (
            <View key={f.key} style={styles.fieldRow}>
              <View style={styles.fieldIcon}>
                <Ionicons name={f.icon as any} size={18} color={C.accent} />
              </View>
              <Text style={styles.fieldLabel}>{f.label}</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  value={values[f.key]}
                  onChangeText={t => setValues(prev => ({ ...prev, [f.key]: t }))}
                  placeholder={f.placeholder}
                  placeholderTextColor={C.muted}
                  keyboardType="numeric"
                  maxLength={5}
                />
                <Text style={styles.unit}>{f.unit}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Skin tone</Text>
          <View style={styles.toneRow}>
            {SKIN_TONES.map(c => (
              <Pressable
                key={c}
                onPress={() => setSkinTone(c)}
                style={[styles.toneSwatch, { backgroundColor: c }, skinTone === c && styles.toneSelected]}
              />
            ))}
          </View>
        </View>

        {canProceed && values.bust && values.waist && values.hips && (
          <View style={styles.shapePreview}>
            <Ionicons name="body-outline" size={18} color={C.accent} />
            <Text style={styles.shapeText}>
              Body shape: {deriveBodyShape(parseFloat(values.bust), parseFloat(values.waist), parseFloat(values.hips)) || 'Calculating...'}
            </Text>
          </View>
        )}
      </KeyboardAwareScrollViewCompat>

      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 24) }]}>
        <Pressable
          style={[styles.nextBtn, !canProceed && styles.nextBtnDisabled]}
          onPress={handleNext}
          disabled={!canProceed}
        >
          <Text style={styles.nextBtnText}>Next: Photos</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: C.primary },
  step: { backgroundColor: C.accentLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  stepText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: C.accent },
  scroll: { paddingHorizontal: 20, paddingTop: 24, gap: 24 },
  label: { fontFamily: 'Inter_700Bold', fontSize: 22, color: C.primary },
  sublabel: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textSecondary, lineHeight: 20, marginTop: -12 },
  fields: { gap: 10 },
  fieldRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.white, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.border },
  fieldIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.accentLight, alignItems: 'center', justifyContent: 'center' },
  fieldLabel: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 15, color: C.primary },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  input: { fontFamily: 'Inter_600SemiBold', fontSize: 18, color: C.primary, textAlign: 'right', minWidth: 50, paddingVertical: 4 },
  unit: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.muted },
  section: { gap: 12 },
  sectionLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: C.primary },
  toneRow: { flexDirection: 'row', gap: 10, justifyContent: 'center' },
  toneSwatch: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: 'transparent' },
  toneSelected: { borderColor: C.primary, transform: [{ scale: 1.15 }] },
  shapePreview: { flexDirection: 'row', gap: 10, backgroundColor: C.accentLight, borderRadius: 12, padding: 14, alignItems: 'center' },
  shapeText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: C.accent, flex: 1 },
  footer: { paddingHorizontal: 20, paddingTop: 16 },
  nextBtn: { backgroundColor: C.accent, borderRadius: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  nextBtnDisabled: { opacity: 0.4 },
  nextBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#FFF' },
});
