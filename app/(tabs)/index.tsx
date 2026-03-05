import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView,
  ActivityIndicator, Platform, RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

const MOODS = ['Confident', 'Relaxed', 'Creative', 'Professional', 'Playful', 'Cosy'];
const CONTEXTS = ['Work', 'Weekend', 'Event', 'Date', 'Travel', 'Errands'];
const WEATHER = ['Sunny', 'Cloudy', 'Rainy', 'Cold', 'Hot', 'Mild'];

const OUTFIT_TEMPLATES = [
  { top: 'White linen shirt', bottom: 'Tailored wide-leg trousers', shoes: 'Loafers', accessories: 'Minimal gold jewellery' },
  { top: 'Silk camisole', bottom: 'High-waisted midi skirt', shoes: 'Strappy sandals', accessories: 'Woven tote bag' },
  { top: 'Ribbed turtleneck', bottom: 'Straight-leg dark jeans', shoes: 'Ankle boots', accessories: 'Leather belt' },
  { top: 'Floral wrap blouse', bottom: 'Slim trousers', shoes: 'Block-heel mules', accessories: 'Gold hoops' },
  { top: 'Oversized blazer', bottom: 'Fitted cycling shorts', shoes: 'White trainers', accessories: 'Cap and tote' },
  { top: 'Cashmere jumper', bottom: 'Pleated midi skirt', shoes: 'Chelsea boots', accessories: 'Wool scarf' },
];

export default function TodayScreen() {
  const insets = useSafeAreaInsets();
  const { userProfile, toneProfile, wardrobe, outfits, addOutfit, styleGaps } = useApp();
  const [mood, setMood] = useState('');
  const [context, setContext] = useState('');
  const [weather, setWeather] = useState('');
  const [currentOutfit, setCurrentOutfit] = useState<typeof OUTFIT_TEMPLATES[0] | null>(null);
  const [generating, setGenerating] = useState(false);
  const [outfitId, setOutfitId] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  function generateOutfit() {
    if (!mood || !context || !weather) return;
    setGenerating(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => {
      const template = OUTFIT_TEMPLATES[Math.floor(Math.random() * OUTFIT_TEMPLATES.length)];
      setCurrentOutfit(template);
      const id = Date.now().toString();
      setOutfitId(id);
      addOutfit({
        id,
        date: new Date().toISOString(),
        mood,
        context,
        weather,
        top: template.top,
        bottom: template.bottom,
        shoes: template.shoes,
        accessories: template.accessories,
        wardrobeItems: [],
        generated: true,
      });
      setGenerating(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1400);
  }

  function regenerate() {
    const template = OUTFIT_TEMPLATES[Math.floor(Math.random() * OUTFIT_TEMPLATES.length)];
    setCurrentOutfit(template);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const topGap = styleGaps[0];

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
          <Text style={styles.greeting}>Good morning{userProfile.name ? `, ${userProfile.name}` : ''}</Text>
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

      <Text style={styles.sectionTitle}>Today's look</Text>
      <Text style={styles.sectionSubtitle}>Tell us the vibe and we'll style you.</Text>

      <View style={styles.selectorGroup}>
        <Text style={styles.selectorLabel}>Mood</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorRow}>
          {MOODS.map(m => (
            <Pressable key={m} onPress={() => setMood(m)} style={[styles.pill, mood === m && styles.pillActive]}>
              <Text style={[styles.pillText, mood === m && styles.pillTextActive]}>{m}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.selectorGroup}>
        <Text style={styles.selectorLabel}>Occasion</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorRow}>
          {CONTEXTS.map(c => (
            <Pressable key={c} onPress={() => setContext(c)} style={[styles.pill, context === c && styles.pillActive]}>
              <Text style={[styles.pillText, context === c && styles.pillTextActive]}>{c}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.selectorGroup}>
        <Text style={styles.selectorLabel}>Weather</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorRow}>
          {WEATHER.map(w => (
            <Pressable key={w} onPress={() => setWeather(w)} style={[styles.pill, weather === w && styles.pillActive]}>
              <Text style={[styles.pillText, weather === w && styles.pillTextActive]}>{w}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.generateBtn,
          (!mood || !context || !weather) && styles.generateBtnDisabled,
          { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }
        ]}
        onPress={generateOutfit}
        disabled={!mood || !context || !weather || generating}
      >
        {generating
          ? <ActivityIndicator color="#FFF" />
          : <>
            <Ionicons name="sparkles" size={18} color="#FFF" />
            <Text style={styles.generateBtnText}>Generate my outfit</Text>
          </>
        }
      </Pressable>

      {currentOutfit && !generating && (
        <View style={styles.outfitCard}>
          <LinearGradient colors={['#2D1F14', '#1A1410']} style={styles.outfitCardGrad} />
          <View style={styles.outfitCardContent}>
            <View style={styles.outfitCardHeader}>
              <Text style={styles.outfitCardTitle}>Your outfit</Text>
              <Text style={styles.outfitCardSub}>{mood} · {context} · {weather}</Text>
            </View>

            {([
              { icon: 'shirt-outline', label: 'Top', value: currentOutfit.top },
              { icon: 'albums-outline', label: 'Bottom', value: currentOutfit.bottom },
              { icon: 'footsteps-outline', label: 'Shoes', value: currentOutfit.shoes },
              { icon: 'sparkles-outline', label: 'Accessories', value: currentOutfit.accessories },
            ] as any[]).map((item) => (
              <View key={item.label} style={styles.outfitRow}>
                <View style={styles.outfitRowIcon}>
                  <Ionicons name={item.icon} size={16} color={C.accent} />
                </View>
                <View style={styles.outfitRowText}>
                  <Text style={styles.outfitRowLabel}>{item.label}</Text>
                  <Text style={styles.outfitRowValue}>{item.value}</Text>
                </View>
              </View>
            ))}

            <View style={styles.outfitActions}>
              <Pressable onPress={regenerate} style={styles.outfitActionBtn}>
                <Ionicons name="refresh" size={16} color={C.accent} />
                <Text style={styles.outfitActionText}>Try another</Text>
              </Pressable>
              <Pressable
                style={styles.outfitFeedbackBtn}
                onPress={() => router.push({ pathname: '/outfit/feedback', params: { outfitId } })}
              >
                <Text style={styles.outfitFeedbackText}>Rate this look</Text>
                <Ionicons name="chevron-forward" size={14} color="#FFF" />
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {wardrobe.length === 0 && (
        <Pressable style={styles.wardrobePrompt} onPress={() => router.push('/(tabs)/wardrobe')}>
          <View style={styles.wardrobePromptIcon}>
            <Ionicons name="shirt-outline" size={24} color={C.accent} />
          </View>
          <View style={styles.wardrobePromptText}>
            <Text style={styles.wardrobePromptTitle}>Add wardrobe items</Text>
            <Text style={styles.wardrobePromptSub}>Outfit suggestions improve with your actual wardrobe</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={C.muted} />
        </Pressable>
      )}

      {topGap && (
        <View style={styles.gapCard}>
          <View style={styles.gapBadge}>
            <Text style={styles.gapBadgeText}>{topGap.priority === 'high' ? 'Priority gap' : 'Suggested'}</Text>
          </View>
          <Text style={styles.gapTitle}>{topGap.title}</Text>
          <Text style={styles.gapDesc}>{topGap.description}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  scroll: { paddingHorizontal: 20, gap: 20 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { fontFamily: 'Inter_700Bold', fontSize: 26, color: C.primary, lineHeight: 32 },
  date: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textSecondary, marginTop: 2 },
  notifBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  toneCard: { backgroundColor: C.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border, gap: 10 },
  toneHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toneLabel: { fontFamily: 'Inter_500Medium', fontSize: 12, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8 },
  toneName: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: C.accent },
  swatches: { flexDirection: 'row', gap: 6 },
  swatch: { flex: 1, height: 28, borderRadius: 8 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 22, color: C.primary },
  sectionSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textSecondary, marginTop: -12 },
  selectorGroup: { gap: 10 },
  selectorLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: C.primary },
  selectorRow: { paddingRight: 20, gap: 8 },
  pill: { borderWidth: 1.5, borderColor: C.border, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: C.white },
  pillActive: { borderColor: C.accent, backgroundColor: C.accentLight },
  pillText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: C.secondary },
  pillTextActive: { color: C.accent },
  generateBtn: {
    backgroundColor: C.accent, borderRadius: 14, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  generateBtnDisabled: { opacity: 0.4 },
  generateBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#FFF' },
  outfitCard: { borderRadius: 20, overflow: 'hidden' },
  outfitCardGrad: { ...StyleSheet.absoluteFillObject },
  outfitCardContent: { padding: 20, gap: 14 },
  outfitCardHeader: { gap: 4 },
  outfitCardTitle: { fontFamily: 'Inter_700Bold', fontSize: 20, color: '#F5F0E8' },
  outfitCardSub: { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(245,240,232,0.5)' },
  outfitRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  outfitRowIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(193,123,88,0.15)', alignItems: 'center', justifyContent: 'center' },
  outfitRowText: { flex: 1 },
  outfitRowLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, color: 'rgba(245,240,232,0.4)', textTransform: 'uppercase', letterSpacing: 0.8 },
  outfitRowValue: { fontFamily: 'Inter_500Medium', fontSize: 15, color: '#F5F0E8', marginTop: 1 },
  outfitActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, paddingTop: 14, borderTopWidth: 1, borderTopColor: 'rgba(245,240,232,0.1)' },
  outfitActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  outfitActionText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: C.accent },
  outfitFeedbackBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.accent, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  outfitFeedbackText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: '#FFF' },
  wardrobePrompt: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border },
  wardrobePromptIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: C.accentLight, alignItems: 'center', justifyContent: 'center' },
  wardrobePromptText: { flex: 1, gap: 3 },
  wardrobePromptTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: C.primary },
  wardrobePromptSub: { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.textSecondary },
  gapCard: { backgroundColor: C.cardAlt, borderRadius: 16, padding: 18, gap: 8, borderWidth: 1, borderColor: C.border },
  gapBadge: { alignSelf: 'flex-start', backgroundColor: C.accentLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  gapBadgeText: { fontFamily: 'Inter_500Medium', fontSize: 11, color: C.accent, textTransform: 'uppercase', letterSpacing: 0.8 },
  gapTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: C.primary },
  gapDesc: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textSecondary, lineHeight: 20 },
});
