import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClientProvider } from "@tanstack/react-query";
import { router, Stack, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { queryClient } from "@/lib/query-client";
import { AppProvider, useApp } from "@/context/AppContext";

SplashScreen.preventAutoHideAsync();

function NavigationGuard({ children }: { children: React.ReactNode }) {
  const { userProfile, isLoading } = useApp();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;
    const inOnboarding = segments[0] === 'onboarding';
    if (!userProfile.onboardingComplete && !inOnboarding) {
      router.replace('/onboarding');
    } else if (userProfile.onboardingComplete && inOnboarding) {
      router.replace('/(tabs)');
    }
  }, [userProfile.onboardingComplete, isLoading, segments]);

  return <>{children}</>;
}

function RootLayoutNav() {
  return (
    <AppProvider>
      <NavigationGuard>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="wardrobe/add" options={{ presentation: 'modal', headerShown: false }} />
          <Stack.Screen name="wardrobe/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="outfit/feedback" options={{ presentation: 'modal', headerShown: false }} />
          <Stack.Screen name="planner/new" options={{ presentation: 'modal', headerShown: false }} />
          <Stack.Screen name="planner/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="stylists/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="body-scan" options={{ headerShown: false }} />
          <Stack.Screen name="try-on" options={{ presentation: 'modal', headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
        </Stack>
      </NavigationGuard>
    </AppProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <KeyboardProvider>
            <RootLayoutNav />
          </KeyboardProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
