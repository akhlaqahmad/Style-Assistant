import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Alert, Switch, Linking } from 'react-native';
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

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { userProfile, updateUserProfile } = useApp();

  async function resetApp() {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log out',
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

  async function deleteAccount() {
    Alert.alert(
      'Delete Account',
      'This action is permanent and cannot be undone. All your data will be erased. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
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

  const handleLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 20 : 10) }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} /> {/* Spacer for centering */}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 100) }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Section title="Style Alerts">
          <SwitchRow
            icon="calendar-outline"
            label="Daily Planner"
            value={userProfile.nightReminders}
            onValueChange={(val) => updateUserProfile({ nightReminders: val })}
          />
          <SwitchRow
            icon="partly-sunny-outline"
            label="Weather Style Suggestions"
            value={userProfile.weatherAware}
            onValueChange={(val) => updateUserProfile({ weatherAware: val })}
          />
          <SwitchRow
            icon="happy-outline"
            label="Mood Check-in"
            value={userProfile.moodTracking}
            onValueChange={(val) => updateUserProfile({ moodTracking: val })}
          />
        </Section>

        <Section title="App Settings">
          <Row
            icon="notifications-outline"
            label="Push Notifications"
            onPress={() => Alert.alert('Notifications', 'System notification settings would open here.')}
          />
          <Row
            icon="lock-closed-outline"
            label="Privacy Settings"
            onPress={() => Alert.alert('Privacy', 'Privacy settings coming soon.')}
          />
        </Section>

        <Section title="About & Support">
          <Row
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => handleLink('https://example.com/support')}
          />
          <Row
            icon="document-text-outline"
            label="Terms of Service"
            onPress={() => handleLink('https://example.com/terms')}
          />
          <Row
            icon="shield-checkmark-outline"
            label="Privacy Policy"
            onPress={() => handleLink('https://example.com/privacy')}
          />
          <Row
            icon="information-circle-outline"
            label="App Version"
            value="1.0.0 (Build 1)"
          />
        </Section>

        <Section title="Account">
          <Row
            icon="log-out-outline"
            label="Log out"
            onPress={resetApp}
          />
          <Row
            icon="trash-outline"
            label="Delete Account"
            onPress={deleteAccount}
            danger
          />
        </Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 20, 
    paddingBottom: 12, 
    backgroundColor: C.background, 
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border
  },
  backBtn: { width: 24, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 18, color: C.primary },
  scroll: { paddingHorizontal: 20, paddingTop: 20, gap: 24 },
  section: { gap: 12 },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8, paddingHorizontal: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.white, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.border },
  rowIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.accentLight, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 15, color: C.primary },
  rowValue: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.muted },
});
