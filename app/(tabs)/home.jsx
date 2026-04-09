import React from 'react';
import { View, Text, FlatList, ScrollView, StyleSheet } from 'react-native';
import DeliveryBanner from '@/components/DeliveryBanner';
import SearchBar from '@/components/SearchBar';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import CartBar from '@/components/CartBar';
import { AppColors, Spacing } from '@/constants/theme';
import { products } from '@/constants/products';
import { categories } from '@/constants/categories';

export default function HomeScreen() {
  const trending = products.slice(0, 6);
  const bestSellers = products.slice(4, 11);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Delivery Banner */}
        <DeliveryBanner />

        {/* Search */}
        <View style={{ marginVertical: Spacing.md }}>
          <SearchBar />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={i => i.id}
            contentContainerStyle={{ paddingHorizontal: Spacing.lg }}
            renderItem={({ item }) => <CategoryCard category={item} />}
          />
        </View>

        {/* Trending */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Now 🔥</Text>
          <FlatList
            data={trending}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={i => i.id}
            contentContainerStyle={{ paddingHorizontal: Spacing.lg }}
            renderItem={({ item }) => <ProductCard product={item} />}
          />
        </View>

        {/* Best Sellers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Best Sellers ⭐</Text>
          <FlatList
            data={bestSellers}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={i => i.id}
            contentContainerStyle={{ paddingHorizontal: Spacing.lg }}
            renderItem={({ item }) => <ProductCard product={item} />}
          />
        </View>

        {/* All Products Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Products</Text>
          <View style={styles.grid}>
            {products.map(p => (
              <View key={p.id} style={styles.gridItem}>
                <ProductCard product={p} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <CartBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.background },
  section: { marginTop: Spacing.xl },
  sectionTitle: {
    fontSize: 18, fontWeight: '700', color: AppColors.primaryBlack,
    marginBottom: Spacing.md, paddingHorizontal: Spacing.lg,
  },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg, gap: Spacing.md,
    justifyContent: 'space-between',
  },
  gridItem: { width: '47%' },
});
