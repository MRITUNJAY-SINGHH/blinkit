import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
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
  const saved = items.reduce((s, i) => s + (i.mrp - i.price) * i.quantity, 0);

  const renderItem = ({ item }) => (
    <View style={s.card}>
      <View style={[s.emojiBox, { backgroundColor: item.bgColor }]}>
        <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
      </View>
      <View style={s.cardInfo}>
        <Text style={s.cardName} numberOfLines={1}>{item.name}</Text>
        <Text style={s.cardSize}>{item.size}</Text>
        <View style={s.priceRow}>
          <Text style={s.cardPrice}>₹{item.price}</Text>
          <Text style={s.cardMrp}>₹{item.mrp}</Text>
        </View>
      </View>
      <QuantitySelector quantity={item.quantity}
        onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
        onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
      />
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
          <Text style={{ fontSize: 64 }}>🛒</Text>
          <Text style={s.emptyTitle}>Your cart is empty</Text>
          <Text style={s.emptyDesc}>Add items to get started</Text>
        </View>
      ) : (
        <>
          <FlatList data={items} keyExtractor={i => i.id} renderItem={renderItem}
            contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: 240 }}
          />
          <View style={s.billWrap}>
            <Text style={s.billTitle}>Bill Details</Text>
            <View style={s.billRow}><Text style={s.billLabel}>Item Total</Text><Text style={s.billVal}>₹{cartTotal}</Text></View>
            <View style={s.billRow}><Text style={s.billLabel}>Delivery Fee</Text><Text style={s.billVal}>₹{deliveryFee}</Text></View>
            <View style={s.billRow}><Text style={[s.billLabel, { color: AppColors.primaryGreen }]}>You Save</Text><Text style={[s.billVal, { color: AppColors.primaryGreen }]}>-₹{saved}</Text></View>
            <View style={[s.billRow, s.totalRow]}>
              <Text style={s.totalLabel}>Grand Total</Text>
              <Text style={s.totalVal}>₹{cartTotal + deliveryFee}</Text>
            </View>
            <TouchableOpacity style={s.placeBtn}>
              <Text style={s.placeBtnText}>Place Order · ₹{cartTotal + deliveryFee}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  headerTitle: { fontSize: 22, fontFamily: FontFamily.heading, color: AppColors.primaryBlack },
  clearText: { fontSize: 14, fontFamily: FontFamily.bodySemiBold, color: AppColors.error },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: AppColors.white,
    borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: AppColors.cardBorder,
  },
  emojiBox: { width: 52, height: 52, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 14, fontFamily: FontFamily.bodySemiBold, color: AppColors.primaryBlack },
  cardSize: { fontSize: 12, fontFamily: FontFamily.body, color: AppColors.secondaryGrey, marginTop: 1 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  cardPrice: { fontSize: 14, fontFamily: FontFamily.bodyBold, color: AppColors.primaryBlack },
  cardMrp: { fontSize: 12, fontFamily: FontFamily.body, color: AppColors.secondaryGrey, textDecorationLine: 'line-through' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 20, fontFamily: FontFamily.heading, color: AppColors.primaryBlack, marginTop: Spacing.lg },
  emptyDesc: { fontSize: 14, fontFamily: FontFamily.body, color: AppColors.secondaryGrey, marginTop: Spacing.sm },
  billWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: AppColors.white,
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.xxxl,
    borderTopLeftRadius: BorderRadius.xl, borderTopRightRadius: BorderRadius.xl,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 10,
  },
  billTitle: { fontSize: 16, fontFamily: FontFamily.headingSemiBold, color: AppColors.primaryBlack, marginBottom: Spacing.md },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  billLabel: { fontSize: 14, fontFamily: FontFamily.body, color: AppColors.secondaryGrey },
  billVal: { fontSize: 14, fontFamily: FontFamily.bodyMedium, color: AppColors.primaryBlack },
  totalRow: { borderTopWidth: 1, borderTopColor: AppColors.cardBorder, paddingTop: Spacing.sm, marginTop: Spacing.sm },
  totalLabel: { fontSize: 16, fontFamily: FontFamily.heading, color: AppColors.primaryBlack },
  totalVal: { fontSize: 16, fontFamily: FontFamily.heading, color: AppColors.primaryBlack },
  placeBtn: { backgroundColor: AppColors.primaryGreen, borderRadius: BorderRadius.lg, paddingVertical: Spacing.lg, alignItems: 'center', marginTop: Spacing.lg },
  placeBtnText: { color: AppColors.white, fontSize: 16, fontFamily: FontFamily.heading },
});
