import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay, withSpring,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/ui/ThemedText';
import { EYE_COLORS } from '@/constants/eyeColors';

const TOTAL_STEPS = 10;
const STEP = 6;

const EyeColorOption = ({ item, selected, onPress }: { item: typeof EYE_COLORS[0], selected: boolean, onPress: () => void }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(selected ? 0.95 : 1);
  }, [selected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPress={onPress} style={styles.optionContainer}>
      <Animated.View style={[styles.outerContainer, animatedStyle]}>
        <View style={[styles.imageContainer, selected && styles.selectedImageContainer]}>
          <Image
            source={item.image}
            style={styles.image}
            contentFit="contain"
            transition={200}
          />
        </View>
        {selected && (
          <View style={styles.checkmarkContainer}>
            <Ionicons name="checkmark" size={16} color="#FFF" />
          </View>
        )}
      </Animated.View>
      <ThemedText variant="caption" style={[styles.label, selected && styles.selectedLabel]}>
        {item.name}
      </ThemedText>
    </Pressable>
  );
};

export default function OnboardingEye() {
  const insets = useSafeAreaInsets();
  const { userProfile, updateUserProfile } = useApp();
  const [selected, setSelected] = React.useState(userProfile.eyeColour || '');

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
    updateUserProfile({ eyeColour: selected });
    router.push('/onboarding/hair');
  }

  function handleSelect(val: string) {
    setSelected(val);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.topBar}>
        <Button variant="ghost" size="sm" icon={<Ionicons name="arrow-back" size={22} color="rgba(245,240,232,0.6)" />} onPress={() => router.back()} title="" style={{ width: 40, paddingHorizontal: 0 }} />
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]} 
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.header, headerStyle]}>
          <View style={styles.stepBadge}><ThemedText variant="caption" style={styles.stepText}>{STEP} of {TOTAL_STEPS}</ThemedText></View>
          <ThemedText variant="headingXL" style={styles.question}>What colour{'\n'}are your eyes?</ThemedText>
          <ThemedText variant="bodyM" color="rgba(245,240,232,0.45)" style={styles.sub}>Select the one that matches you best.</ThemedText>
        </Animated.View>

        <View style={styles.grid}>
          {EYE_COLORS.map((item) => (
            <EyeColorOption
              key={item.id}
              item={item}
              selected={selected === item.name}
              onPress={() => handleSelect(item.name)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 24) }]}>
        <Button 
          title="Continue" 
          onPress={handleNext} 
          disabled={!selected}
          icon={<Ionicons name="arrow-forward" size={18} color="#FFF" />}
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
  scrollContent: { paddingHorizontal: 28 },
  header: { gap: 12, marginBottom: 32 },
  stepBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(193,123,88,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  stepText: { color: C.accent, letterSpacing: 0.5 },
  question: { color: C.text, lineHeight: 48, letterSpacing: -1.5 },
  sub: { lineHeight: 22 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8 },
  optionContainer: { width: '33.33%', alignItems: 'center', padding: 8, marginBottom: 16 },
  outerContainer: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  selectedImageContainer: {
    borderColor: C.accent,
    backgroundColor: 'rgba(193,123,88,0.1)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  checkmarkContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: C.accent,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: C.background,
  },
  label: { textAlign: 'center', color: C.textMuted },
  selectedLabel: { color: C.text, fontWeight: '600' },
  footer: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    paddingHorizontal: 28, 
    paddingTop: 20,
    backgroundColor: C.background, // Ensure footer has background to cover scroll content
    borderTopWidth: 1,
    borderTopColor: 'rgba(245,240,232,0.05)',
  },
});

