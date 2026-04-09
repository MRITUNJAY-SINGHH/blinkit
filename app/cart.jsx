import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppColors, Spacing, BorderRadius } from '@/constants/theme';
import { useCart } from '@/context/CartContext';
import QuantitySelector from '@/components/QuantitySelector';

export default function CartScreen() {
  const router = useRouter();
  const { items, cartTotal, updateQuantity, clearCart } = useCart();
  const deliveryFee = items.length > 0 ? 25 : 0;
  const totalSaved = items.reduce((s, i) => s + (i.mrp - i.price) * i.quantity, 0);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={[styles.emojiBox, { backgroundColor: item.bgColor }]}>
        <Text style={{ fontSize: 32 }}>{item.emoji}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.cardSize}>{item.size}</Text>
        <View style={styles.cardPriceRow}>
          <Text style={styles.cardPrice}>₹{item.price}</Text>
          <Text style={styles.cardMrp}>₹{item.mrp}</Text>
        </View>
      </View>
      <QuantitySelector
        quantity={item.quantity}
        onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
        onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={AppColors.primaryBlack} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={clearCart}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ fontSize: 64 }}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyDesc}>Add items to get started</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => router.back()}>
            <Text style={styles.shopBtnText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={i => i.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: 220 }}
          />

          {/* Bill Details */}
          <View style={styles.billContainer}>
            <Text style={styles.billTitle}>Bill Details</Text>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Item Total</Text>
              <Text style={styles.billValue}>₹{cartTotal}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Delivery Fee</Text>
              <Text style={styles.billValue}>₹{deliveryFee}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={[styles.billLabel, { color: AppColors.primaryGreen }]}>You Save</Text>
              <Text style={[styles.billValue, { color: AppColors.primaryGreen }]}>-₹{totalSaved}</Text>
            </View>
            <View style={[styles.billRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>₹{cartTotal + deliveryFee}</Text>
            </View>

            <TouchableOpacity style={styles.placeBtn}>
              <Text style={styles.placeBtnText}>Place Order · ₹{cartTotal + deliveryFee}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: AppColors.primaryBlack },
  clearText: { fontSize: 14, fontWeight: '600', color: AppColors.error },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: AppColors.white, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: AppColors.cardBorder,
  },
  emojiBox: {
    width: 60, height: 60, borderRadius: BorderRadius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 14, fontWeight: '600', color: AppColors.primaryBlack },
  cardSize: { fontSize: 12, color: AppColors.secondaryGrey, marginTop: 2 },
  cardPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  cardPrice: { fontSize: 14, fontWeight: '700', color: AppColors.primaryBlack },
  cardMrp: { fontSize: 12, color: AppColors.secondaryGrey, textDecorationLine: 'line-through' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: AppColors.primaryBlack, marginTop: Spacing.lg },
  emptyDesc: { fontSize: 14, color: AppColors.secondaryGrey, marginTop: Spacing.sm },
  shopBtn: {
    backgroundColor: AppColors.primaryGreen, borderRadius: BorderRadius.lg,
    paddingHorizontal: 32, paddingVertical: Spacing.md, marginTop: Spacing.xxl,
  },
  shopBtnText: { color: AppColors.white, fontSize: 16, fontWeight: '700' },
  billContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: AppColors.white, paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxxl, borderTopLeftRadius: BorderRadius.xl, borderTopRightRadius: BorderRadius.xl,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 10,
  },
  billTitle: { fontSize: 16, fontWeight: '700', color: AppColors.primaryBlack, marginBottom: Spacing.md },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  billLabel: { fontSize: 14, color: AppColors.secondaryGrey },
  billValue: { fontSize: 14, fontWeight: '500', color: AppColors.primaryBlack },
  totalRow: { borderTopWidth: 1, borderTopColor: AppColors.cardBorder, paddingTop: Spacing.sm, marginTop: Spacing.sm },
  totalLabel: { fontSize: 16, fontWeight: '700', color: AppColors.primaryBlack },
  totalValue: { fontSize: 16, fontWeight: '800', color: AppColors.primaryBlack },
  placeBtn: {
    backgroundColor: AppColors.primaryGreen, borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg, alignItems: 'center', marginTop: Spacing.lg,
  },
  placeBtnText: { color: AppColors.white, fontSize: 16, fontWeight: '700' },
});
