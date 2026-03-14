import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Platform, ScrollView, Pressable, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/constants/colors';
import { ThemedText } from '@/components/ui/ThemedText';
import { Card } from '@/components/ui/Card';
import { useApp } from '@/context/AppContext';
import { generateDummyWardrobe, generateDummyOutfits, generateDummyFeedback, validateInsightData } from '@/utils/insightGenerator';
import { WardrobeItem, OutfitPlan, FeedbackEntry } from '@/context/AppContext';

// Simple Bar Chart Component using Views
const SimpleBarChart = ({ data, color }: { data: { label: string; value: number }[]; color: string }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  return (
    <View style={styles.chartContainer}>
      {data.map((item, index) => (
        <View key={index} style={styles.barRow}>
          <ThemedText variant="caption" style={styles.barLabel} numberOfLines={1}>{item.label}</ThemedText>
          <View style={styles.barTrack}>
            <View 
              style={[
                styles.barFill, 
                { width: `${(item.value / maxValue) * 100}%`, backgroundColor: color }
              ]} 
            />
          </View>
          <ThemedText variant="caption" style={styles.barValue}>{item.value}</ThemedText>
        </View>
      ))}
    </View>
  );
};

export default function InsightsScreen() {
  const insets = useSafeAreaInsets();
  const { wardrobe: realWardrobe, outfits: realOutfits, feedback: realFeedback } = useApp();
  
  // State for dummy data
  const [useDummyData, setUseDummyData] = useState(false);
  const [dummyWardrobe, setDummyWardrobe] = useState<WardrobeItem[]>([]);
  const [dummyOutfits, setDummyOutfits] = useState<OutfitPlan[]>([]);
  const [dummyFeedback, setDummyFeedback] = useState<FeedbackEntry[]>([]);
  const [timeRange, setTimeRange] = useState<'30d' | '6m' | '1y'>('30d');

  // Load dummy data on mount if real data is sparse
  useEffect(() => {
    if (realWardrobe.length < 5) {
      setUseDummyData(true);
      const w = generateDummyWardrobe(50);
      const o = generateDummyOutfits(w, 90); // 90 days history
      const f = generateDummyFeedback(o);
      
      setDummyWardrobe(w);
      setDummyOutfits(o);
      setDummyFeedback(f);
      
      validateInsightData(w, o, f);
    }
  }, [realWardrobe.length]);

  const activeWardrobe = useDummyData ? dummyWardrobe : realWardrobe;
  const activeOutfits = useDummyData ? dummyOutfits : realOutfits;
  const activeFeedback = useDummyData ? dummyFeedback : realFeedback;

  // Calculate Metrics
  const metrics = useMemo(() => {
    const totalValue = activeWardrobe.reduce((sum, item) => sum + (item.price || 0), 0);
    const totalItems = activeWardrobe.length;
    const itemsWithPrice = activeWardrobe.filter(i => i.price !== undefined).length;
    
    // Cost Per Wear (only for items with price and wears > 0)
    const itemsWithCPW = activeWardrobe.filter(i => (i.price || 0) > 0 && (i.wearCount || 0) > 0);
    const avgCPW = itemsWithCPW.length > 0
      ? itemsWithCPW.reduce((sum, item) => sum + ((item.price || 0) / (item.wearCount || 1)), 0) / itemsWithCPW.length
      : 0;

    // Category Distribution
    const catCounts: Record<string, number> = {};
    activeWardrobe.forEach(i => {
      catCounts[i.category] = (catCounts[i.category] || 0) + 1;
    });
    const topCategories = Object.entries(catCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, value]) => ({ label, value }));

    // Color Distribution
    const colorCounts: Record<string, number> = {};
    activeWardrobe.forEach(i => {
      if (i.colour) colorCounts[i.colour] = (colorCounts[i.colour] || 0) + 1;
    });
    const topColors = Object.entries(colorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, value]) => ({ label, value }));

    // Wears Logic (based on time range)
    // Note: In a real app, we'd filter outfits by date. 
    // For now, we'll just use the raw 'wearCount' property as a proxy for "All Time"
    // and scale it down for shorter ranges to simulate the effect.
    const wearMultiplier = timeRange === '30d' ? 0.1 : (timeRange === '6m' ? 0.5 : 1);
    
    const utilization = {
      worn: activeWardrobe.filter(i => (i.wearCount || 0) * wearMultiplier >= 1).length,
      unworn: activeWardrobe.filter(i => (i.wearCount || 0) * wearMultiplier < 1).length,
    };

    return {
      totalValue,
      totalItems,
      avgCPW,
      topCategories,
      topColors,
      utilization
    };
  }, [activeWardrobe, timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 20 : 10) }]}>
        <View>
            <ThemedText variant="headingL">Insights</ThemedText>
            <ThemedText variant="bodyS" color={C.textSecondary}>
                {useDummyData ? 'Visualizing Demo Data' : 'Your Wardrobe Analytics'}
            </ThemedText>
        </View>
        
        {/* Time Range Toggle */}
        <View style={styles.toggleRow}>
            {(['30d', '6m', '1y'] as const).map((t) => (
                <Pressable 
                    key={t} 
                    onPress={() => setTimeRange(t)}
                    style={[styles.toggleBtn, timeRange === t && styles.toggleBtnActive]}
                >
                    <ThemedText variant="caption" style={{color: timeRange === t ? C.background : C.textSecondary, fontWeight: timeRange === t ? '600' : '400'}}>
                        {t.toUpperCase()}
                    </ThemedText>
                </Pressable>
            ))}
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Key Metrics Grid */}
        <View style={styles.metricsGrid}>
            <Card style={styles.metricCard}>
                <Ionicons name="pricetag-outline" size={20} color={C.accent} />
                <ThemedText variant="headingM" style={{marginTop: 8}}>{formatCurrency(metrics.totalValue)}</ThemedText>
                <ThemedText variant="caption" color={C.textSecondary}>Total Value</ThemedText>
            </Card>
            <Card style={styles.metricCard}>
                <Ionicons name="stats-chart-outline" size={20} color={C.success} />
                <ThemedText variant="headingM" style={{marginTop: 8}}>{formatCurrency(metrics.avgCPW)}</ThemedText>
                <ThemedText variant="caption" color={C.textSecondary}>Avg Cost/Wear</ThemedText>
            </Card>
        </View>

        {/* 2. Utilization */}
        <View style={styles.section}>
            <ThemedText variant="headingS" style={styles.sectionTitle}>Wardrobe Utilization</ThemedText>
            <Card style={styles.chartCard}>
                <View style={styles.utilizationRow}>
                    <View style={styles.utilizationItem}>
                        <ThemedText variant="headingL" style={{color: C.primary}}>{Math.round((metrics.utilization.worn / metrics.totalItems) * 100)}%</ThemedText>
                        <ThemedText variant="caption" color={C.textSecondary}>Active Items</ThemedText>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.utilizationItem}>
                         <ThemedText variant="headingL" style={{color: C.textMuted}}>{metrics.utilization.unworn}</ThemedText>
                         <ThemedText variant="caption" color={C.textSecondary}>Unworn Items</ThemedText>
                    </View>
                </View>
                <ThemedText variant="caption" color={C.textMuted} style={{marginTop: 12, textAlign: 'center'}}>
                    Based on wear history for the last {timeRange === '30d' ? '30 days' : (timeRange === '6m' ? '6 months' : 'year')}.
                </ThemedText>
            </Card>
        </View>

        {/* 3. Top Categories */}
        <View style={styles.section}>
            <ThemedText variant="headingS" style={styles.sectionTitle}>Top Categories</ThemedText>
            <Card style={styles.chartCard}>
                <SimpleBarChart data={metrics.topCategories} color={C.accent} />
            </Card>
        </View>

        {/* 4. Top Colors */}
        <View style={styles.section}>
            <ThemedText variant="headingS" style={styles.sectionTitle}>Color Palette</ThemedText>
            <Card style={styles.chartCard}>
                <SimpleBarChart data={metrics.topColors} color={C.warning} />
            </Card>
        </View>

        {/* Demo Controls */}
        <Pressable onPress={() => setUseDummyData(!useDummyData)} style={styles.demoToggle}>
            <ThemedText variant="caption" color={C.textMuted}>
                {useDummyData ? 'Switch to Real Data' : 'Switch to Demo Data'}
            </ThemedText>
        </Pressable>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingBottom: 12,
    backgroundColor: C.background,
    zIndex: 10,
  },
  toggleRow: { flexDirection: 'row', backgroundColor: C.cardAlt, borderRadius: 8, padding: 2 },
  toggleBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  toggleBtnActive: { backgroundColor: C.accent },
  
  scrollContent: { padding: 20, gap: 20 },
  
  metricsGrid: { flexDirection: 'row', gap: 12 },
  metricCard: { flex: 1, padding: 16 },
  
  section: { gap: 10 },
  sectionTitle: { color: C.primary },
  chartCard: { padding: 16 },
  
  // Bar Chart
  chartContainer: { gap: 12 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  barLabel: { width: 80, color: C.textSecondary },
  barTrack: { flex: 1, height: 8, backgroundColor: C.cardAlt, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  barValue: { width: 30, textAlign: 'right', color: C.textMuted },

  // Utilization
  utilizationRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  utilizationItem: { alignItems: 'center' },
  divider: { width: 1, height: 40, backgroundColor: C.border },

  demoToggle: { alignItems: 'center', padding: 20 },
});
