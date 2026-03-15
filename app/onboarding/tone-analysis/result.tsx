import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { C } from '@/constants/colors';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';

export default function AnalysisResultScreen() {
  const insets = useSafeAreaInsets();
  const { updateToneProfile } = useApp();
  const [analyzing, setAnalyzing] = useState(true);
  const [result, setResult] = useState<'warm' | 'cool' | 'neutral' | null>(null);

  useEffect(() => {
    // Simulate analysis delay
    const timer = setTimeout(() => {
      const mockResult = 'warm'; // Mocked result
      setResult(mockResult);
      setAnalyzing(false);
      
      // Save result to context
      const palettes = {
        warm: ['#C17B58', '#D4A96A', '#8B5E3C', '#E8D5B0', '#7A5230', '#C9956C', '#F0E0CC'],
        cool: ['#7B9BBF', '#6B8CAE', '#4A7299', '#B0C8E8', '#3D6480', '#8FAECE', '#D5E5F5'],
        neutral: ['#8B8070', '#A09080', '#C4B5A5', '#E0D5C8', '#6B6055', '#B0A595', '#D5CCBF'],
      };
      
      const guidance = {
        warm: 'Your colouring has warm golden undertones. Terracotta, camel, olive, and rich burnt orange will make you glow.',
        cool: 'Your colouring has cool blue undertones. Navy, burgundy, emerald, and pure white will make your features stand out.',
        neutral: 'You have beautifully balanced neutral undertones — both warm and cool shades work for you. Focus on mid-tones.',
      };

      updateToneProfile({
        toneType: mockResult,
        palette: palettes[mockResult],
        guidance: guidance[mockResult],
      });

    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    router.push('/onboarding/loves');
  };

  if (analyzing) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={C.accent} />
        <ThemedText variant="headingM" style={styles.loadingText}>Analyzing your tone...</ThemedText>
        <ThemedText variant="bodyS" color={C.textMuted} style={styles.subText}>Processing skin, vein, and contrast data</ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="sparkles" size={48} color={C.accent} />
        </View>
        
        <ThemedText variant="headingXL" style={styles.title}>You are {result?.charAt(0).toUpperCase() + result!.slice(1)}!</ThemedText>
        
        <View style={styles.resultCard}>
          <ThemedText variant="bodyM" style={styles.description}>
            {result === 'warm' && 'Your colouring has warm golden undertones. Terracotta, camel, olive, and rich burnt orange will make you glow.'}
            {result === 'cool' && 'Your colouring has cool blue undertones. Navy, burgundy, emerald, and pure white will make your features stand out.'}
            {result === 'neutral' && 'You have beautifully balanced neutral undertones — both warm and cool shades work for you.'}
          </ThemedText>
        </View>

        <View style={styles.paletteContainer}>
          <ThemedText variant="headingS" style={styles.paletteTitle}>Your Signature Palette</ThemedText>
          <View style={styles.swatches}>
             {result === 'warm' && ['#C17B58', '#D4A96A', '#8B5E3C', '#E8D5B0'].map(c => (
               <View key={c} style={[styles.swatch, { backgroundColor: c }]} />
             ))}
             {result === 'cool' && ['#7B9BBF', '#6B8CAE', '#4A7299', '#B0C8E8'].map(c => (
               <View key={c} style={[styles.swatch, { backgroundColor: c }]} />
             ))}
             {result === 'neutral' && ['#8B8070', '#A09080', '#C4B5A5', '#E0D5C8'].map(c => (
               <View key={c} style={[styles.swatch, { backgroundColor: c }]} />
             ))}
          </View>
        </View>

        <Pressable onPress={() => router.push('/(tabs)/discover')} style={styles.expertPrompt}>
          <View style={styles.expertIcon}>
            <Ionicons name="chatbubbles-outline" size={20} color={C.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText variant="bodyS" style={{ fontWeight: '600' }}>Want a second opinion?</ThemedText>
            <ThemedText variant="caption" color={C.textSecondary}>A colour specialist can review your palette and provide personalised recommendations.</ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={16} color={C.muted} />
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Button 
          title="Continue to Style Profile" 
          onPress={handleContinue}
          icon={<Ionicons name="arrow-forward" size={18} color="#FFF" />}
          style={{ flexDirection: 'row-reverse' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
    paddingHorizontal: 28,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 24,
    marginBottom: 8,
  },
  subText: {
    textAlign: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(193,123,88,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: C.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: C.card,
    padding: 24,
    borderRadius: 16,
    width: '100%',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: C.border,
  },
  description: {
    color: C.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  paletteContainer: {
    width: '100%',
    alignItems: 'center',
  },
  paletteTitle: {
    marginBottom: 16,
    color: C.text,
  },
  swatches: {
    flexDirection: 'row',
    gap: 12,
  },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  footer: {
    paddingTop: 16,
  },
  expertPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    width: '100%',
    marginTop: 24,
  },
  expertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
