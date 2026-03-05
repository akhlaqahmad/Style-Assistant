import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, withSpring, Easing } from 'react-native-reanimated';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

export default function OnboardingComplete() {
  const insets = useSafeAreaInsets();
  const { userProfile, toneProfile } = useApp();

  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const btnOpacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(100, withSpring(1, { damping: 12, stiffness: 100 }));
    opacity.value = withDelay(100, withTiming(1, { duration: 400 }));
    textOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
    btnOpacity.value = withDelay(1100, withTiming(1, { duration: 400 }));
  }, []);

  const circleStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }], opacity: opacity.value }));
  const textStyle = useAnimatedStyle(() => ({ opacity: textOpacity.value }));
  const btnStyle = useAnimatedStyle(() => ({ opacity: btnOpacity.value }));

  const toneName = toneProfile.toneType ? toneProfile.toneType.charAt(0).toUpperCase() + toneProfile.toneType.slice(1) : 'Balanced';

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1A1410', '#2D1F14', '#3D2818']} style={StyleSheet.absoluteFill} />
      <View style={[styles.content, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 60), paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 40) }]}>
        <Animated.View style={[styles.circleWrap, circleStyle]}>
          <View style={styles.circle}>
            <Text style={styles.circleIcon}>✦</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.textBlock, textStyle]}>
          <Text style={styles.greeting}>
            {userProfile.name ? `Welcome, ${userProfile.name}` : 'Welcome to StylistA'}
          </Text>
          <Text style={styles.title}>Your style profile{'\n'}is ready.</Text>
          <Text style={styles.subtitle}>We've built your personalised wardrobe experience based on your answers. Here's a glimpse:</Text>

          <View style={styles.cards}>
            {toneProfile.toneType ? (
              <View style={styles.card}>
                <Text style={styles.cardLabel}>Your tone</Text>
                <Text style={styles.cardValue}>{toneName} palette</Text>
                <View style={styles.swatches}>
                  {toneProfile.palette.slice(0, 5).map((color, i) => (
                    <View key={i} style={[styles.swatch, { backgroundColor: color }]} />
                  ))}
                </View>
              </View>
            ) : null}

            <View style={styles.card}>
              <Text style={styles.cardLabel}>Next step</Text>
              <Text style={styles.cardValue}>Build your wardrobe</Text>
              <Text style={styles.cardHint}>Add your first items to unlock daily outfit suggestions</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.btnWrap, btnStyle]}>
          <Pressable
            style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }]}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.btnText}>Explore my wardrobe</Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1410' },
  content: { flex: 1, paddingHorizontal: 28, alignItems: 'center', justifyContent: 'space-between' },
  circleWrap: {},
  circle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(193,123,88,0.2)',
    borderWidth: 1, borderColor: 'rgba(193,123,88,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  circleIcon: { fontSize: 40, color: C.accent },
  textBlock: { width: '100%', gap: 14 },
  greeting: { fontFamily: 'Inter_500Medium', fontSize: 14, color: 'rgba(245,240,232,0.5)', letterSpacing: 0.5 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 38, color: '#F5F0E8', lineHeight: 46, letterSpacing: -1 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 15, color: 'rgba(245,240,232,0.6)', lineHeight: 22 },
  cards: { gap: 12, marginTop: 8 },
  card: {
    backgroundColor: 'rgba(245,240,232,0.06)', borderRadius: 16,
    padding: 16, borderWidth: 1, borderColor: 'rgba(245,240,232,0.1)', gap: 4,
  },
  cardLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, color: 'rgba(245,240,232,0.4)', textTransform: 'uppercase', letterSpacing: 1 },
  cardValue: { fontFamily: 'Inter_600SemiBold', fontSize: 18, color: '#F5F0E8' },
  cardHint: { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(245,240,232,0.5)' },
  swatches: { flexDirection: 'row', gap: 6, marginTop: 6 },
  swatch: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  btnWrap: { width: '100%' },
  btn: { backgroundColor: C.accent, borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  btnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#FFF', letterSpacing: 0.2 },
});
