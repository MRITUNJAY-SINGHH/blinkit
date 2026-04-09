import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import CartBar from '@/components/CartBar';
import { AppColors, FontFamily, Spacing, BorderRadius } from '@/constants/theme';
import { products } from '@/constants/products';
import { categories } from '@/constants/categories';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const filtered = query.length > 0
    ? products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <Text style={s.header}>Search</Text>
      <View style={s.searchRow}>
        <Ionicons name="search" size={20} color={AppColors.secondaryGrey} />
        <TextInput style={s.input} placeholder="Search for products..." placeholderTextColor={AppColors.secondaryGrey}
          value={query} onChangeText={setQuery} autoCapitalize="none"
        />
        {query.length > 0 && (
          <Ionicons name="close-circle" size={20} color={AppColors.secondaryGrey} onPress={() => setQuery('')} />
        )}
      </View>

      {query.length > 0 ? (
        <FlatList data={filtered} numColumns={2} keyExtractor={i => i.id}
          contentContainerStyle={s.gridContainer} columnWrapperStyle={s.gridRow}
          renderItem={({ item }) => <View style={s.gridItem}><ProductCard product={item} /></View>}
          ListEmptyComponent={<View style={s.empty}><Text style={{ fontSize: 48 }}>🔍</Text><Text style={s.emptyText}>No products found</Text></View>}
        />
      ) : (
        <FlatList data={categories} numColumns={3} keyExtractor={i => i.id}
          ListHeaderComponent={<Text style={s.catHeader}>Browse Categories</Text>}
          contentContainerStyle={s.catGrid} columnWrapperStyle={s.catRow}
          renderItem={({ item }) => <CategoryCard category={item} size="large" />}
        />
      )}
      <CartBar />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.background },
  header: { fontSize: 22, fontFamily: FontFamily.heading, color: AppColors.primaryBlack, paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.sm },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: AppColors.lightGrey,
    borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 2,
    marginHorizontal: Spacing.lg, marginBottom: Spacing.lg, gap: Spacing.sm,
  },
  input: { flex: 1, fontSize: 14, fontFamily: FontFamily.body, color: AppColors.primaryBlack },
  gridContainer: { paddingHorizontal: Spacing.lg, paddingBottom: 100 },
  gridRow: { justifyContent: 'space-between', marginBottom: Spacing.md },
  gridItem: { width: '48%' },
  catHeader: { fontSize: 16, fontFamily: FontFamily.headingSemiBold, color: AppColors.primaryBlack, paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  catGrid: { paddingHorizontal: Spacing.lg },
  catRow: { justifyContent: 'space-between' },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 16, fontFamily: FontFamily.bodyMedium, color: AppColors.secondaryGrey, marginTop: Spacing.md },
});
