import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppColors, FontFamily, Spacing, BorderRadius } from '@/constants/theme';
import { useCart } from '@/context/CartContext';
import QuantitySelector from '@/components/QuantitySelector';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { items, addToCart, updateQuantity } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const cartItem = items.find(i => i.id === id);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`https://api.the9to9restaurant.com/v1/api/foods/getFood/${id}`);
        const data = await res.json();
        if (data.success && data.food) {
          const f = data.food;
          const v = f.variants?.[0] || {};
          setProduct({
            id: f._id, name: f.name, description: f.description || '', size: v.size || '',
            price: v.price || 0, mrp: f.discount > 0 ? Math.round((v.price || 0) / (1 - f.discount / 100)) : v.price || 0,
            discount: f.discount || 0, image: f.foodImages?.[0] || null, itemType: f.itemType || 'Veg',
            ingredients: f.ingredients || [],
          });
        }
      } catch (e) { console.warn(e); }
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <SafeAreaView style={s.container}><ActivityIndicator size="large" color={AppColors.primaryGreen} style={{ marginTop: 80 }} /></SafeAreaView>;
  if (!product) return <SafeAreaView style={s.container}><Text style={{ textAlign: 'center', marginTop: 60, fontFamily: FontFamily.bodyMedium }}>Product not found</Text></SafeAreaView>;

  const isVeg = product.itemType === 'Veg';

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={AppColors.primaryBlack} />
        </TouchableOpacity>
        <TouchableOpacity style={s.shareBtn}>
          <Ionicons name="share-outline" size={20} color={AppColors.primaryBlack} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Image */}
        <View style={s.imgWrap}>
          {product.image ? (
            <Image source={{ uri: product.image }} style={s.img} resizeMode="cover" />
          ) : (
            <View style={[s.img, { backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center' }]}>
              <Text style={{ fontSize: 80 }}>🍽️</Text>
            </View>
          )}
          {product.discount > 0 && (
            <View style={s.discBadge}>
              <Text style={s.discText}>{product.discount}% OFF</Text>
            </View>
          )}
        </View>

        <View style={s.info}>
          <View style={s.typeRow}>
            <View style={[s.typeDot, { backgroundColor: isVeg ? '#0F8A2A' : '#E23744' }]} />
            <Text style={s.typeText}>{isVeg ? 'Veg' : 'Non-Veg'}</Text>
          </View>

          <Text style={s.name}>{product.name}</Text>
          <Text style={s.size}>{product.size}</Text>

          <View style={s.delivRow}>
            <Ionicons name="time-outline" size={14} color={AppColors.primaryGreen} />
            <Text style={s.delivText}>10 MINS delivery</Text>
          </View>

          <View style={s.priceRow}>
            <Text style={s.price}>₹{product.price}</Text>
            {product.discount > 0 && <Text style={s.mrp}>MRP ₹{product.mrp}</Text>}
          </View>

          <Text style={s.sectionTitle}>Description</Text>
          <Text style={s.desc}>{product.description}</Text>

          {product.ingredients?.length > 0 && (
            <>
              <Text style={s.sectionTitle}>Ingredients</Text>
              <View style={s.ingRow}>
                {product.ingredients.map((ing, i) => (
                  <View key={i} style={s.ingChip}>
                    <Text style={s.ingText}>{ing}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <View style={s.whyBox}>
            <Text style={s.whyTitle}>Why Choose This?</Text>
            {['Premium quality ingredients', 'Freshly prepared daily', 'Fast 10-minute delivery'].map((t, i) => (
              <View key={i} style={s.whyItem}>
                <Ionicons name="checkmark-circle" size={18} color={AppColors.primaryGreen} />
                <Text style={s.whyText}>{t}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={s.bottomBar}>
        <View>
          <Text style={s.bottomPrice}>₹{product.price}</Text>
          {product.discount > 0 && <Text style={s.bottomMrp}>₹{product.mrp}</Text>}
        </View>
        {cartItem ? (
          <QuantitySelector quantity={cartItem.quantity}
            onIncrease={() => updateQuantity(product.id, cartItem.quantity + 1)}
            onDecrease={() => updateQuantity(product.id, cartItem.quantity - 1)} />
        ) : (
          <TouchableOpacity style={s.addBtn} onPress={() => addToCart(product)}>
            <Text style={s.addBtnText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.white },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: AppColors.lightGrey, alignItems: 'center', justifyContent: 'center' },
  shareBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: AppColors.lightGrey, alignItems: 'center', justifyContent: 'center' },
  imgWrap: { position: 'relative', marginHorizontal: Spacing.lg, borderRadius: BorderRadius.xl, overflow: 'hidden' },
  img: { width: '100%', height: 250, borderRadius: BorderRadius.xl },
  discBadge: { position: 'absolute', top: 16, left: 16, backgroundColor: '#0F8A2A', paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.sm },
  discText: { fontSize: 12, fontFamily: FontFamily.bodySemiBold, color: '#FFF' },
  info: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  typeDot: { width: 10, height: 10, borderRadius: 3 },
  typeText: { fontSize: 12, fontFamily: FontFamily.bodySemiBold, color: AppColors.secondaryGrey },
  name: { fontSize: 22, fontFamily: FontFamily.heading, color: AppColors.primaryBlack },
  size: { fontSize: 14, fontFamily: FontFamily.body, color: AppColors.secondaryGrey, marginTop: 4 },
  delivRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: Spacing.sm },
  delivText: { fontSize: 13, fontFamily: FontFamily.bodySemiBold, color: AppColors.primaryGreen },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginTop: Spacing.lg },
  price: { fontSize: 24, fontFamily: FontFamily.heading, color: AppColors.primaryBlack },
  mrp: { fontSize: 16, fontFamily: FontFamily.body, color: AppColors.secondaryGrey, textDecorationLine: 'line-through' },
  sectionTitle: { fontSize: 16, fontFamily: FontFamily.headingSemiBold, color: AppColors.primaryBlack, marginTop: Spacing.xxl },
  desc: { fontSize: 14, fontFamily: FontFamily.body, color: AppColors.secondaryGrey, lineHeight: 22, marginTop: Spacing.sm },
  ingRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: Spacing.sm },
  ingChip: { backgroundColor: AppColors.lightGrey, borderRadius: BorderRadius.full, paddingHorizontal: 12, paddingVertical: 6 },
  ingText: { fontSize: 12, fontFamily: FontFamily.bodyMedium, color: AppColors.primaryBlack, textTransform: 'capitalize' },
  whyBox: { marginTop: Spacing.xxl, backgroundColor: AppColors.lightGreen, borderRadius: BorderRadius.lg, padding: Spacing.lg },
  whyTitle: { fontSize: 15, fontFamily: FontFamily.headingSemiBold, color: AppColors.primaryBlack, marginBottom: Spacing.md },
  whyItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  whyText: { fontSize: 14, fontFamily: FontFamily.bodyMedium, color: AppColors.primaryBlack },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: AppColors.white, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, borderTopWidth: 1, borderTopColor: AppColors.cardBorder, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
  bottomPrice: { fontSize: 22, fontFamily: FontFamily.heading, color: AppColors.primaryBlack },
  bottomMrp: { fontSize: 13, fontFamily: FontFamily.body, color: AppColors.secondaryGrey, textDecorationLine: 'line-through' },
  addBtn: { backgroundColor: AppColors.primaryGreen, borderRadius: BorderRadius.lg, paddingHorizontal: 32, paddingVertical: Spacing.md },
  addBtnText: { color: AppColors.white, fontSize: 16, fontFamily: FontFamily.heading },
});
