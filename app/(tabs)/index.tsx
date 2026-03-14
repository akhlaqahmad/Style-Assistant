import React, { useState, useCallback } from 'react';
import {
  View, StyleSheet, Pressable, ScrollView,
  Platform, RefreshControl
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { ThemedText } from '@/components/ui/ThemedText';
import { Card } from '@/components/ui/Card';
import { WeatherWidget } from '@/components/weather/WeatherWidget';
import { Spacing } from '@/constants/spacing';
import { Radius } from '@/constants/layout';

export default function TodayScreen() {
  const insets = useSafeAreaInsets();
  const { userProfile, refreshWeather } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [reflectionScore, setReflectionScore] = useState(3); // 1-5 scale

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refreshWeather().finally(() => setRefreshing(false));
  }, [refreshWeather]);

  const handleWearThis = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Logic to mark outfit as worn
  };

  const QuickAction = ({ label, icon, onPress }: { label: string, icon: keyof typeof Ionicons.glyphMap, onPress: () => void }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickActionBtn,
        { opacity: pressed ? 0.7 : 1, backgroundColor: C.card }
      ]}
    >
      <Ionicons name={icon} size={24} color={C.primary} />
      <ThemedText variant="caption" style={{ marginTop: 8 }}>{label}</ThemedText>
    </Pressable>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.scroll,
        { paddingTop: insets.top + (Platform.OS === 'web' ? 20 : 10), paddingBottom: insets.bottom + 100 }
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />}
    >
      {/* 1. Header */}
      <View style={styles.header}>
        <View>
          <ThemedText variant="headingM" style={styles.greeting}>
            Good morning, {userProfile.name || 'User'}
          </ThemedText>
          <ThemedText variant="bodyS" color={C.textSecondary}>{today}</ThemedText>
        </View>
        <Pressable onPress={() => router.push('/outfit/feedback')} hitSlop={8}>
          <View style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color={C.primary} />
          </View>
        </Pressable>
      </View>

      {/* 2. Weather */}
      <View style={styles.section}>
        <WeatherWidget />
      </View>

      {/* 3. Hero Section "Today's Outfit" */}
      <View style={styles.section}>
        <ThemedText variant="headingS" style={styles.sectionTitle}>Today's Outfit</ThemedText>
        <Card variant="default" style={styles.heroCard} padding={false}>
            <View style={styles.heroImageContainer}>
                 <Ionicons name="shirt-outline" size={64} color={C.muted} />
                 <ThemedText variant="bodyS" color={C.textMuted} style={{marginTop: 10}}>Outfit Placeholder</ThemedText>
            </View>
            <View style={styles.heroContent}>
                <ThemedText variant="bodyM" style={{fontWeight: '600'}}>Casual Chic</ThemedText>
                <ThemedText variant="caption" color={C.textSecondary}>Perfect for a mild day.</ThemedText>
                <Pressable onPress={handleWearThis} style={styles.wearButton}>
                    <ThemedText variant="bodyS" style={styles.wearButtonText}>Wear this</ThemedText>
                </Pressable>
            </View>
        </Card>
      </View>

      {/* 4. Style Note */}
      <View style={styles.section}>
        <Card variant="flat" style={styles.infoCard}>
            <View style={styles.infoIcon}>
                <Ionicons name="information-circle-outline" size={24} color={C.accent} />
            </View>
            <View style={styles.infoText}>
                <ThemedText variant="bodyS" style={{fontWeight: '600'}}>Style Note</ThemedText>
                <ThemedText variant="caption" color={C.textSecondary}>Light jacket recommended for the evening breeze.</ThemedText>
            </View>
        </Card>
      </View>

      {/* 5. Style Insight */}
      <View style={styles.section}>
        <Card variant="flat" style={styles.infoCard}>
            <View style={styles.infoIcon}>
                <Ionicons name="bulb-outline" size={24} color={C.warning} />
            </View>
            <View style={styles.infoText}>
                <ThemedText variant="bodyS" style={{fontWeight: '600'}}>Style Insight</ThemedText>
                <ThemedText variant="caption" color={C.textSecondary}>You feel most confident in structured outfits.</ThemedText>
            </View>
        </Card>
      </View>

      {/* 6. Style Studio Prompt */}
      <View style={styles.section}>
         <Pressable onPress={() => router.push('/(tabs)/studio' as any)}>
            <Card variant="default" style={styles.studioCard}>
                <View>
                    <ThemedText variant="headingXS" color={C.primary}>146</ThemedText>
                    <ThemedText variant="caption" color={C.textSecondary}>outfit combinations available</ThemedText>
                </View>
                <Ionicons name="chevron-forward" size={24} color={C.textMuted} />
            </Card>
         </Pressable>
      </View>

      {/* 7. Daily Reflection */}
      <View style={styles.section}>
        <ThemedText variant="headingS" style={styles.sectionTitle}>Daily Reflection</ThemedText>
        <Card variant="default" style={styles.reflectionCard}>
            <ThemedText variant="bodyS" style={{marginBottom: 10}}>How did your outfit feel today?</ThemedText>
            <View style={styles.reflectionSlider}>
                {[1, 2, 3, 4, 5].map((score) => (
                    <Pressable
                        key={score}
                        onPress={() => {
                            setReflectionScore(score);
                            Haptics.selectionAsync();
                        }}
                        style={[
                            styles.reflectionDot,
                            reflectionScore === score && styles.reflectionDotActive
                        ]}
                    >
                         <ThemedText variant="caption" style={reflectionScore === score ? {color: C.background, fontWeight: 'bold'} : {color: C.textMuted}}>{score}</ThemedText>
                    </Pressable>
                ))}
            </View>
            <View style={styles.reflectionLabels}>
                <ThemedText variant="caption" color={C.textMuted}>Not great</ThemedText>
                <ThemedText variant="caption" color={C.textMuted}>Amazing</ThemedText>
            </View>
        </Card>
      </View>

      {/* 8. Tomorrow Preview */}
      <View style={styles.section}>
        <Pressable onPress={() => router.push('/(tabs)/planner' as any)}>
            <Card variant="flat" style={styles.tomorrowCard}>
                <View>
                    <ThemedText variant="bodyS" style={{fontWeight: '600'}}>Tomorrow Preview</ThemedText>
                    <ThemedText variant="caption" color={C.textSecondary}>Want to plan your outfit now?</ThemedText>
                </View>
                <View style={styles.planButton}>
                    <ThemedText variant="caption" color={C.primary}>Plan</ThemedText>
                </View>
            </Card>
        </Pressable>
      </View>

      {/* 9. Quick Actions */}
      <View style={styles.section}>
        <ThemedText variant="headingS" style={styles.sectionTitle}>Quick Actions</ThemedText>
        <View style={styles.quickActionsRow}>
            <QuickAction label="Add Item" icon="add-circle-outline" onPress={() => router.push('/(tabs)/studio' as any)} />
            <QuickAction label="Plan Tmrw" icon="calendar-outline" onPress={() => router.push('/(tabs)/planner' as any)} />
            <QuickAction label="Explore" icon="compass-outline" onPress={() => router.push('/(tabs)/discover' as any)} />
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  scroll: { gap: Spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20 },
  greeting: { color: C.primary },
  notifBtn: { width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(245,240,232,0.06)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  section: { paddingHorizontal: 20, gap: 10 },
  sectionTitle: { marginBottom: 4, color: C.primary },
  
  // Hero
  heroCard: { overflow: 'hidden' },
  heroImageContainer: { height: 200, backgroundColor: C.cardAlt, alignItems: 'center', justifyContent: 'center' },
  heroContent: { padding: 16, gap: 4 },
  wearButton: { 
      marginTop: 10, 
      backgroundColor: C.accent, 
      paddingVertical: 10, 
      borderRadius: Radius.md, 
      alignItems: 'center' 
  },
  wearButtonText: { color: '#FFF', fontWeight: '600' },

  // Info Cards
  infoCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  infoIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(245,240,232,0.05)', alignItems: 'center', justifyContent: 'center' },
  infoText: { flex: 1 },

  // Studio
  studioCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },

  // Reflection
  reflectionCard: { padding: 16 },
  reflectionSlider: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  reflectionDot: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.cardAlt, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  reflectionDotActive: { backgroundColor: C.accent, borderColor: C.accent },
  reflectionLabels: { flexDirection: 'row', justifyContent: 'space-between' },

  // Tomorrow
  tomorrowCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: 'rgba(245,240,232,0.03)' },
  planButton: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: C.cardAlt, borderRadius: 12, borderWidth: 1, borderColor: C.border },

  // Quick Actions
  quickActionsRow: { flexDirection: 'row', gap: 12 },
  quickActionBtn: { flex: 1, alignItems: 'center', padding: 16, borderRadius: Radius.lg, borderWidth: 1, borderColor: C.border },
});
