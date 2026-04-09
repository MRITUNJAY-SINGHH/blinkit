import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { AppColors, FontFamily } from '@/constants/theme';

export default function LoaderScreen() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.replace('/(tabs)'), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={s.container}>
      <ActivityIndicator size="large" color={AppColors.primaryGreen} />
      <Text style={s.text}>Setting up your store...</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.white, alignItems: 'center', justifyContent: 'center' },
  text: { marginTop: 20, fontSize: 16, color: AppColors.secondaryGrey, fontFamily: FontFamily.bodyMedium },
});
