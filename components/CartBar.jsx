import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring,
} from 'react-native-reanimated';
import { AppColors, Spacing, BorderRadius } from '@/constants/theme';
import { useCart } from '@/context/CartContext';

export default function CartBar() {
  const router = useRouter();
  const { cartCount, cartTotal } = useCart();
  const translateY = useSharedValue(100);

  useEffect(() => {
    translateY.value = withSpring(cartCount > 0 ? 0 : 100, { damping: 15, stiffness: 150 });
  }, [cartCount]);

  const anim = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  if (cartCount === 0) return null;

  return (
    <Animated.View style={[styles.wrap, anim]}>
      <TouchableOpacity style={styles.bar} onPress={() => router.push('/cart')} activeOpacity={0.9}>
        <View style={styles.left}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartCount}</Text>
          </View>
          <View>
            <Text style={styles.itemText}>
              {cartCount} item{cartCount > 1 ? 's' : ''} · ₹{cartTotal}
            </Text>
            <Text style={styles.extra}>Extra charges may apply</Text>
          </View>
        </View>
        <View style={styles.right}>
          <Text style={styles.viewText}>View Cart</Text>
          <Ionicons name="arrow-forward" size={18} color={AppColors.white} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', bottom: 65, left: Spacing.lg, right: Spacing.lg, zIndex: 100 },
  bar: {
    backgroundColor: AppColors.primaryGreen, borderRadius: BorderRadius.lg,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  badge: {
    backgroundColor: AppColors.white, borderRadius: BorderRadius.full,
    width: 24, height: 24, alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { color: AppColors.primaryGreen, fontSize: 12, fontWeight: '700' },
  itemText: { color: AppColors.white, fontSize: 14, fontWeight: '600' },
  extra: { color: 'rgba(255,255,255,0.7)', fontSize: 10 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewText: { color: AppColors.white, fontSize: 14, fontWeight: '700' },
});
