import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { router } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, withSpring, Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

const TOTAL_STEPS = 8;
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
  const cursorOpacity = useSharedValue(1);

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
          <Pressable onPress={() => router.back()} hitSlop={14}>
            <Ionicons name="arrow-back" size={22} color="rgba(245,240,232,0.6)" />
          </Pressable>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, progressStyle]} />
          </View>
        </View>

        <Animated.View style={[styles.content, contentStyle]}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepText}>{STEP} of {TOTAL_STEPS}</Text>
          </View>
          <Text style={styles.question}>What should{'\n'}we call you?</Text>
          <Text style={styles.hint}>This is optional — entirely up to you.</Text>

          <Animated.View style={inputAnimStyle}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={name}
              onChangeText={handleChangeName}
              placeholder="Your name..."
              placeholderTextColor="rgba(245,240,232,0.2)"
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={handleNext}
              selectionColor={C.accent}
            />
          </Animated.View>

          {name.length > 0 && (
            <Animated.Text style={styles.greeting}>
              Nice to meet you, {name} ✦
            </Animated.Text>
          )}
        </Animated.View>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [styles.nextBtn, { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }]}
            onPress={handleNext}
          >
            <Text style={styles.nextBtnText}>{name ? 'Continue' : 'Skip'}</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFF" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0D0B' },
  inner: { flex: 1, paddingHorizontal: 28 },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 16 },
  progressTrack: { flex: 1, height: 3, backgroundColor: 'rgba(245,240,232,0.1)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: C.accent, borderRadius: 2 },
  content: { flex: 1, justifyContent: 'center', gap: 20 },
  stepBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(193,123,88,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  stepText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: C.accent, letterSpacing: 0.5 },
  question: { fontFamily: 'Inter_700Bold', fontSize: 40, color: '#F5F0E8', lineHeight: 48, letterSpacing: -1.5 },
  hint: { fontFamily: 'Inter_400Regular', fontSize: 15, color: 'rgba(245,240,232,0.4)' },
  input: {
    borderBottomWidth: 2, borderBottomColor: 'rgba(245,240,232,0.15)',
    fontFamily: 'Inter_600SemiBold', fontSize: 32, color: '#F5F0E8',
    paddingVertical: 12, letterSpacing: -0.5,
  },
  greeting: { fontFamily: 'Inter_500Medium', fontSize: 16, color: C.accent },
  footer: { paddingTop: 16 },
  nextBtn: {
    backgroundColor: C.accent, borderRadius: 16, paddingVertical: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  nextBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#FFF' },
});
