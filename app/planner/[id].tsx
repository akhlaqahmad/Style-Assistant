import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, SectionList, Alert, Platform, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

type TabType = 'outfits' | 'packing';

export default function TripDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { trips, updateTrip, removeTrip } = useApp();
  const trip = trips.find(t => t.id === id);
  const [tab, setTab] = useState<TabType>('outfits');

  if (!trip) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Trip not found</Text>
        <Pressable onPress={() => router.back()}><Text style={styles.backLink}>Go back</Text></Pressable>
      </View>
    );
  }

  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const nights = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const packed = trip.packingList?.filter(i => i.packed).length || 0;
  const total = trip.packingList?.length || 0;
  const packingPercent = total > 0 ? Math.round((packed / total) * 100) : 0;

  function togglePacked(itemId: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const updated = trip.packingList.map(i => i.id === itemId ? { ...i, packed: !i.packed } : i);
    updateTrip(id, { packingList: updated });
  }

  function confirmDelete() {
    Alert.alert('Delete trip', 'Remove this trip and all its outfit plans?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { removeTrip(id); router.back(); } }
    ]);
  }

  const packingByCategory = trip.packingList?.reduce((acc, item) => {
    const cat = item.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, typeof trip.packingList>);

  const packingSections = Object.entries(packingByCategory || {}).map(([title, data]) => ({ title, data }));

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={C.primary} />
        </Pressable>
        <View style={styles.headerMid}>
          <Text style={styles.headerTitle}>{trip.destination}</Text>
          <Text style={styles.headerSub}>
            {start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} — {end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · {nights} nights
          </Text>
        </View>
        <Pressable onPress={confirmDelete} hitSlop={12}>
          <Ionicons name="trash-outline" size={20} color={C.danger} />
        </Pressable>
      </View>

      <Pressable onPress={() => router.push('/(tabs)/discover')} style={styles.expertPrompt}>
        <View style={styles.expertIcon}>
          <Ionicons name="sparkles" size={16} color={C.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.expertTitle}>Need help styling this event?</Text>
          <Text style={styles.expertSub}>Connect with a stylist for expert advice</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={C.muted} />
      </Pressable>

      {tab === 'packing' && total > 0 && (
        <View style={styles.packingProgress}>
          <View style={styles.packingProgressBar}>
            <View style={[styles.packingProgressFill, { width: `${packingPercent}%` as any }]} />
          </View>
          <Text style={styles.packingProgressText}>{packed}/{total} packed · {packingPercent}%</Text>
        </View>
      )}

      <View style={styles.tabRow}>
        <Pressable onPress={() => setTab('outfits')} style={[styles.tabBtn, tab === 'outfits' && styles.tabBtnActive]}>
          <Ionicons name="shirt-outline" size={16} color={tab === 'outfits' ? C.accent : C.muted} />
          <Text style={[styles.tabText, tab === 'outfits' && styles.tabTextActive]}>Outfit Plan</Text>
        </Pressable>
        <Pressable onPress={() => setTab('packing')} style={[styles.tabBtn, tab === 'packing' && styles.tabBtnActive]}>
          <Ionicons name="checkmark-done-outline" size={16} color={tab === 'packing' ? C.accent : C.muted} />
          <Text style={[styles.tabText, tab === 'packing' && styles.tabTextActive]}>Packing ({packed}/{total})</Text>
        </Pressable>
      </View>

      {tab === 'outfits' ? (
        <SectionList
          sections={[{ title: 'outfits', data: trip.outfitDays || [] }]}
          keyExtractor={(item, idx) => idx.toString()}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 100) }]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const date = new Date(item.date);
            return (
              <View style={styles.dayCard}>
                <View style={styles.dayNumber}>
                  <Text style={styles.dayNum}>{index + 1}</Text>
                </View>
                <View style={styles.dayContent}>
                  <View style={styles.dayHeader}>
                    <Text style={styles.dayDate}>{date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}</Text>
                    {item.weather && (
                      <View style={styles.weatherBadge}>
                        <Ionicons name="partly-sunny-outline" size={12} color={C.textSecondary} />
                        <Text style={styles.weatherText}>{item.weather}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.dayOutfit}>{item.outfit}</Text>
                  <Text style={styles.dayActivities}>{item.activities}</Text>
                </View>
              </View>
            );
          }}
          renderSectionHeader={() => null}
        />
      ) : (
        <SectionList
          sections={packingSections}
          keyExtractor={item => item.id}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 100) }]}
          showsVerticalScrollIndicator={false}
          renderSectionHeader={({ section }) => (
            <Text style={styles.packingCategory}>{section.title}</Text>
          )}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.packingItem, item.packed && styles.packingItemPacked]}
              onPress={() => togglePacked(item.id)}
            >
              <View style={[styles.checkbox, item.packed && styles.checkboxChecked]}>
                {item.packed && <Ionicons name="checkmark" size={14} color="#FFF" />}
              </View>
              {item.image ? (
                <Image source={{ uri: item.image }} style={[styles.packingItemImage, item.packed && { opacity: 0.5 }]} />
              ) : (
                <View style={[styles.packingItemImagePlaceholder, item.packed && { opacity: 0.5 }]}>
                  <Ionicons name="shirt-outline" size={20} color={C.muted} />
                </View>
              )}
              <Text style={[styles.packingItemName, item.packed && styles.packingItemNameDone]}>{item.name}</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  notFoundText: { fontFamily: 'Inter_600SemiBold', fontSize: 18, color: C.primary },
  backLink: { fontFamily: 'Inter_500Medium', fontSize: 15, color: C.accent },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, gap: 12 },
  headerMid: { flex: 1, gap: 2 },
  headerTitle: { fontFamily: 'Inter_700Bold', fontSize: 20, color: C.primary },
  headerSub: { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.textSecondary },
  expertPrompt: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 20, marginBottom: 12, padding: 12, backgroundColor: C.white, borderRadius: 12, borderWidth: 1, borderColor: C.border },
  expertIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.accentLight, alignItems: 'center', justifyContent: 'center' },
  expertTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: C.primary },
  expertSub: { fontFamily: 'Inter_400Regular', fontSize: 11, color: C.textSecondary },
  packingProgress: { paddingHorizontal: 20, paddingBottom: 12, gap: 6 },
  packingProgressBar: { height: 6, backgroundColor: C.border, borderRadius: 3, overflow: 'hidden' },
  packingProgressFill: { height: '100%', backgroundColor: C.success, borderRadius: 3 },
  packingProgressText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: C.success },
  tabRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, paddingBottom: 12 },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.white },
  tabBtnActive: { borderColor: C.accent, backgroundColor: C.accentLight },
  tabText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: C.muted },
  tabTextActive: { color: C.accent },
  listContent: { paddingHorizontal: 20, gap: 10 },
  dayCard: { flexDirection: 'row', gap: 14, backgroundColor: C.white, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: C.border, alignItems: 'flex-start' },
  dayNumber: { width: 36, height: 36, borderRadius: 12, backgroundColor: C.accentLight, alignItems: 'center', justifyContent: 'center' },
  dayNum: { fontFamily: 'Inter_700Bold', fontSize: 16, color: C.accent },
  dayContent: { flex: 1, gap: 4 },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dayDate: { fontFamily: 'Inter_500Medium', fontSize: 13, color: C.muted },
  weatherBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.cardAlt, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  weatherText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: C.textSecondary },
  dayOutfit: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: C.primary, lineHeight: 22 },
  dayActivities: { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.textSecondary },
  packingCategory: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8, paddingVertical: 8, paddingTop: 16 },
  packingItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.white, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: C.border },
  packingItemPacked: { opacity: 0.6, backgroundColor: C.cardAlt },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { borderColor: C.success, backgroundColor: C.success },
  packingItemImage: { width: 40, height: 40, borderRadius: 8, backgroundColor: C.cardAlt },
  packingItemImagePlaceholder: { width: 40, height: 40, borderRadius: 8, backgroundColor: C.cardAlt, alignItems: 'center', justifyContent: 'center' },
  packingItemName: { fontFamily: 'Inter_500Medium', fontSize: 15, color: C.primary, flex: 1 },
  packingItemNameDone: { textDecorationLine: 'line-through', color: C.muted },
});
