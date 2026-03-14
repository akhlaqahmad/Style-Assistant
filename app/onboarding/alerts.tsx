import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, ScrollView, Switch } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/ui/ThemedText';

export default function OnboardingAlerts() {
  const insets = useSafeAreaInsets();
  const { updateUserProfile } = useApp();
  
  const [planner, setPlanner] = useState(true);
  const [weather, setWeather] = useState(true);
  const [mood, setMood] = useState(true);

  const headerOpacity = useSharedValue(0);
  const headerY = useSharedValue(20);

  useEffect(() => {
    headerOpacity.value = withDelay(60, withTiming(1, { duration: 500 }));
    headerY.value = withDelay(60, withTiming(0, { duration: 500, easing: Easing.out(Easing.quad) }));
  }, []);

  const headerStyle = useAnimatedStyle(() => ({ opacity: headerOpacity.value, transform: [{ translateY: headerY.value }] }));

  function handleNext() {
    updateUserProfile({
      nightReminders: planner,
      weatherAware: weather,
      moodTracking: mood,
      onboardingComplete: true
    });
    router.replace('/onboarding/complete');
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.topBar}>
        <Button variant="ghost" size="sm" icon={<Ionicons name="arrow-back" size={22} color="rgba(245,240,232,0.6)" />} onPress={() => router.back()} title="" style={{ width: 40, paddingHorizontal: 0 }} />
        <View style={{ flex: 1 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.header, headerStyle]}>
          <ThemedText variant="headingXL" style={styles.title}>Stay Inspired{'\n'}Each Day</ThemedText>
          <ThemedText variant="bodyM" color="rgba(245,240,232,0.45)" style={styles.sub}>Enable these features to get the most out of your style assistant.</ThemedText>
        </Animated.View>

        <View style={styles.section}>
            <View style={styles.row}>
                <View style={styles.textCol}>
                    <ThemedText variant="headingXS">Daily Planner</ThemedText>
                    <ThemedText variant="bodyS" color="rgba(245,240,232,0.6)">Evening check-in to plan tomorrow's look.</ThemedText>
                </View>
                <Switch
                    value={planner}
                    onValueChange={setPlanner}
                    trackColor={{ false: 'rgba(245,240,232,0.1)', true: C.accent }}
                    thumbColor={'#FFF'}
                />
            </View>
            
            <View style={styles.divider} />

            <View style={styles.row}>
                <View style={styles.textCol}>
                    <ThemedText variant="headingXS">Weather Integration</ThemedText>
                    <ThemedText variant="bodyS" color="rgba(245,240,232,0.6)">Smart suggestions based on forecast.</ThemedText>
                </View>
                <Switch
                    value={weather}
                    onValueChange={setWeather}
                    trackColor={{ false: 'rgba(245,240,232,0.1)', true: C.accent }}
                    thumbColor={'#FFF'}
                />
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
                <View style={styles.textCol}>
                    <ThemedText variant="headingXS">Mood Tracking</ThemedText>
                    <ThemedText variant="bodyS" color="rgba(245,240,232,0.6)">Style & Mood insights over time.</ThemedText>
                </View>
                <Switch
                    value={mood}
                    onValueChange={setMood}
                    trackColor={{ false: 'rgba(245,240,232,0.1)', true: C.accent }}
                    thumbColor={'#FFF'}
                />
            </View>
        </View>

      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 24) }]}>
        <Button 
          title="Enable Notifications" 
          onPress={handleNext} 
          icon={<Ionicons name="notifications-outline" size={18} color="#FFF" />}
          style={{ flexDirection: 'row-reverse' }}
        />
        <Button 
          title="Skip for now" 
          variant="ghost" 
          size="sm" 
          onPress={handleNext} 
          style={styles.skip}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 16, paddingHorizontal: 28 },
  scrollContent: { paddingHorizontal: 28, paddingBottom: 20, gap: 32 },
  header: { gap: 12, marginTop: 10 },
  title: { color: C.text, lineHeight: 48, letterSpacing: -1.5 },
  sub: { lineHeight: 22 },
  section: { backgroundColor: 'rgba(245,240,232,0.03)', borderRadius: 16, padding: 20, gap: 20 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  textCol: { flex: 1, gap: 4 },
  divider: { height: 1, backgroundColor: 'rgba(245,240,232,0.05)' },
  footer: { paddingHorizontal: 28, paddingTop: 12, gap: 10 },
  skip: { alignSelf: 'center', paddingVertical: 4 },
});