import React, { useState, useCallback } from 'react';
import {
  View, StyleSheet, Pressable, ScrollView,
  FlatList, Platform, RefreshControl, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { C } from '@/constants/colors';
import { useApp, WardrobeItem, OutfitPlan } from '@/context/AppContext';
import { ThemedText } from '@/components/ui/ThemedText';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Spacing } from '@/constants/spacing';
import { Radius } from '@/constants/layout';

const SHORTCUTS = [
  { label: 'Planner', icon: 'calendar-outline' as const, route: '/(tabs)/planner' },
  { label: 'Try-On', icon: 'body-outline' as const, route: '/try-on' },
  { label: 'Wardrobe', icon: 'shirt-outline' as const, route: '/(tabs)/wardrobe' },
  { label: 'Body Scan', icon: 'scan-outline' as const, route: '/body-scan' },
];

const OUTFIT_TEMPLATES = [
  { top: 'White linen shirt', bottom: 'Tailored wide-leg trousers', shoes: 'Loafers', accessories: 'Minimal gold jewellery' },
  { top: 'Silk camisole', bottom: 'High-waisted midi skirt', shoes: 'Strappy sandals', accessories: 'Woven tote bag' },
  { top: 'Ribbed turtleneck', bottom: 'Straight-leg dark jeans', shoes: 'Ankle boots', accessories: 'Leather belt' },
  { top: 'Floral wrap blouse', bottom: 'Slim trousers', shoes: 'Block-heel mules', accessories: 'Gold hoops' },
  { top: 'Oversized blazer', bottom: 'Fitted cycling shorts', shoes: 'White trainers', accessories: 'Cap and tote' },
  { top: 'Cashmere jumper', bottom: 'Pleated midi skirt', shoes: 'Chelsea boots', accessories: 'Wool scarf' },
];

function ShortcutButton({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.shortcutBtn, { opacity: pressed ? 0.7 : 1 }]}>
      <View style={styles.shortcutIcon}>
        <Ionicons name={icon} size={26} color={C.primary} />
      </View>
      <ThemedText variant="caption" style={styles.shortcutLabel}>{label}</ThemedText>
    </Pressable>
  );
}

function WardrobeItemCard({ item, onPress }: { item: WardrobeItem; onPress: () => void }) {
  return (
    <Card onPress={onPress} padding={false} style={styles.wardrobeCard} variant="default">
      <View style={[styles.wardrobeCardSwatch, { backgroundColor: item.colour || C.cardAlt }]}>
        <Ionicons name="shirt-outline" size={24} color="rgba(255,255,255,0.15)" />
      </View>
      <ThemedText variant="caption" style={styles.wardrobeCardCategory} numberOfLines={1}>{item.category}</ThemedText>
      <ThemedText variant="caption" color={C.textMuted} style={styles.wardrobeCardNotes} numberOfLines={1}>{item.notes}</ThemedText>
    </Card>
  );
}

function OutfitCard({ outfit }: { outfit: OutfitPlan }) {
  const date = new Date(outfit.date);
  const label = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  return (
    <Card
      onPress={() => router.push({ pathname: '/outfit/feedback', params: { outfitId: outfit.id } })}
      style={styles.outfitMiniCard}
      variant="default"
    >
      <View style={styles.outfitMiniTop}>
        <Ionicons name="sparkles" size={16} color={C.accent} />
        <ThemedText variant="caption" color={C.textMuted}>{label}</ThemedText>
      </View>
      <ThemedText variant="bodyS" numberOfLines={1}>{outfit.top}</ThemedText>
      <ThemedText variant="bodyS" numberOfLines={1}>{outfit.bottom}</ThemedText>
      <ThemedText variant="caption" color={C.textMuted} numberOfLines={1}>{outfit.shoes}</ThemedText>
    </Card>
  );
}

export default function TodayScreen() {
  const insets = useSafeAreaInsets();
  const { userProfile, toneProfile, wardrobe, outfits, addOutfit } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [generating, setGenerating] = useState(false);

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  const recentItems = [...wardrobe]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const basics = wardrobe.filter(i => i.category === 'basics' && !i.hidden);
  const recentOutfits = [...outfits].reverse().slice(0, 5);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  function handleCreateOutfit() {
    setGenerating(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => {
      const template = OUTFIT_TEMPLATES[Math.floor(Math.random() * OUTFIT_TEMPLATES.length)];
      addOutfit({
        date: new Date().toISOString(),
        mood: 'Confident',
        context: 'Everyday',
        weather: 'Mild',
        top: template.top,
        bottom: template.bottom,
        shoes: template.shoes,
        accessories: template.accessories,
        wardrobeItems: [],
        generated: true,
      });
      setGenerating(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1200);
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.scroll,
        { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 16), paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 100) }
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />}
    >
      <View style={styles.topRow}>
        <View>
          <ThemedText variant="headingM" style={styles.greeting}>
            {userProfile.name ? `Hi, ${userProfile.name}` : 'Welcome'}
          </ThemedText>
          <ThemedText variant="bodyS" color={C.textSecondary}>{today}</ThemedText>
        </View>
        <Pressable onPress={() => router.push('/outfit/feedback')} hitSlop={8}>
          <View style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color={C.primary} />
          </View>
        </Pressable>
      </View>

      {toneProfile.toneType ? (
        <Card style={styles.toneCard} variant="default">
          <View style={styles.toneHeader}>
            <ThemedText variant="caption" style={styles.toneLabel}>Your colour palette</ThemedText>
            <ThemedText variant="headingXS" color={C.accent}>{toneProfile.toneType.charAt(0).toUpperCase() + toneProfile.toneType.slice(1)} tones</ThemedText>
          </View>
          <View style={styles.swatches}>
            {toneProfile.palette.map((color, i) => (
              <View key={i} style={[styles.swatch, { backgroundColor: color }]} />
            ))}
          </View>
        </Card>
      ) : null}

      <View style={styles.shortcutsRow}>
        {SHORTCUTS.map(s => (
          <ShortcutButton
            key={s.label}
            icon={s.icon}
            label={s.label}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push(s.route as any);
            }}
          />
        ))}
      </View>

      <View style={styles.aiCards}>
        <Card
          onPress={handleCreateOutfit}
          variant="flat"
          style={[styles.aiCardLarge, { backgroundColor: 'rgba(193,123,88,0.12)', borderColor: 'rgba(193,123,88,0.25)' }]}
        >
          <View style={styles.aiCardContent}>
            <View style={styles.aiCardIconWrap}>
              {generating
                ? <ActivityIndicator color={C.accent} size="small" />
                : <Ionicons name="sparkles" size={28} color={C.accent} />
              }
            </View>
            <ThemedText variant="headingS" color={C.primary}>Make an outfit</ThemedText>
            <ThemedText variant="caption" color={C.textSecondary}>For any date, occasion and style</ThemedText>
          </View>
        </Card>
        
        <Card
          onPress={() => router.push('/outfit/feedback')}
          variant="default"
          style={styles.aiCardSmall}
        >
          <View style={styles.aiCardContent}>
            <View style={[styles.aiCardIconWrap, { backgroundColor: 'rgba(245,240,232,0.06)' }]}>
              <Ionicons name="star-outline" size={24} color={C.accent} />
            </View>
            <ThemedText variant="headingXS" color={C.primary}>Rate my outfit</ThemedText>
            <ThemedText variant="caption" color={C.textSecondary}>Get styling tips</ThemedText>
          </View>
        </Card>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        <SectionHeader title="Recent outfits" />
      </View>
      
      {recentOutfits.length > 0 ? (
        <FlatList
          horizontal
          data={recentOutfits}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hList}
          renderItem={({ item }) => <OutfitCard outfit={item} />}
          scrollEnabled={!!recentOutfits.length}
        />
      ) : (
        <Card variant="flat" style={styles.emptyOutfits}>
          <Ionicons name="sparkles-outline" size={36} color={C.muted} />
          <ThemedText variant="bodyS" color={C.textSecondary}>Your outfits will appear here.</ThemedText>
          <Pressable onPress={handleCreateOutfit} style={styles.createOutfitBtn} disabled={generating}>
            {generating
              ? <ActivityIndicator color="#FFF" size="small" />
              : <ThemedText variant="bodyS" style={{ fontWeight: '600' }}>Create outfit</ThemedText>
            }
          </Pressable>
        </Card>
      )}

      {recentItems.length > 0 && (
        <>
          <View style={{ paddingHorizontal: 20 }}>
            <SectionHeader title="Recently added items" onPress={() => router.push('/(tabs)/wardrobe')} />
          </View>
          <FlatList
            horizontal
            data={recentItems}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hList}
            renderItem={({ item }) => (
              <WardrobeItemCard
                item={item}
                onPress={() => router.push({ pathname: '/wardrobe/[id]', params: { id: item.id } })}
              />
            )}
            scrollEnabled={!!recentItems.length}
          />
        </>
      )}

      {basics.length > 0 && (
        <>
          <View style={{ paddingHorizontal: 20 }}>
            <SectionHeader title="Basics you may have" />
          </View>
          <FlatList
            horizontal
            data={basics}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hList}
            renderItem={({ item }) => (
              <WardrobeItemCard
                item={item}
                onPress={() => router.push({ pathname: '/wardrobe/[id]', params: { id: item.id } })}
              />
            )}
            scrollEnabled={!!basics.length}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  scroll: { gap: Spacing.xl },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20 },
  greeting: { color: C.primary },
  notifBtn: { width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(245,240,232,0.06)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  toneCard: { marginHorizontal: 20 },
  toneHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  toneLabel: { color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8 },
  swatches: { flexDirection: 'row', gap: 6 },
  swatch: { flex: 1, height: 26, borderRadius: 8 },
  shortcutsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10 },
  shortcutBtn: { flex: 1, alignItems: 'center', gap: 8 },
  shortcutIcon: {
    width: '100%', aspectRatio: 1, borderRadius: 16,
    backgroundColor: C.card, borderWidth: 1, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center',
  },
  shortcutLabel: { color: C.textSecondary, textAlign: 'center' },
  aiCards: { flexDirection: 'row', paddingHorizontal: 20, gap: 10 },
  aiCardLarge: { flex: 2, minHeight: 150 },
  aiCardSmall: { flex: 1, minHeight: 150 },
  aiCardContent: { flex: 1, justifyContent: 'flex-end', gap: 4 },
  aiCardIconWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(193,123,88,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  hList: { paddingHorizontal: 20, gap: 12 },
  emptyOutfits: {
    marginHorizontal: 20, alignItems: 'center', gap: 12, paddingVertical: 36,
  },
  createOutfitBtn: {
    backgroundColor: C.card, borderRadius: 20,
    paddingHorizontal: 22, paddingVertical: 10,
    borderWidth: 1, borderColor: C.border,
  },
  outfitMiniCard: { width: 140, gap: 4 },
  outfitMiniTop: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  wardrobeCard: { width: 120 },
  wardrobeCardSwatch: { height: 90, alignItems: 'center', justifyContent: 'center' },
  wardrobeCardCategory: { color: C.primary, paddingHorizontal: 10, paddingTop: 8, textTransform: 'capitalize' },
  wardrobeCardNotes: { paddingHorizontal: 10, paddingBottom: 10 },
});
