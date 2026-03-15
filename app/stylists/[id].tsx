import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Platform, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { DatePicker } from '@/components/ui/DatePicker';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';

const TIMES = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

function StarRow({ rating }: { rating: number }) {
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map(i => (
        <Ionicons key={i} name={i <= Math.floor(rating) ? 'star' : 'star-outline'} size={16} color="#D4A96A" />
      ))}
    </View>
  );
}

export default function StylistDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { stylists, addBooking, formatPrice } = useApp();
  const stylist = stylists.find(s => s.id === id);

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingStep, setBookingStep] = useState<'browse' | 'book' | 'confirm'>('browse');
  const [booked, setBooked] = useState(false);

  if (!stylist) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Stylist not found</Text>
        <Pressable onPress={() => router.back()}><Text style={styles.backLink}>Go back</Text></Pressable>
      </View>
    );
  }

  function toggleService(service: string) {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  }

  function getTotalPrice() {
    return selectedServices.reduce((total, service) => total + getServicePrice(service), 0);
  }

  function handleBook() {
    if (!selectedDate || !selectedTime || selectedServices.length === 0) return;
    
    // Check availability
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'short' });
    if (!stylist?.availability.includes(dayName)) {
      Alert.alert('Stylist Unavailable', `This stylist is only available on ${stylist?.availability.join(', ')}.`);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Calculate total based on services
    const total = getTotalPrice();
    
    addBooking({
      stylistId: stylist!.id,
      date: selectedDate.toISOString(),
      time: selectedTime,
      notes: `Services: ${selectedServices.join(', ')}\n${notes}`,
      status: 'confirmed',
      total,
    });
    setBooked(true);
    setBookingStep('confirm');
  }

  function getServicePrice(serviceName: string) {
    if (!stylist) return 0;
    const multipliers: Record<string, number> = {
      'Colour Analysis Review': 0.8,
      'Style Consultation': 1.0,
      'Style Studio Edit': 1.5,
      'Event Styling': 1.2
    };
    return stylist.pricing * (multipliers[serviceName] || 1);
  }

  const formattedDate = selectedDate?.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  if (booked && bookingStep === 'confirm') {
    return (
      <View style={[styles.container, styles.successContainer, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 40) }]}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={60} color={C.success} />
        </View>
        <Text style={styles.successTitle}>Booking confirmed!</Text>
        <Text style={styles.successSub}>Your session with {stylist.name} on {formattedDate} at {selectedTime} has been confirmed. You'll receive a reminder before your appointment.</Text>

        <View style={styles.bookingSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Stylist</Text>
            <Text style={styles.summaryValue}>{stylist.name}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Date & Time</Text>
            <Text style={styles.summaryValue}>{formattedDate} at {selectedTime}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Services</Text>
            <Text style={styles.summaryValue}>{selectedServices.join(', ')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total (simulated)</Text>
            <Text style={styles.summaryValue}>{formatPrice(getTotalPrice())}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Status</Text>
            <View style={styles.confirmedBadge}>
              <Text style={styles.confirmedText}>Confirmed</Text>
            </View>
          </View>
        </View>

        <Pressable style={styles.doneBtn} onPress={() => router.replace('/(tabs)/discover')}>
          <Text style={styles.doneBtnText}>Back to experts</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.header}>
        <Pressable onPress={() => bookingStep === 'book' ? setBookingStep('browse') : router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>{bookingStep === 'book' ? 'Book session' : 'Stylist profile'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAwareScrollViewCompat contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 40) }]} showsVerticalScrollIndicator={false}>
        {bookingStep === 'browse' ? (
          <>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{stylist.avatar}</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.name}>{stylist.name}</Text>
                <Text style={styles.specialty}>{stylist.specialty}</Text>
                <View style={styles.ratingRow}>
                  <StarRow rating={stylist.rating} />
                  <Text style={styles.ratingText}>{stylist.rating} ({stylist.reviewCount} reviews)</Text>
                </View>
              </View>
            </View>

            <Text style={styles.bio}>{stylist.bio}</Text>

            <View style={styles.tagRow}>
              {stylist.tags.map(tag => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>Hourly rate</Text>
                  <Text style={styles.infoValue}>{formatPrice(stylist.pricing)}</Text>
                  <Text style={styles.infoSub}>approx.</Text>
                </View>
                <View style={[styles.infoBlock, styles.infoBlockBorder]}>
                  <Text style={styles.infoLabel}>Availability</Text>
                  <Text style={styles.infoValue}>{stylist.availability.join(', ')}</Text>
                  <Text style={styles.infoSub}>Weekly</Text>
                </View>
              </View>
            </View>

            <View style={styles.servicesCard}>
              <Text style={styles.servicesTitle}>Available Services</Text>
              {[
                { name: 'Colour Analysis Review', price: stylist.pricing * 0.8 },
                { name: 'Style Consultation', price: stylist.pricing },
                { name: 'Style Studio Edit', price: stylist.pricing * 1.5 },
                { name: 'Event Styling', price: stylist.pricing * 1.2 }
              ].map((service, idx) => (
                <View key={idx} style={[styles.serviceRow, idx === 3 && { borderBottomWidth: 0 }]}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.servicePrice}>{formatPrice(service.price)}</Text>
                </View>
              ))}
            </View>

            <Pressable
              style={styles.bookBtn}
              onPress={() => setBookingStep('book')}
            >
              <Ionicons name="chatbubbles-outline" size={18} color="#FFF" />
              <Text style={styles.bookBtnText}>Request Expert Insight</Text>
            </Pressable>
          </>
        ) : (
          <>
            <View style={styles.miniProfile}>
              <View style={styles.miniAvatar}>
                <Text style={styles.miniAvatarText}>{stylist.avatar}</Text>
              </View>
              <View>
                <Text style={styles.miniName}>{stylist.name}</Text>
                <Text style={styles.miniPrice}>{formatPrice(stylist.pricing)} per session</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Select services</Text>
              <View style={styles.serviceSelect}>
                {[
                  'Colour Analysis Review',
                  'Style Consultation',
                  'Style Studio Edit',
                  'Event Styling'
                ].map(service => {
                  const isSelected = selectedServices.includes(service);
                  return (
                    <Pressable
                      key={service}
                      onPress={() => toggleService(service)}
                      style={[styles.serviceOption, isSelected && styles.serviceOptionActive]}
                    >
                      <View style={{flex: 1}}>
                        <Text style={[styles.serviceOptionName, isSelected && styles.serviceOptionNameActive]}>{service}</Text>
                        <Text style={styles.serviceOptionPrice}>{formatPrice(getServicePrice(service))}</Text>
                      </View>
                      <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Select a day</Text>
              <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                minimumDate={new Date()}
                placeholder="Choose a date"
              />
              <Text style={styles.infoSub}>Available on: {stylist.availability.join(', ')}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Select a time</Text>
              <View style={styles.timeGrid}>
                {TIMES.map(t => (
                  <Pressable
                    key={t}
                    onPress={() => setSelectedTime(t)}
                    style={[styles.timeBtn, selectedTime === t && styles.timeBtnActive]}
                  >
                    <Text style={[styles.timeBtnText, selectedTime === t && styles.timeBtnTextActive]}>{t}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Notes for your stylist (optional)</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Tell them about your goals, upcoming events, or style challenges..."
                placeholderTextColor={C.muted}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total (simulated payment)</Text>
              <Text style={styles.totalAmount}>{formatPrice(stylist.pricing)}</Text>
            </View>

            <Pressable
              style={[styles.confirmBtn, (!selectedDate || !selectedTime) && styles.confirmBtnDisabled]}
              onPress={handleBook}
              disabled={!selectedDate || !selectedTime}
            >
              <Ionicons name="checkmark-circle" size={18} color="#FFF" />
              <Text style={styles.confirmBtnText}>Confirm booking</Text>
            </Pressable>

            <Text style={styles.paymentNote}>Payment is simulated — no real charge will be made.</Text>
          </>
        )}
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  notFoundText: { fontFamily: 'Inter_600SemiBold', fontSize: 18, color: C.primary },
  backLink: { fontFamily: 'Inter_500Medium', fontSize: 15, color: C.accent },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: C.primary },
  scroll: { paddingHorizontal: 20, paddingTop: 20, gap: 20 },
  profileHeader: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: C.accentLight, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: 'Inter_700Bold', fontSize: 22, color: C.accent },
  profileInfo: { flex: 1, gap: 4 },
  name: { fontFamily: 'Inter_700Bold', fontSize: 22, color: C.primary },
  specialty: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textSecondary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  stars: { flexDirection: 'row', gap: 2 },
  ratingText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.muted },
  bio: { fontFamily: 'Inter_400Regular', fontSize: 15, color: C.textSecondary, lineHeight: 23 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: C.cardAlt, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
  tagText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: C.secondary },
  infoCard: { backgroundColor: C.white, borderRadius: 16, borderWidth: 1, borderColor: C.border },
  infoRow: { flexDirection: 'row' },
  infoBlock: { flex: 1, padding: 16, gap: 3 },
  infoBlockBorder: { borderLeftWidth: 1, borderLeftColor: C.border },
  infoLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8 },
  infoValue: { fontFamily: 'Inter_700Bold', fontSize: 18, color: C.primary },
  infoSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.muted },
  servicesCard: { backgroundColor: C.white, borderRadius: 16, padding: 16, gap: 12, borderWidth: 1, borderColor: C.border, marginTop: 20 },
  servicesTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: C.primary },
  serviceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border },
  serviceName: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.secondary },
  servicePrice: { fontFamily: 'Inter_500Medium', fontSize: 14, color: C.primary },
  bookBtn: { backgroundColor: C.accent, borderRadius: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  bookBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#FFF' },
  miniProfile: { flexDirection: 'row', gap: 14, alignItems: 'center', backgroundColor: C.white, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.border },
  miniAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: C.accentLight, alignItems: 'center', justifyContent: 'center' },
  miniAvatarText: { fontFamily: 'Inter_700Bold', fontSize: 16, color: C.accent },
  miniName: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: C.primary },
  miniPrice: { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.textSecondary },
  section: { gap: 12 },
  sectionLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: C.primary },
  dayRow: { flexDirection: 'row', gap: 8 },
  dayBtn: { flex: 1, borderWidth: 1.5, borderColor: C.border, borderRadius: 12, paddingVertical: 12, alignItems: 'center', backgroundColor: C.white },
  dayBtnActive: { borderColor: C.accent, backgroundColor: C.accentLight },
  dayBtnText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: C.secondary },
  dayBtnTextActive: { color: C.accent },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeBtn: { borderWidth: 1.5, borderColor: C.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: C.white },
  timeBtnActive: { borderColor: C.accent, backgroundColor: C.accentLight },
  timeBtnText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: C.secondary },
  timeBtnTextActive: { color: C.accent },
  notesInput: { borderWidth: 1.5, borderColor: C.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontFamily: 'Inter_400Regular', fontSize: 15, color: C.primary, backgroundColor: C.white, minHeight: 100, textAlignVertical: 'top' },
  totalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.white, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: C.border },
  totalLabel: { fontFamily: 'Inter_500Medium', fontSize: 15, color: C.primary },
  totalAmount: { fontFamily: 'Inter_700Bold', fontSize: 20, color: C.primary },
  confirmBtn: { backgroundColor: C.accent, borderRadius: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  confirmBtnDisabled: { opacity: 0.4 },
  confirmBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#FFF' },
  paymentNote: { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.muted, textAlign: 'center' },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, gap: 16 },
  successIcon: { width: 100, height: 100, borderRadius: 50, backgroundColor: C.successLight, alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontFamily: 'Inter_700Bold', fontSize: 28, color: C.primary, textAlign: 'center' },
  successSub: { fontFamily: 'Inter_400Regular', fontSize: 15, color: C.textSecondary, textAlign: 'center', lineHeight: 22 },
  bookingSummary: { width: '100%', backgroundColor: C.white, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  summaryLabel: { fontFamily: 'Inter_500Medium', fontSize: 14, color: C.muted },
  summaryValue: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: C.primary },
  confirmedBadge: { backgroundColor: C.successLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  confirmedText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: C.success, textTransform: 'capitalize' },
  doneBtn: { backgroundColor: C.accent, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 40, marginTop: 8 },
  doneBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#FFF' },
  serviceSelect: { gap: 10 },
  serviceOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderWidth: 1.5, borderColor: C.border, borderRadius: 12, backgroundColor: C.white },
  serviceOptionActive: { borderColor: C.accent, backgroundColor: C.accentLight },
  serviceOptionName: { fontFamily: 'Inter_500Medium', fontSize: 14, color: C.primary },
  serviceOptionNameActive: { color: C.accent },
  serviceOptionPrice: { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.textSecondary, marginTop: 2 },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  radioCircleActive: { borderColor: C.accent },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.accent },
});
