import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { router } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, withSpring, Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/ui/ThemedText';
import { Input } from '@/components/ui/Input';
import { Spacing } from '@/constants/spacing';

const TOTAL_STEPS = 10;
const STEP = 1;

export default function OnboardingName() {
  const insets = useSafeAreaInsets();
  const { updateUserProfile } = useApp();
  const [name, setName] = useState('');
  const inputRef = useRef<TextInput>(null);

  const progress = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentY = useSharedValue(28);
  const inputScale = useSharedValue(1);

  useEffect(() => {
    progress.value = withTiming(STEP / TOTAL_STEPS, { duration: 600, easing: Easing.out(Easing.quad) });
    contentOpacity.value = withDelay(100, withTiming(1, { duration: 500 }));
    contentY.value = withDelay(100, withTiming(0, { duration: 500, easing: Easing.out(Easing.quad) }));
    setTimeout(() => inputRef.current?.focus(), 600);
  }, []);

  function handleChangeName(val: string) {
    setName(val);
    inputScale.value = withSpring(1.02, { damping: 10 }, () => {
      inputScale.value = withSpring(1);
    });
  }

  function handleNext() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateUserProfile({ name });
    router.push('/onboarding/age');
  }

  const progressStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` as any }));
  const contentStyle = useAnimatedStyle(() => ({ opacity: contentOpacity.value, transform: [{ translateY: contentY.value }] }));
  const inputAnimStyle = useAnimatedStyle(() => ({ transform: [{ scale: inputScale.value }] }));

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.inner, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0), paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 24) }]}>
        <View style={styles.topBar}>
          <Button variant="ghost" size="sm" icon={<Ionicons name="arrow-back" size={22} color="rgba(245,240,232,0.6)" />} onPress={() => router.back()} title="" style={{ width: 40, paddingHorizontal: 0 }} />
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, progressStyle]} />
          </View>
        </View>

        <Animated.View style={[styles.content, contentStyle]}>
          <View style={styles.stepBadge}>
            <ThemedText variant="caption" style={styles.stepText}>{STEP} of {TOTAL_STEPS}</ThemedText>
          </View>
          <ThemedText variant="headingXL" style={styles.question}>I’m StylistA.{'\n'}What should I call you?</ThemedText>
          <ThemedText variant="bodyM" color={C.textMuted} style={styles.hint}>This is optional — entirely up to you.</ThemedText>

          <Animated.View style={inputAnimStyle}>
            <Input
              ref={inputRef}
              value={name}
              onChangeText={handleChangeName}
              placeholder="Your name..."
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={handleNext}
              style={{ fontSize: 32 }}
            />
          </Animated.View>

          {name.length > 0 && (
            <Animated.Text style={styles.greeting}>
              Nice to meet you, {name} ✦
            </Animated.Text>
          )}
        </Animated.View>

        <View style={styles.footer}>
          <Button 
            title={name ? 'Continue' : 'Skip'} 
            onPress={handleNext}
            icon={<Ionicons name="arrow-forward" size={18} color="#FFF" />}
            style={{ flexDirection: 'row-reverse' }}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  inner: { flex: 1, paddingHorizontal: 28 },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 16 },
  progressTrack: { flex: 1, height: 3, backgroundColor: 'rgba(245,240,232,0.1)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: C.accent, borderRadius: 2 },
  content: { flex: 1, justifyContent: 'center', gap: 20 },
  stepBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(193,123,88,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  stepText: { color: C.accent, letterSpacing: 0.5 },
  question: { color: C.text, lineHeight: 48, letterSpacing: -1.5 },
  hint: { color: 'rgba(245,240,232,0.4)' },
  greeting: { fontFamily: 'Inter_500Medium', fontSize: 16, color: C.accent },
  footer: { paddingTop: 16 },
});
