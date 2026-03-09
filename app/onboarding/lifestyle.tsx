import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, ScrollView } from 'react-native';
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
import { Chip } from '@/components/ui/Chip';

const LIFESTYLES = ['Office professional', 'Creative work', 'Work from home', 'Physical / active work', 'Student', 'Parent life', 'Social butterfly', 'Outdoors lover', 'Homebody', 'Frequent traveller'];
const BUDGETS = ['I love a bargain', 'Mid-range is my sweet spot', 'I invest in quality pieces', 'A mix — it depends'];

export default function OnboardingLifestyle() {
  const insets = useSafeAreaInsets();
  const { updateUserProfile } = useApp();
  const [life, setLife] = React.useState<string[]>([]);
  const [budget, setBudget] = React.useState('');

  const progress = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const headerY = useSharedValue(20);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.quad) });
    headerOpacity.value = withDelay(60, withTiming(1, { duration: 500 }));
    headerY.value = withDelay(60, withTiming(0, { duration: 500, easing: Easing.out(Easing.quad) }));
  }, []);

  const progressStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` as any }));
  const headerStyle = useAnimatedStyle(() => ({ opacity: headerOpacity.value, transform: [{ translateY: headerY.value }] }));

  function toggleLife(l: string) {
    setLife(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]);
  }

  function handleComplete() {
    updateUserProfile({ lifestyle: life, budgetRange: budget, onboardingComplete: true });
    router.replace('/onboarding/complete');
  }

  const canContinue = life.length > 0 && budget !== '';

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.topBar}>
        <Button variant="ghost" size="sm" icon={<Ionicons name="arrow-back" size={22} color="rgba(245,240,232,0.6)" />} onPress={() => router.back()} title="" style={{ width: 40, paddingHorizontal: 0 }} />
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>
        <ThemedText variant="caption" style={styles.almostText}>Almost done!</ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.header, headerStyle]}>
          <View style={styles.stepBadge}><ThemedText variant="caption" style={styles.stepText}>Last step</ThemedText></View>
          <ThemedText variant="headingXL" style={styles.question}>A few final{'\n'}details</ThemedText>
          <ThemedText variant="bodyM" color="rgba(245,240,232,0.45)" style={styles.sub}>Help us understand what occasions to dress you for.</ThemedText>
        </Animated.View>

        <View style={styles.section}>
          <ThemedText variant="headingXS" style={styles.sectionLabel}>Your lifestyle</ThemedText>
          <View style={styles.chips}>
            {LIFESTYLES.map((l, i) => (
              <Chip 
                key={l} 
                label={l} 
                selected={life.includes(l)} 
                variant={life.includes(l) ? 'accent' : 'default'}
                onPress={() => toggleLife(l)} 
                icon={life.includes(l) ? 'checkmark' : undefined}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText variant="headingXS" style={styles.sectionLabel}>Budget approach</ThemedText>
          <View style={styles.chips}>
            {BUDGETS.map((b, i) => (
              <Chip 
                key={b} 
                label={b} 
                selected={budget === b} 
                variant={budget === b ? 'accent' : 'default'}
                onPress={() => setBudget(b)} 
                icon={budget === b ? 'checkmark' : undefined}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 24) }]}>
        <Button 
          title="Reveal my style profile" 
          onPress={handleComplete} 
          disabled={!canContinue}
          icon={<Ionicons name="sparkles" size={18} color="#FFF" />}
          style={{ flexDirection: 'row-reverse' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 16, paddingHorizontal: 28 },
  progressTrack: { flex: 1, height: 3, backgroundColor: 'rgba(245,240,232,0.1)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: C.accent, borderRadius: 2 },
  almostText: { color: C.accent },
  scrollContent: { paddingHorizontal: 28, paddingBottom: 20, gap: 32 },
  header: { gap: 12 },
  stepBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(193,123,88,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  stepText: { color: C.accent, letterSpacing: 0.5 },
  question: { color: C.text, lineHeight: 48, letterSpacing: -1.5 },
  sub: { lineHeight: 22 },
  section: { gap: 16 },
  sectionLabel: { color: 'rgba(245,240,232,0.7)' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  footer: { paddingHorizontal: 28, paddingTop: 12 },
});
