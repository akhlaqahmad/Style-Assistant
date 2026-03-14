import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Alert, Switch } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ icon, label, value, onPress, danger }: { icon: string; label: string; value?: string; onPress?: () => void; danger?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, { opacity: onPress && pressed ? 0.7 : 1 }]}
      disabled={!onPress}
    >
      <View style={[styles.rowIcon, danger && { backgroundColor: C.dangerLight }]}>
        <Ionicons name={icon as any} size={18} color={danger ? C.danger : C.accent} />
      </View>
      <Text style={[styles.rowLabel, danger && { color: C.danger }]}>{label}</Text>
      {value && <Text style={styles.rowValue}>{value}</Text>}
      {onPress && <Ionicons name="chevron-forward" size={16} color={C.muted} />}
    </Pressable>
  );
}

function SwitchRow({ icon, label, value, onValueChange }: { icon: string; label: string; value: boolean; onValueChange: (val: boolean) => void }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon as any} size={18} color={C.accent} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch
        trackColor={{ false: C.border, true: C.accent }}
        thumbColor={C.primary}
        ios_backgroundColor={C.cardAlt}
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { wardrobe, userProfile, updateUserProfile } = useApp();
  const [loadingImage, setLoadingImage] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to grant camera roll permissions to change your profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setLoadingImage(true);
      // Simulate upload delay or processing
      setTimeout(() => {
        updateUserProfile({ profileImage: result.assets[0].uri });
        setLoadingImage(false);
      }, 500);
    }
  };

  const signaturePieces = useMemo(() => {
    if (wardrobe.length === 0) return 'None';
    const categories = wardrobe.map(i => i.category);
    const counts = categories.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.slice(0, 3).map(i => i[0]).join(', ');
  }, [wardrobe]);

  const stylingPotential = wardrobe.length * 3;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 20 : 10) }]}>
        <Text style={styles.headerTitle}>Your Style Identity</Text>
        <Pressable onPress={() => router.push('/settings' as any)} hitSlop={10}>
          <View style={styles.settingsBtn}>
            <Ionicons name="settings-outline" size={24} color={C.primary} />
          </View>
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: 20, paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 100) }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <Pressable onPress={pickImage} style={({ pressed }) => [styles.avatarContainer, pressed && { opacity: 0.8 }]}>
            {userProfile.profileImage ? (
              <Image source={{ uri: userProfile.profileImage }} style={styles.avatar} contentFit="cover" transition={200} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>{userProfile.name ? userProfile.name[0].toUpperCase() : 'U'}</Text>
              </View>
            )}
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={14} color={C.background} />
            </View>
          </Pressable>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userProfile.name || 'Style Enthusiast'}</Text>
            <Text style={styles.profileBio}>Ready to elevate your wardrobe?</Text>
          </View>
        </View>

        <Section title="Style Identity">
        <Row
          icon="body-outline"
          label="Fit Profile"
          value="Body details"
          onPress={() => router.push('/body-scan/result')}
        />
        <Row
          icon="color-palette-outline"
          label="Colour Profile"
          value="Tone analysis"
          onPress={() => router.push('/onboarding/tone-analysis/result')}
        />
        <Row
          icon="shirt-outline"
          label="Personal Style"
          value="Preferences"
          onPress={() => router.push('/onboarding/styles')}
        />
        <Row
          icon="heart-outline"
          label="Celebrate Your Body"
          value="Loves"
          onPress={() => router.push('/onboarding/loves')}
        />
      </Section>

      <Section title="Style Insights">
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{wardrobe.length}</Text>
            <Text style={styles.statLabel}>Your Collection</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{stylingPotential}</Text>
            <Text style={styles.statLabel}>Styling Potential</Text>
          </View>
        </View>
        <View style={styles.signatureCard}>
          <Text style={styles.signatureLabel}>Signature Pieces</Text>
          <Text style={styles.signatureValue}>{signaturePieces}</Text>
        </View>
      </Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { 
    paddingHorizontal: 20, 
    paddingBottom: 12, 
    backgroundColor: C.background, 
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  scroll: { paddingHorizontal: 20, gap: 24 },
  headerTitle: { fontFamily: 'Inter_700Bold', fontSize: 28, color: C.primary },
  settingsBtn: { width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(245,240,232,0.06)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  section: { gap: 12 },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8, paddingHorizontal: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.white, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.border },
  rowIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.accentLight, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 15, color: C.primary },
  rowValue: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.muted },
  statsGrid: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, backgroundColor: C.white, borderRadius: 14, padding: 16, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: C.border },
  statNum: { fontFamily: 'Inter_700Bold', fontSize: 24, color: C.primary },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.muted },
  signatureCard: { backgroundColor: C.white, borderRadius: 14, padding: 16, gap: 4, borderWidth: 1, borderColor: C.border },
  signatureLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.muted },
  signatureValue: { fontFamily: 'Inter_500Medium', fontSize: 16, color: C.primary },
  
  // Profile Header
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: C.cardAlt },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: C.cardAlt, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: C.border },
  avatarInitial: { fontFamily: 'Inter_700Bold', fontSize: 32, color: C.accent },
  editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: C.primary, width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: C.background },
  profileInfo: { flex: 1, gap: 4 },
  profileName: { fontFamily: 'Inter_700Bold', fontSize: 20, color: C.primary },
  profileBio: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textSecondary },
});
