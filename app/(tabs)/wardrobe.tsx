import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, FlatList, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { C } from '@/constants/colors';
import { useApp, WardrobeItem } from '@/context/AppContext';

const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories', 'Basics'];
const TAG_CONFIG = {
  keep: { label: 'Keep', color: C.success, bg: C.successLight },
  review: { label: 'Review', color: C.warning, bg: C.warningLight },
  donate: { label: 'Donate', color: C.danger, bg: C.dangerLight },
};

function ItemCard({ item, onPress }: { item: WardrobeItem; onPress: () => void }) {
  const tag = TAG_CONFIG[item.tag];
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.itemCard, { opacity: pressed ? 0.85 : 1 }]}>
      <View style={[styles.itemImagePlaceholder, { backgroundColor: item.colour || C.cardAlt }]}>
        <Ionicons name="shirt-outline" size={28} color="rgba(255,255,255,0.2)" />
      </View>
      {item.favourite && (
        <View style={styles.favBadge}>
          <Ionicons name="heart" size={10} color="#FFF" />
        </View>
      )}
      <View style={styles.itemInfo}>
        <Text style={styles.itemCategory} numberOfLines={1}>{item.category}</Text>
        {item.brand ? <Text style={styles.itemBrand} numberOfLines={1}>{item.brand}</Text> : null}
        <View style={[styles.tagPill, { backgroundColor: tag.bg }]}>
          <Text style={[styles.tagText, { color: tag.color }]}>{tag.label}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function WardrobeScreen() {
  const insets = useSafeAreaInsets();
  const { wardrobe, styleGaps } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? wardrobe.filter(i => !i.hidden)
    : wardrobe.filter(i => !i.hidden && i.category.toLowerCase() === activeCategory.toLowerCase());

  const keepCount = wardrobe.filter(i => i.tag === 'keep').length;
  const reviewCount = wardrobe.filter(i => i.tag === 'review').length;
  const donateCount = wardrobe.filter(i => i.tag === 'donate').length;

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Wardrobe</Text>
          <Text style={styles.subtitle}>{wardrobe.length} items</Text>
        </View>
        <Pressable
          style={styles.addBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/wardrobe/add');
          }}
        >
          <Ionicons name="add" size={24} color="#FFF" />
        </Pressable>
      </View>

      {wardrobe.length > 0 && (
        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <Text style={[styles.statNum, { color: C.success }]}>{keepCount}</Text>
            <Text style={styles.statLabel}>Keep</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={[styles.statNum, { color: C.warning }]}>{reviewCount}</Text>
            <Text style={styles.statLabel}>Review</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={[styles.statNum, { color: C.danger }]}>{donateCount}</Text>
            <Text style={styles.statLabel}>Donate</Text>
          </View>
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
        {CATEGORIES.map(cat => (
          <Pressable
            key={cat}
            onPress={() => setActiveCategory(cat)}
            style={[styles.catPill, activeCategory === cat && styles.catPillActive]}
          >
            <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>{cat}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {styleGaps.length > 0 && (
        <Pressable style={styles.gapsBanner} onPress={() => {}}>
          <Ionicons name="alert-circle-outline" size={16} color={C.accent} />
          <Text style={styles.gapsBannerText}>{styleGaps.length} style gap{styleGaps.length !== 1 ? 's' : ''} identified</Text>
          <Ionicons name="chevron-forward" size={14} color={C.accent} />
        </Pressable>
      )}

      {wardrobe.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="shirt-outline" size={40} color={C.muted} />
          </View>
          <Text style={styles.emptyTitle}>Your wardrobe is empty</Text>
          <Text style={styles.emptySubtitle}>Add your first item to start building your digital wardrobe and unlock outfit suggestions.</Text>
          <Pressable
            style={styles.emptyBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/wardrobe/add');
            }}
          >
            <Ionicons name="add" size={18} color="#FFF" />
            <Text style={styles.emptyBtnText}>Add first item</Text>
          </Pressable>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No items in {activeCategory}</Text>
          <Text style={styles.emptySubtitle}>Try adding some items to this category.</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={i => i.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 100) }]}
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              onPress={() => router.push({ pathname: '/wardrobe/[id]', params: { id: item.id } })}
            />
          )}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 30, color: C.primary },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textSecondary, marginTop: 2 },
  addBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 12 },
  statChip: { flex: 1, backgroundColor: C.white, borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  statNum: { fontFamily: 'Inter_700Bold', fontSize: 22 },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.muted, marginTop: 2 },
  catRow: { paddingHorizontal: 20, paddingBottom: 12, gap: 8 },
  catPill: { borderWidth: 1.5, borderColor: C.border, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: C.white },
  catPillActive: { borderColor: C.accent, backgroundColor: C.accentLight },
  catText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: C.secondary },
  catTextActive: { color: C.accent },
  gapsBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 20, backgroundColor: C.accentLight, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 12 },
  gapsBannerText: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 13, color: C.accent },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 14 },
  emptyIcon: { width: 80, height: 80, borderRadius: 24, backgroundColor: C.cardAlt, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 20, color: C.primary, textAlign: 'center' },
  emptySubtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textSecondary, textAlign: 'center', lineHeight: 21 },
  emptyBtn: { backgroundColor: C.accent, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  emptyBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#FFF' },
  columnWrapper: { paddingHorizontal: 20, gap: 12 },
  listContent: { paddingTop: 4, gap: 12 },
  itemCard: { flex: 1, backgroundColor: C.white, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: C.border },
  itemImagePlaceholder: { height: 120, alignItems: 'center', justifyContent: 'center' },
  favBadge: { position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: 11, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' },
  itemInfo: { padding: 10, gap: 4 },
  itemCategory: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: C.primary, textTransform: 'capitalize' },
  itemBrand: { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.textSecondary },
  tagPill: { alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontFamily: 'Inter_500Medium', fontSize: 11 },
});
