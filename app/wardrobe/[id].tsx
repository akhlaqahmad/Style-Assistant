import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

const TAG_CONFIG = {
  keep: { label: 'Keep', color: C.success, bg: C.successLight, icon: 'checkmark-circle' },
  review: { label: 'Review', color: C.warning, bg: C.warningLight, icon: 'time' },
  donate: { label: 'Donate', color: C.danger, bg: C.dangerLight, icon: 'heart' },
};

export default function WardrobeItemDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { wardrobe, updateWardrobeItem, removeWardrobeItem } = useApp();
  const item = wardrobe.find(i => i.id === id);

  if (!item) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Item not found</Text>
        <Pressable onPress={() => router.back()}><Text style={styles.back}>Go back</Text></Pressable>
      </View>
    );
  }

  const tag = TAG_CONFIG[item.tag];

  function toggleFavourite() {
    if (!item) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateWardrobeItem(id, { favourite: !item.favourite });
  }

  function toggleHidden() {
    if (!item) return;
    updateWardrobeItem(id, { hidden: !item.hidden });
  }

  function setTag(t: 'keep' | 'review' | 'donate') {
    if (!item) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateWardrobeItem(id, { tag: t });
  }

  function confirmDelete() {
    Alert.alert(
      'Remove item',
      'This will permanently remove this item from your wardrobe.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => { removeWardrobeItem(id); router.back(); } }
      ]
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>{item.category}</Text>
        <Pressable onPress={toggleFavourite} hitSlop={12}>
          <Ionicons name={item.favourite ? 'heart' : 'heart-outline'} size={24} color={item.favourite ? C.accent : C.muted} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 40) }]} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          {item.image ? (
            <Image source={item.image} style={styles.itemImage} contentFit="cover" transition={200} />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: item.colour || C.cardAlt }]}>
              <Ionicons name="shirt-outline" size={60} color="rgba(255,255,255,0.2)" />
            </View>
          )}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{item.subCategory || item.category}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.infoRow}>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Brand</Text>
              <Text style={styles.infoValue}>{item.brand || '—'}</Text>
            </View>
            {item.notes ? (
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Notes</Text>
                <Text style={styles.infoValue}>{item.notes}</Text>
              </View>
            ) : null}
          </View>

          {/* Detailed Attributes Section */}
          <View style={styles.section}>
             <Text style={styles.sectionTitle}>Details</Text>
             <View style={styles.attributesGrid}>
               {item.fabric && <DetailItem label="Fabric" value={item.fabric} />}
               {item.pattern && <DetailItem label="Pattern" value={item.pattern} />}
               {item.style && <DetailItem label="Style" value={item.style} />}
               {item.fit && <DetailItem label="Fit" value={item.fit} />}
               {item.sleeveLength && <DetailItem label="Sleeve" value={item.sleeveLength} />}
               {item.neckline && <DetailItem label="Neckline" value={item.neckline} />}
               {item.genderCategory && <DetailItem label="Gender" value={item.genderCategory} />}
             </View>

             {/* Measurements */}
             {item.measurements && (
                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>Measurements</Text>
                  <View style={styles.attributesGrid}>
                    {Object.entries(item.measurements).map(([key, val]) => (
                      <View key={key} style={styles.detailItem}>
                        <Text style={styles.detailLabel}>{key}</Text>
                        <Text style={styles.detailValue}>{val as string}</Text>
                      </View>
                    ))}
                  </View>
                </View>
             )}

             {/* Care Instructions */}
             {item.careInstructions && (
               <View style={styles.infoBlock}>
                 <Text style={styles.infoLabel}>Care Instructions</Text>
                 <Text style={styles.infoValue}>{item.careInstructions}</Text>
               </View>
             )}

             {/* Color Palette */}
             {item.colourPalette && item.colourPalette.length > 0 && (
                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>Color Palette</Text>
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                    {item.colourPalette.map((c, i) => (
                      <View key={i} style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: c, borderWidth: 1, borderColor: C.border }} />
                    ))}
                  </View>
                </View>
             )}

             {item.features && item.features.length > 0 && (
               <View style={styles.infoBlock}>
                 <Text style={styles.infoLabel}>Features</Text>
                 <View style={styles.featuresRow}>
                   {item.features.map((f, i) => (
                     <View key={i} style={styles.featureChip}>
                       <Text style={styles.featureText}>{f}</Text>
                     </View>
                   ))}
                 </View>
               </View>
             )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wardrobe status</Text>
            <View style={styles.tagRow}>
              {(['keep', 'review', 'donate'] as const).map(t => {
                const cfg = TAG_CONFIG[t];
                return (
                  <Pressable
                    key={t}
                    onPress={() => setTag(t)}
                    style={[styles.tagBtn, item.tag === t && { borderColor: cfg.color, backgroundColor: cfg.bg }]}
                  >
                    <Ionicons name={cfg.icon as any} size={16} color={item.tag === t ? cfg.color : C.muted} />
                    <Text style={[styles.tagBtnText, item.tag === t && { color: cfg.color }]}>{cfg.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Outfit suggestions</Text>
            <Pressable style={styles.toggleRow} onPress={toggleHidden}>
              <Ionicons name={item.hidden ? 'eye-off-outline' : 'eye-outline'} size={20} color={item.hidden ? C.muted : C.accent} />
              <Text style={[styles.toggleText, item.hidden && { color: C.muted }]}>
                {item.hidden ? 'Hidden from suggestions' : 'Included in suggestions'}
              </Text>
            </Pressable>
          </View>

          <Pressable
            style={styles.tryOnBtn}
            onPress={() => router.push({ pathname: '/try-on', params: { preselect: id } })}
          >
            <Ionicons name="body-outline" size={18} color="#FFF" />
            <Text style={styles.tryOnBtnText}>Try on avatar</Text>
          </Pressable>

          <Pressable style={styles.deleteBtn} onPress={confirmDelete}>
            <Ionicons name="trash-outline" size={18} color={C.danger} />
            <Text style={styles.deleteBtnText}>Remove from wardrobe</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  notFoundText: { fontFamily: 'Inter_600SemiBold', fontSize: 18, color: C.primary },
  back: { fontFamily: 'Inter_500Medium', fontSize: 15, color: C.accent },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: C.primary, textTransform: 'capitalize', flex: 1, textAlign: 'center' },
  scroll: { gap: 0 },
  imageContainer: { height: 240, marginHorizontal: 20, borderRadius: 20, overflow: 'hidden', backgroundColor: C.cardAlt },
  itemImage: { width: '100%', height: '100%' },
  imagePlaceholder: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  categoryBadge: { position: 'absolute', bottom: 12, left: 12, backgroundColor: 'rgba(15,13,11,0.85)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  categoryBadgeText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#F5F0E8', textTransform: 'capitalize' },
  content: { padding: 20, gap: 24 },
  infoRow: { gap: 14 },
  infoBlock: { gap: 4 },
  infoLabel: { fontFamily: 'Inter_500Medium', fontSize: 12, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8 },
  infoValue: { fontFamily: 'Inter_500Medium', fontSize: 16, color: C.primary },
  section: { gap: 12 },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: C.primary },
  attributesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  detailItem: { width: '48%', backgroundColor: C.white, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: C.border, gap: 4 },
  detailLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, color: C.muted, textTransform: 'uppercase' },
  detailValue: { fontFamily: 'Inter_500Medium', fontSize: 14, color: C.primary },
  featuresRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  featureChip: { backgroundColor: C.background, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: C.border },
  featureText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: C.textSecondary },
  tagRow: { flexDirection: 'row', gap: 10 },
  tagBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1.5, borderColor: C.border, borderRadius: 12, paddingVertical: 12, backgroundColor: C.white },
  tagBtnText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: C.muted },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.white, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: C.border },
  toggleText: { fontFamily: 'Inter_500Medium', fontSize: 15, color: C.accent },
  tryOnBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.accent, borderRadius: 12, paddingVertical: 14 },
  tryOnBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#FFF' },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.dangerLight, borderRadius: 12, paddingVertical: 14, borderWidth: 1, borderColor: C.danger + '30' },
  deleteBtnText: { fontFamily: 'Inter_500Medium', fontSize: 15, color: C.danger },
});
