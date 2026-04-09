import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppColors, Spacing, BorderRadius } from '@/constants/theme';

const dummyOrders = [
  { id: '1', date: '9 Apr 2026', items: 3, total: 537, status: 'Delivered' },
  { id: '2', date: '7 Apr 2026', items: 5, total: 1249, status: 'Delivered' },
  { id: '3', date: '3 Apr 2026', items: 2, total: 348, status: 'Delivered' },
];

export default function OrdersScreen() {
  const renderOrder = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.statusBadge}>
          <Ionicons name="checkmark-circle" size={14} color={AppColors.primaryGreen} />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <Text style={styles.summary}>{item.items} items · ₹{item.total}</Text>
      <View style={styles.actions}>
        <Text style={styles.reorder}>Reorder</Text>
        <Ionicons name="chevron-forward" size={16} color={AppColors.primaryGreen} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>My Orders</Text>
      <FlatList
        data={dummyOrders}
        keyExtractor={i => i.id}
        renderItem={renderOrder}
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 48 }}>📦</Text>
            <Text style={styles.emptyText}>No orders yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.background },
  header: {
    fontSize: 22, fontWeight: '700', color: AppColors.primaryBlack,
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.md,
  },
  card: {
    backgroundColor: AppColors.white, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: AppColors.cardBorder,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusText: { fontSize: 13, fontWeight: '600', color: AppColors.primaryGreen },
  date: { fontSize: 12, color: AppColors.secondaryGrey },
  summary: { fontSize: 14, color: AppColors.primaryBlack, fontWeight: '500', marginBottom: Spacing.sm },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  reorder: { fontSize: 14, fontWeight: '600', color: AppColors.primaryGreen },
  empty: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { fontSize: 16, color: AppColors.secondaryGrey, marginTop: Spacing.md },
});
