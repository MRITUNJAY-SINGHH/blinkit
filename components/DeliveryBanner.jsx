import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors, Spacing } from '@/constants/theme';

export default function DeliveryBanner() {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.label}>Delivery in</Text>
        <View style={styles.locRow}>
          <Ionicons name="location-sharp" size={14} color={AppColors.primaryGreen} />
          <Text style={styles.locText}>Home</Text>
          <Ionicons name="chevron-down" size={14} color={AppColors.primaryBlack} />
        </View>
      </View>
      <Text style={styles.time}>10 minutes</Text>
      <Text style={styles.address}>123 Main Street, City Center</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, backgroundColor: AppColors.white },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 13, color: AppColors.primaryBlack, fontWeight: '500' },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locText: { fontSize: 13, fontWeight: '600', color: AppColors.primaryBlack },
  time: { fontSize: 24, fontWeight: '700', color: AppColors.primaryBlack },
  address: { fontSize: 12, color: AppColors.secondaryGrey, marginTop: 2 },
});
