import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/constants/colors';
import { KeyboardAwareScrollViewCompat } from '../KeyboardAwareScrollViewCompat';

interface DetailsStepProps {
  initialData: any;
  onSave: (data: any) => void;
  onBack: () => void;
}

export default function DetailsStep({ initialData, onSave, onBack }: DetailsStepProps) {
  const [data, setData] = useState(initialData || {});
  
  const updateField = (field: string, value: any) => {
    setData((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateMeasurement = (key: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      measurements: { ...prev.measurements, [key]: value }
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Review Details</Text>
        <Pressable onPress={() => onSave(data)} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>

      <KeyboardAwareScrollViewCompat contentContainerStyle={styles.scroll}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Measurements</Text>
          <View style={styles.grid}>
            {Object.entries(data.measurements || {}).map(([key, val]: [string, any]) => (
              <View key={key} style={styles.gridItem}>
                <Text style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                <TextInput
                  style={styles.input}
                  value={val}
                  onChangeText={(text) => updateMeasurement(key, text)}
                  placeholderTextColor={C.muted}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Color Analysis</Text>
          <View style={styles.colorRow}>
            <View style={[styles.colorSwatch, { backgroundColor: data.color?.hex || C.cardAlt }]} />
            <Text style={styles.colorName}>{data.color?.name || 'Unknown'}</Text>
          </View>
          <Text style={styles.subLabel}>Palette Suggestions</Text>
          <View style={styles.paletteRow}>
            {(data.color?.palette || []).map((c: string, i: number) => (
              <View key={i} style={[styles.paletteSwatch, { backgroundColor: c }]} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Care Instructions</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            value={data.care}
            onChangeText={(text) => updateField('care', text)}
            placeholderTextColor={C.muted}
          />
          <View style={styles.careTags}>
            {['Machine Wash', 'Dry Clean', 'Iron Low', 'Bleach'].map(tag => (
               <Pressable key={tag} style={styles.careTag}>
                 <Text style={styles.careTagText}>{tag}</Text>
               </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
           <Text style={styles.sectionTitle}>Privacy</Text>
           <View style={styles.row}>
             <Text style={styles.label}>Allow Stylist Access</Text>
             <Switch
               value={!data.hidden}
               onValueChange={(v) => updateField('hidden', !v)}
               trackColor={{ false: C.cardAlt, true: C.accent }}
               thumbColor={C.primary}
             />
           </View>
        </View>
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: C.border },
  headerTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold', color: C.primary },
  backButton: { padding: 8 },
  saveButton: { backgroundColor: C.accent, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  saveButtonText: { color: C.background, fontFamily: 'Inter_600SemiBold' },
  scroll: { padding: 20, gap: 24, paddingBottom: 100 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: C.primary, marginBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: { width: '48%', gap: 8 },
  label: { fontSize: 13, fontFamily: 'Inter_500Medium', color: C.textSecondary, marginBottom: 4 },
  subLabel: { fontSize: 13, fontFamily: 'Inter_400Regular', color: C.muted, marginTop: 8 },
  input: { borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 14, fontSize: 15, fontFamily: 'Inter_400Regular', color: C.text, backgroundColor: C.card },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  colorRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.card, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: C.border },
  colorSwatch: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: C.border },
  colorName: { fontSize: 16, fontFamily: 'Inter_500Medium', color: C.primary },
  paletteRow: { flexDirection: 'row', gap: 8 },
  paletteSwatch: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: C.border },
  careTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  careTag: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  careTagText: { fontSize: 13, color: C.textSecondary, fontFamily: 'Inter_500Medium' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: C.card, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: C.border },
});
