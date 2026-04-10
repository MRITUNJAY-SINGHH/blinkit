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
        <View style={s.glowA} />
        <View style={s.glowB} />
        {/* Left: item thumbnail + count */}
        <View style={s.left}>
          <View style={s.thumbStack}>
            {items.slice(0, 2).map((item, idx) => (
              item?.image ? (
                <Image
                  key={item.id}
                  source={{ uri: item.image }}
                  style={[s.thumb, idx === 1 && s.thumbSecond]}
                  resizeMode="cover"
                />
              ) : (
                <View key={item.id} style={[s.thumb, s.thumbFallback, idx === 1 && s.thumbSecond]}>
                  <Ionicons name="bag-handle" size={14} color="#FFF" />
                </View>
              )
            ))}
            {!firstItem && (
              <View style={[s.thumb, s.thumbFallback]}>
                <Ionicons name="cart" size={16} color="#FFF" />
              </View>
            )}
          </View>
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
    paddingVertical: 11, paddingHorizontal: Spacing.lg,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 10,
    overflow: 'hidden',
  },
  glowA: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.12)',
    top: -66,
    right: -10,
  },
  glowB: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -50,
    left: 70,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  thumbStack: { width: 48, justifyContent: 'center' },
  thumb: { width: 36, height: 36, borderRadius: 8, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)' },
  thumbSecond: { position: 'absolute', left: 12 },
  thumbFallback: { backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  viewText: { color: '#FFF', fontSize: 14, fontFamily: FontFamily.headingSemiBold },
  countText: { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontFamily: FontFamily.body },
  right: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  totalText: { color: '#FFF', fontSize: 15, fontFamily: FontFamily.heading },
});
