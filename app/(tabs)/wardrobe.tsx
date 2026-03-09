import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView, FlatList, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { C } from '@/constants/colors';
import { useApp, WardrobeItem } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/ui/ThemedText';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import { Spacing } from '@/constants/spacing';
import { Radius } from '@/constants/layout';

const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories', 'Basics'];
const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  'All': 'grid-outline',
  'Tops': 'shirt-outline',
  'Bottoms': 'layers-outline',
  'Dresses': 'body-outline',
  'Outerwear': 'cloudy-night-outline',
  'Shoes': 'footsteps-outline',
  'Accessories': 'glasses-outline',
  'Basics': 'leaf-outline',
};

const TAG_CONFIG = {
  keep: { label: 'Keep', color: C.success, bg: C.successLight },
  review: { label: 'Review', color: C.warning, bg: C.warningLight },
  donate: { label: 'Donate', color: C.danger, bg: C.dangerLight },
};

function ItemCard({ item, onPress }: { item: WardrobeItem; onPress: () => void }) {
  const tag = TAG_CONFIG[item.tag];
  // match case-insensitive for icon lookup
  const iconKey = Object.keys(CATEGORY_ICONS).find(k => k.toLowerCase() === item.category.toLowerCase()) || 'Tops';
  const icon = CATEGORY_ICONS[iconKey] || 'shirt-outline';

  return (
    <Card onPress={onPress} padding={false} style={styles.itemCard} variant="default">
      {item.image ? (
        <Image source={item.image} style={styles.itemImage} contentFit="cover" transition={200} />
      ) : (
        <View style={[styles.itemImagePlaceholder, { backgroundColor: item.colour || C.cardAlt }]}>
          <Ionicons name={icon as any} size={32} color="rgba(255,255,255,0.2)" />
        </View>
      )}
      {item.favourite && (
        <View style={styles.favBadge}>
          <Ionicons name="heart" size={10} color="#FFF" />
        </View>
      )}
      <View style={styles.itemInfo}>
        <ThemedText variant="caption" style={styles.itemCategory} numberOfLines={1}>{item.category || 'Item'}</ThemedText>
        {item.brand ? <ThemedText variant="caption" color={C.textMuted} numberOfLines={1}>{item.brand}</ThemedText> : null}
        <View style={[styles.tagPill, { backgroundColor: tag.bg }]}>
          <ThemedText variant="caption" style={[styles.tagText, { color: tag.color }]}>{tag.label}</ThemedText>
        </View>
      </View>
    </Card>
  );
}

export default function WardrobeScreen() {
  const insets = useSafeAreaInsets();
  const { wardrobe, styleGaps } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = wardrobe.filter(i => {
    if (i.hidden) return false;
    if (activeCategory !== 'All' && i.category.toLowerCase() !== activeCategory.toLowerCase()) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        i.category.toLowerCase().includes(q) ||
        (i.subCategory && i.subCategory.toLowerCase().includes(q)) ||
        (i.brand && i.brand.toLowerCase().includes(q)) ||
        (i.notes && i.notes.toLowerCase().includes(q)) ||
        (i.features && i.features.some(f => f.toLowerCase().includes(q))) ||
        (i.colour && i.colour.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const keepCount = wardrobe.filter(i => i.tag === 'keep').length;
  const reviewCount = wardrobe.filter(i => i.tag === 'review').length;
  const donateCount = wardrobe.filter(i => i.tag === 'donate').length;

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.header}>
        <View>
          <ThemedText variant="headingL">Wardrobe</ThemedText>
          <ThemedText variant="bodyM" color={C.textSecondary}>{wardrobe.length} items</ThemedText>
        </View>
        <View style={styles.headerButtons}>
          <Button
            variant="outline"
            icon={<Ionicons name="share-outline" size={22} color={C.primary} />}
            onPress={() => router.push('/wardrobe/share')}
            title=""
            style={styles.headerBtn}
          />
          <Button
            variant="primary"
            icon={<Ionicons name="add" size={24} color="#FFF" />}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/wardrobe/add-smart');
            }}
            title=""
            style={styles.headerBtn}
          />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Input
          variant="outline"
          style={styles.searchInput}
          placeholder="Search wardrobe..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
        <View style={styles.searchIcon}>
          <Ionicons name="search" size={20} color={C.textSecondary} />
        </View>
      </View>

      {wardrobe.length > 0 && (
        <View style={styles.statsRow}>
          <Card style={styles.statChip} variant="default">
            <ThemedText variant="headingM" style={{ color: C.success }}>{keepCount}</ThemedText>
            <ThemedText variant="caption" color={C.textMuted}>Keep</ThemedText>
          </Card>
          <Card style={styles.statChip} variant="default">
            <ThemedText variant="headingM" style={{ color: C.warning }}>{reviewCount}</ThemedText>
            <ThemedText variant="caption" color={C.textMuted}>Review</ThemedText>
          </Card>
          <Card style={styles.statChip} variant="default">
            <ThemedText variant="headingM" style={{ color: C.danger }}>{donateCount}</ThemedText>
            <ThemedText variant="caption" color={C.textMuted}>Donate</ThemedText>
          </Card>
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
        {CATEGORIES.map(cat => (
          <Chip
            key={cat}
            label={cat}
            selected={activeCategory === cat}
            onPress={() => setActiveCategory(cat)}
            variant={activeCategory === cat ? 'accent' : 'default'}
            icon={CATEGORY_ICONS[cat]}
          />
        ))}
      </ScrollView>

      {styleGaps.length > 0 && (
        <Pressable style={styles.gapsBanner} onPress={() => {}}>
          <Ionicons name="alert-circle-outline" size={16} color={C.accent} />
          <ThemedText variant="caption" style={styles.gapsBannerText}>{styleGaps.length} style gap{styleGaps.length !== 1 ? 's' : ''} identified</ThemedText>
          <Ionicons name="chevron-forward" size={14} color={C.accent} />
        </Pressable>
      )}

      {wardrobe.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="shirt-outline" size={40} color={C.muted} />
          </View>
          <ThemedText variant="headingM" style={{ textAlign: 'center' }}>Your wardrobe is empty</ThemedText>
          <ThemedText variant="bodyS" color={C.textSecondary} style={{ textAlign: 'center' }}>Add your first item to start building your digital wardrobe and unlock outfit suggestions.</ThemedText>
          <Button
            title="Add first item"
            icon={<Ionicons name="add" size={18} color="#FFF" />}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/wardrobe/add-smart');
            }}
            style={{ marginTop: Spacing.md }}
          />
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <ThemedText variant="headingS">No items in {activeCategory}</ThemedText>
          <ThemedText variant="bodyS" color={C.textSecondary}>Try adding some items to this category.</ThemedText>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  headerButtons: { flexDirection: 'row', gap: 12 },
  headerBtn: { width: 44, height: 44, paddingHorizontal: 0 },
  searchContainer: { marginHorizontal: 20, marginBottom: 12, position: 'relative' },
  searchInput: { paddingLeft: 40 }, // Space for icon
  searchIcon: { position: 'absolute', left: 12, top: 14 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 12 },
  statChip: { flex: 1, alignItems: 'center', padding: Spacing.md },
  catRow: { paddingHorizontal: 20, paddingBottom: 12, gap: 8 },
  gapsBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 20, backgroundColor: C.accentLight, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 12 },
  gapsBannerText: { flex: 1, color: C.accent },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 14 },
  emptyIcon: { width: 80, height: 80, borderRadius: 24, backgroundColor: C.cardAlt, alignItems: 'center', justifyContent: 'center' },
  columnWrapper: { paddingHorizontal: 20, gap: 12 },
  listContent: { paddingTop: 4, gap: 12 },
  itemCard: { flex: 1 },
  itemImagePlaceholder: { aspectRatio: 3/4, width: '100%', alignItems: 'center', justifyContent: 'center' },
  itemImage: { aspectRatio: 3/4, width: '100%' },
  favBadge: { position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: 11, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' },
  itemInfo: { padding: 10, gap: 4 },
  itemCategory: { color: C.primary, textTransform: 'capitalize' },
  tagPill: { alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontSize: 11, fontWeight: '600' },
});
