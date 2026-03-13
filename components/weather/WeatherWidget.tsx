import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/constants/colors';
import { ThemedText } from '@/components/ui/ThemedText';
import { Card } from '@/components/ui/Card';
import { useApp } from '@/context/AppContext';

export function WeatherWidget() {
  const { weather, isLoading, userProfile } = useApp();

  if (!userProfile.weatherAware) return null;

  if (!weather && isLoading) {
    return (
      <Card style={styles.card}>
        <ActivityIndicator color={C.accent} />
      </Card>
    );
  }

  if (!weather) return null;

  const iconName = getWeatherIcon(weather.icon);

  return (
    <Card style={styles.card} variant="default">
      <View style={styles.row}>
        <View style={styles.info}>
          <ThemedText variant="caption" style={styles.label}>Current Weather</ThemedText>
          <View style={styles.tempRow}>
            <ThemedText variant="headingM" style={styles.temp}>{weather.temp}°</ThemedText>
            <View style={styles.iconContainer}>
              <Ionicons name={iconName} size={24} color={C.accent} />
            </View>
          </View>
          <ThemedText variant="bodyS" color={C.textSecondary}>{weather.description}</ThemedText>
        </View>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Ionicons name="water-outline" size={14} color={C.muted} />
            <ThemedText variant="caption" color={C.textSecondary}>{weather.humidity}%</ThemedText>
          </View>
          <View style={styles.stat}>
            <Ionicons name="speedometer-outline" size={14} color={C.muted} />
            <ThemedText variant="caption" color={C.textSecondary}>{weather.windSpeed} km/h</ThemedText>
          </View>
        </View>
      </View>
      
      <View style={styles.recommendation}>
        <Ionicons name="shirt-outline" size={16} color={C.primary} />
        <ThemedText variant="caption" style={styles.recText}>
          {getClothingRecommendation(weather.temp, weather.condition)}
        </ThemedText>
      </View>
    </Card>
  );
}

function getWeatherIcon(icon: string): any {
  // Map API icons to Ionicons
  if (icon.includes('sun') || icon.includes('clear')) return 'sunny';
  if (icon.includes('cloud')) return 'cloudy';
  if (icon.includes('rain')) return 'rainy';
  if (icon.includes('snow')) return 'snow';
  if (icon.includes('thunder')) return 'thunderstorm';
  return 'partly-sunny';
}

function getClothingRecommendation(temp: number, condition: string): string {
  if (condition.toLowerCase().includes('rain')) return 'Don\'t forget an umbrella and waterproof jacket.';
  if (temp < 10) return 'Bundle up with a warm coat and layers.';
  if (temp < 18) return 'A light jacket or sweater would be perfect.';
  if (temp < 25) return 'T-shirt weather, but maybe bring a light layer.';
  return 'Stay cool in breathable fabrics like linen or cotton.';
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  info: {
    flex: 1,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: C.muted,
    marginBottom: 4,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  temp: {
    color: C.primary,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stats: {
    gap: 8,
    alignItems: 'flex-end',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recommendation: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: C.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recText: {
    color: C.primary,
    flex: 1,
  },
});
