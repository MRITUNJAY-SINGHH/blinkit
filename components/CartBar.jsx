import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { AppColors, FontFamily, Spacing, BorderRadius } from '@/constants/theme';
import { useCart } from '@/context/CartContext';

export default function CartBar() {
  const router = useRouter();
  const { cartCount, cartTotal, items } = useCart();
  const translateY = useSharedValue(80);

  useEffect(() => {
    translateY.value = withSpring(cartCount > 0 ? 0 : 80, { damping: 18, stiffness: 180 });
  }, [cartCount]);

  const anim = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  if (cartCount === 0) return null;

  const firstItem = items[0];

  return (
    <Animated.View style={[s.wrap, anim]}>
      <TouchableOpacity style={s.bar} onPress={() => router.push('/cart')} activeOpacity={0.9}>
        {/* Left: item thumbnail + count */}
        <View style={s.left}>
          {firstItem?.image ? (
            <Image source={{ uri: firstItem.image }} style={s.thumb} resizeMode="cover" />
          ) : (
            <View style={[s.thumb, s.thumbFallback]}>
              <Ionicons name="cart" size={16} color="#FFF" />
            </View>
          )}
          <View>
            <Text style={s.viewText}>View cart</Text>
            <Text style={s.countText}>{cartCount} item{cartCount > 1 ? 's' : ''}</Text>
          </View>
        </View>
        {/* Right: total + arrow */}
        <View style={s.right}>
          <Text style={s.totalText}>₹{cartTotal}</Text>
          <Ionicons name="chevron-forward" size={18} color="#FFF" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrap: {
    position: 'absolute', bottom: 2, left: Spacing.md, right: Spacing.md, zIndex: 90,
  },
  bar: {
    backgroundColor: '#0D8320', borderRadius: BorderRadius.xl,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 10, paddingHorizontal: Spacing.lg,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 10,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  thumb: { width: 36, height: 36, borderRadius: 8, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)' },
  thumbFallback: { backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  viewText: { color: '#FFF', fontSize: 14, fontFamily: FontFamily.headingSemiBold },
  countText: { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontFamily: FontFamily.body },
  right: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  totalText: { color: '#FFF', fontSize: 15, fontFamily: FontFamily.heading },
});
