import React, { useEffect } from 'react';
import { View, Text, FlatList, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing, withDelay } from 'react-native-reanimated';
import DeliveryBanner from '@/components/DeliveryBanner';
import SearchBar from '@/components/SearchBar';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import CartBar from '@/components/CartBar';
import { AppColors, FontFamily, Spacing, BorderRadius } from '@/constants/theme';
import { products } from '@/constants/products';
import { categories } from '@/constants/categories';

const { width } = Dimensions.get('window');

const Star = ({ x, y, size, delay }) => {
  const opacity = useSharedValue(0.2);
  useEffect(() => {
    opacity.value = withDelay(delay, withRepeat(withSequence(
      withTiming(0.8, { duration: 1500 + delay, easing: Easing.inOut(Easing.ease) }),
      withTiming(0.2, { duration: 1500 + delay, easing: Easing.inOut(Easing.ease) }),
    ), -1, true));
  }, []);
  const a = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[{ position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: size / 2, backgroundColor: '#FFF' }, a]} />;
};

const banners = [
  { id: '1', title: 'Newly\nLaunched', sub: '✦ For You ✦', bg: '#FFF3E0', img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&h=200&fit=crop&q=80' },
  { id: '2', title: 'Summer\nSpecials', sub: 'Cool Deals', bg: '#E3F2FD', img: 'https://images.unsplash.com/photo-1595475207225-428b62bda831?w=300&h=200&fit=crop&q=80' },
  { id: '3', title: 'Health &\nWellness', sub: 'Top Picks', bg: '#E8F5E9', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop&q=80' },
];

const catTabs = [
  { id: 'all', name: 'All', icon: 'storefront' },
  { id: 'summer', name: 'Summer', icon: 'sunny' },
  { id: 'snacks', name: 'Snacks', icon: 'fast-food' },
  { id: 'drinks', name: 'Drinks', icon: 'cafe' },
  { id: 'care', name: 'Care', icon: 'heart' },
];

export default function HomeScreen() {
  const trending = products.slice(0, 6);
  const bestSellers = products.slice(4, 11);

  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* ── Dark Premium Header ── */}
        <View style={s.darkHeader}>
          <SafeAreaView edges={['top']}>
            {/* Stars */}
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
              <Star x={30} y={20} size={2} delay={0} />
              <Star x={80} y={40} size={3} delay={300} />
              <Star x={150} y={15} size={2} delay={600} />
              <Star x={200} y={50} size={2.5} delay={200} />
              <Star x={260} y={25} size={2} delay={800} />
              <Star x={320} y={45} size={3} delay={100} />
              <Star x={width - 60} y={30} size={2} delay={500} />
              <Star x={100} y={60} size={1.5} delay={400} />
              <Star x={width - 100} y={55} size={2} delay={700} />
            </View>

            <View style={s.headerContent}>
              <View>
                <Text style={s.delivLabel}>QuickComm in</Text>
                <Text style={s.delivTime}>10 minutes</Text>
                <View style={s.addressRow}>
                  <Text style={s.addressText}>HOME</Text>
                  <Text style={s.addressSub}> - 123 Main Street ▾</Text>
                </View>
              </View>
              <View style={s.headerIcons}>
                <TouchableOpacity style={s.headerIconBtn}>
                  <Ionicons name="notifications-outline" size={22} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style={s.headerIconBtn}>
                  <Ionicons name="person-circle-outline" size={26} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Search */}
            <TouchableOpacity style={s.searchBar} activeOpacity={0.8}>
              <Ionicons name="search" size={20} color={AppColors.secondaryGrey} />
              <Text style={s.searchPlaceholder}>Search "fresh fruits"</Text>
              <Ionicons name="mic-outline" size={20} color={AppColors.secondaryGrey} />
            </TouchableOpacity>

            {/* Category Tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.catTabRow}>
              {catTabs.map((t, i) => (
                <TouchableOpacity key={t.id} style={[s.catTab, i === 0 && s.catTabActive]}>
                  <Ionicons name={t.icon} size={18} color={i === 0 ? AppColors.primaryGreen : '#C0C0C0'} />
                  <Text style={[s.catTabText, i === 0 && s.catTabTextActive]}>{t.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </SafeAreaView>
        </View>

        {/* ── Promotional Banners ── */}
        <FlatList data={banners} horizontal showsHorizontalScrollIndicator={false} keyExtractor={i => i.id}
          contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg }}
          renderItem={({ item }) => (
            <View style={[s.bannerCard, { backgroundColor: item.bg }]}>
              <View style={s.bannerTextArea}>
                <Text style={s.bannerTitle}>{item.title}</Text>
                <Text style={s.bannerSub}>{item.sub}</Text>
              </View>
              <Image source={{ uri: item.img }} style={s.bannerImg} resizeMode="cover" />
            </View>
          )}
        />

        {/* ── Categories Row ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Shop by Category</Text>
          <FlatList data={categories} horizontal showsHorizontalScrollIndicator={false}
            keyExtractor={i => i.id} contentContainerStyle={{ paddingHorizontal: Spacing.lg }}
            renderItem={({ item }) => <CategoryCard category={item} />}
          />
        </View>

        {/* ── Trending ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Trending Now 🔥</Text>
          <FlatList data={trending} horizontal showsHorizontalScrollIndicator={false}
            keyExtractor={i => i.id} contentContainerStyle={{ paddingHorizontal: Spacing.lg }}
            renderItem={({ item }) => <ProductCard product={item} />}
          />
        </View>

        {/* ── Best Sellers ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Best Sellers ⭐</Text>
          <FlatList data={bestSellers} horizontal showsHorizontalScrollIndicator={false}
            keyExtractor={i => i.id} contentContainerStyle={{ paddingHorizontal: Spacing.lg }}
            renderItem={({ item }) => <ProductCard product={item} />}
          />
        </View>

        {/* ── All Products Grid ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>All Products</Text>
          <View style={s.grid}>
            {products.map(p => (
              <View key={p.id} style={s.gridItem}><ProductCard product={p} /></View>
            ))}
          </View>
        </View>
      </ScrollView>

      <CartBar />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.background },
  darkHeader: { backgroundColor: AppColors.darkHeader, paddingBottom: Spacing.lg, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm },
  delivLabel: { fontSize: 13, fontFamily: FontFamily.bodyMedium, color: 'rgba(255,255,255,0.7)' },
  delivTime: { fontSize: 28, fontFamily: FontFamily.heading, color: '#FFF', marginTop: 2 },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  addressText: { fontSize: 13, fontFamily: FontFamily.bodySemiBold, color: '#FFF' },
  addressSub: { fontSize: 12, fontFamily: FontFamily.body, color: 'rgba(255,255,255,0.6)' },
  headerIcons: { flexDirection: 'row', gap: 12, marginTop: 8 },
  headerIconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 4, marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg, gap: Spacing.sm,
  },
  searchPlaceholder: { flex: 1, fontSize: 14, fontFamily: FontFamily.body, color: AppColors.secondaryGrey },
  catTabRow: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, gap: 6 },
  catTab: { alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.full, backgroundColor: 'rgba(255,255,255,0.08)', gap: 4 },
  catTabActive: { backgroundColor: 'rgba(255,255,255,0.95)' },
  catTabText: { fontSize: 10, fontFamily: FontFamily.bodySemiBold, color: 'rgba(255,255,255,0.6)' },
  catTabTextActive: { color: AppColors.primaryGreen },
  bannerCard: {
    width: width * 0.4, height: 160, borderRadius: BorderRadius.xl, marginRight: Spacing.md,
    overflow: 'hidden', position: 'relative',
  },
  bannerTextArea: { padding: Spacing.md, zIndex: 1 },
  bannerTitle: { fontSize: 16, fontFamily: FontFamily.heading, color: AppColors.primaryBlack },
  bannerSub: { fontSize: 11, fontFamily: FontFamily.bodyMedium, color: AppColors.primaryGreen, marginTop: 4 },
  bannerImg: { position: 'absolute', bottom: 0, right: 0, width: 90, height: 90, borderTopLeftRadius: 12 },
  section: { marginTop: Spacing.xl },
  sectionTitle: { fontSize: 18, fontFamily: FontFamily.heading, color: AppColors.primaryBlack, marginBottom: Spacing.md, paddingHorizontal: Spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.lg, gap: Spacing.md, justifyContent: 'space-between' },
  gridItem: { width: '47%' },
});
