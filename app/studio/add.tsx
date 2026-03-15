import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Platform, Alert, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { C } from '@/constants/colors';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useApp } from '@/context/AppContext';

const CATEGORIES = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Knitwear', 'Activewear', 'Loungewear', 'Shoes', 'Bags', 'Accessories', 'Jewellery', 'Occasionwear'];
const COLOURS = ['#F5F0E8', '#C17B58', '#8B7B6B', '#2D2D2A', '#7B9BBF', '#7A9B6A', '#D4A96A', '#C0605A', '#8B5E8B', '#B8B8B0'];
const TAGS = ['keep', 'review', 'donate'] as const;

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export default function AddWardrobeItem() {
  const insets = useSafeAreaInsets();
  const { addWardrobeItem } = useApp();
  const params = useLocalSearchParams();
  const initialCategory = typeof params.initialCategory === 'string' ? params.initialCategory : '';
  
  const [category, setCategory] = useState(initialCategory);
  const [brand, setBrand] = useState('');
  const [notes, setNotes] = useState('');
  const [tag, setTag] = useState<'keep' | 'review' | 'donate'>('keep');
  const [colour, setColour] = useState(COLOURS[0]);
  const [image, setImage] = useState<string | null>(null);

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera access is needed to take photos.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  function handleSave() {
    if (!category) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addWardrobeItem({ category, image, brand, notes, tag, favourite: false, hidden: false, colour });
    router.back();
  }

  const canSave = !!category;

  const tagConfig = {
    keep: { icon: 'checkmark-circle', color: C.success, label: 'Keep' },
    review: { icon: 'time', color: C.warning, label: 'Review' },
    donate: { icon: 'heart', color: C.danger, label: 'Donate' },
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={24} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Add item</Text>
        <Pressable
          onPress={handleSave}
          disabled={!canSave}
          style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
        >
          <Text style={styles.saveBtnText}>Save</Text>
        </Pressable>
      </View>

      <KeyboardAwareScrollViewCompat contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.imageSection}>
          {image ? (
            <Pressable onPress={pickImage} style={styles.imagePreview}>
              <Image source={{ uri: image }} style={styles.imageActual} resizeMode="cover" />
              <View style={styles.imageOverlay}>
                <Text style={styles.imageChangeText}>Tap to change</Text>
              </View>
            </Pressable>
          ) : (
            <View style={styles.imagePicker}>
              <Pressable style={styles.imagePickerBtn} onPress={takePhoto}>
                <Ionicons name="camera-outline" size={22} color={C.accent} />
                <Text style={styles.imagePickerBtnText}>Take photo</Text>
              </Pressable>
              <View style={styles.imagePickerDivider} />
              <Pressable style={styles.imagePickerBtn} onPress={pickImage}>
                <Ionicons name="image-outline" size={22} color={C.accent} />
                <Text style={styles.imagePickerBtnText}>Choose from library</Text>
              </Pressable>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Category <Text style={{ color: C.accent }}>*</Text></Text>
          <View style={styles.chips}>
            {CATEGORIES.map(c => (
              <Chip key={c} label={c} selected={category === c} onPress={() => setCategory(c)} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Colour</Text>
          <View style={styles.colourRow}>
            {COLOURS.map(c => (
              <Pressable
                key={c}
                onPress={() => setColour(c)}
                style={[styles.colourSwatch, { backgroundColor: c }, colour === c && styles.colourSwatchSelected]}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Wardrobe status</Text>
          <View style={styles.tagRow}>
            {TAGS.map(t => {
              const cfg = tagConfig[t];
              return (
                <Pressable
                  key={t}
                  onPress={() => setTag(t)}
                  style={[styles.tagBtn, tag === t && { borderColor: cfg.color, backgroundColor: `${cfg.color}18` }]}
                >
                  <Ionicons name={cfg.icon as any} size={18} color={tag === t ? cfg.color : C.muted} />
                  <Text style={[styles.tagBtnText, tag === t && { color: cfg.color }]}>{cfg.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Brand or label (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Zara, H&M, vintage..."
            placeholderTextColor={C.muted}
            value={brand}
            onChangeText={setBrand}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, styles.inputMulti]}
            placeholder="Size, condition, where you wear it..."
            placeholderTextColor={C.muted}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </View>
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: C.primary },
  saveBtn: { backgroundColor: C.accent, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#FFF' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 20, gap: 24 },
  imageSection: {},
  imagePreview: { height: 250, backgroundColor: C.cardAlt, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: C.border },
  imageActual: { width: '100%', height: '100%' },
  imageOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 8, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center' },
  imageChangeText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: '#FFF' },
  imagePicker: { flexDirection: 'row', backgroundColor: C.white, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  imagePickerBtn: { flex: 1, paddingVertical: 20, alignItems: 'center', gap: 8 },
  imagePickerDivider: { width: 1, backgroundColor: C.border },
  imagePickerBtnText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: C.accent },
  section: { gap: 12 },
  label: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: C.primary },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1.5, borderColor: C.border, borderRadius: 24, paddingHorizontal: 14, paddingVertical: 9, backgroundColor: C.white },
  chipSelected: { borderColor: C.accent, backgroundColor: C.accentLight },
  chipText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: C.secondary },
  chipTextSelected: { color: C.accent },
  colourRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  colourSwatch: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: 'transparent' },
  colourSwatchSelected: { borderColor: C.primary, transform: [{ scale: 1.15 }] },
  tagRow: { flexDirection: 'row', gap: 10 },
  tagBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1.5, borderColor: C.border, borderRadius: 12, paddingVertical: 12, backgroundColor: C.white },
  tagBtnText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: C.muted },
  input: {
    borderWidth: 1.5, borderColor: C.border, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    fontFamily: 'Inter_400Regular', fontSize: 15, color: C.primary, backgroundColor: C.white,
  },
  inputMulti: { minHeight: 90, textAlignVertical: 'top' },
});
