import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AppColors, BorderRadius } from '@/constants/theme';

export default function QuantitySelector({ quantity, onIncrease, onDecrease }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={onDecrease}>
        <Text style={styles.btnText}>−</Text>
      </TouchableOpacity>
      <Text style={styles.qty}>{quantity}</Text>
      <TouchableOpacity style={styles.btn} onPress={onIncrease}>
        <Text style={styles.btnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.primaryGreen,
    borderRadius: BorderRadius.md,
    alignSelf: 'stretch',
    justifyContent: 'center',
    marginTop: 4,
  },
  btn: { paddingHorizontal: 12, paddingVertical: 6 },
  btnText: { color: AppColors.white, fontSize: 16, fontWeight: '700' },
  qty: { color: AppColors.white, fontSize: 14, fontWeight: '700', paddingHorizontal: 8 },
});
