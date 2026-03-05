import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, FlatList, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';
import { C } from '@/constants/colors';
import { useApp, WardrobeItem } from '@/context/AppContext';
import Avatar from '@/components/Avatar';

const ZONES = ['Tops', 'Bottoms', 'Shoes'] as const;
type Zone = typeof ZONES[number];

function ZoneItemCard({ item, selected, onPress }: { item: WardrobeItem; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.zoneItem}>
      <View style={[styles.zoneItemSwatch, { backgroundColor: item.colour || C.cardAlt }, selected && { borderColor: C.accent }]}>
        <Ionicons name="shirt-outline" size={16} color="rgba(255,255,255,0.3)" />
        {selected && (
          <View style={styles.checkOverlay}>
            <Ionicons name="checkmark-circle" size={18} color={C.accent} />
          </View>
        )}
      </View>
      <Text style={[styles.zoneItemLabel, selected && styles.zoneItemLabelSelected]} numberOfLines={1}>
        {item.brand || item.category}
      </Text>
    </Pressable>
  );
}

export default function TryOnScreen() {
  const insets = useSafeAreaInsets();
  const { preselect } = useLocalSearchParams<{ preselect?: string }>();
  const { wardrobe, avatarProfile } = useApp();
  const [activeZone, setActiveZone] = useState<Zone>('Tops');
  const [selectedTop, setSelectedTop] = useState<WardrobeItem | null>(null);
  const [selectedBottom, setSelectedBottom] = useState<WardrobeItem | null>(null);
  const [selectedShoes, setSelectedShoes] = useState<WardrobeItem | null>(null);

  React.useEffect(() => {
    if (preselect && wardrobe.length > 0) {
      const item = wardrobe.find(i => i.id === preselect);
      if (item) {
        const cat = item.category.toLowerCase();
        if (cat === 'tops' || cat === 'basics') { setSelectedTop(item); setActiveZone('Tops'); }
        else if (cat === 'bottoms' || cat === 'dresses') { setSelectedBottom(item); setActiveZone('Bottoms'); }
        else if (cat === 'shoes') { setSelectedShoes(item); setActiveZone('Shoes'); }
      }
    }
  }, [preselect, wardrobe]);

  const zoneItems: Record<Zone, WardrobeItem[]> = {
    Tops: wardrobe.filter(i => ['tops', 'basics', 'outerwear'].includes(i.category.toLowerCase())),
    Bottoms: wardrobe.filter(i => ['bottoms', 'dresses'].includes(i.category.toLowerCase())),
    Shoes: wardrobe.filter(i => i.category.toLowerCase() === 'shoes'),
  };

  function handleSelect(item: WardrobeItem) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (activeZone === 'Tops') setSelectedTop(prev => prev?.id === item.id ? null : item);
    else if (activeZone === 'Bottoms') setSelectedBottom(prev => prev?.id === item.id ? null : item);
    else setSelectedShoes(prev => prev?.id === item.id ? null : item);
  }

  const selectedId = activeZone === 'Tops' ? selectedTop?.id : activeZone === 'Bottoms' ? selectedBottom?.id : selectedShoes?.id;
  const items = zoneItems[activeZone];

  if (!avatarProfile.avatarGenerated) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="close" size={24} color={C.primary} />
          </Pressable>
          <Text style={styles.headerTitle}>Virtual Try-On</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIcon}>
            <Ionicons name="body-outline" size={48} color={C.muted} />
          </View>
          <Text style={styles.emptyTitle}>No avatar yet</Text>
          <Text style={styles.emptySub}>Complete the body scan first to create your avatar, then try on wardrobe items virtually.</Text>
          <Pressable style={styles.scanBtn} onPress={() => router.replace('/body-scan')}>
            <Ionicons name="scan-outline" size={18} color="#FFF" />
            <Text style={styles.scanBtnText}>Start body scan</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={24} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Virtual Try-On</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.avatarSection}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.avatarCard}>
          <Avatar
            shoulderWidth={avatarProfile.shoulderWidth}
            bust={avatarProfile.bust}
            waist={avatarProfile.waist}
            hips={avatarProfile.hips}
            inseam={avatarProfile.inseam}
            skinTone={avatarProfile.skinTone}
            topColor={selectedTop?.colour}
            bottomColor={selectedBottom?.colour}
            shoeColor={selectedShoes?.colour}
            height={260}
          />
        </Animated.View>

        <View style={styles.outfitSummary}>
          {selectedTop && (
            <View style={styles.summaryChip}>
              <View style={[styles.summaryDot, { backgroundColor: selectedTop.colour || C.muted }]} />
              <Text style={styles.summaryText}>{selectedTop.brand || selectedTop.category}</Text>
            </View>
          )}
          {selectedBottom && (
            <View style={styles.summaryChip}>
              <View style={[styles.summaryDot, { backgroundColor: selectedBottom.colour || C.muted }]} />
              <Text style={styles.summaryText}>{selectedBottom.brand || selectedBottom.category}</Text>
            </View>
          )}
          {selectedShoes && (
            <View style={styles.summaryChip}>
              <View style={[styles.summaryDot, { backgroundColor: selectedShoes.colour || C.muted }]} />
              <Text style={styles.summaryText}>{selectedShoes.brand || selectedShoes.category}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.selectorSection}>
        <View style={styles.zoneRow}>
          {ZONES.map(z => (
            <Pressable key={z} onPress={() => setActiveZone(z)} style={[styles.zoneTab, activeZone === z && styles.zoneTabActive]}>
              <Text style={[styles.zoneTabText, activeZone === z && styles.zoneTabTextActive]}>{z}</Text>
            </Pressable>
          ))}
        </View>

        {items.length === 0 ? (
          <View style={styles.noItems}>
            <Text style={styles.noItemsText}>No {activeZone.toLowerCase()} in wardrobe</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={i => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.itemList, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 24) }]}
            renderItem={({ item }) => (
              <ZoneItemCard item={item} selected={selectedId === item.id} onPress={() => handleSelect(item)} />
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: C.primary },
  avatarSection: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, paddingHorizontal: 20 },
  avatarCard: { width: 200, height: 280, alignItems: 'center', justifyContent: 'center', backgroundColor: C.white, borderRadius: 24, borderWidth: 1, borderColor: C.border },
  outfitSummary: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  summaryChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.white, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: C.border },
  summaryDot: { width: 12, height: 12, borderRadius: 6 },
  summaryText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: C.primary, textTransform: 'capitalize' },
  selectorSection: { borderTopWidth: 1, borderTopColor: C.border, paddingTop: 16 },
  zoneRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 14 },
  zoneTab: { flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', backgroundColor: C.white },
  zoneTabActive: { borderColor: C.accent, backgroundColor: C.accentLight },
  zoneTabText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: C.secondary },
  zoneTabTextActive: { color: C.accent },
  itemList: { paddingHorizontal: 20, gap: 10 },
  zoneItem: { width: 80, alignItems: 'center', gap: 6 },
  zoneItemSwatch: { width: 64, height: 64, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' },
  checkOverlay: { position: 'absolute', bottom: -4, right: -4, backgroundColor: C.background, borderRadius: 10 },
  zoneItemLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, color: C.muted, textAlign: 'center' },
  zoneItemLabelSelected: { color: C.accent },
  noItems: { alignItems: 'center', paddingVertical: 24 },
  noItemsText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.muted },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 16 },
  emptyIcon: { width: 88, height: 88, borderRadius: 28, backgroundColor: C.cardAlt, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 20, color: C.primary, textAlign: 'center' },
  emptySub: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textSecondary, textAlign: 'center', lineHeight: 20 },
  scanBtn: { backgroundColor: C.accent, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 28, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  scanBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#FFF' },
});
