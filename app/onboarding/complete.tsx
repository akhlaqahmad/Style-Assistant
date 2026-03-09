import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay,
  withSpring, withSequence, Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/ui/ThemedText';
import { Spacing } from '@/constants/spacing';
import { Radius } from '@/constants/layout';

const TONE_LABELS: Record<string, string> = {
  warm: 'Warm Tone',
  cool: 'Cool Tone',
  neutral: 'Neutral Tone',
};

const TONE_DESC: Record<string, string> = {
  warm: 'Your golden, sun-kissed colouring is rich with warmth. The shades below will make you radiate.',
  cool: 'Your cool, crisp colouring shines with depth. The shades below will make your features sing.',
  neutral: 'Your beautifully balanced colouring bridges warm and cool — a rare versatility that gives you a wider palette to work with.',
};

function PaletteSwatch({ colour, delay }: { colour: string; delay: number }) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    scale.value = withDelay(delay, withSpring(1, { damping: 12, stiffness: 100 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.swatch, { backgroundColor: colour }, style]} />
  );
}

function HighlightCard({ icon, label, value, delay }: { icon: string; label: string; value: string; delay: number }) {
  const opacity = useSharedValue(0);
  const y = useSharedValue(16);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    y.value = withDelay(delay, withTiming(0, { duration: 400, easing: Easing.out(Easing.quad) }));
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ translateY: y.value }] }));

  return (
    <Animated.View style={[styles.highlightCard, style]}>
      <Ionicons name={icon as any} size={18} color={C.accent} />
      <View style={styles.highlightText}>
        <ThemedText variant="headingXS" style={{ color: '#F5F0E8', fontSize: 14 }}>{label}</ThemedText>
        <ThemedText variant="bodyS" style={{ color: 'rgba(245,240,232,0.4)' }}>{value}</ThemedText>
      </View>
    </Animated.View>
  );
}

export default function OnboardingComplete() {
  const insets = useSafeAreaInsets();
  const { userProfile, toneProfile, updateUserProfile } = useApp();

  const toneType = toneProfile.toneType || 'neutral';
  const palette = toneProfile.palette || [];
  const name = userProfile.name;

  const heroOpacity = useSharedValue(0);
  const heroScale = useSharedValue(0.8);
  const toneOpacity = useSharedValue(0);
  const toneY = useSharedValue(24);
  const btnOpacity = useSharedValue(0);
  const btnY = useSharedValue(16);
  const sparkle = useSharedValue(1);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    heroOpacity.value = withDelay(100, withTiming(1, { duration: 600 }));
    heroScale.value = withDelay(100, withSpring(1, { damping: 14, stiffness: 90 }));
    toneOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
    toneY.value = withDelay(500, withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) }));
    btnOpacity.value = withDelay(palette.length * 80 + 1000, withTiming(1, { duration: 500 }));
    btnY.value = withDelay(palette.length * 80 + 1000, withTiming(0, { duration: 500, easing: Easing.out(Easing.quad) }));

    setTimeout(() => {
      sparkle.value = withSequence(
        withTiming(1.15, { duration: 200 }),
        withSpring(1, { damping: 8 }),
      );
    }, palette.length * 80 + 1200);
  }, []);

  const heroStyle = useAnimatedStyle(() => ({ opacity: heroOpacity.value, transform: [{ scale: heroScale.value }] }));
  const toneStyle = useAnimatedStyle(() => ({ opacity: toneOpacity.value, transform: [{ translateY: toneY.value }] }));
  const btnStyle = useAnimatedStyle(() => ({ opacity: btnOpacity.value, transform: [{ translateY: btnY.value }] }));
  const sparkleStyle = useAnimatedStyle(() => ({ transform: [{ scale: sparkle.value }] }));

  function handleEnter() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateUserProfile({ onboardingComplete: true });
    router.replace('/(tabs)');
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F0D0B', '#1A1210', '#241610']} locations={[0, 0.5, 1]} style={StyleSheet.absoluteFill} />
      <View style={styles.orb} />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, {
          paddingTop: insets.top + (Platform.OS === 'web' ? 80 : 48),
          paddingBottom: insets.bottom + (Platform.OS === 'web' ? 80 : 48),
        }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.heroSection, heroStyle]}>
          <Animated.View style={sparkleStyle}>
            <View style={styles.completeBadge}>
              <Ionicons name="checkmark-circle" size={48} color={C.accent} />
            </View>
          </Animated.View>
          <ThemedText variant="headingL" style={styles.heroTitle}>
            {name ? `Your profile is\nready, ${name}.` : 'Your style profile\nis ready.'}
          </ThemedText>
          <ThemedText variant="bodyM" style={styles.heroSub}>We've analysed your colouring and crafted a personalised palette just for you.</ThemedText>
        </Animated.View>

        <Animated.View style={[styles.toneSection, toneStyle]}>
          <View style={styles.toneBadge}>
            <ThemedText variant="caption" style={styles.toneBadgeText}>{TONE_LABELS[toneType] || 'Neutral Tone'}</ThemedText>
          </View>
          <ThemedText variant="bodyM" style={styles.toneDesc}>{TONE_DESC[toneType] || TONE_DESC.neutral}</ThemedText>
        </Animated.View>

        {palette.length > 0 && (
          <View style={styles.paletteSection}>
            <ThemedText variant="caption" style={styles.paletteLabel}>Your colour palette</ThemedText>
            <View style={styles.paletteRow}>
              {palette.map((colour, i) => (
                <PaletteSwatch key={colour + i} colour={colour} delay={700 + i * 70} />
              ))}
            </View>
          </View>
        )}

        {toneProfile.guidance ? (
          <Animated.View style={[styles.guidanceCard, toneStyle]}>
            <ThemedText variant="bodyM" style={styles.guidanceText}>{toneProfile.guidance}</ThemedText>
          </Animated.View>
        ) : null}

        <View style={styles.highlightSection}>
          <HighlightCard icon="shirt-outline" label="Wardrobe" value="Ready to add your first item" delay={1000} />
          <HighlightCard icon="calendar-outline" label="Daily outfits" value="Curated for your style every morning" delay={1100} />
          <HighlightCard icon="airplane-outline" label="Travel planner" value="Packing lists built around your wardrobe" delay={1200} />
        </View>

        <Animated.View style={btnStyle}>
          <Button 
            title="Enter Stylista" 
            onPress={handleEnter} 
            size="lg"
            icon={<Ionicons name="arrow-forward" size={18} color="#FFF" />}
            style={{ flexDirection: 'row-reverse', width: '100%' }}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  orb: {
    position: 'absolute', width: 400, height: 400, borderRadius: 200,
    backgroundColor: 'rgba(193,123,88,0.08)', top: -120, right: -120,
  },
  scrollContent: { paddingHorizontal: 28, gap: 36 },
  heroSection: { alignItems: 'center', gap: 20 },
  completeBadge: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: 'rgba(193,123,88,0.15)',
    borderWidth: 1.5, borderColor: 'rgba(193,123,88,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroTitle: { color: '#F5F0E8', textAlign: 'center', lineHeight: 40, letterSpacing: -1 },
  heroSub: { color: 'rgba(245,240,232,0.5)', textAlign: 'center', lineHeight: 24 },
  toneSection: { gap: 14, alignItems: 'flex-start' },
  toneBadge: {
    backgroundColor: 'rgba(193,123,88,0.2)', borderWidth: 1, borderColor: C.accent,
    borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 7,
  },
  toneBadgeText: { color: C.accent, letterSpacing: 1, textTransform: 'uppercase', fontWeight: '700' },
  toneDesc: { color: 'rgba(245,240,232,0.6)', lineHeight: 24 },
  paletteSection: { gap: 16 },
  paletteLabel: { color: 'rgba(245,240,232,0.45)', letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: '600' },
  paletteRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  swatch: { width: 44, height: 44, borderRadius: 22 },
  guidanceCard: {
    backgroundColor: 'rgba(245,240,232,0.05)', borderRadius: 18,
    borderWidth: 1, borderColor: 'rgba(245,240,232,0.08)',
    padding: 20,
  },
  guidanceText: { color: 'rgba(245,240,232,0.55)', lineHeight: 24, fontStyle: 'italic' },
  highlightSection: { gap: 10 },
  highlightCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(245,240,232,0.05)', borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(245,240,232,0.07)',
    padding: 18,
  },
  highlightText: { flex: 1, gap: 3 },
});
