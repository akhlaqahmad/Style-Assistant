import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Platform } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, withSequence, Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '@/constants/colors';

const { width, height } = Dimensions.get('window');

export default function OnboardingWelcome() {
  const insets = useSafeAreaInsets();
  const opacity1 = useSharedValue(0);
  const opacity2 = useSharedValue(0);
  const opacity3 = useSharedValue(0);
  const btnOpacity = useSharedValue(0);
  const translateY1 = useSharedValue(30);
  const translateY2 = useSharedValue(30);
  const translateY3 = useSharedValue(30);

  useEffect(() => {
    opacity1.value = withDelay(200, withTiming(1, { duration: 600 }));
    translateY1.value = withDelay(200, withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) }));
    opacity2.value = withDelay(500, withTiming(1, { duration: 600 }));
    translateY2.value = withDelay(500, withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) }));
    opacity3.value = withDelay(800, withTiming(1, { duration: 600 }));
    translateY3.value = withDelay(800, withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) }));
    btnOpacity.value = withDelay(1200, withTiming(1, { duration: 600 }));
  }, []);

  const style1 = useAnimatedStyle(() => ({ opacity: opacity1.value, transform: [{ translateY: translateY1.value }] }));
  const style2 = useAnimatedStyle(() => ({ opacity: opacity2.value, transform: [{ translateY: translateY2.value }] }));
  const style3 = useAnimatedStyle(() => ({ opacity: opacity3.value, transform: [{ translateY: translateY3.value }] }));
  const btnStyle = useAnimatedStyle(() => ({ opacity: btnOpacity.value }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1A1410', '#2D1F14', '#3D2818']}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.decorCircle1]} />
      <View style={[styles.decorCircle2]} />

      <View style={[styles.content, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0), paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 20) }]}>
        <View style={styles.logoArea}>
          <Animated.View style={[style1]}>
            <Text style={styles.logoMark}>✦</Text>
          </Animated.View>
        </View>

        <View style={styles.textArea}>
          <Animated.Text style={[styles.headline, style2]}>
            Your personal{'\n'}style, elevated.
          </Animated.Text>
          <Animated.Text style={[styles.subhead, style3]}>
            Discover what works for your unique body and tone. Build a wardrobe you actually wear.
          </Animated.Text>
        </View>

        <Animated.View style={[styles.btnArea, btnStyle]}>
          <Pressable
            style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }]}
            onPress={() => router.push('/onboarding/basics')}
          >
            <Text style={styles.btnText}>Begin your style journey</Text>
          </Pressable>
          <Text style={styles.hint}>Takes about 3 minutes</Text>
        </Animated.View>
      </View>

      <View style={styles.features}>
        {[
          'Body proportion guidance',
          'Personalised colour palette',
          'Daily outfit suggestions',
          'Travel packing planner',
        ].map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1410' },
  decorCircle1: {
    position: 'absolute', width: 300, height: 300,
    borderRadius: 150, backgroundColor: 'rgba(193,123,88,0.15)',
    top: -80, right: -80,
  },
  decorCircle2: {
    position: 'absolute', width: 200, height: 200,
    borderRadius: 100, backgroundColor: 'rgba(193,123,88,0.08)',
    bottom: 120, left: -60,
  },
  content: { flex: 1, paddingHorizontal: 32, justifyContent: 'space-between' },
  logoArea: { alignItems: 'flex-start', paddingTop: 20 },
  logoMark: { fontSize: 36, color: C.accent },
  textArea: { gap: 16 },
  headline: {
    fontFamily: 'Inter_700Bold', fontSize: 42, color: '#F5F0E8',
    lineHeight: 50, letterSpacing: -1.5,
  },
  subhead: {
    fontFamily: 'Inter_400Regular', fontSize: 17, color: 'rgba(245,240,232,0.6)',
    lineHeight: 26,
  },
  btnArea: { gap: 14 },
  btn: {
    backgroundColor: C.accent, borderRadius: 16,
    paddingVertical: 18, alignItems: 'center',
  },
  btnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#FFF', letterSpacing: 0.2 },
  hint: { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(245,240,232,0.4)', textAlign: 'center' },
  features: {
    paddingHorizontal: 32, paddingBottom: 32, gap: 10,
  },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: C.accent },
  featureText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(245,240,232,0.5)' },
});
