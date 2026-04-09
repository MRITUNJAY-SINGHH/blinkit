import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AppColors, Spacing, BorderRadius } from '@/constants/theme';

export default function CategoryCard({ category, onPress, size = 'small' }) {
  const large = size === 'large';
  return (
    <TouchableOpacity
      style={[styles.wrap, large && styles.wrapLg]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.circle, { backgroundColor: category.bgColor }, large && styles.circleLg]}>
        <Text style={[styles.emoji, large && { fontSize: 32 }]}>{category.emoji}</Text>
      </View>
      <Text style={[styles.label, large && styles.labelLg]} numberOfLines={1}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', width: 72, marginRight: Spacing.md },
  wrapLg: { width: '30%', marginRight: 0, marginBottom: Spacing.lg },
  circle: {
    width: 56, height: 56, borderRadius: BorderRadius.lg,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xs,
  },
  circleLg: { width: 80, height: 80, borderRadius: BorderRadius.xl },
  emoji: { fontSize: 24 },
  label: { fontSize: 11, color: AppColors.primaryBlack, textAlign: 'center', fontWeight: '500' },
  labelLg: { fontSize: 13 },
});
