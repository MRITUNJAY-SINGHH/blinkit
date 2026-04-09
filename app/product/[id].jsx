import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppColors, Spacing, BorderRadius } from '@/constants/theme';
import { products } from '@/constants/products';
import { useCart } from '@/context/CartContext';
import StarRating from '@/components/StarRating';
import QuantitySelector from '@/components/QuantitySelector';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const product = products.find(p => p.id === id);
  const { items, addToCart, updateQuantity } = useCart();
  const cartItem = items.find(i => i.id === id);

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 60 }}>Product not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={AppColors.primaryBlack} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="share-outline" size={22} color={AppColors.primaryBlack} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Image */}
        <View style={[styles.imgBox, { backgroundColor: product.bgColor }]}>
          {product.discount > 0 && (
            <View style={styles.discBadge}>
              <Text style={styles.discText}>{product.discount}% OFF</Text>
            </View>
          )}
          <Text style={styles.emoji}>{product.emoji}</Text>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.size}>{product.size}</Text>

          <View style={styles.ratingRow}>
            <StarRating rating={product.rating} size={14} />
            <Text style={styles.ratingText}>{product.rating} ({product.ratingCount} ratings)</Text>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <View style={styles.priceYellow}>
              <Text style={styles.priceLabel}>₹{product.price}</Text>
            </View>
            <Text style={styles.mrp}>MRP ₹{product.mrp}</Text>
          </View>

          {/* Description */}
          <Text style={styles.descTitle}>Description</Text>
          <Text style={styles.desc}>{product.description}</Text>

          {/* Why choose */}
          <View style={styles.whyBox}>
            <Text style={styles.whyTitle}>Why Choose This?</Text>
            <View style={styles.whyItem}>
              <Ionicons name="checkmark-circle" size={18} color={AppColors.primaryGreen} />
              <Text style={styles.whyText}>Premium quality ingredients</Text>
            </View>
            <View style={styles.whyItem}>
              <Ionicons name="checkmark-circle" size={18} color={AppColors.primaryGreen} />
              <Text style={styles.whyText}>Sustainably sourced</Text>
            </View>
            <View style={styles.whyItem}>
              <Ionicons name="checkmark-circle" size={18} color={AppColors.primaryGreen} />
              <Text style={styles.whyText}>Fast 10-minute delivery</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPrice}>₹{product.price}</Text>
          <Text style={styles.bottomMrp}>₹{product.mrp}</Text>
        </View>
        {cartItem ? (
          <QuantitySelector
            quantity={cartItem.quantity}
            onIncrease={() => updateQuantity(product.id, cartItem.quantity + 1)}
            onDecrease={() => updateQuantity(product.id, cartItem.quantity - 1)}
          />
        ) : (
          <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(product)}>
            <Text style={styles.addBtnText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.white },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
  },
  imgBox: {
    height: 260, alignItems: 'center', justifyContent: 'center',
    marginHorizontal: Spacing.lg, borderRadius: BorderRadius.xl, position: 'relative',
  },
  discBadge: {
    position: 'absolute', top: 16, left: 16,
    backgroundColor: AppColors.highlightYellow, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  discText: { fontSize: 12, fontWeight: '700', color: AppColors.primaryBlack },
  emoji: { fontSize: 100 },
  info: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl },
  name: { fontSize: 22, fontWeight: '700', color: AppColors.primaryBlack },
  size: { fontSize: 14, color: AppColors.secondaryGrey, marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: Spacing.md },
  ratingText: { fontSize: 13, color: AppColors.secondaryGrey },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginTop: Spacing.lg },
  priceYellow: {
    backgroundColor: AppColors.highlightYellow, paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: BorderRadius.md,
  },
  priceLabel: { fontSize: 20, fontWeight: '800', color: AppColors.primaryBlack },
  mrp: { fontSize: 15, color: AppColors.secondaryGrey, textDecorationLine: 'line-through' },
  descTitle: { fontSize: 16, fontWeight: '700', color: AppColors.primaryBlack, marginTop: Spacing.xxl },
  desc: { fontSize: 14, color: AppColors.secondaryGrey, lineHeight: 22, marginTop: Spacing.sm },
  whyBox: {
    marginTop: Spacing.xxl, backgroundColor: AppColors.lightGreen,
    borderRadius: BorderRadius.lg, padding: Spacing.lg,
  },
  whyTitle: { fontSize: 15, fontWeight: '700', color: AppColors.primaryBlack, marginBottom: Spacing.md },
  whyItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  whyText: { fontSize: 14, color: AppColors.primaryBlack },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: AppColors.white, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg,
    borderTopWidth: 1, borderTopColor: AppColors.cardBorder,
    shadowColor: '#000', shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 5,
  },
  bottomPrice: { fontSize: 20, fontWeight: '800', color: AppColors.primaryBlack },
  bottomMrp: { fontSize: 13, color: AppColors.secondaryGrey, textDecorationLine: 'line-through' },
  addBtn: {
    backgroundColor: AppColors.primaryGreen, borderRadius: BorderRadius.lg,
    paddingHorizontal: 32, paddingVertical: Spacing.md,
  },
  addBtnText: { color: AppColors.white, fontSize: 16, fontWeight: '700' },
});
