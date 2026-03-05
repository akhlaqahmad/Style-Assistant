import { Stack } from 'expo-router';
import React from 'react';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="basics" />
      <Stack.Screen name="body" />
      <Stack.Screen name="tone" />
      <Stack.Screen name="style" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
