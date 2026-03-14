import { Stack } from 'expo-router';
import React from 'react';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right', contentStyle: { backgroundColor: '#0F0D0B' } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="name" />
      <Stack.Screen name="age" />
      <Stack.Screen name="gender" />
      <Stack.Screen name="clothing-style" />
      <Stack.Screen name="location" />
      <Stack.Screen name="eye" />
      <Stack.Screen name="hair" />
      <Stack.Screen name="skin" />
      <Stack.Screen name="loves" />
      <Stack.Screen name="styles" />
      <Stack.Screen name="lifestyle" />
      <Stack.Screen name="alerts" />
      <Stack.Screen name="complete" />
      <Stack.Screen name="basics" />
      <Stack.Screen name="tone" />
      <Stack.Screen name="body" />
      <Stack.Screen name="style" />
      <Stack.Screen name="tone-analysis/capture-face" />
      <Stack.Screen name="tone-analysis/capture-wrist" />
      <Stack.Screen name="tone-analysis/capture-card" />
      <Stack.Screen name="tone-analysis/result" />
    </Stack>
  );
}
