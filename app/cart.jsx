import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppColors, FontFamily, Spacing, BorderRadius } from '@/constants/theme';
import { useCart } from '@/context/CartContext';

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, cartTotal, clearCart } = useCart();
  const deliveryFee = items.length > 0 ? 25 : 0;
  const [selectedPayment, setSelectedPayment] = useState('upi');

  const payments = [
    { id: 'upi', name: 'UPI / Google Pay', icon: 'phone-portrait-outline', sub: 'Pay via any UPI app' },
    { id: 'card', name: 'Credit / Debit Card', icon: 'card-outline', sub: 'Visa, Mastercard, RuPay' },
    { id: 'cod', name: 'Cash on Delivery', icon: 'cash-outline', sub: 'Pay when order arrives' },
  ];

  const placeOrder = () => {
    Alert.alert('Order Placed! 🎉', 'Your order will be delivered in 10 minutes.', [
      { text: 'OK', onPress: () => { clearCart(); router.replace('/(tabs)'); } }
    ]);
  };

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={AppColors.primaryBlack} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList data={[1]} keyExtractor={() => '1'} contentContainerStyle={{ paddingBottom: 140 }}
        renderItem={() => (
          <View>
            {/* Delivery Address */}
            <View style={s.section}>
              <View style={s.sectionHead}>
                <View style={s.iconCircle}><Ionicons name="location" size={18} color={AppColors.primaryGreen} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={s.sectionLabel}>Delivery Address</Text>
                  <Text style={s.addressText}>HOME - 123 Main Street, City</Text>
                </View>
                <TouchableOpacity><Text style={s.changeText}>Change</Text></TouchableOpacity>
              </View>
            </View>

            {/* Delivery Time */}
            <View style={s.delivBanner}>
              <Ionicons name="flash" size={20} color="#FF6F00" />
              <View>
                <Text style={s.delivTitle}>Delivery in 10 minutes</Text>
                <Text style={s.delivSub}>Shipment of {items.length} item{items.length > 1 ? 's' : ''}</Text>
              </View>
            </View>

            {/* Items Summary */}
            <View style={s.section}>
              <Text style={s.sectionTitle}>Order Summary</Text>
              {items.map(item => (
                <View key={item.id} style={s.itemRow}>
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={s.itemImg} resizeMode="cover" />
                  ) : (
                    <View style={[s.itemImg, s.itemImgFallback]}>
                      <Text style={{ fontSize: 18 }}>{item.emoji || '🍽️'}</Text>
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={s.itemName} numberOfLines={1}>{item.name}</Text>
                    <Text style={s.itemQty}>{item.size} × {item.quantity}</Text>
                  </View>
                  <Text style={s.itemPrice}>₹{item.price * item.quantity}</Text>
                </View>
              ))}
            </View>

            {/* Payment Method */}
            <View style={s.section}>
              <Text style={s.sectionTitle}>Payment Method</Text>
              {payments.map(p => (
                <TouchableOpacity key={p.id} style={[s.paymentRow, selectedPayment === p.id && s.paymentSelected]}
                  onPress={() => setSelectedPayment(p.id)}>
                  <View style={s.radioOuter}>
                    {selectedPayment === p.id && <View style={s.radioInner} />}
                  </View>
                  <Ionicons name={p.icon} size={20} color={selectedPayment === p.id ? AppColors.primaryGreen : AppColors.secondaryGrey} />
                  <View>
                    <Text style={s.paymentName}>{p.name}</Text>
                    <Text style={s.paymentSub}>{p.sub}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Bill */}
            <View style={s.bill}>
              <Text style={s.billTitle}>Bill Details</Text>
              <View style={s.billRow}><Text style={s.billLabel}>Item Total</Text><Text style={s.billVal}>₹{cartTotal}</Text></View>
              <View style={s.billRow}><Text style={s.billLabel}>Delivery Fee</Text><Text style={s.billVal}>₹{deliveryFee}</Text></View>
              <View style={s.billRow}><Text style={s.billLabel}>Platform Fee</Text><Text style={[s.billVal, { color: AppColors.primaryGreen }]}>FREE</Text></View>
              <View style={[s.billRow, s.totalRow]}>
                <Text style={s.totalLabel}>To Pay</Text>
                <Text style={s.totalVal}>₹{cartTotal + deliveryFee}</Text>
              </View>
            </View>
          </View>
        )}
      />

      {/* Bottom CTA */}
      <View style={s.bottomBar}>
        <TouchableOpacity style={s.placeBtn} onPress={placeOrder} activeOpacity={0.8}>
          <View>
            <Text style={s.placeTotal}>₹{cartTotal + deliveryFee}</Text>
            <Text style={s.placeSub}>TOTAL</Text>
          </View>
          <View style={s.placeRight}>
            <Text style={s.placeText}>Place Order</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F7' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, backgroundColor: AppColors.white },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: AppColors.lightGrey, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: FontFamily.heading, color: AppColors.primaryBlack },
  section: { backgroundColor: AppColors.white, padding: Spacing.lg, marginBottom: 8 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: AppColors.lightGreen, alignItems: 'center', justifyContent: 'center' },
  sectionLabel: { fontSize: 11, fontFamily: FontFamily.bodySemiBold, color: AppColors.secondaryGrey, textTransform: 'uppercase' },
  addressText: { fontSize: 14, fontFamily: FontFamily.bodyMedium, color: AppColors.primaryBlack, marginTop: 2 },
  changeText: { fontSize: 13, fontFamily: FontFamily.bodySemiBold, color: AppColors.primaryGreen },
  delivBanner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: '#FFF8E1', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, marginBottom: 8 },
  delivTitle: { fontSize: 14, fontFamily: FontFamily.headingSemiBold, color: AppColors.primaryBlack },
  delivSub: { fontSize: 12, fontFamily: FontFamily.body, color: AppColors.secondaryGrey, marginTop: 1 },
  sectionTitle: { fontSize: 15, fontFamily: FontFamily.headingSemiBold, color: AppColors.primaryBlack, marginBottom: Spacing.md },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  itemImg: { width: 44, height: 44, borderRadius: 8 },
  itemImgFallback: { backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center' },
  itemName: { fontSize: 13, fontFamily: FontFamily.bodyMedium, color: AppColors.primaryBlack },
  itemQty: { fontSize: 11, fontFamily: FontFamily.body, color: AppColors.secondaryGrey, marginTop: 2 },
  itemPrice: { fontSize: 14, fontFamily: FontFamily.bodyBold, color: AppColors.primaryBlack },
  paymentRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.sm, marginBottom: 4 },
  paymentSelected: { backgroundColor: AppColors.lightGreen },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: AppColors.primaryGreen, alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: AppColors.primaryGreen },
  paymentName: { fontSize: 14, fontFamily: FontFamily.bodySemiBold, color: AppColors.primaryBlack },
  paymentSub: { fontSize: 11, fontFamily: FontFamily.body, color: AppColors.secondaryGrey },
  bill: { backgroundColor: AppColors.white, padding: Spacing.lg },
  billTitle: { fontSize: 14, fontFamily: FontFamily.headingSemiBold, color: AppColors.primaryBlack, marginBottom: Spacing.sm },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  billLabel: { fontSize: 13, fontFamily: FontFamily.body, color: AppColors.secondaryGrey },
  billVal: { fontSize: 13, fontFamily: FontFamily.bodyMedium, color: AppColors.primaryBlack },
  totalRow: { borderTopWidth: 1, borderTopColor: AppColors.cardBorder, paddingTop: Spacing.sm, marginTop: 4 },
  totalLabel: { fontSize: 16, fontFamily: FontFamily.heading, color: AppColors.primaryBlack },
  totalVal: { fontSize: 16, fontFamily: FontFamily.heading, color: AppColors.primaryBlack },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: AppColors.white, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, paddingBottom: Spacing.xxxl, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  placeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0D8320', borderRadius: BorderRadius.lg, paddingVertical: Spacing.lg, paddingHorizontal: Spacing.lg },
  placeTotal: { color: '#FFF', fontSize: 18, fontFamily: FontFamily.heading },
  placeSub: { color: 'rgba(255,255,255,0.7)', fontSize: 9, fontFamily: FontFamily.bodySemiBold },
  placeRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  placeText: { color: '#FFF', fontSize: 16, fontFamily: FontFamily.heading },
});
