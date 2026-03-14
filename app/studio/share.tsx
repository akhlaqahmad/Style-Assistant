import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch, Alert, Share, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

const CATEGORIES = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Knitwear', 'Activewear', 'Loungewear', 'Shoes', 'Bags', 'Accessories', 'Jewellery', 'Occasionwear'];
const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  'Tops': 'shirt-outline',
  'Bottoms': 'layers-outline',
  'Dresses': 'body-outline',
  'Outerwear': 'cloudy-night-outline',
  'Knitwear': 'shirt-outline',
  'Activewear': 'bicycle-outline',
  'Loungewear': 'home-outline',
  'Shoes': 'footsteps-outline',
  'Bags': 'briefcase-outline',
  'Accessories': 'glasses-outline',
  'Jewellery': 'diamond-outline',
  'Occasionwear': 'sparkles-outline',
};

export default function ShareWardrobeScreen() {
  const { userProfile } = useApp();
  const [viewAll, setViewAll] = useState(true);
  const [shareAllCategories, setShareAllCategories] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(CATEGORIES);
  const [expiresIn, setExpiresIn] = useState(7); // days
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(prev => prev.filter(c => c !== category));
    } else {
      setSelectedCategories(prev => [...prev, category]);
    }
  };

  const generateLink = async () => {
    // In a real app, we would call the backend API with the selected options
    // const res = await fetch('/api/stylist-links', {
    //   body: JSON.stringify({
    //     viewHidden: viewAll,
    //     categories: shareAllCategories ? 'all' : selectedCategories,
    //     expiresIn
    //   })
    // });
    
    // Mocking the link generation for now as we might not have a running backend
    const mockToken = Math.random().toString(36).substring(2, 10);
    const link = `https://style-assistant.app/stylist-access/${mockToken}`;
    setGeneratedLink(link);
  };

  const shareLink = async () => {
    if (!generatedLink) return;
    try {
      await Share.share({
        message: `Here is access to my digital wardrobe: ${generatedLink}`,
      });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={24} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Share Wardrobe</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>
          Create a secure, temporary link for your stylist to view your wardrobe.
        </Text>

        <View style={styles.optionRow}>
          <View>
            <Text style={styles.optionTitle}>View All Items</Text>
            <Text style={styles.optionSubtitle}>Stylist can see all garments including hidden ones</Text>
          </View>
          <Switch
            value={viewAll}
            onValueChange={setViewAll}
            trackColor={{ false: C.border, true: C.accent }}
          />
        </View>

        <View style={styles.optionRow}>
          <View>
            <Text style={styles.optionTitle}>Shared Categories</Text>
            <Text style={styles.optionSubtitle}>
              {shareAllCategories 
                ? 'Stylist can see all wardrobe categories' 
                : `Stylist can see ${selectedCategories.length} selected categories`}
            </Text>
          </View>
          <Switch
            value={shareAllCategories}
            onValueChange={setShareAllCategories}
            trackColor={{ false: C.border, true: C.accent }}
          />
        </View>

        {!shareAllCategories && (
          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategories.includes(cat);
              const iconName = CATEGORY_ICONS[cat] || 'shirt-outline';
              return (
                <Pressable 
                  key={cat} 
                  onPress={() => toggleCategory(cat)}
                  style={[
                    styles.categoryPill, 
                    isSelected && styles.categoryPillSelected
                  ]}
                >
                  <Ionicons 
                    name={iconName} 
                    size={16} 
                    color={isSelected ? C.accent : C.textSecondary} 
                  />
                  <Text style={[
                    styles.categoryText, 
                    isSelected && styles.categoryTextSelected
                  ]}>
                    {cat}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkIcon}>
                      <Ionicons name="checkmark-circle" size={14} color={C.accent} />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        )}

        <View style={styles.optionRow}>
           <View>
            <Text style={styles.optionTitle}>Expiration</Text>
            <Text style={styles.optionSubtitle}>Link expires after {expiresIn} days</Text>
          </View>
          <View style={styles.daysControl}>
            <Pressable onPress={() => setExpiresIn(Math.max(1, expiresIn - 1))} style={styles.controlBtn}>
              <Ionicons name="remove" size={20} color={C.primary} />
            </Pressable>
            <Text style={styles.daysText}>{expiresIn}d</Text>
            <Pressable onPress={() => setExpiresIn(Math.min(30, expiresIn + 1))} style={styles.controlBtn}>
              <Ionicons name="add" size={20} color={C.primary} />
            </Pressable>
          </View>
        </View>

        {generatedLink ? (
          <View style={styles.linkContainer}>
            <Text style={styles.linkTitle}>Secure Link Generated</Text>
            <Text style={styles.linkText}>{generatedLink}</Text>
            <Pressable onPress={shareLink} style={styles.shareButton}>
              <Ionicons name="share-outline" size={20} color="#FFF" />
              <Text style={styles.shareButtonText}>Share Link</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={generateLink} style={styles.generateButton}>
            <Text style={styles.generateButtonText}>Generate Access Link</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  headerTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold', color: C.primary },
  backButton: { padding: 8 },
  content: { padding: 20, gap: 24 },
  description: { fontSize: 15, color: C.textSecondary, lineHeight: 22, fontFamily: 'Inter_400Regular' },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: C.card, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: C.border },
  optionTitle: { fontSize: 16, fontFamily: 'Inter_500Medium', color: C.primary },
  optionSubtitle: { fontSize: 13, fontFamily: 'Inter_400Regular', color: C.muted, marginTop: 4, maxWidth: 200 },
  daysControl: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  controlBtn: { padding: 8, backgroundColor: C.cardAlt, borderRadius: 8 },
  daysText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: C.primary, minWidth: 30, textAlign: 'center' },
  generateButton: { backgroundColor: C.accent, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  generateButtonText: { color: '#FFF', fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  linkContainer: { backgroundColor: C.accentLight, padding: 20, borderRadius: 16, alignItems: 'center', gap: 12, marginTop: 20 },
  linkTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: C.accent },
  linkText: { fontSize: 14, fontFamily: 'Inter_400Regular', color: C.primary, textAlign: 'center' },
  shareButton: { flexDirection: 'row', backgroundColor: C.accent, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, gap: 8, alignItems: 'center' },
  shareButtonText: { color: '#FFF', fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: -12, paddingBottom: 8 },
  categoryPill: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  categoryPillSelected: { borderColor: C.accent, backgroundColor: C.accentLight },
  categoryText: { fontSize: 14, fontFamily: 'Inter_500Medium', color: C.textSecondary },
  categoryTextSelected: { color: C.accent },
  checkIcon: { marginLeft: 4 },
});
