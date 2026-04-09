import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryCard from '@/components/CategoryCard';
import SearchBar from '@/components/SearchBar';
import { AppColors, Spacing } from '@/constants/theme';
import { categories } from '@/constants/categories';

export default function CategoriesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Categories</Text>
      <View style={{ marginBottom: Spacing.lg }}>
        <SearchBar placeholder="Search categories..." />
      </View>
      <FlatList
        data={categories}
        numColumns={3}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => <CategoryCard category={item} size="large" />}
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
  grid: { paddingHorizontal: Spacing.lg },
  row: { justifyContent: 'space-between' },
});
