import React from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { C } from '@/constants/colors';
import { useApp, Trip } from '@/context/AppContext';

const TRIP_TYPE_ICONS: Record<string, string> = {
  beach: 'sunny-outline',
  city: 'business-outline',
  business: 'briefcase-outline',
  mountain: 'trail-sign-outline',
  wedding: 'rose-outline',
  other: 'airplane-outline',
};

function TripCard({ trip, onPress }: { trip: Trip; onPress: () => void }) {
  const icon = (TRIP_TYPE_ICONS[trip.tripType?.toLowerCase()] || 'airplane-outline') as any;
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const nights = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.tripCard, { opacity: pressed ? 0.85 : 1 }]}>
      <View style={styles.tripCardLeft}>
        <View style={styles.tripIcon}>
          <Ionicons name={icon} size={22} color={C.accent} />
        </View>
        <View style={styles.tripInfo}>
          <Text style={styles.tripDest}>{trip.destination}</Text>
          <Text style={styles.tripDates}>
            {start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} — {end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Text>
          <View style={styles.tripMeta}>
            <View style={styles.tripMetaBadge}>
              <Text style={styles.tripMetaText}>{nights} night{nights !== 1 ? 's' : ''}</Text>
            </View>
            <View style={styles.tripMetaBadge}>
              <Text style={styles.tripMetaText}>{trip.tripType}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.tripProgress}>
        <Text style={styles.tripProgressNum}>{trip.outfitDays?.length || 0}</Text>
        <Text style={styles.tripProgressLabel}>looks</Text>
      </View>
    </Pressable>
  );
}

export default function PlannerScreen() {
  const insets = useSafeAreaInsets();
  const { trips, removeTrip } = useApp();

  const upcoming = trips.filter(t => new Date(t.startDate) >= new Date());
  const past = trips.filter(t => new Date(t.startDate) < new Date());

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Travel Planner</Text>
          <Text style={styles.subtitle}>{trips.length} trip{trips.length !== 1 ? 's' : ''} planned</Text>
        </View>
        <Pressable
          style={styles.addBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/planner/new');
          }}
        >
          <Ionicons name="add" size={24} color="#FFF" />
        </Pressable>
      </View>

      {trips.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="airplane-outline" size={40} color={C.muted} />
          </View>
          <Text style={styles.emptyTitle}>No trips planned yet</Text>
          <Text style={styles.emptySub}>Plan a trip and get day-by-day outfit suggestions with a smart packing checklist.</Text>
          <Pressable
            style={styles.emptyBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/planner/new');
            }}
          >
            <Ionicons name="add" size={18} color="#FFF" />
            <Text style={styles.emptyBtnText}>Plan a trip</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={[
            ...(upcoming.length > 0 ? [{ type: 'header', label: 'Upcoming', id: 'h1' }] : []),
            ...upcoming.map(t => ({ type: 'trip', ...t })),
            ...(past.length > 0 ? [{ type: 'header', label: 'Past trips', id: 'h2' }] : []),
            ...past.map(t => ({ type: 'trip', ...t })),
          ]}
          keyExtractor={item => item.id}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 100) }]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            if (item.type === 'header') {
              return <Text style={styles.sectionLabel}>{(item as any).label}</Text>;
            }
            return (
              <TripCard
                trip={item as Trip}
                onPress={() => router.push({ pathname: '/planner/[id]', params: { id: item.id } })}
              />
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 30, color: C.primary },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textSecondary, marginTop: 2 },
  addBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: 20, gap: 10 },
  sectionLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8, paddingTop: 8, paddingBottom: 4 },
  tripCard: { backgroundColor: C.white, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: C.border },
  tripCardLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, flex: 1 },
  tripIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: C.accentLight, alignItems: 'center', justifyContent: 'center' },
  tripInfo: { flex: 1, gap: 4 },
  tripDest: { fontFamily: 'Inter_700Bold', fontSize: 17, color: C.primary },
  tripDates: { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.textSecondary },
  tripMeta: { flexDirection: 'row', gap: 6, marginTop: 4 },
  tripMetaBadge: { backgroundColor: C.cardAlt, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  tripMetaText: { fontFamily: 'Inter_500Medium', fontSize: 11, color: C.secondary, textTransform: 'capitalize' },
  tripProgress: { alignItems: 'center', gap: 2 },
  tripProgressNum: { fontFamily: 'Inter_700Bold', fontSize: 22, color: C.accent },
  tripProgressLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: C.muted },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 14 },
  emptyIcon: { width: 80, height: 80, borderRadius: 24, backgroundColor: C.cardAlt, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 20, color: C.primary, textAlign: 'center' },
  emptySub: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textSecondary, textAlign: 'center', lineHeight: 21 },
  emptyBtn: { backgroundColor: C.accent, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  emptyBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#FFF' },
});
