import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AppColors, FontFamily, Spacing, BorderRadius } from '@/constants/theme';
import { useCart } from '@/context/CartContext';
import QuantitySelector from './QuantitySelector';

export default function ProductCard({ product }) {
  const router = useRouter();
  const { items, addToCart, updateQuantity } = useCart();
  const cartItem = items.find(i => i.id === product.id);
  const isVeg = product.itemType === 'Veg';

  return (
    <TouchableOpacity style={s.card} activeOpacity={0.9}
      onPress={() => router.push(`/product/${product.id}`)}>

      {/* Wishlist */}
      <TouchableOpacity style={s.heart}>
        <Ionicons name="heart-outline" size={16} color={AppColors.secondaryGrey} />
      </TouchableOpacity>

      {/* Image */}
      <View style={s.imgWrap}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={s.img} resizeMode="cover" />
        ) : (
          <View style={[s.img, s.placeholder]}>
            <Text style={{ fontSize: 36 }}>{product.emoji || '🍽️'}</Text>
          </View>
        )}
        {/* ADD Button overlaid at bottom of image */}
        <View style={s.addWrap}>
          {cartItem ? (
            <QuantitySelector quantity={cartItem.quantity}
              onIncrease={() => updateQuantity(product.id, cartItem.quantity + 1)}
              onDecrease={() => updateQuantity(product.id, cartItem.quantity - 1)} />
          ) : (
            <TouchableOpacity style={s.addBtn} onPress={() => addToCart(product)}>
              <Text style={s.addText}>ADD</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Info */}
      <View style={s.info}>
        {/* Type + Size */}
        <View style={s.typeRow}>
          <View style={[s.typeDot, { backgroundColor: isVeg ? '#0F8A2A' : '#E23744' }]} />
          <Text style={s.sizeText}>{product.size}</Text>
        </View>

        {/* Name */}
        <Text style={s.name} numberOfLines={2}>{product.name}</Text>

        {/* Delivery */}
        <View style={s.delivRow}>
          <Ionicons name="time-outline" size={12} color={AppColors.secondaryGrey} />
          <Text style={s.delivText}>10 MINS</Text>
        </View>

        {/* Price */}
        <View style={s.priceRow}>
          {product.discount > 0 && (
            <Text style={s.discLabel}>{product.discount}% OFF</Text>
          )}
          <Text style={s.price}>₹{product.price}</Text>
          {product.discount > 0 && <Text style={s.mrp}>MRP ₹{product.mrp}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: AppColors.white, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: '#F0F0F0', width: 155, marginRight: Spacing.md,
  },
  heart: { position: 'absolute', top: 8, right: 8, zIndex: 2 },
  imgWrap: { position: 'relative', alignItems: 'center' },
  img: { width: '100%', height: 120, borderTopLeftRadius: BorderRadius.lg, borderTopRightRadius: BorderRadius.lg },
  placeholder: { backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center' },
  addWrap: { position: 'absolute', bottom: -14, zIndex: 2 },
  addBtn: {
    backgroundColor: AppColors.white, borderWidth: 1.5, borderColor: AppColors.primaryGreen,
    borderRadius: BorderRadius.md, paddingHorizontal: 24, paddingVertical: 5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3,
  },
  addText: { color: AppColors.primaryGreen, fontFamily: FontFamily.heading, fontSize: 14 },
  info: { padding: Spacing.sm, paddingTop: Spacing.lg },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  typeDot: { width: 8, height: 8, borderRadius: 2 },
  sizeText: { fontSize: 11, fontFamily: FontFamily.body, color: AppColors.secondaryGrey },
  name: { fontSize: 13, fontFamily: FontFamily.bodyMedium, color: AppColors.primaryBlack, lineHeight: 17, minHeight: 34 },
  delivRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
  delivText: { fontSize: 10, fontFamily: FontFamily.bodySemiBold, color: AppColors.secondaryGrey },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, flexWrap: 'wrap' },
  discLabel: { fontSize: 10, fontFamily: FontFamily.bodySemiBold, color: '#0F8A2A' },
  price: { fontSize: 14, fontFamily: FontFamily.bodyBold, color: AppColors.primaryBlack },
  mrp: { fontSize: 11, fontFamily: FontFamily.body, color: AppColors.secondaryGrey, textDecorationLine: 'line-through' },
});
