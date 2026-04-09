import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Image, Animated as RNAnimated, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, withDelay, Easing } from 'react-native-reanimated';
import ProductCard from '@/components/ProductCard';
import CartBar from '@/components/CartBar';
import { AppColors, FontFamily, Spacing, BorderRadius } from '@/constants/theme';
import { categories } from '@/constants/categories';
import { getAllFoods } from '@/services/api';

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
  { id: 'care', name: 'Beauty', icon: 'heart' },
  { id: 'pharma', name: 'Pharmacy', icon: 'medkit' },
];

export default function HomeScreen() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stickyVisible, setStickyVisible] = useState(false);
  const scrollY = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const data = await getAllFoods();
      setFoods(data);
      setLoading(false);
    })();
  }, []);

  const featured = foods.filter(f => f.isFeatured);
  const recommended = foods.filter(f => f.isRecommended);
  const hotProducts = foods.filter(f => f.isHotProduct);

  const handleScroll = RNAnimated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false, listener: (e) => { setStickyVisible(e.nativeEvent.contentOffset.y > 220); } }
  );

  return (
    <View style={s.container}>
      {/* Sticky Search + Tabs (shows on scroll) */}
      {stickyVisible && (
        <View style={s.stickyWrap}>
          <SafeAreaView edges={['top']} style={{ backgroundColor: AppColors.white }}>
            <TouchableOpacity style={s.stickySearch} activeOpacity={0.8}>
              <Ionicons name="search" size={18} color={AppColors.secondaryGrey} />
              <Text style={s.stickySearchText}>Search for atta, dal, coke and more</Text>
              <Ionicons name="mic-outline" size={18} color={AppColors.secondaryGrey} />
            </TouchableOpacity>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.stickyCatRow}>
              {catTabs.map((t, i) => (
                <TouchableOpacity key={t.id} style={[s.stickyCat, i === 0 && s.stickyCatActive]}>
                  <Ionicons name={t.icon} size={16} color={i === 0 ? AppColors.primaryGreen : AppColors.secondaryGrey} />
                  <Text style={[s.stickyCatText, i === 0 && { color: AppColors.primaryGreen }]}>{t.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </SafeAreaView>
        </View>
      )}

      <RNAnimated.ScrollView showsVerticalScrollIndicator={false} onScroll={handleScroll}
        scrollEventThrottle={16} contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Dark Header */}
        <View style={s.darkHeader}>
          <SafeAreaView edges={['top']}>
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
              <Star x={30} y={20} size={2} delay={0} /><Star x={80} y={40} size={3} delay={300} />
              <Star x={150} y={15} size={2} delay={600} /><Star x={200} y={50} size={2.5} delay={200} />
              <Star x={260} y={25} size={2} delay={800} /><Star x={320} y={45} size={3} delay={100} />
              <Star x={width - 60} y={30} size={2} delay={500} />
            </View>
            <View style={s.headerContent}>
              <View>
                <Text style={s.delivLabel}>QuickComm in</Text>
                <Text style={s.delivTime}>10 minutes</Text>
                <View style={s.addressRow}>
                  <Text style={s.addressBold}>HOME</Text>
                  <Text style={s.addressSub}> - 123 Main Street ▾</Text>
                </View>
              </View>
              <View style={s.headerIcons}>
                <TouchableOpacity style={s.iconBtn}><Ionicons name="notifications-outline" size={22} color="#FFF" /></TouchableOpacity>
                <TouchableOpacity style={s.iconBtn}><Ionicons name="person-circle-outline" size={26} color="#FFF" /></TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={s.searchBar} activeOpacity={0.8}>
              <Ionicons name="search" size={20} color={AppColors.secondaryGrey} />
              <Text style={s.searchPlaceholder}>Search for atta, dal, coke and more</Text>
              <Ionicons name="mic-outline" size={20} color={AppColors.secondaryGrey} />
            </TouchableOpacity>
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

        {/* Banners */}
        <FlatList data={banners} horizontal showsHorizontalScrollIndicator={false} keyExtractor={i => i.id}
          contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg }}
          renderItem={({ item }) => (
            <View style={[s.bannerCard, { backgroundColor: item.bg }]}>
              <View style={s.bannerText}><Text style={s.bannerTitle}>{item.title}</Text><Text style={s.bannerSub}>{item.sub}</Text></View>
              <Image source={{ uri: item.img }} style={s.bannerImg} resizeMode="cover" />
            </View>
          )}
        />

        {/* Loading */}
        {loading && <ActivityIndicator size="large" color={AppColors.primaryGreen} style={{ marginTop: 40 }} />}

        {/* Hot Products */}
        {hotProducts.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Previously bought</Text>
            <FlatList data={hotProducts} horizontal showsHorizontalScrollIndicator={false}
              keyExtractor={i => i.id} contentContainerStyle={{ paddingHorizontal: Spacing.lg }}
              renderItem={({ item }) => <ProductCard product={item} />}
            />
            <TouchableOpacity style={s.seeMore}><Text style={s.seeMoreText}>See more like this</Text><Ionicons name="chevron-forward" size={14} color={AppColors.primaryGreen} /></TouchableOpacity>
          </View>
        )}

        {/* Featured */}
        {featured.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>People also bought</Text>
            <FlatList data={featured} horizontal showsHorizontalScrollIndicator={false}
              keyExtractor={i => i.id} contentContainerStyle={{ paddingHorizontal: Spacing.lg }}
              renderItem={({ item }) => <ProductCard product={item} />}
            />
          </View>
        )}

        {/* Recommended */}
        {recommended.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Recommended for you</Text>
            <FlatList data={recommended} horizontal showsHorizontalScrollIndicator={false}
              keyExtractor={i => i.id} contentContainerStyle={{ paddingHorizontal: Spacing.lg }}
              renderItem={({ item }) => <ProductCard product={item} />}
            />
          </View>
        )}

        {/* See All */}
        <TouchableOpacity style={s.seeAllBar}>
          <Text style={{ fontSize: 20 }}>🍛🥗🍕</Text>
          <Text style={s.seeAllText}>See all products</Text>
          <Ionicons name="chevron-forward" size={16} color={AppColors.primaryBlack} />
        </TouchableOpacity>
      </RNAnimated.ScrollView>

      <CartBar />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.background },
  /* Sticky */
  stickyWrap: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50, backgroundColor: AppColors.white, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 5 },
  stickySearch: { flexDirection: 'row', alignItems: 'center', backgroundColor: AppColors.lightGrey, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md, paddingVertical: 10, marginHorizontal: Spacing.lg, marginTop: 4, gap: Spacing.sm },
  stickySearchText: { flex: 1, fontSize: 13, fontFamily: FontFamily.body, color: AppColors.secondaryGrey },
  stickyCatRow: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, gap: 8 },
  stickyCat: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full, backgroundColor: AppColors.lightGrey },
  stickyCatActive: { backgroundColor: AppColors.lightGreen },
  stickyCatText: { fontSize: 11, fontFamily: FontFamily.bodySemiBold, color: AppColors.secondaryGrey },
  /* Dark Header */
  darkHeader: { backgroundColor: AppColors.darkHeader, paddingBottom: Spacing.lg, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm },
  delivLabel: { fontSize: 13, fontFamily: FontFamily.bodyMedium, color: 'rgba(255,255,255,0.7)' },
  delivTime: { fontSize: 28, fontFamily: FontFamily.heading, color: '#FFF', marginTop: 2 },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  addressBold: { fontSize: 13, fontFamily: FontFamily.bodySemiBold, color: '#FFF' },
  addressSub: { fontSize: 12, fontFamily: FontFamily.body, color: 'rgba(255,255,255,0.6)' },
  headerIcons: { flexDirection: 'row', gap: 12, marginTop: 8 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md, paddingVertical: 11, marginHorizontal: Spacing.lg, marginTop: Spacing.lg, gap: Spacing.sm },
  searchPlaceholder: { flex: 1, fontSize: 14, fontFamily: FontFamily.body, color: AppColors.secondaryGrey },
  catTabRow: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, gap: 6 },
  catTab: { alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.full, backgroundColor: 'rgba(255,255,255,0.08)', gap: 4 },
  catTabActive: { backgroundColor: 'rgba(255,255,255,0.95)' },
  catTabText: { fontSize: 10, fontFamily: FontFamily.bodySemiBold, color: 'rgba(255,255,255,0.6)' },
  catTabTextActive: { color: AppColors.primaryGreen },
  /* Banners */
  bannerCard: { width: width * 0.4, height: 160, borderRadius: BorderRadius.xl, marginRight: Spacing.md, overflow: 'hidden', position: 'relative' },
  bannerText: { padding: Spacing.md, zIndex: 1 },
  bannerTitle: { fontSize: 16, fontFamily: FontFamily.heading, color: AppColors.primaryBlack },
  bannerSub: { fontSize: 11, fontFamily: FontFamily.bodyMedium, color: AppColors.primaryGreen, marginTop: 4 },
  bannerImg: { position: 'absolute', bottom: 0, right: 0, width: 90, height: 90, borderTopLeftRadius: 12 },
  /* Sections */
  section: { marginTop: Spacing.xl },
  sectionTitle: { fontSize: 18, fontFamily: FontFamily.heading, color: AppColors.primaryBlack, marginBottom: Spacing.md, paddingHorizontal: Spacing.lg },
  seeMore: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, gap: 4 },
  seeMoreText: { fontSize: 13, fontFamily: FontFamily.bodySemiBold, color: AppColors.primaryGreen },
  seeAllBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: Spacing.lg, marginTop: Spacing.xxl, paddingVertical: Spacing.lg, borderTopWidth: 1, borderTopColor: AppColors.cardBorder },
  seeAllText: { fontSize: 15, fontFamily: FontFamily.headingSemiBold, color: AppColors.primaryBlack },
});
