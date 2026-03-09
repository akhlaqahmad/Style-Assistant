import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { C } from '@/constants/colors';

interface MeasurementProcessingStepProps {
  onComplete: (data: any) => void;
}

export default function MeasurementProcessingStep({ onComplete }: MeasurementProcessingStepProps) {
  const [stage, setStage] = useState('Analyzing photos...');

  useEffect(() => {
    const t1 = setTimeout(() => setStage('Detecting garment edges...'), 1500);
    const t2 = setTimeout(() => setStage('Extracting dimensions...'), 3000);
    const t3 = setTimeout(() => setStage('Analyzing fabric & color...'), 4500);
    const t4 = setTimeout(() => {
      // Mock result
      onComplete({
        measurements: {
          shoulder: '42cm',
          bust: '98cm',
          waist: '88cm',
          length: '65cm',
          sleeve: '22cm',
        },
        color: {
          hex: '#2D2D2A',
          name: 'Charcoal',
          palette: ['#2D2D2A', '#8B7B6B', '#F5F0E8']
        },
        fabric: 'Cotton Blend',
        care: 'Machine wash cold, Tumble dry low',
        category: 'Tops'
      });
    }, 6000);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={C.accent} style={{ transform: [{ scale: 1.5 }] }} />
      <Text style={styles.title}>AI Analysis in Progress</Text>
      <Text style={styles.subtitle}>{stage}</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: stage.includes('Analyzing') ? '25%' : stage.includes('Detecting') ? '50%' : stage.includes('Extracting') ? '75%' : '100%' }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 20, fontFamily: 'Inter_600SemiBold', color: C.primary, marginTop: 24, marginBottom: 8 },
  subtitle: { fontSize: 15, fontFamily: 'Inter_400Regular', color: C.muted, marginBottom: 30 },
  progressBar: { width: '80%', height: 6, backgroundColor: C.border, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: C.accent },
});
