import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, TextInput } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/ui/ThemedText';
import { SelectionCard } from '@/components/ui/SelectionCard';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';

const TOTAL_STEPS = 10;
const STEP = 3;
const OPTIONS = [
  { value: 'Woman', icon: 'person' as const },
  { value: 'Man', icon: 'person' as const },
  { value: 'Non-binary', icon: 'person' as const },
  { value: 'Prefer to self-describe', icon: 'create-outline' as const },
  { value: 'Prefer not to say', icon: 'ellipsis-horizontal' as const },
];

export default function OnboardingGender() {
  const insets = useSafeAreaInsets();
  const { userProfile, updateUserProfile } = useApp();
  const [selected, setSelected] = React.useState(userProfile.gender || '');
  const [customGender, setCustomGender] = React.useState('');

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
    if (!selected) return;
    const genderValue = selected === 'Prefer to self-describe' ? customGender : selected;
    if (selected === 'Prefer to self-describe' && !customGender.trim()) return;

    updateUserProfile({ gender: genderValue });
    router.push('/onboarding/clothing-style');
  }

  function handleSelect(val: string) {
    setSelected(val);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  return (
    <KeyboardAwareScrollViewCompat
      style={{ flex: 1, backgroundColor: C.background }}
      contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 28, paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0), paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 24) }}
      bounces={false}
    >
      <View style={styles.topBar}>
        <Button variant="ghost" size="sm" icon={<Ionicons name="arrow-back" size={22} color="rgba(245,240,232,0.6)" />} onPress={() => router.back()} title="" style={{ width: 40, paddingHorizontal: 0 }} />
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>
      </View>

      <Animated.View style={[styles.header, headerStyle]}>
        <View style={styles.stepBadge}><ThemedText variant="caption" style={styles.stepText}>{STEP} of {TOTAL_STEPS}</ThemedText></View>
        <ThemedText variant="headingXL" style={styles.question}>How do you{'\n'}identify?</ThemedText>
        <ThemedText variant="bodyM" color="rgba(245,240,232,0.45)" style={styles.sub}>Helps us personalise language and clothing guidance.</ThemedText>
      </Animated.View>

      <View style={styles.cards}>
        {OPTIONS.map((opt, i) => (
          <React.Fragment key={opt.value}>
            <SelectionCard 
              label={opt.value} 
              selected={selected === opt.value} 
              onPress={() => handleSelect(opt.value)} 
              icon={opt.icon as any}
            />
            {selected === 'Prefer to self-describe' && opt.value === 'Prefer to self-describe' && (
              <TextInput
                style={styles.input}
                placeholder="Please describe..."
                placeholderTextColor="rgba(245,240,232,0.3)"
                value={customGender}
                onChangeText={setCustomGender}
                autoFocus
              />
            )}
          </React.Fragment>
        ))}
      </View>

      <View style={styles.footer}>
        <Button 
          title="Continue" 
          onPress={handleNext} 
          disabled={!selected}
          icon={<Ionicons name="arrow-forward" size={18} color="#FFF" />}
          style={{ flexDirection: 'row-reverse' }}
        />
      </View>
    </KeyboardAwareScrollViewCompat>
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
  cards: { flex: 1, gap: 12 },
  input: {
    backgroundColor: 'rgba(245,240,232,0.06)',
    borderRadius: 12,
    padding: 16,
    color: C.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(245,240,232,0.1)',
    marginTop: -4,
    marginBottom: 8,
    marginLeft: 12,
  },
  footer: { paddingTop: 20 },
});
