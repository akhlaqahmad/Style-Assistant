import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import ThreeAvatar from '@/components/ThreeAvatar';

const FIELDS = [
  { key: 'heightCm', label: 'Height', unit: 'cm' },
  { key: 'shoulderWidth', label: 'Shoulders', unit: 'cm' },
  { key: 'bust', label: 'Bust', unit: 'cm' },
  { key: 'waist', label: 'Waist', unit: 'cm' },
  { key: 'hips', label: 'Hips', unit: 'cm' },
  { key: 'inseam', label: 'Inseam', unit: 'cm' },
] as const;

// Mock extracted data (simulating 3D scan result)
const MOCK_EXTRACTED = {
  heightCm: 172,
  shoulderWidth: 42,
  bust: 92,
  waist: 74,
  hips: 98,
  inseam: 79,
};

export default function ReviewScreen() {
  const insets = useSafeAreaInsets();
  const { updateAvatarProfile } = useApp();
  
  // Initialize with mock extracted data
  const [values, setValues] = useState(MOCK_EXTRACTED);
  const [skinTone, setSkinTone] = useState('#D4A06A');

  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateAvatarProfile({
      ...values,
      skinTone,
      bodyShape: 'Hourglass', // Simplified for now
    });
    router.push('/body-scan/result-3d');
  };

  const handleChange = (key: keyof typeof MOCK_EXTRACTED, text: string) => {
    const val = parseFloat(text) || 0;
    setValues(prev => ({ ...prev, [key]: val }));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Review Measurements</Text>
        <Pressable onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        {/* 3D Preview */}
        <View style={styles.previewContainer}>
          <ThreeAvatar measurements={values} skinTone={skinTone} />
          <View style={styles.previewBadge}>
            <Ionicons name="scan-circle" size={16} color="#FFF" />
            <Text style={styles.previewText}>Live Preview</Text>
          </View>
        </View>

        {/* Editor */}
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.banner}>
              <Ionicons name="checkmark-circle" size={20} color={C.accent} />
              <Text style={styles.bannerText}>Measurements extracted from scan</Text>
            </View>

            <Text style={styles.sectionTitle}>Adjust if needed:</Text>

            <View style={styles.grid}>
              {FIELDS.map((f) => (
                <View key={f.key} style={styles.fieldItem}>
                  <Text style={styles.label}>{f.label}</Text>
                  <View style={styles.inputWrap}>
                    <TextInput
                      style={styles.input}
                      value={String(values[f.key])}
                      onChangeText={(t) => handleChange(f.key as any, t)}
                      keyboardType="numeric"
                      maxLength={4}
                    />
                    <Text style={styles.unit}>{f.unit}</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.white },
  headerTitle: { fontSize: 17, fontWeight: '600', color: C.primary },
  saveText: { fontSize: 16, fontWeight: '600', color: C.accent },
  
  content: { flex: 1 },
  previewContainer: { height: 300, backgroundColor: '#F0F0F0', borderBottomWidth: 1, borderBottomColor: C.border, position: 'relative' },
  previewBadge: { position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(0,0,0,0.6)', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 },
  previewText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  
  scroll: { padding: 20 },
  banner: { flexDirection: 'row', gap: 10, backgroundColor: C.accentLight, padding: 12, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  bannerText: { color: C.accent, fontSize: 14, fontWeight: '500' },
  
  sectionTitle: { fontSize: 16, fontWeight: '600', color: C.primary, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  fieldItem: { width: '48%', backgroundColor: C.white, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: C.border },
  label: { fontSize: 13, color: C.textSecondary, marginBottom: 4 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  input: { flex: 1, fontSize: 18, fontWeight: '600', color: C.primary, padding: 0 },
  unit: { fontSize: 14, color: C.muted },
});
