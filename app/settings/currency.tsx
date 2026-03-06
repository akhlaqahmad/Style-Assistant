import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

export default function CurrencyScreen() {
  const insets = useSafeAreaInsets();
  const { userProfile, updateUserProfile } = useApp();

  const currencies = [
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'AUD', name: 'Australian Dollar', symbol: '$' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: '$' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  ] as const;

  const handleSelect = (code: typeof currencies[number]['code']) => {
    updateUserProfile({ currency: code });
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={C.primary} />
        </Pressable>
        <Text style={styles.title}>Currency</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.section}>
          {currencies.map((currency) => (
            <Pressable
              key={currency.code}
              style={({ pressed }) => [
                styles.row,
                userProfile.currency === currency.code && styles.selectedRow,
                pressed && styles.pressedRow
              ]}
              onPress={() => handleSelect(currency.code)}
            >
              <View style={styles.rowContent}>
                <Text style={styles.currencyCode}>{currency.code}</Text>
                <Text style={styles.currencyName}>{currency.name} ({currency.symbol})</Text>
              </View>
              {userProfile.currency === currency.code && (
                <Ionicons name="checkmark-circle" size={24} color={C.accent} />
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 20 },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: C.card },
  title: { fontFamily: 'Inter_700Bold', fontSize: 18, color: C.primary },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  section: { gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border },
  selectedRow: { borderColor: C.accent, backgroundColor: C.cardAlt },
  pressedRow: { opacity: 0.7 },
  rowContent: { gap: 4 },
  currencyCode: { fontFamily: 'Inter_700Bold', fontSize: 16, color: C.primary },
  currencyName: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textSecondary },
});
