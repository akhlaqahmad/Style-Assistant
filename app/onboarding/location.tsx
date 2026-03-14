import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, TextInput } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/ui/ThemedText';

const TOTAL_STEPS = 10;
const STEP = 5;

export default function OnboardingLocation() {
  const insets = useSafeAreaInsets();
  const { userProfile, updateUserProfile } = useApp();
  const [location, setLocation] = React.useState(userProfile.location || '');

  const progress = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const headerY = useSharedValue(20);

  useEffect(() => {
    progress.value = withTiming(STEP / TOTAL_STEPS, { duration: 600, easing: Easing.out(Easing.quad) });
    headerOpacity.value = withDelay(60, withTiming(1, { duration: 500 }));
    headerY.value = withDelay(60, withTiming(0, { duration: 500, easing: Easing.out(Easing.quad) }));
  }, []);

  const progressStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` as any }));
  const headerStyle = useAnimatedStyle(() => ({ opacity: headerOpacity.value, transform: [{ translateY: headerY.value }] }));

  function handleNext() {
    if (!location.trim()) return;
    updateUserProfile({ location: location.trim() });
    router.push('/onboarding/eye');
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0), paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 24) }]}>
      <View style={styles.topBar}>
        <Button variant="ghost" size="sm" icon={<Ionicons name="arrow-back" size={22} color="rgba(245,240,232,0.6)" />} onPress={() => router.back()} title="" style={{ width: 40, paddingHorizontal: 0 }} />
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>
      </View>

      <Animated.View style={[styles.header, headerStyle]}>
        <View style={styles.stepBadge}><ThemedText variant="caption" style={styles.stepText}>{STEP} of {TOTAL_STEPS}</ThemedText></View>
        <ThemedText variant="headingXL" style={styles.question}>Where are you{'\n'}usually located?</ThemedText>
        <ThemedText variant="bodyM" color="rgba(245,240,232,0.45)" style={styles.sub}>We use this to personalise outfit suggestions based on your local weather.</ThemedText>
      </Animated.View>

      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="City / Suburb"
          placeholderTextColor="rgba(245,240,232,0.3)"
          value={location}
          onChangeText={setLocation}
          autoCapitalize="words"
          autoFocus
        />
      </View>

      <View style={styles.footer}>
        <Button 
          title="Continue" 
          onPress={handleNext} 
          disabled={!location.trim()}
          icon={<Ionicons name="arrow-forward" size={18} color="#FFF" />}
          style={{ flexDirection: 'row-reverse' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background, paddingHorizontal: 28 },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 16 },
  progressTrack: { flex: 1, height: 3, backgroundColor: 'rgba(245,240,232,0.1)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: C.accent, borderRadius: 2 },
  header: { gap: 12, marginBottom: 36 },
  stepBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(193,123,88,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  stepText: { color: C.accent, letterSpacing: 0.5 },
  question: { color: C.text, lineHeight: 48, letterSpacing: -1.5 },
  sub: { lineHeight: 22 },
  content: { flex: 1 },
  input: {
    backgroundColor: 'rgba(245,240,232,0.06)',
    borderRadius: 12,
    padding: 20,
    color: C.text,
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'rgba(245,240,232,0.1)',
  },
  footer: { paddingTop: 20 },
});
