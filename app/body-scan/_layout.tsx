import { Stack } from 'expo-router';
import React from 'react';

export default function BodyScanLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="measurements" />
      <Stack.Screen name="capture" />
      <Stack.Screen name="result" />
    </Stack>
  );
}
