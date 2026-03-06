import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import ThreeAvatar from '@/components/ThreeAvatar';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function Result3DScreen() {
  const insets = useSafeAreaInsets();
  const { avatarProfile } = useApp();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.push('/')} hitSlop={12}>
          <Ionicons name="close" size={24} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Your 3D Avatar</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <ThreeAvatar 
            measurements={{
              heightCm: avatarProfile.heightCm || 170,
              shoulderWidth: avatarProfile.shoulderWidth || 40,
              bust: avatarProfile.bust || 90,
              waist: avatarProfile.waist || 70,
              hips: avatarProfile.hips || 95,
              inseam: avatarProfile.inseam || 75,
            }} 
            skinTone={avatarProfile.skinTone} 
          />
        </View>

        <Animated.View entering={FadeInDown.delay(200)} style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="body" size={20} color={C.accent} />
            <Text style={styles.infoTitle}>Body Shape: {avatarProfile.bodyShape || 'Hourglass'}</Text>
          </View>
          <Text style={styles.infoDesc}>
            Your avatar is ready! Use it to try on clothes and get personalized style advice.
          </Text>
        </Animated.View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <Pressable style={styles.primaryBtn} onPress={() => router.push('/')}>
          <Text style={styles.primaryBtnText}>Go to Home</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn} onPress={() => router.push('/body-scan/review')}>
          <Text style={styles.secondaryBtnText}>Edit Measurements</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: C.primary },
  
  content: { flex: 1 },
  avatarContainer: { flex: 1, backgroundColor: '#F5F5F5' },
  
  infoCard: { margin: 20, padding: 20, backgroundColor: C.white, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  infoTitle: { fontSize: 16, fontWeight: '600', color: C.primary },
  infoDesc: { fontSize: 14, color: C.textSecondary, lineHeight: 20 },
  
  footer: { paddingHorizontal: 20, gap: 12 },
  primaryBtn: { backgroundColor: C.primary, paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  primaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  secondaryBtn: { paddingVertical: 16, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  secondaryBtnText: { color: C.primary, fontSize: 16, fontWeight: '600' },
});
