import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { C } from '@/constants/colors';
import { useApp, TripDay, PackingItem } from '@/context/AppContext';

const TRIP_TYPES = ['Beach', 'City', 'Business', 'Mountain', 'Wedding', 'Other'];
const LUGGAGE = ['Carry-on only', 'Medium suitcase', 'Large suitcase', 'Backpack'];

const OUTFIT_TEMPLATES = [
  'Linen shirt + tailored shorts + sandals',
  'Sundress + espadrilles + sun hat',
  'Smart trousers + silk blouse + heels',
  'Casual jeans + trainers + knitwear',
  'Midi dress + flat sandals + woven bag',
  'Wide-leg trousers + blouse + loafers',
];

const PACKING_ESSENTIALS = [
  { name: 'Passport / ID', category: 'Documents' },
  { name: 'Travel insurance', category: 'Documents' },
  { name: 'Phone charger', category: 'Tech' },
  { name: 'Universal adaptor', category: 'Tech' },
  { name: 'Toiletries bag', category: 'Personal' },
  { name: 'Sunscreen', category: 'Personal' },
  { name: 'Comfortable walking shoes', category: 'Clothing' },
  { name: 'Pyjamas / sleepwear', category: 'Clothing' },
];

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export default function NewTrip() {
  const insets = useSafeAreaInsets();
  const { addTrip } = useApp();
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tripType, setTripType] = useState('');
  const [luggage, setLuggage] = useState('');

  function handleCreate() {
    if (!destination || !startDate || !endDate || !tripType) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const start = new Date(startDate);
    const end = new Date(endDate);
    const nights = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

    const outfitDays: TripDay[] = Array.from({ length: nights }).map((_, i) => {
      const day = new Date(start);
      day.setDate(day.getDate() + i);
      return {
        date: day.toISOString(),
        outfit: OUTFIT_TEMPLATES[i % OUTFIT_TEMPLATES.length],
        activities: 'Explore and discover',
      };
    });

    const packingItems: PackingItem[] = PACKING_ESSENTIALS.map((item, i) => ({
      id: `pack_${i}`,
      name: item.name,
      category: item.category,
      packed: false,
    }));

    outfitDays.forEach((day, i) => {
      const dayOutfitPieces = day.outfit.split(' + ');
      dayOutfitPieces.forEach((piece, j) => {
        packingItems.push({
          id: `outfit_${i}_${j}`,
          name: `Day ${i + 1}: ${piece}`,
          category: 'Clothing',
          packed: false,
        });
      });
    });

    addTrip({ destination, startDate, endDate, tripType, luggageType: luggage, outfitDays, packingList: packingItems });
    router.back();
  }

  const canCreate = !!destination && !!startDate && !!endDate && !!tripType;

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={24} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Plan a trip</Text>
        <Pressable
          onPress={handleCreate}
          disabled={!canCreate}
          style={[styles.createBtn, !canCreate && styles.createBtnDisabled]}
        >
          <Text style={styles.createBtnText}>Create</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 40) }]} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.label}>Destination <Text style={{ color: C.accent }}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Paris, Santorini..."
            placeholderTextColor={C.muted}
            value={destination}
            onChangeText={setDestination}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.label}>From <Text style={{ color: C.accent }}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={C.muted}
              value={startDate}
              onChangeText={setStartDate}
              keyboardType="numbers-and-punctuation"
            />
          </View>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.label}>To <Text style={{ color: C.accent }}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={C.muted}
              value={endDate}
              onChangeText={setEndDate}
              keyboardType="numbers-and-punctuation"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Trip type <Text style={{ color: C.accent }}>*</Text></Text>
          <View style={styles.chips}>
            {TRIP_TYPES.map(t => (
              <Chip key={t} label={t} selected={tripType === t} onPress={() => setTripType(t)} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Luggage allowance</Text>
          <View style={styles.chips}>
            {LUGGAGE.map(l => (
              <Chip key={l} label={l} selected={luggage === l} onPress={() => setLuggage(l)} />
            ))}
          </View>
        </View>

        <View style={styles.previewCard}>
          <Ionicons name="information-circle-outline" size={18} color={C.accent} />
          <Text style={styles.previewText}>We'll create a day-by-day outfit plan and packing checklist based on your trip details.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: C.primary },
  createBtn: { backgroundColor: C.accent, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 },
  createBtnDisabled: { opacity: 0.4 },
  createBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#FFF' },
  scroll: { paddingHorizontal: 20, paddingTop: 24, gap: 24 },
  row: { flexDirection: 'row', gap: 12 },
  section: { gap: 12 },
  label: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: C.primary },
  input: { borderWidth: 1.5, borderColor: C.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontFamily: 'Inter_400Regular', fontSize: 15, color: C.primary, backgroundColor: C.white },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1.5, borderColor: C.border, borderRadius: 24, paddingHorizontal: 14, paddingVertical: 9, backgroundColor: C.white },
  chipSelected: { borderColor: C.accent, backgroundColor: C.accentLight },
  chipText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: C.secondary },
  chipTextSelected: { color: C.accent },
  previewCard: { flexDirection: 'row', gap: 10, backgroundColor: C.accentLight, borderRadius: 12, padding: 14, alignItems: 'flex-start' },
  previewText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.accentDark, flex: 1, lineHeight: 20 },
});
