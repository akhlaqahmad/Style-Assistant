import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import Avatar from '@/components/Avatar';

const MEASUREMENT_LABELS = [
  { key: 'heightCm', label: 'Height', unit: 'cm' },
  { key: 'shoulderWidth', label: 'Shoulders', unit: 'cm' },
  { key: 'bust', label: 'Bust', unit: 'cm' },
  { key: 'waist', label: 'Waist', unit: 'cm' },
  { key: 'hips', label: 'Hips', unit: 'cm' },
  { key: 'inseam', label: 'Inseam', unit: 'cm' },
] as const;

export default function ResultScreen() {
  const insets = useSafeAreaInsets();
  const { avatarProfile, updateAvatarProfile } = useApp();

  function handleSave() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    updateAvatarProfile({ avatarGenerated: true });
    router.replace('/(tabs)/profile');
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Your Avatar</Text>
        <View style={styles.stepBadge}>
          <Text style={styles.stepText}>3/3</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.avatarWrap}>
          <Avatar
            shoulderWidth={avatarProfile.shoulderWidth}
            bust={avatarProfile.bust}
            waist={avatarProfile.waist}
            hips={avatarProfile.hips}
            inseam={avatarProfile.inseam}
            skinTone={avatarProfile.skinTone}
            height={280}
          />
        </Animated.View>

        {avatarProfile.bodyShape ? (
          <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.shapeBadge}>
            <Ionicons name="body-outline" size={16} color={C.accent} />
            <Text style={styles.shapeText}>{avatarProfile.bodyShape} body shape</Text>
          </Animated.View>
        ) : null}

        <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.measureGrid}>
          {MEASUREMENT_LABELS.map(m => {
            const val = avatarProfile[m.key];
            return (
              <View key={m.key} style={styles.measureItem}>
                <Text style={styles.measureVal}>{val || '—'}</Text>
                <Text style={styles.measureLabel}>{m.label}</Text>
              </View>
            );
          })}
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.delay(700).duration(500)} style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 24) }]}>
        <Pressable
          style={({ pressed }) => [styles.saveBtn, { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }]}
          onPress={handleSave}
        >
          <Ionicons name="checkmark-circle" size={20} color="#FFF" />
          <Text style={styles.saveBtnText}>Save avatar</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: C.primary },
  stepBadge: { backgroundColor: C.accentLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  stepText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: C.accent },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 24 },
  avatarWrap: { width: 200, height: 300, alignItems: 'center', justifyContent: 'center', backgroundColor: C.white, borderRadius: 24, borderWidth: 1, borderColor: C.border },
  shapeBadge: { flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: C.accentLight, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 },
  shapeText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: C.accent },
  measureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  measureItem: { width: '30%' as any, backgroundColor: C.white, borderRadius: 12, padding: 12, alignItems: 'center', gap: 3, borderWidth: 1, borderColor: C.border },
  measureVal: { fontFamily: 'Inter_700Bold', fontSize: 20, color: C.primary },
  measureLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.6 },
  footer: { paddingHorizontal: 20, paddingTop: 16 },
  saveBtn: { backgroundColor: C.accent, borderRadius: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  saveBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#FFF' },
});
