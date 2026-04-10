import CartBar from '@/components/CartBar';
import ProductCard from '@/components/ProductCard';
import { categories } from '@/constants/categories';
import { BorderRadius, FontFamily, Spacing } from '@/constants/theme';
import { getAllFoods, getCategories } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
   ActivityIndicator,
   Animated,
   FlatList,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from 'react-native';
import {
   SafeAreaView,
   useSafeAreaInsets,
} from 'react-native-safe-area-context';

const quickFilters = [
   { id: 'all', label: 'All', icon: 'bag-handle-outline' },
   { id: 'summer', label: 'Summer', icon: 'sunny-outline' },
   { id: 'snacks', label: 'Snacks', icon: 'fast-food-outline' },
   { id: 'drinks', label: 'Drinks', icon: 'cafe-outline' },
   { id: 'beauty', label: 'Beauty', icon: 'sparkles-outline' },
   { id: 'pharmacy', label: 'Pharmacy', icon: 'medkit-outline' },
];

const promoCards = [
   {
      id: 'launch',
      label: 'NEWLY LAUNCHED',
      title: 'Fresh Picks',
      subtitle: 'For You',
      bg: '#FFEAB5',
      emoji: '🥭',
   },
   {
      id: 'featured',
      label: 'Featured',
      title: 'Summer Special',
      subtitle: 'Cool & Crispy',
      bg: '#E4F3FF',
      emoji: '🧊',
   },
   {
      id: 'deals',
      label: 'Featured',
      title: 'Snacks Fest',
      subtitle: 'Flat 20% OFF',
      bg: '#FFE0BA',
      emoji: '🍿',
   },
];

const searchPlaceholders = [
   'Search aata...',
   'Search rice...',
   'Search chicken...',
   'Search paneer...',
   'Search dal...',
   'Search bread...',
];

function pickDistinctByCategory(items, count) {
   const buckets = items.reduce((acc, item) => {
      const key = item.category || 'misc';
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
   }, {});

   const keys = Object.keys(buckets);
   const selected = [];
   let round = 0;

   while (selected.length < count && keys.length > 0 && round < 12) {
      keys.forEach((key) => {
         if (selected.length < count && buckets[key]?.length) {
            selected.push(buckets[key].shift());
         }
      });
      round += 1;
   }

   return selected;
}

export default function HomeScreen() {
   const router = useRouter();
   const insets = useSafeAreaInsets();
   const scrollY = useRef(new Animated.Value(0)).current;
   const [foods, setFoods] = useState([]);
   const [apiCategories, setApiCategories] = useState([]);
   const [loading, setLoading] = useState(true);
   const [activeFilter, setActiveFilter] = useState('all');
   const [placeholder, setPlaceholder] = useState('');
   const [phraseIdx, setPhraseIdx] = useState(0);
   const [charIdx, setCharIdx] = useState(0);

   // Smooth typewriter effect for placeholder
   useEffect(() => {
      let timeoutId;
      const currentPhrase = searchPlaceholders[phraseIdx];

      if (charIdx <= currentPhrase.length) {
         // Still typing characters
         timeoutId = setTimeout(() => {
            setPlaceholder(currentPhrase.substring(0, charIdx));
            setCharIdx(charIdx + 1);
         }, 80); // Type speed - 80ms per character
      } else {
         // Phrase complete, wait before next
         timeoutId = setTimeout(() => {
            setPhraseIdx((phraseIdx + 1) % searchPlaceholders.length);
            setCharIdx(0);
         }, 2000); // 2 second pause between phrases
      }

      return () => clearTimeout(timeoutId);
   }, [charIdx, phraseIdx]);

   useEffect(() => {
      let mounted = true;

      (async () => {
         try {
            const [apiFoods, apiCats] = await Promise.all([
               getAllFoods(),
               getCategories(),
            ]);
            if (mounted) {
               setFoods(apiFoods || []);
               setApiCategories(apiCats || []);
            }
         } finally {
            if (mounted) setLoading(false);
         }
      })();

      return () => {
         mounted = false;
      };
   }, []);

   const nowHour = new Date().getHours();
   const isNight = nowHour >= 19 || nowHour < 6;
   const isMorning = nowHour >= 6 && nowHour < 12;

   const heroTheme = useMemo(() => {
      if (isNight) {
         return {
            bg: '#2C323F',
            bgSoft: '#4C5464',
            label: '#E6EAF2',
            title: '#FFFFFF',
         };
      }

      if (isMorning) {
         return {
            bg: '#EAF6DB',
            bgSoft: '#F6C84A',
            label: '#243B2A',
            title: '#1E2A1F',
         };
      }

      return {
         bg: '#EAF3FF',
         bgSoft: '#A8D5FF',
         label: '#22344F',
         title: '#18263D',
      };
   }, [isMorning, isNight]);

   const allProducts = foods;

   const stickyShadow = scrollY.interpolate({
      inputRange: [0, 110],
      outputRange: [0, 0.16],
      extrapolate: 'clamp',
   });

   const stickyElevation = scrollY.interpolate({
      inputRange: [0, 110],
      outputRange: [0, 10],
      extrapolate: 'clamp',
   });

   const stickyY = scrollY.interpolate({
      inputRange: [0, 120],
      outputRange: [0, -2],
      extrapolate: 'clamp',
   });

   const categoryProducts = useMemo(() => {
      if (!apiCategories.length) return {};
      const grouped = {};
      apiCategories.slice(0, 6).forEach((cat) => {
         grouped[cat._id] = foods
            .filter((f) => f.category === cat._id)
            .slice(0, 8);
      });
      return grouped;
   }, [foods, apiCategories]);

   const hotProducts = useMemo(
      () => allProducts.filter((item) => item.isHotProduct),
      [allProducts],
   );

   const recommendedProducts = useMemo(
      () => allProducts.filter((item) => item.isRecommended),
      [allProducts],
   );

   const previouslyBought = useMemo(() => {
      const source = hotProducts.length ? hotProducts : allProducts;
      return pickDistinctByCategory(source, 8);
   }, [allProducts, hotProducts]);

   const summerSpecials = useMemo(() => {
      const source = allProducts.filter((item) => {
         const cat = (item.category || '').toLowerCase();
         const name = (item.name || '').toLowerCase();
         if (activeFilter === 'all') return true;
         if (activeFilter === 'summer') {
            return /summer|cold|ice|juice|drink|beverage|shake/.test(
               `${cat} ${name}`,
            );
         }
         if (activeFilter === 'snacks') {
            return /snack|chips|cookie|namkeen|bakery/.test(`${cat} ${name}`);
         }
         if (activeFilter === 'drinks') {
            return /drink|beverage|juice|coffee|tea/.test(`${cat} ${name}`);
         }
         if (activeFilter === 'beauty') {
            return /beauty|care|cosmetic|skin/.test(`${cat} ${name}`);
         }
         if (activeFilter === 'pharmacy') {
            return /medicine|pharma|health|wellness/.test(`${cat} ${name}`);
         }
         return true;
      });

      const fallback = source.length ? source : allProducts;
      return pickDistinctByCategory(fallback, 10);
   }, [activeFilter, allProducts]);

   const snacksCategory = useMemo(() => {
      const snacks = allProducts.filter((p) =>
         /snack|chips|cookie/i.test(p.name || ''),
      );
      if (snacks.length) return snacks.slice(0, 8);
      return allProducts.slice(0, 8);
   }, [allProducts]);

   const beveragesCategory = useMemo(() => {
      const drinks = allProducts.filter((p) =>
         /drink|juice|tea|coffee/i.test(p.name || ''),
      );
      if (drinks.length) return drinks.slice(0, 8);
      return allProducts.slice(0, 8);
   }, [allProducts]);

   const topCategories = categories.slice(0, 8);
   const isDay = !isNight;

   const categoryIconMap = {
      breakfast: 'egg',
      beverages: 'cafe',
      bakery: 'pizza',
      snacks: 'fast-food',
      'personal-care': 'spa',
      'eco-living': 'leaf',
      pantry: 'settings',
      fruits: 'apple',
      vegetables: 'leaf',
      dairy: 'water',
      'meat-fish': 'fish',
      frozen: 'snow',
   };

   return (
      <SafeAreaView style={styles.container} edges={['top']}>
         <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
            stickyHeaderIndices={[1]}
            scrollEventThrottle={16}
            onScroll={Animated.event(
               [{ nativeEvent: { contentOffset: { y: scrollY } } }],
               { useNativeDriver: false },
            )}
         >
            <View
               style={[
                  styles.heroWrap,
                  {
                     backgroundColor: heroTheme.bg,
                     paddingTop: insets.top + (isDay ? 6 : 10),
                     paddingBottom: isDay ? 10 : 16,
                  },
               ]}
            >
               <View
                  style={[
                     styles.heroBlob,
                     { backgroundColor: heroTheme.bgSoft },
                  ]}
               />
               <Text
                  style={[
                     styles.heroLabel,
                     { color: heroTheme.label, fontSize: isDay ? 26 : 31 },
                  ]}
               >
                  Blinkit in
               </Text>
               <View style={styles.heroTitleRow}>
                  <Text
                     style={[
                        styles.heroTitle,
                        { color: heroTheme.title, fontSize: isDay ? 17 : 20 },
                     ]}
                  >
                     14 minutes
                  </Text>
                  <View style={styles.liveChip}>
                     <Ionicons name='time-outline' size={12} color='#5E4C00' />
                     <Text style={styles.liveText}>24/7</Text>
                  </View>
               </View>
               <View style={styles.locationRow}>
                  <Text
                     style={[styles.locationTag, { color: heroTheme.label }]}
                  >
                     HOME
                  </Text>
                  <Text
                     style={[styles.locationText, { color: heroTheme.label }]}
                  >
                     {' '}
                     - Shankar vihar colony, House no
                  </Text>
                  <Ionicons
                     name='chevron-down'
                     size={14}
                     color={heroTheme.label}
                  />
               </View>
            </View>

            <Animated.View
               style={[
                  styles.stickyWrap,
                  {
                     shadowOpacity: stickyShadow,
                     elevation: stickyElevation,
                     transform: [{ translateY: stickyY }],
                  },
               ]}
            >
               <TouchableOpacity
                  style={styles.searchWrap}
                  activeOpacity={0.8}
                  onPress={() => router.push('/(tabs)/search-screen')}
               >
                  <Ionicons name='search' size={22} color='#333' />
                  <Text style={styles.searchPlaceholder}>{placeholder}</Text>
                  <Ionicons name='mic-outline' size={21} color='#333' />
               </TouchableOpacity>

               <FlatList
                  data={quickFilters}
                  horizontal
                  keyExtractor={(item) => item.id}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.quickFilterRow}
                  renderItem={({ item }) => (
                     <TouchableOpacity
                        style={styles.quickFilterItem}
                        activeOpacity={0.85}
                        onPress={() => setActiveFilter(item.id)}
                     >
                        <Ionicons
                           name={item.icon}
                           size={21}
                           color={
                              activeFilter === item.id ? '#1A1A1A' : '#3F3F3F'
                           }
                        />
                        <Text
                           style={[
                              styles.quickFilterText,
                              activeFilter === item.id &&
                                 styles.quickFilterActive,
                           ]}
                        >
                           {item.label}
                        </Text>
                        {activeFilter === item.id && (
                           <View style={styles.activeUnderLine} />
                        )}
                     </TouchableOpacity>
                  )}
               />
            </Animated.View>

            <View style={styles.section}>
               <FlatList
                  data={promoCards}
                  horizontal
                  keyExtractor={(item) => item.id}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.promoRow}
                  renderItem={({ item }) => (
                     <TouchableOpacity
                        style={[styles.promoCard, { backgroundColor: item.bg }]}
                        activeOpacity={0.85}
                     >
                        <Text style={styles.promoLabel}>{item.label}</Text>
                        <Text style={styles.promoTitle}>{item.title}</Text>
                        <Text style={styles.promoSubtitle}>
                           {item.subtitle}
                        </Text>
                        <Text style={styles.promoEmoji}>{item.emoji}</Text>
                     </TouchableOpacity>
                  )}
               />
            </View>

            {loading && (
               <View style={styles.loaderWrap}>
                  <ActivityIndicator size='large' color='#168C33' />
               </View>
            )}

            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Previously bought</Text>
               <FlatList
                  data={previouslyBought}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.horizontalListPad}
                  renderItem={({ item }) => (
                     <ProductCard
                        product={item}
                        variant='premium'
                        showFooterCta
                     />
                  )}
               />
            </View>

            <View style={[styles.section, styles.freshMarketWrap]}>
               <View style={styles.sectionHeaderRow}>
                  <View>
                     <Text style={styles.sectionTitle}>Fresh market</Text>
                     <Text style={styles.sectionCaption}>
                        Handpicked seasonal finds
                     </Text>
                  </View>
                  <View style={styles.priceChip}>
                     <Text style={styles.priceChipText}>₹59 / Unit</Text>
                  </View>
               </View>

               <FlatList
                  data={summerSpecials}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.horizontalListPad}
                  renderItem={({ item }) => (
                     <ProductCard
                        product={item}
                        showFooterCta
                        variant='premium'
                     />
                  )}
               />

               <TouchableOpacity
                  style={styles.allProductsBtn}
                  activeOpacity={0.9}
               >
                  <Text style={styles.allProductsText}>See all products</Text>
                  <Ionicons name='chevron-forward' size={16} color='#32406B' />
               </TouchableOpacity>
            </View>

            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Snacks corner</Text>
               <FlatList
                  data={snacksCategory}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.horizontalListPad}
                  renderItem={({ item }) => <ProductCard product={item} />}
               />
            </View>

            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Drinks & coolers</Text>
               <FlatList
                  data={beveragesCategory}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.horizontalListPad}
                  renderItem={({ item }) => (
                     <ProductCard product={item} variant='premium' />
                  )}
               />
            </View>

            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Grocery & Kitchen</Text>
               <View style={styles.categoryGrid}>
                  {topCategories.map((cat) => (
                     <TouchableOpacity
                        key={cat.id}
                        style={styles.categoryTile}
                        activeOpacity={0.85}
                     >
                        <View
                           style={[
                              styles.categoryIconWrap,
                              { backgroundColor: cat.bgColor },
                           ]}
                        >
                           <Ionicons
                              name={
                                 categoryIconMap[cat.id.toLowerCase()] ||
                                 'bag-handle'
                              }
                              size={28}
                              color='#222'
                           />
                        </View>
                        <Text style={styles.categoryLabel} numberOfLines={2}>
                           {cat.name}
                        </Text>
                     </TouchableOpacity>
                  ))}
               </View>
            </View>

            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Recommended for you</Text>
               <FlatList
                  data={
                     recommendedProducts.length
                        ? recommendedProducts.slice(0, 10)
                        : allProducts.slice(0, 10)
                  }
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.horizontalListPad}
                  renderItem={({ item }) => (
                     <ProductCard product={item} variant='premium' />
                  )}
               />
            </View>

            {apiCategories.slice(0, 4).map((cat) => {
               const catProducts = categoryProducts[cat._id] || [];
               if (!catProducts.length) return null;
               return (
                  <View key={cat._id} style={styles.section}>
                     <Text style={styles.sectionTitle}>{cat.name}</Text>
                     <FlatList
                        data={catProducts}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.horizontalListPad}
                        renderItem={({ item }) => (
                           <ProductCard product={item} variant='premium' />
                        )}
                     />
                  </View>
               );
            })}

            <View style={styles.bottomSpace} />
         </Animated.ScrollView>

         <View pointerEvents='box-none'>
            <CartBar />
         </View>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: '#F7F8F4' },
   contentContainer: { paddingBottom: 110 },
   heroWrap: {
      paddingHorizontal: Spacing.lg,
      overflow: 'hidden',
   },
   heroBlob: {
      position: 'absolute',
      width: 220,
      height: 220,
      borderRadius: 110,
      top: -70,
      right: -35,
      opacity: 0.45,
   },
   heroLabel: {
      fontFamily: FontFamily.heading,
   },
   heroTitleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
   heroTitle: { fontFamily: FontFamily.bodySemiBold },
   liveChip: {
      marginLeft: Spacing.sm,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: BorderRadius.full,
      backgroundColor: '#FFEBA6',
      borderWidth: 1,
      borderColor: '#FFDF77',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
   },
   liveText: {
      fontSize: 11,
      color: '#5E4C00',
      fontFamily: FontFamily.bodyBold,
   },
   locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
   locationTag: { fontSize: 14, fontFamily: FontFamily.bodyBold },
   locationText: { fontSize: 14, fontFamily: FontFamily.body },

   stickyWrap: {
      backgroundColor: '#F7F8F4',
      paddingHorizontal: Spacing.lg,
      paddingTop: 10,
      paddingBottom: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
   },
   searchWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: BorderRadius.xl,
      paddingHorizontal: 12,
      height: 56,
      borderWidth: 1,
      borderColor: '#EBEBEB',
   },
   searchInput: {
      flex: 1,
      marginLeft: 8,
      fontSize: 14,
      color: '#333',
      fontFamily: FontFamily.bodyMedium,
      paddingVertical: 0,
   },
   searchPlaceholder: {
      flex: 1,
      marginLeft: 8,
      fontSize: 14,
      color: '#999',
      fontFamily: FontFamily.bodyMedium,
   },
   searchDivider: {
      width: 1,
      height: 24,
      backgroundColor: '#E3E3E3',
      marginHorizontal: 10,
   },
   quickFilterRow: { paddingTop: 12, paddingBottom: 4 },
   quickFilterItem: {
      width: 78,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
   },
   quickFilterText: {
      marginTop: 2,
      fontSize: 12,
      fontFamily: FontFamily.bodyMedium,
      color: '#3E3E3E',
   },
   quickFilterActive: { fontFamily: FontFamily.bodyBold, color: '#1A1A1A' },
   activeUnderLine: {
      marginTop: 7,
      width: 36,
      height: 4,
      borderRadius: BorderRadius.full,
      backgroundColor: '#2F3A49',
   },

   section: { marginTop: Spacing.lg },
   promoRow: { paddingHorizontal: Spacing.lg },
   promoCard: {
      width: 174,
      borderRadius: BorderRadius.xl,
      marginRight: Spacing.sm,
      padding: 12,
      borderWidth: 1,
      borderColor: '#DDE7EE',
      minHeight: 118,
   },
   promoLabel: {
      fontSize: 11,
      fontFamily: FontFamily.bodyBold,
      color: '#C43721',
   },
   promoTitle: {
      fontSize: 26,
      fontFamily: FontFamily.headingSemiBold,
      color: '#1E2A1F',
      marginTop: 6,
   },
   promoSubtitle: {
      fontSize: 13,
      fontFamily: FontFamily.bodySemiBold,
      color: '#3A4B40',
      marginTop: 4,
   },
   promoEmoji: { position: 'absolute', right: 10, bottom: 8, fontSize: 38 },

   loaderWrap: { paddingTop: 16 },
   sectionTitle: {
      fontSize: 24,
      fontFamily: FontFamily.headingSemiBold,
      color: '#1D2520',
      marginBottom: Spacing.md,
      paddingHorizontal: Spacing.lg,
   },
   sectionCaption: {
      fontSize: 13,
      fontFamily: FontFamily.body,
      color: '#5F6C66',
      marginTop: -8,
      paddingHorizontal: Spacing.lg,
      marginBottom: 10,
   },
   horizontalListPad: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
   },
   freshMarketWrap: {
      backgroundColor: '#EAF5E5',
      paddingVertical: Spacing.md,
   },
   sectionHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingRight: Spacing.lg,
   },
   priceChip: {
      backgroundColor: '#FFD748',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: BorderRadius.lg,
   },
   priceChipText: {
      color: '#242424',
      fontSize: 13,
      fontFamily: FontFamily.bodyBold,
   },
   allProductsBtn: {
      marginHorizontal: Spacing.lg,
      marginTop: Spacing.md,
      borderRadius: BorderRadius.lg,
      backgroundColor: '#F4F5FF',
      borderWidth: 1,
      borderColor: '#E3E5F9',
      paddingVertical: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
   },
   allProductsText: {
      fontSize: 16,
      fontFamily: FontFamily.bodySemiBold,
      color: '#32406B',
   },
   categoryGrid: {
      paddingHorizontal: Spacing.lg,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      rowGap: Spacing.md,
   },
   categoryTile: {
      width: '23%',
      backgroundColor: '#FFFFFF',
      borderRadius: BorderRadius.xl,
      borderWidth: 1,
      borderColor: '#ECECEC',
      paddingVertical: 10,
      alignItems: 'center',
   },
   categoryIconWrap: {
      width: 54,
      height: 54,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
   },

   categoryLabel: {
      marginTop: 7,
      fontSize: 12,
      fontFamily: FontFamily.bodyMedium,
      color: '#1F1F1F',
      textAlign: 'center',
      minHeight: 30,
   },
   bottomSpace: { height: 30 },
});
