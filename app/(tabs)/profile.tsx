import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { userProfile, toneProfile, bodyProfile, avatarProfile, wardrobe, outfits, feedback, trips, bookings, updateUserProfile } = useApp();

  async function resetApp() {
    Alert.alert(
      'Reset profile',
      'This will delete all your data and restart the onboarding. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            updateUserProfile({ onboardingComplete: false });
            router.replace('/onboarding');
          }
        }
      ]
    );
  }

  const toneName = toneProfile.toneType ? toneProfile.toneType.charAt(0).toUpperCase() + toneProfile.toneType.slice(1) + ' tones' : 'Not set';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.scroll,
        { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 16), paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 100) }
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userProfile.name ? userProfile.name[0].toUpperCase() : '✦'}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{userProfile.name || 'Style enthusiast'}</Text>
          <Text style={styles.profileSub}>{userProfile.ageRange || ''} {userProfile.gender ? `· ${userProfile.gender}` : ''}</Text>
          {userProfile.preferredStyles.length > 0 && (
            <Text style={styles.profileStyles}>{userProfile.preferredStyles.slice(0, 2).join(' · ')}</Text>
          )}
        </View>
      </View>

      {toneProfile.toneType ? (
        <View style={styles.paletteCard}>
          <Text style={styles.paletteLabel}>{toneName}</Text>
          <View style={styles.swatches}>
            {toneProfile.palette.map((c, i) => <View key={i} style={[styles.swatch, { backgroundColor: c }]} />)}
          </View>
          <Text style={styles.paletteGuidance} numberOfLines={3}>{toneProfile.guidance}</Text>
        </View>
      ) : null}

      <View style={styles.statsGrid}>
        {[
          { label: 'Items', value: wardrobe.length },
          { label: 'Outfits', value: outfits.length },
          { label: 'Feedback', value: feedback.length },
          { label: 'Trips', value: trips.length },
        ].map(s => (
          <View key={s.label} style={styles.statCard}>
            <Text style={styles.statNum}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <Section title="Body & Avatar">
        <Row
          icon="scan-outline"
          label={avatarProfile.avatarGenerated ? 'Body scan complete' : 'Body scan'}
          value={avatarProfile.avatarGenerated ? avatarProfile.bodyShape : 'Set up'}
          onPress={() => router.push('/body-scan')}
        />
        {avatarProfile.avatarGenerated && (
          <Row
            icon="shirt-outline"
            label="Virtual try-on"
            value={`${wardrobe.length} items`}
            onPress={() => router.push('/try-on')}
          />
        )}
      </Section>

      <Section title="Style profile">
        <Row icon="color-palette-outline" label="Colour palette" value={toneName} />
        <Row icon="body-outline" label="Body guidance" value={bodyProfile.silhouetteGuidance.length > 0 ? `${bodyProfile.silhouetteGuidance.length} tips` : 'Set up'} />
        <Row icon="pricetag-outline" label="Preferred styles" value={userProfile.preferredStyles.slice(0, 2).join(', ') || 'Not set'} />
        <Row icon="wallet-outline" label="Budget range" value={userProfile.budgetRange || 'Not set'} />
      </Section>

      <Section title="Wardrobe insights">
        <Row icon="shirt-outline" label="Total items" value={`${wardrobe.length}`} />
        <Row icon="heart-outline" label="Favourites" value={`${wardrobe.filter(i => i.favourite).length}`} />
        <Row icon="trash-outline" label="To donate" value={`${wardrobe.filter(i => i.tag === 'donate').length}`} />
      </Section>

      <Section title="Settings">
        <Row icon="notifications-outline" label="Night reminders" value={userProfile.nightReminders ? 'On' : 'Off'} />
        <Row icon="partly-sunny-outline" label="Weather-aware planning" value={userProfile.weatherAware ? 'On' : 'Off'} />
        <Row icon="happy-outline" label="Mood tracking" value={userProfile.moodTracking ? 'On' : 'Off'} />
        <Row icon="chatbubble-outline" label="Feedback prompts" value={userProfile.feedbackPrompts ? 'On' : 'Off'} />
      </Section>

      {bookings.length > 0 && (
        <Section title="Bookings">
          {bookings.map(b => (
            <View key={b.id} style={styles.bookingRow}>
              <Text style={styles.bookingDate}>{new Date(b.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} at {b.time}</Text>
              <View style={[styles.bookingStatus, { backgroundColor: b.status === 'confirmed' ? C.successLight : C.warningLight }]}>
                <Text style={[styles.bookingStatusText, { color: b.status === 'confirmed' ? C.success : C.warning }]}>{b.status}</Text>
              </View>
            </View>
          ))}
        </Section>
      )}

      <Section title="">
        <Row icon="refresh-outline" label="Reset profile" onPress={resetApp} danger />
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  scroll: { paddingHorizontal: 20, gap: 16 },
  profileCard: { flexDirection: 'row', gap: 16, alignItems: 'center', backgroundColor: C.white, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: C.border },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: C.accentLight, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: 'Inter_700Bold', fontSize: 24, color: C.accent },
  profileInfo: { flex: 1, gap: 3 },
  profileName: { fontFamily: 'Inter_700Bold', fontSize: 20, color: C.primary },
  profileSub: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textSecondary },
  profileStyles: { fontFamily: 'Inter_500Medium', fontSize: 12, color: C.accent, textTransform: 'capitalize' },
  paletteCard: { backgroundColor: C.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border, gap: 10 },
  paletteLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: C.primary },
  swatches: { flexDirection: 'row', gap: 6 },
  swatch: { flex: 1, height: 24, borderRadius: 6 },
  paletteGuidance: { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.textSecondary, lineHeight: 19 },
  statsGrid: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, backgroundColor: C.white, borderRadius: 14, padding: 12, alignItems: 'center', gap: 3, borderWidth: 1, borderColor: C.border },
  statNum: { fontFamily: 'Inter_700Bold', fontSize: 24, color: C.primary },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.muted },
  section: { gap: 8 },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8, paddingHorizontal: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.white, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.border },
  rowIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.accentLight, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 15, color: C.primary },
  rowValue: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.muted },
  bookingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.white, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: C.border },
  bookingDate: { fontFamily: 'Inter_500Medium', fontSize: 14, color: C.primary },
  bookingStatus: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  bookingStatusText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, textTransform: 'capitalize' },
});
