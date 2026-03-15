import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/constants/colors';
import { useApp, Stylist } from '@/context/AppContext';

const FILTERS = ['All', 'Colour Analysis Review', 'Style Consultation', 'Style Studio Edit', 'Event Styling'];

function StarRow({ rating }: { rating: number }) {
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map(i => (
        <Ionicons key={i} name={i <= Math.floor(rating) ? 'star' : 'star-outline'} size={12} color="#D4A96A" />
      ))}
    </View>
  );
}

function StylistCard({ stylist, onPress }: { stylist: Stylist; onPress: () => void }) {
  const { formatPrice } = useApp();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, { opacity: pressed ? 0.85 : 1 }]}>
      <View style={styles.cardTop}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{stylist.avatar}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{stylist.name}</Text>
          <Text style={styles.cardSpec}>{stylist.specialty}</Text>
          <View style={styles.ratingRow}>
            <StarRow rating={stylist.rating} />
            <Text style={styles.ratingNum}>{stylist.rating}</Text>
            <Text style={styles.reviewCount}>({stylist.reviewCount})</Text>
          </View>
        </View>
        <View style={styles.priceBadge}>
          <Text style={styles.priceNum}>{formatPrice(stylist.pricing)}</Text>
          <Text style={styles.priceUnit}>/{stylist.pricingUnit}</Text>
        </View>
      </View>

      <Text style={styles.bio} numberOfLines={2}>{stylist.bio}</Text>

      <View style={styles.cardFooter}>
        <View style={styles.tags}>
          {stylist.tags.slice(0, 2).map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <View style={styles.availability}>
          <Ionicons name="calendar-outline" size={12} color={C.success} />
          <Text style={styles.availText}>{stylist.availability.join(' · ')}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const { stylists, bookings } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? stylists
    : stylists; // For now, show all stylists as filters don't map to tags yet

  const myBookings = bookings.length;

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Style Experts</Text>
        </View>
        {myBookings > 0 && (
          <View style={styles.bookingsBadge}>
            <Text style={styles.bookingsBadgeText}>{myBookings} booking{myBookings !== 1 ? 's' : ''}</Text>
          </View>
        )}
      </View>

      <View style={styles.introContainer}>
        <Text style={styles.introText}>
          StylistA already creates personalised styling recommendations based on your proportions, colouring and preferences.
        </Text>
        <Text style={[styles.introText, { marginTop: 8 }]}>
          If you’d like additional inspiration or a second opinion, you can connect with professional stylists and colour experts.
        </Text>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <Pressable
            key={f}
            onPress={() => setActiveFilter(f)}
            style={[styles.filterPill, activeFilter === f && styles.filterPillActive]}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={s => s.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 100) }]}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <StylistCard
            stylist={item}
            onPress={() => router.push({ pathname: '/stylists/[id]', params: { id: item.id } })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 30, color: C.primary },
  introContainer: { paddingHorizontal: 20, paddingBottom: 16 },
  introText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textSecondary, lineHeight: 21 },
  bookingsBadge: { backgroundColor: C.accentLight, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  bookingsBadgeText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: C.accent },
  featuredBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 20, backgroundColor: C.accentLight, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 4 },
  featuredText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: C.accent },
  filterRow: { flexDirection: 'row', gap: 8, paddingBottom: 16, flexWrap: 'wrap', paddingHorizontal: 20 },
  filterPill: { borderWidth: 1.5, borderColor: C.border, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: C.white },
  filterPillActive: { borderColor: C.accent, backgroundColor: C.accentLight },
  filterText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: C.secondary },
  filterTextActive: { color: C.accent },
  list: { paddingHorizontal: 20, paddingTop: 8 },
  card: { backgroundColor: C.white, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: C.border, gap: 12 },
  cardTop: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: C.accentLight, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: 'Inter_700Bold', fontSize: 16, color: C.accent },
  cardInfo: { flex: 1, gap: 3 },
  cardName: { fontFamily: 'Inter_700Bold', fontSize: 17, color: C.primary },
  cardSpec: { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.textSecondary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  stars: { flexDirection: 'row', gap: 2 },
  ratingNum: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: C.primary },
  reviewCount: { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.muted },
  priceBadge: { alignItems: 'flex-end' },
  priceNum: { fontFamily: 'Inter_700Bold', fontSize: 18, color: C.primary },
  priceUnit: { fontFamily: 'Inter_400Regular', fontSize: 11, color: C.muted },
  bio: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textSecondary, lineHeight: 20 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tags: { flexDirection: 'row', gap: 6 },
  tag: { backgroundColor: C.cardAlt, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontFamily: 'Inter_500Medium', fontSize: 11, color: C.secondary },
  availability: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  availText: { fontFamily: 'Inter_500Medium', fontSize: 11, color: C.success },
});
