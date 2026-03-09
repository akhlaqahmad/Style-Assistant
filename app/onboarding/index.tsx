import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay,
  withSpring, Easing, withSequence, withRepeat,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';
import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/ui/ThemedText';

const { width } = Dimensions.get('window');

const FEATURES = ['Colour palette personalised to you', 'Wardrobe gap detection', 'Daily outfit suggestions', 'Travel packing plans'];

function FeatureLine({ text, delay }: { text: string; delay: number }) {
  const opacity = useSharedValue(0);
  const x = useSharedValue(-16);
  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    x.value = withDelay(delay, withTiming(0, { duration: 500, easing: Easing.out(Easing.quad) }));
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ translateX: x.value }] }));
  return (
    <Animated.View style={[styles.featureRow, style]}>
      <View style={styles.featureDot} />
      <ThemedText variant="bodyS" style={styles.featureText}>{text}</ThemedText>
    </Animated.View>
  );
}

export default function OnboardingWelcome() {
  const insets = useSafeAreaInsets();

  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.6);
  const headOpacity = useSharedValue(0);
  const headY = useSharedValue(24);
  const subOpacity = useSharedValue(0);
  const btnOpacity = useSharedValue(0);
  const btnY = useSharedValue(16);
  const pulse = useSharedValue(1);

  useEffect(() => {
    logoOpacity.value = withDelay(100, withTiming(1, { duration: 600 }));
    logoScale.value = withDelay(100, withSpring(1, { damping: 14, stiffness: 100 }));
    headOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    headY.value = withDelay(400, withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) }));
    subOpacity.value = withDelay(700, withTiming(1, { duration: 600 }));
    btnOpacity.value = withDelay(1400, withTiming(1, { duration: 500 }));
    btnY.value = withDelay(1400, withTiming(0, { duration: 500, easing: Easing.out(Easing.quad) }));
    pulse.value = withDelay(2000, withRepeat(
      withSequence(withTiming(1.06, { duration: 1800, easing: Easing.inOut(Easing.sin) }), withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) })),
      -1, false,
    ));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({ opacity: logoOpacity.value, transform: [{ scale: logoScale.value }] }));
  const headStyle = useAnimatedStyle(() => ({ opacity: headOpacity.value, transform: [{ translateY: headY.value }] }));
  const subStyle = useAnimatedStyle(() => ({ opacity: subOpacity.value }));
  const btnStyle = useAnimatedStyle(() => ({ opacity: btnOpacity.value, transform: [{ translateY: btnY.value }, { scale: pulse.value }] }));

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F0D0B', '#1E1510', '#2D1C10']} locations={[0, 0.6, 1]} style={StyleSheet.absoluteFill} />

      <View style={styles.orb1} />
      <View style={styles.orb2} />

      <View style={[styles.content, {
        paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 20),
        paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 32),
      }]}>
        <Animated.View style={[styles.logoWrap, logoStyle]}>
          <View style={styles.logoRing}>
            <View style={styles.logoInner}>
              <ThemedText style={styles.logoMark}>✦</ThemedText>
            </View>
          </View>
          <ThemedText style={styles.logoName}>STYLISTA</ThemedText>
        </Animated.View>

        <View style={styles.heroBlock}>
          <Animated.Text style={[Typography.headingXL, styles.headline, headStyle]}>
            Style that{'\n'}knows you.
          </Animated.Text>
          <Animated.Text style={[Typography.bodyL, styles.subhead, subStyle]}>
            A personal styling experience built around your unique body, tones, and taste.
          </Animated.Text>
        </View>

        <View style={styles.featuresBlock}>
          {FEATURES.map((f, i) => <FeatureLine key={i} text={f} delay={900 + i * 120} />)}
        </View>

        <Animated.View style={btnStyle}>
          <Button 
            title="Begin your style journey" 
            onPress={() => router.push('/onboarding/name')} 
            size="lg"
            style={styles.btn}
          />
          <ThemedText variant="caption" style={styles.hint}>Takes about 3 minutes</ThemedText>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  orb1: {
    position: 'absolute', width: 320, height: 320, borderRadius: 160,
    backgroundColor: 'rgba(193,123,88,0.12)', top: -100, right: -80,
  },
  orb2: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(193,123,88,0.07)', bottom: 80, left: -60,
  },
  content: { flex: 1, paddingHorizontal: 28, justifyContent: 'space-between' },
  logoWrap: { alignItems: 'center', gap: 10, paddingTop: 12 },
  logoRing: { width: 72, height: 72, borderRadius: 36, borderWidth: 1, borderColor: 'rgba(193,123,88,0.4)', alignItems: 'center', justifyContent: 'center' },
  logoInner: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(193,123,88,0.15)', alignItems: 'center', justifyContent: 'center' },
  logoMark: { fontSize: 26, color: C.accent },
  logoName: { fontFamily: 'Inter_700Bold', fontSize: 11, color: C.accent, letterSpacing: 5, textTransform: 'uppercase' },
  heroBlock: { gap: 14 },
  headline: { color: '#F5F0E8', lineHeight: 54 },
  subhead: { color: 'rgba(245,240,232,0.55)', lineHeight: 26 },
  featuresBlock: { gap: 10 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: C.accent },
  featureText: { color: 'rgba(245,240,232,0.45)' },
  btn: { width: '100%' },
  hint: { color: 'rgba(245,240,232,0.3)', textAlign: 'center', marginTop: 12 },
});
