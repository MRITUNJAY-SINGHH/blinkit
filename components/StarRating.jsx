import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function StarRating({ rating = 0, size = 12 }) {
  const stars = [];
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < full) {
      stars.push(<Ionicons key={i} name="star" size={size} color="#FFC107" />);
    } else if (i === full && half) {
      stars.push(<Ionicons key={i} name="star-half" size={size} color="#FFC107" />);
    } else {
      stars.push(<Ionicons key={i} name="star-outline" size={size} color="#FFC107" />);
    }
  }

  return <View style={styles.row}>{stars}</View>;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 1 },
});
