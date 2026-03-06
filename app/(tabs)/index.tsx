import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView,
  FlatList, Platform, RefreshControl, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { C } from '@/constants/colors';
import { useApp, WardrobeItem, OutfitPlan } from '@/context/AppContext';

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

function SectionHeader({ title, onPress }: { title: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.sectionHeader} disabled={!onPress}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onPress && <Ionicons name="chevron-forward" size={18} color={C.accent} />}
    </Pressable>
  );
}

function ShortcutButton({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.shortcutBtn, { opacity: pressed ? 0.7 : 1 }]}>
      <View style={styles.shortcutIcon}>
        <Ionicons name={icon} size={26} color={C.primary} />
      </View>
      <Text style={styles.shortcutLabel}>{label}</Text>
    </Pressable>
  );
}

function WardrobeItemCard({ item, onPress }: { item: WardrobeItem; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.wardrobeCard, { opacity: pressed ? 0.8 : 1 }]}>
      <View style={[styles.wardrobeCardSwatch, { backgroundColor: item.colour || C.cardAlt }]}>
        <Ionicons name="shirt-outline" size={24} color="rgba(255,255,255,0.15)" />
      </View>
      <Text style={styles.wardrobeCardCategory} numberOfLines={1}>{item.category}</Text>
      <Text style={styles.wardrobeCardNotes} numberOfLines={1}>{item.notes}</Text>
    </Pressable>
  );
}

function OutfitCard({ outfit }: { outfit: OutfitPlan }) {
  const date = new Date(outfit.date);
  const label = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/outfit/feedback', params: { outfitId: outfit.id } })}
      style={({ pressed }) => [styles.outfitMiniCard, { opacity: pressed ? 0.8 : 1 }]}
    >
      <View style={styles.outfitMiniTop}>
        <Ionicons name="sparkles" size={16} color={C.accent} />
        <Text style={styles.outfitMiniDate}>{label}</Text>
      </View>
      <Text style={styles.outfitMiniText} numberOfLines={1}>{outfit.top}</Text>
      <Text style={styles.outfitMiniText} numberOfLines={1}>{outfit.bottom}</Text>
      <Text style={styles.outfitMiniSub} numberOfLines={1}>{outfit.shoes}</Text>
    </Pressable>
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
          <Text style={styles.greeting}>
            {userProfile.name ? `Hi, ${userProfile.name}` : 'Welcome'}
          </Text>
          <Text style={styles.date}>{today}</Text>
        </View>
        <Pressable onPress={() => router.push('/outfit/feedback')} hitSlop={8}>
          <View style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color={C.primary} />
          </View>
        </Pressable>
      </View>

      {toneProfile.toneType ? (
        <View style={styles.toneCard}>
          <View style={styles.toneHeader}>
            <Text style={styles.toneLabel}>Your colour palette</Text>
            <Text style={styles.toneName}>{toneProfile.toneType.charAt(0).toUpperCase() + toneProfile.toneType.slice(1)} tones</Text>
          </View>
          <View style={styles.swatches}>
            {toneProfile.palette.map((color, i) => (
              <View key={i} style={[styles.swatch, { backgroundColor: color }]} />
            ))}
          </View>
        </View>
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
        <Pressable
          onPress={handleCreateOutfit}
          disabled={generating}
          style={({ pressed }) => [styles.aiCardLarge, { opacity: pressed ? 0.85 : 1 }]}
        >
          <View style={styles.aiCardLargeInner}>
            <View style={styles.aiCardIconWrap}>
              {generating
                ? <ActivityIndicator color={C.accent} size="small" />
                : <Ionicons name="sparkles" size={28} color={C.accent} />
              }
            </View>
            <Text style={styles.aiCardTitle}>Make an outfit</Text>
            <Text style={styles.aiCardSub}>For any date, occasion and style</Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() => router.push('/outfit/feedback')}
          style={({ pressed }) => [styles.aiCardSmall, { opacity: pressed ? 0.85 : 1 }]}
        >
          <View style={styles.aiCardSmallInner}>
            <View style={styles.aiCardIconWrap}>
              <Ionicons name="star-outline" size={24} color={C.accent} />
            </View>
            <Text style={styles.aiCardSmallTitle}>Rate my outfit</Text>
            <Text style={styles.aiCardSmallSub}>Get styling tips</Text>
          </View>
        </Pressable>
      </View>

      <SectionHeader title="Recent outfits" />
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
        <View style={styles.emptyOutfits}>
          <Ionicons name="sparkles-outline" size={36} color={C.muted} />
          <Text style={styles.emptyOutfitsText}>Your outfits will appear here.</Text>
          <Pressable onPress={handleCreateOutfit} style={styles.createOutfitBtn} disabled={generating}>
            {generating
              ? <ActivityIndicator color="#FFF" size="small" />
              : <Text style={styles.createOutfitBtnText}>Create outfit</Text>
            }
          </Pressable>
        </View>
      )}

      {recentItems.length > 0 && (
        <>
          <SectionHeader title="Recently added items" onPress={() => router.push('/(tabs)/wardrobe')} />
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
          <SectionHeader title="Basics you may have" />
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
  scroll: { gap: 20 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20 },
  greeting: { fontFamily: 'Inter_700Bold', fontSize: 28, color: C.primary, lineHeight: 34 },
  date: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textSecondary, marginTop: 2 },
  notifBtn: { width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(245,240,232,0.06)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  toneCard: { marginHorizontal: 20, backgroundColor: C.white, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: C.border, gap: 10 },
  toneHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toneLabel: { fontFamily: 'Inter_500Medium', fontSize: 12, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8 },
  toneName: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: C.accent },
  swatches: { flexDirection: 'row', gap: 6 },
  swatch: { flex: 1, height: 26, borderRadius: 8 },
  shortcutsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10 },
  shortcutBtn: { flex: 1, alignItems: 'center', gap: 8 },
  shortcutIcon: {
    width: '100%', aspectRatio: 1, borderRadius: 16,
    backgroundColor: C.white, borderWidth: 1, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center',
  },
  shortcutLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, color: C.textSecondary, textAlign: 'center' },
  aiCards: { flexDirection: 'row', paddingHorizontal: 20, gap: 10 },
  aiCardLarge: { flex: 2, borderRadius: 20, overflow: 'hidden' },
  aiCardLargeInner: {
    backgroundColor: 'rgba(193,123,88,0.12)', borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(193,123,88,0.25)',
    padding: 18, justifyContent: 'flex-end', minHeight: 150, gap: 6,
  },
  aiCardSmall: { flex: 1, borderRadius: 20, overflow: 'hidden' },
  aiCardSmallInner: {
    backgroundColor: C.white, borderRadius: 20,
    borderWidth: 1, borderColor: C.border,
    padding: 16, justifyContent: 'flex-end', minHeight: 150, gap: 6,
  },
  aiCardIconWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(193,123,88,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  aiCardTitle: { fontFamily: 'Inter_700Bold', fontSize: 16, color: C.primary },
  aiCardSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.textSecondary, lineHeight: 16 },
  aiCardSmallTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: C.primary },
  aiCardSmallSub: { fontFamily: 'Inter_400Regular', fontSize: 11, color: C.textSecondary },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 20, color: C.primary },
  hList: { paddingHorizontal: 20, gap: 12 },
  emptyOutfits: {
    marginHorizontal: 20, backgroundColor: C.white, borderRadius: 20,
    borderWidth: 1, borderColor: C.border,
    paddingVertical: 36, alignItems: 'center', gap: 12,
  },
  emptyOutfitsText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textSecondary },
  createOutfitBtn: {
    backgroundColor: C.card, borderRadius: 20,
    paddingHorizontal: 22, paddingVertical: 10,
    borderWidth: 1, borderColor: C.border,
  },
  createOutfitBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: C.primary },
  outfitMiniCard: {
    width: 140, backgroundColor: C.white, borderRadius: 16,
    borderWidth: 1, borderColor: C.border, padding: 14, gap: 4,
  },
  outfitMiniTop: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  outfitMiniDate: { fontFamily: 'Inter_500Medium', fontSize: 11, color: C.muted },
  outfitMiniText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: C.primary },
  outfitMiniSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.textSecondary },
  wardrobeCard: {
    width: 120, backgroundColor: C.white, borderRadius: 16,
    borderWidth: 1, borderColor: C.border, overflow: 'hidden',
  },
  wardrobeCardSwatch: { height: 90, alignItems: 'center', justifyContent: 'center' },
  wardrobeCardCategory: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: C.primary, paddingHorizontal: 10, paddingTop: 8, textTransform: 'capitalize' },
  wardrobeCardNotes: { fontFamily: 'Inter_400Regular', fontSize: 11, color: C.textSecondary, paddingHorizontal: 10, paddingBottom: 10 },
});
