import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AppColors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useCart } from '@/context/CartContext';
import StarRating from './StarRating';
import QuantitySelector from './QuantitySelector';

export default function ProductCard({ product }) {
  const router = useRouter();
  const { items, addToCart, updateQuantity } = useCart();
  const cartItem = items.find(i => i.id === product.id);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => router.push(`/product/${product.id}`)}
    >
      {product.discount > 0 && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{product.discount}% OFF</Text>
        </View>
      )}

      <TouchableOpacity style={styles.heart}>
        <Ionicons name="heart-outline" size={18} color={AppColors.secondaryGrey} />
      </TouchableOpacity>

      <View style={[styles.imgBox, { backgroundColor: product.bgColor }]}>
        <Text style={styles.emoji}>{product.emoji}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.size}>{product.size}</Text>

        <View style={styles.ratingRow}>
          <StarRating rating={product.rating} size={10} />
          <Text style={styles.ratingCount}>({product.ratingCount})</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{product.price}</Text>
          <Text style={styles.mrp}>₹{product.mrp}</Text>
        </View>

        {cartItem ? (
          <QuantitySelector
            quantity={cartItem.quantity}
            onIncrease={() => updateQuantity(product.id, cartItem.quantity + 1)}
            onDecrease={() => updateQuantity(product.id, cartItem.quantity - 1)}
          />
        ) : (
          <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(product)}>
            <Text style={styles.addText}>ADD</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: AppColors.cardBorder,
    padding: Spacing.sm,
    width: 160,
    marginRight: Spacing.md,
    position: 'relative',
  },
  discountBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: AppColors.highlightYellow,
    paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: BorderRadius.sm, zIndex: 1,
  },
  discountText: { ...Typography.discountBadge },
  heart: { position: 'absolute', top: 8, right: 8, zIndex: 1 },
  imgBox: {
    alignItems: 'center', justifyContent: 'center',
    height: 100, borderRadius: BorderRadius.md, marginBottom: Spacing.sm,
  },
  emoji: { fontSize: 48 },
  info: { gap: 3 },
  name: { ...Typography.productName },
  size: { ...Typography.caption, fontSize: 11 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingCount: { fontSize: 10, color: AppColors.secondaryGrey },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  price: { ...Typography.price, fontSize: 14 },
  mrp: { ...Typography.mrp },
  addBtn: {
    borderWidth: 1.5, borderColor: AppColors.primaryGreen,
    borderRadius: BorderRadius.md, paddingVertical: 6,
    alignItems: 'center', marginTop: 4,
  },
  addText: { color: AppColors.primaryGreen, fontWeight: '700', fontSize: 13 },
});
