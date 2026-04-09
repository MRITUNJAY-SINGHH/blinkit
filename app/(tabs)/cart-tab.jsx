import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppColors, FontFamily, Spacing, BorderRadius } from '@/constants/theme';
import { useCart } from '@/context/CartContext';
import QuantitySelector from '@/components/QuantitySelector';

export default function CartTabScreen() {
  const router = useRouter();
  const { items, cartTotal, updateQuantity, clearCart } = useCart();
  const deliveryFee = items.length > 0 ? 25 : 0;
  const saved = items.reduce((sum, i) => sum + (i.mrp - i.price) * i.quantity, 0);

  const renderItem = ({ item }) => (
    <View style={s.card}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={s.cardImg} resizeMode="cover" />
      ) : (
        <View style={[s.cardImg, s.cardImgFallback]}>
          <Text style={{ fontSize: 24 }}>{item.emoji || '🍽️'}</Text>
        </View>
      )}
      <View style={s.cardInfo}>
        <Text style={s.cardName} numberOfLines={1}>{item.name}</Text>
        <Text style={s.cardSize}>{item.size}</Text>
        <View style={s.priceRow}>
          <Text style={s.cardPrice}>₹{item.price * item.quantity}</Text>
          {item.discount > 0 && <Text style={s.cardMrp}>₹{item.mrp * item.quantity}</Text>}
        </View>
      </View>
      <QuantitySelector quantity={item.quantity}
        onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
        onDecrease={() => updateQuantity(item.id, item.quantity - 1)} />
    </View>
  );

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.header}>
        <Text style={s.headerTitle}>My Cart</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={clearCart}>
            <Text style={s.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <View style={s.empty}>
          <View style={s.emptyCircle}><Text style={{ fontSize: 56 }}>🛒</Text></View>
          <Text style={s.emptyTitle}>Your cart is empty</Text>
          <Text style={s.emptyDesc}>Looks like you haven't added anything yet</Text>
          <TouchableOpacity style={s.browseBtn} onPress={() => router.push('/(tabs)')}>
            <Ionicons name="arrow-back" size={18} color={AppColors.white} />
            <Text style={s.browseBtnText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList data={items} keyExtractor={i => i.id} renderItem={renderItem}
            contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: 300 }}
            ListFooterComponent={
              <View style={s.couponRow}>
                <Ionicons name="pricetag-outline" size={18} color={AppColors.primaryGreen} />
                <Text style={s.couponText}>Apply Coupon</Text>
                <Ionicons name="chevron-forward" size={16} color={AppColors.secondaryGrey} style={{ marginLeft: 'auto' }} />
              </View>
            }
          />

          {/* Bill + Checkout */}
          <View style={s.billWrap}>
            <View style={s.savingBanner}>
              <Ionicons name="sparkles" size={16} color="#FF6F00" />
              <Text style={s.savingText}>You're saving ₹{saved} on this order!</Text>
            </View>
            <Text style={s.billTitle}>Bill Details</Text>
            <View style={s.billRow}><Text style={s.billLabel}>Item Total</Text><Text style={s.billVal}>₹{cartTotal}</Text></View>
            <View style={s.billRow}><Text style={s.billLabel}>Delivery Fee</Text><Text style={[s.billVal, { color: AppColors.primaryGreen }]}>₹{deliveryFee}</Text></View>
            <View style={[s.billRow, s.totalRow]}>
              <Text style={s.totalLabel}>Grand Total</Text>
              <Text style={s.totalVal}>₹{cartTotal + deliveryFee}</Text>
            </View>
            <TouchableOpacity style={s.checkoutBtn} onPress={() => router.push('/cart')}>
              <View>
                <Text style={s.checkoutTotal}>₹{cartTotal + deliveryFee}</Text>
                <Text style={s.checkoutSub}>TOTAL</Text>
              </View>
              <View style={s.checkoutRight}>
                <Text style={s.checkoutText}>Proceed to Checkout</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFF" />
              </View>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F7' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, backgroundColor: AppColors.white },
  headerTitle: { fontSize: 22, fontFamily: FontFamily.heading, color: AppColors.primaryBlack },
  clearText: { fontSize: 13, fontFamily: FontFamily.bodySemiBold, color: AppColors.error },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: AppColors.white,
    borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm,
  },
  cardImg: { width: 56, height: 56, borderRadius: BorderRadius.md },
  cardImgFallback: { backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 14, fontFamily: FontFamily.bodySemiBold, color: AppColors.primaryBlack },
  cardSize: { fontSize: 11, fontFamily: FontFamily.body, color: AppColors.secondaryGrey, marginTop: 1 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  cardPrice: { fontSize: 14, fontFamily: FontFamily.bodyBold, color: AppColors.primaryBlack },
  cardMrp: { fontSize: 11, fontFamily: FontFamily.body, color: AppColors.secondaryGrey, textDecorationLine: 'line-through' },
  couponRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: AppColors.white,
    borderRadius: BorderRadius.lg, padding: Spacing.lg, marginTop: Spacing.sm,
    borderWidth: 1, borderColor: AppColors.cardBorder, borderStyle: 'dashed',
  },
  couponText: { fontSize: 14, fontFamily: FontFamily.bodySemiBold, color: AppColors.primaryBlack },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xxl },
  emptyCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: AppColors.lightGrey, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl },
  emptyTitle: { fontSize: 22, fontFamily: FontFamily.heading, color: AppColors.primaryBlack },
  emptyDesc: { fontSize: 14, fontFamily: FontFamily.body, color: AppColors.secondaryGrey, marginTop: Spacing.sm, textAlign: 'center' },
  browseBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: AppColors.primaryGreen, borderRadius: BorderRadius.lg, paddingHorizontal: 24, paddingVertical: Spacing.md, marginTop: Spacing.xxl },
  browseBtnText: { color: AppColors.white, fontSize: 15, fontFamily: FontFamily.headingSemiBold },
  billWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: AppColors.white,
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.xxxl,
    borderTopLeftRadius: BorderRadius.xxl, borderTopRightRadius: BorderRadius.xxl,
    shadowColor: '#000', shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 14,
  },
  savingBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF8E1', borderRadius: BorderRadius.md, padding: Spacing.sm, marginBottom: Spacing.md },
  savingText: { fontSize: 12, fontFamily: FontFamily.bodySemiBold, color: '#E65100' },
  billTitle: { fontSize: 14, fontFamily: FontFamily.headingSemiBold, color: AppColors.primaryBlack, marginBottom: Spacing.sm },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  billLabel: { fontSize: 13, fontFamily: FontFamily.body, color: AppColors.secondaryGrey },
  billVal: { fontSize: 13, fontFamily: FontFamily.bodyMedium, color: AppColors.primaryBlack },
  totalRow: { borderTopWidth: 1, borderTopColor: AppColors.cardBorder, paddingTop: Spacing.sm, marginTop: 4 },
  totalLabel: { fontSize: 15, fontFamily: FontFamily.heading, color: AppColors.primaryBlack },
  totalVal: { fontSize: 15, fontFamily: FontFamily.heading, color: AppColors.primaryBlack },
  checkoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#0D8320', borderRadius: BorderRadius.lg, paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, marginTop: Spacing.md,
  },
  checkoutTotal: { color: '#FFF', fontSize: 16, fontFamily: FontFamily.heading },
  checkoutSub: { color: 'rgba(255,255,255,0.7)', fontSize: 9, fontFamily: FontFamily.bodySemiBold },
  checkoutRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  checkoutText: { color: '#FFF', fontSize: 15, fontFamily: FontFamily.headingSemiBold },
});
