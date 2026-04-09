import React, { useCallback, useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { CartProvider } from '@/context/CartContext';
import { AppColors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          Inter_400Regular: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.ttf',
          Inter_500Medium: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-500-normal.ttf',
          Inter_600SemiBold: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-600-normal.ttf',
          Inter_700Bold: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.ttf',
          SpaceGrotesk_500Medium: 'https://cdn.jsdelivr.net/fontsource/fonts/space-grotesk@latest/latin-500-normal.ttf',
          SpaceGrotesk_600SemiBold: 'https://cdn.jsdelivr.net/fontsource/fonts/space-grotesk@latest/latin-600-normal.ttf',
          SpaceGrotesk_700Bold: 'https://cdn.jsdelivr.net/fontsource/fonts/space-grotesk@latest/latin-700-normal.ttf',
        });
      } catch (e) {
        console.warn('Font loading failed, using system fonts:', e);
      }
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={ls.loader}>
        <ActivityIndicator size="large" color={AppColors.primaryGreen} />
      </View>
    );
  }

  return (
    <CartProvider>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="splash" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="login" />
          <Stack.Screen name="loader" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="product/[id]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="cart" options={{ animation: 'slide_from_bottom' }} />
        </Stack>
        <StatusBar style="auto" />
      </View>
    </CartProvider>
  );
}

const ls = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: AppColors.white },
});
