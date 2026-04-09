import React, { useMemo } from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppColors, FontFamily, BorderRadius } from '@/constants/theme';
import { useCart } from '@/context/CartContext';

function CartTabIcon({ color, size }) {
  const { cartCount } = useCart();
  return (
    <View>
      <Ionicons name="cart" size={size} color={color} />
      {cartCount > 0 && (
        <View style={bs.badge}>
          <Text style={bs.badgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
        </View>
      )}
    </View>
  );
}

const bs = StyleSheet.create({
  badge: {
    position: 'absolute', top: -4, right: -8,
    backgroundColor: AppColors.error, borderRadius: 10,
    minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
});

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const tabBottom = useMemo(() => {
    if (Platform.OS === 'android') return insets.bottom > 0 ? Math.max(8, insets.bottom - 2) : 16;
    return Math.max(10, insets.bottom);
  }, [insets.bottom]);

  const scenePadding = useMemo(() => 72 + tabBottom + 16, [tabBottom]);

  const screenOptions = useMemo(() => ({
    headerShown: false,
    tabBarShowLabel: true,
    sceneStyle: { paddingBottom: scenePadding, backgroundColor: AppColors.background },
    tabBarActiveTintColor: AppColors.primaryGreen,
    tabBarInactiveTintColor: AppColors.secondaryGrey,
    tabBarStyle: {
      backgroundColor: AppColors.white,
      borderTopWidth: 0,
      height: 68,
      paddingBottom: 8,
      paddingTop: 6,
      marginHorizontal: 12,
      marginBottom: tabBottom,
      borderRadius: 20,
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      elevation: 14,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.08,
      shadowRadius: 14,
    },
    tabBarItemStyle: { paddingVertical: 2, alignItems: 'center', justifyContent: 'center' },
    tabBarLabelStyle: { fontSize: 10, fontFamily: FontFamily.bodySemiBold, marginTop: 1 },
  }), [scenePadding, tabBottom]);

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen name="index" options={{
        title: 'Home',
        tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
      }} />
      <Tabs.Screen name="search" options={{
        title: 'Search',
        tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} />,
      }} />
      <Tabs.Screen name="cart-tab" options={{
        title: 'Cart',
        tabBarIcon: ({ color, size }) => <CartTabIcon color={color} size={size} />,
      }} />
      <Tabs.Screen name="orders" options={{
        title: 'Orders',
        tabBarIcon: ({ color, size }) => <Ionicons name="receipt" size={size} color={color} />,
      }} />
      <Tabs.Screen name="account" options={{
        title: 'Profile',
        tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
      }} />
      {/* Hide old tabs */}
      <Tabs.Screen name="categories" options={{ href: null }} />
      <Tabs.Screen name="home" options={{ href: null }} />
    </Tabs>
  );
}
