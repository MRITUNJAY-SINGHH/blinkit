import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors, Spacing, BorderRadius } from '@/constants/theme';

export default function SearchBar({ placeholder = 'Search for products...', onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <Ionicons name="search" size={20} color={AppColors.secondaryGrey} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={AppColors.secondaryGrey}
        editable={false}
        pointerEvents="none"
      />
      <Ionicons name="mic-outline" size={20} color={AppColors.secondaryGrey} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: AppColors.lightGrey, borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 2,
    marginHorizontal: Spacing.lg, gap: Spacing.sm,
  },
  input: { flex: 1, fontSize: 14, color: AppColors.primaryBlack },
});
