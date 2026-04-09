import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { AppColors, Spacing } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function OnboardingSlide({ title, subtitle, emoji, bgColor }) {
  return (
    <View style={[styles.slide, { width }]}>
      <View style={[styles.circle, { backgroundColor: bgColor || AppColors.lightGreen }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xxl },
  circle: {
    width: 160, height: 160, borderRadius: 80,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xxxl,
  },
  emoji: { fontSize: 72 },
  title: { fontSize: 26, fontWeight: '700', color: AppColors.primaryBlack, textAlign: 'center', marginBottom: Spacing.md },
  subtitle: { fontSize: 15, color: AppColors.secondaryGrey, textAlign: 'center', lineHeight: 22 },
});
