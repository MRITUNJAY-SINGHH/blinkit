import CartBar from '@/components/CartBar';
import ProductCard from '@/components/ProductCard';
import { BorderRadius, FontFamily, Spacing } from '@/constants/theme';
import { getAllFoods, getCategories } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
   ActivityIndicator,
   Animated,
   FlatList,
   Image,
   Modal,
   Pressable,
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
   { id: 'mobile', label: 'Mobile', icon: 'phone-portrait-outline' },
   { id: 'drinks', label: 'Drinks', icon: 'cafe-outline' },
   { id: 'beauty', label: 'Beauty', icon: 'sparkles-outline' },
   { id: 'pharmacy', label: 'Pharmacy', icon: 'medkit-outline' },
];

const groceryBannerImages = {
   one: require('../../assets/images/groceries-1.png'),
   two: require('../../assets/images/groceries-2.png'),
   three: require('../../assets/images/groceries-3.png'),
   four: require('../../assets/images/groceries-4.png'),
};

const groceryCards = [
   {
      id: 'g-2',
      image: {
         uri: 'https://cdn.jiostore.online/v2/jmd-asp/jdprod/wrkr/company/1/applications/645a057875d8c4882b096f7e/theme/pictures/free/original/theme-image-1775217945678.jpeg',
      },
   },
   { id: 'g-4', image: groceryBannerImages.four },
   { id: 'g-3', image: groceryBannerImages.three },
   { id: 'g-1', image: groceryBannerImages.one },
   { id: 'g-5', image: groceryBannerImages.two },
   { id: 'g-6', image: groceryBannerImages.four },
   { id: 'g-7', image: groceryBannerImages.three },
   { id: 'g-8', image: groceryBannerImages.one },
];

const searchPlaceholders = [
   'Search aata...',
   'Search rice...',
   'Search chicken...',
   'Search paneer...',
   'Search dal...',
   'Search bread...',
];

const addressActions = [
   {
      id: 'current',
      title: 'Use current location',
      subtitle: 'Detect your live location',
      icon: 'location-outline',
   },
   {
      id: 'new',
      title: 'Add new address',
      subtitle: 'Save home, office or other locations',
      icon: 'add',
   },
   {
      id: 'request',
      title: 'Request address from someone else',
      subtitle: 'Share an address request on WhatsApp',
      icon: 'chatbubble-ellipses-outline',
   },
   {
      id: 'import',
      title: 'Import your addresses from Zomato',
      subtitle: 'Bring in saved locations quickly',
      icon: 'download-outline',
   },
];

const grocerySectionItems = [
   {
      id: 'veg-fruit',
      image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-5_4.png',
   },
   {
      id: 'atta-rice-dal',
      image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-6_5.png',
   },
   {
      id: 'oil-ghee',
      image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2025-11/Slice-7-1_0.png',
   },
   {
      id: 'dairy-bread-eggs',
      image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-8_4.png',
   },
   {
      id: 'bakery-biscuits',
      image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-4_9.png',
   },
   {
      id: 'dry-fruits-cereals',
      image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-2_10.png',
   },
   {
      id: 'chicken-meat-fish',
      image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-12.png',
   },
   {
      id: 'kitchenware',
      image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-11.png',
   },
   {
      id: 'veg-fruit-repeat',
      image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-5_4.png',
   },
];

const snacksSectionItems = [
   {
      id: 'chips-namkeen',
      image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-20.png',
   },
   {
      id: 'sweets-chocolates',
      image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-17.png',
   },
   {
      id: 'drinks-juices',
      image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-12/paan-corner_web.png',
   },
   {
      id: 'tea-coffee',
      image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-4_9.png',
   },
   {
      id: 'instant-food',
      image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-6_5.png',
   },
   {
      id: 'ice-cream',
      image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2025-11/Slice-7-1_0.png',
   },
   {
      id: 'breakfast',
      image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-8_4.png',
   },
   {
      id: 'personal-care',
      image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-12.png',
   },
   {
      id: 'chips-repeat',
      image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-20.png',
   },
];

const frequentlyBoughtTogetherItems = [
   {
      id: 'kurkure',
      image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/da/cms-assets/cms/product/02a26f91-4c2d-400c-84c3-1d33b222acb4.png',
   },
   {
      id: 'curls',
      image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=540/da/cms-assets/cms/product/5b450106-f5f1-4c8d-a60f-43244faa3c67.png',
   },
   {
      id: 'crax',
      image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=540/da/cms-assets/cms/product/7f63a457-0457-4e22-a5d9-8a9e33b9a547.png',
   },
   {
      id: 'natkhat',
      image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=540/da/cms-assets/cms/product/a04d9ab3-8941-4208-a60e-746f0e0b68f1.png',
   },
   {
      id: 'crax-cheese-ball',
      image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=540/da/cms-assets/cms/product/f3464dcd-07f3-4b0c-9821-5ea882c57d02.png',
   },
   {
      id: 'doritos',
      image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=540/da/cms-assets/cms/product/43f0ac75-1806-44c8-a337-88e409f9bc35.png',
   },
   {
      id: 'kitkat',
      image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=540/da/cms-assets/cms/product/rc-upload-1775469517019-153.png',
   },
   {
      id: 'oneplus-15',
      image: 'https://cdn.jiostore.online/v2/jmd-asp/jdprod/wrkr/products/pictures/item/free/resize-w:250/one-plus/494742149/0/OfHXVeop9z-qaI1A1EqK-OnePlusOneplus15-MP-494742149-i-1.jpg',
   },
   {
      id: 'pixel-10',
      image: 'https://cdn.jiostore.online/v2/jmd-asp/jdprod/wrkr/products/pictures/item/free/resize-w:250/google/494582873/0/4fHEHEgttk-L8dI3gF2_n-GooglePixel10-494582873-i-1-1200Wx1200H.jpeg',
   },
   {
      id: 'pixel-10-pro-fold',
      image: 'https://cdn.jiostore.online/v2/jmd-asp/jdprod/wrkr/products/pictures/item/free/resize-w:250/google/494583323/0/yiVtzP3KVT-zaRva_f5rL-GooglePixel10ProFold-MP-494583323-i-1-1200Wx1200H.jpeg',
   },
   {
      id: 'iphone-16',
      image: 'https://cdn.jiostore.online/v2/jmd-asp/jdprod/wrkr/products/pictures/item/free/resize-w:250/apple/494423032/0/xCQYRCsXOR-AqKZhL-pVa-Apple-iPhone-16-Plus-494423032-i-1-1200Wx1200H.jpeg',
   },
];

const frequentlyBoughtTogetherCards = [
   {
      id: 'oil-ghee-masala',
      title: 'Oil, Ghee & Masala',
      moreText: '+4 more',
      bg: '#DDEEEF',
      items: [
         frequentlyBoughtTogetherItems[0],
         frequentlyBoughtTogetherItems[1],
      ],
   },
   {
      id: 'chips-namkeen',
      title: 'Chips & Namkeen',
      moreText: '+1 more',
      bg: '#EEF6E6',
      items: [
         frequentlyBoughtTogetherItems[2],
         frequentlyBoughtTogetherItems[3],
      ],
   },
   {
      id: 'rajma-chole-dal',
      title: 'Rajma, Chole & Dal',
      moreText: '',
      bg: '#EEF2F8',
      items: [
         frequentlyBoughtTogetherItems[4],
         frequentlyBoughtTogetherItems[5],
      ],
   },
   {
      id: 'drinks-juices',
      title: 'Drinks & Juices',
      moreText: '+1 more',
      bg: '#E3F4EC',
      items: [
         frequentlyBoughtTogetherItems[6],
         frequentlyBoughtTogetherItems[0],
      ],
   },
   {
      id: 'mobiles',
      title: 'Mobiles',
      moreText: '',
      bg: '#E9ECFF',
      items: [
         frequentlyBoughtTogetherItems[7],
         frequentlyBoughtTogetherItems[8],
      ],
   },
];

const mobileDemoProducts = [
   {
      id: 'mobile-oneplus-15',
      title: 'OnePlus 15 5G 256 GB, 12 GB RAM, Infinite Black',
      description: 'Flagship performance with premium design',
      price: '₹89,999',
      image: frequentlyBoughtTogetherItems[7].image,
   },
   {
      id: 'mobile-pixel-10',
      title: 'Google Pixel 10',
      description: 'Google AI camera phone with clean Android',
      price: '₹84,999',
      image: frequentlyBoughtTogetherItems[8].image,
   },
   {
      id: 'mobile-pixel-10-pro-fold',
      title: 'Google Pixel 10 Pro Fold 256 GB, 16 GB RAM, Moonstone, Mobile Phone',
      description: 'Foldable flagship with premium camera and AI features',
      price: '₹1,62,999',
      image: frequentlyBoughtTogetherItems[9].image,
   },
   {
      id: 'mobile-iphone-16',
      title: 'iPhone 16',
      description: 'Powerful performance with smooth iOS experience',
      price: '₹96,499',
      image: frequentlyBoughtTogetherItems[10].image,
   },
];

const previouslyBoughtDemoProducts = [
   {
      id: 'demo-kurkure',
      title: 'Kurkure Masala Munch',
      description: 'Crunchy snack with tangy masala flavour',
      price: '₹20',
      image: frequentlyBoughtTogetherItems[0].image,
   },
   {
      id: 'demo-curls',
      title: 'Curls Party Snack',
      description: 'Light, crispy and perfect for tea time',
      price: '₹35',
      image: frequentlyBoughtTogetherItems[1].image,
   },
   {
      id: 'demo-crax',
      title: 'Crax Spicy Rings',
      description: 'Spicy rings snack for quick bites',
      price: '₹18',
      image: frequentlyBoughtTogetherItems[2].image,
   },
   {
      id: 'demo-natkhat',
      title: 'Natkhat Snack Mix',
      description: 'Mixed crunchy snack for every mood',
      price: '₹28',
      image: frequentlyBoughtTogetherItems[3].image,
   },
   {
      id: 'demo-kitkat',
      title: 'KitKat Chocolate Bar',
      description: 'Chocolate treat for a sweet break',
      price: '₹40',
      image: frequentlyBoughtTogetherItems[6].image,
   },
];

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
   const [locationSheetVisible, setLocationSheetVisible] = useState(false);

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
            bg: '#262A33',
            bgSoft: '#4E5666',
            label: '#EEF2F7',
            title: '#FFFFFF',
            shadow: 'rgba(0,0,0,0.28)',
         };
      }

      if (isMorning) {
         return {
            bg: '#EAF6DB',
            bgSoft: '#F4D55B',
            label: '#243B2A',
            title: '#172117',
            shadow: 'rgba(0,0,0,0.08)',
         };
      }

      return {
         bg: '#EAF3FF',
         bgSoft: '#A8D5FF',
         label: '#22344F',
         title: '#18263D',
         shadow: 'rgba(0,0,0,0.1)',
      };
   }, [isMorning, isNight]);

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

   const isDay = !isNight;

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
                     paddingTop: insets.top + (isDay ? 8 : 10),
                     paddingBottom: isDay ? 10 : 12,
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
                     { color: heroTheme.label, fontSize: isDay ? 24 : 27 },
                  ]}
               >
                  Bachat Bazar in
               </Text>
               <View style={styles.heroTitleRow}>
                  <Text
                     style={[
                        styles.heroTitle,
                        { color: heroTheme.title, fontSize: isDay ? 16 : 18 },
                     ]}
                  >
                     14 minutes
                  </Text>
                  <View style={styles.liveChip}>
                     <Ionicons name='time-outline' size={12} color='#5E4C00' />
                     <Text style={styles.liveText}>24/7</Text>
                  </View>
               </View>
               <TouchableOpacity
                  style={styles.locationRow}
                  activeOpacity={0.75}
                  onPress={() => setLocationSheetVisible(true)}
               >
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
               </TouchableOpacity>
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
                  data={groceryCards}
                  horizontal
                  keyExtractor={(item) => item.id}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.promoRow}
                  renderItem={({ item }) => (
                     <TouchableOpacity
                        style={styles.promoCard}
                        activeOpacity={0.85}
                     >
                        <View style={styles.promoImageWrap}>
                           <Image
                              source={item.image}
                              style={styles.promoImage}
                              resizeMode='contain'
                           />
                        </View>
                     </TouchableOpacity>
                  )}
               />
            </View>

            <View style={styles.section}>
               <Text style={styles.sectionTitle}>
                  Frequently bought together
               </Text>
               <View style={styles.freqGrid}>
                  {frequentlyBoughtTogetherCards.map((card) => (
                     <TouchableOpacity
                        key={card.id}
                        style={styles.freqCard}
                        activeOpacity={0.85}
                     >
                        <View style={styles.freqCardSurface}>
                           <View
                              style={[
                                 styles.freqArtWrap,
                                 { backgroundColor: card.bg },
                              ]}
                           >
                              <View style={styles.freqImageStack}>
                                 {card.items.map((item, index) => (
                                    <View
                                       key={`${card.id}-${item.id}`}
                                       style={[
                                          styles.freqImageFrame,
                                          index === 0
                                             ? styles.freqImageFrameLeft
                                             : styles.freqImageFrameRight,
                                       ]}
                                    >
                                       <Image
                                          source={{ uri: item.image }}
                                          style={styles.freqImage}
                                          resizeMode='contain'
                                       />
                                    </View>
                                 ))}
                              </View>
                              {card.moreText ? (
                                 <View style={styles.freqMoreChip}>
                                    <Text style={styles.freqMoreText}>
                                       {card.moreText}
                                    </Text>
                                 </View>
                              ) : null}
                           </View>

                           <View style={styles.freqTextBlock}>
                              <Text style={styles.freqTitle} numberOfLines={2}>
                                 {card.title}
                              </Text>
                              <Text
                                 style={styles.freqSubtitle}
                                 numberOfLines={1}
                              >
                                 Smart picks for faster reorders
                              </Text>
                           </View>
                        </View>
                     </TouchableOpacity>
                  ))}
               </View>
            </View>

            {loading && (
               <View style={styles.loaderWrap}>
                  <ActivityIndicator size='large' color='#168C33' />
               </View>
            )}

            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Previously bought</Text>
               <FlatList
                  data={previouslyBoughtDemoProducts}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.horizontalListPad}
                  renderItem={({ item }) => (
                     <TouchableOpacity
                        style={styles.demoProductCard}
                        activeOpacity={0.9}
                     >
                        <View style={styles.demoProductImageWrap}>
                           <Image
                              source={{ uri: item.image }}
                              style={styles.demoProductImage}
                              resizeMode='contain'
                           />
                        </View>
                        <Text style={styles.demoProductTitle} numberOfLines={2}>
                           {item.title}
                        </Text>
                        <Text
                           style={styles.demoProductDescription}
                           numberOfLines={2}
                        >
                           {item.description}
                        </Text>
                        <View style={styles.demoProductFooter}>
                           <Text style={styles.demoProductPrice}>
                              {item.price}
                           </Text>
                           <View style={styles.demoAddButton}>
                              <Text style={styles.demoAddButtonText}>ADD</Text>
                           </View>
                        </View>
                     </TouchableOpacity>
                  )}
               />
            </View>

            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Mobile picks</Text>
               <FlatList
                  data={mobileDemoProducts}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.horizontalListPad}
                  renderItem={({ item }) => (
                     <TouchableOpacity
                        style={styles.demoProductCard}
                        activeOpacity={0.9}
                     >
                        <View style={styles.demoProductImageWrap}>
                           <Image
                              source={{ uri: item.image }}
                              style={styles.demoProductImage}
                              resizeMode='contain'
                           />
                        </View>
                        <Text style={styles.demoProductTitle} numberOfLines={2}>
                           {item.title}
                        </Text>
                        <Text
                           style={styles.demoProductDescription}
                           numberOfLines={2}
                        >
                           {item.description}
                        </Text>
                        <View style={styles.demoProductFooter}>
                           <Text style={styles.demoProductPrice}>
                              {item.price}
                           </Text>
                           <View style={styles.demoAddButton}>
                              <Text style={styles.demoAddButtonText}>ADD</Text>
                           </View>
                        </View>
                     </TouchableOpacity>
                  )}
               />
            </View>

            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Grocery & Kitchen</Text>
               <View style={styles.categoryGrid}>
                  {grocerySectionItems.map((item) => (
                     <TouchableOpacity
                        key={item.id}
                        style={styles.categoryTile}
                        activeOpacity={0.85}
                     >
                        <View style={styles.categoryIconWrap}>
                           <Image
                              source={{ uri: item.image }}
                              style={styles.categoryImage}
                              resizeMode='contain'
                           />
                        </View>
                     </TouchableOpacity>
                  ))}
               </View>
            </View>

            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Quick reorders</Text>
               <FlatList
                  data={previouslyBoughtDemoProducts}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => `${item.id}-more`}
                  contentContainerStyle={styles.horizontalListPad}
                  renderItem={({ item }) => (
                     <TouchableOpacity
                        style={styles.demoProductCard}
                        activeOpacity={0.9}
                     >
                        <View style={styles.demoProductImageWrap}>
                           <Image
                              source={{ uri: item.image }}
                              style={styles.demoProductImage}
                              resizeMode='contain'
                           />
                        </View>
                        <Text style={styles.demoProductTitle} numberOfLines={2}>
                           {item.title}
                        </Text>
                        <Text
                           style={styles.demoProductDescription}
                           numberOfLines={2}
                        >
                           {item.description}
                        </Text>
                        <View style={styles.demoProductFooter}>
                           <Text style={styles.demoProductPrice}>
                              {item.price}
                           </Text>
                           <View style={styles.demoAddButton}>
                              <Text style={styles.demoAddButtonText}>ADD</Text>
                           </View>
                        </View>
                     </TouchableOpacity>
                  )}
               />
            </View>

            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Snacks & Drinks</Text>
               <View style={styles.categoryGrid}>
                  {snacksSectionItems.map((item) => (
                     <TouchableOpacity
                        key={item.id}
                        style={styles.categoryTile}
                        activeOpacity={0.85}
                     >
                        <View style={styles.categoryIconWrap}>
                           <Image
                              source={{ uri: item.image }}
                              style={styles.categoryImage}
                              resizeMode='contain'
                           />
                        </View>
                     </TouchableOpacity>
                  ))}
               </View>
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

         <Modal
            visible={locationSheetVisible}
            transparent
            animationType='slide'
            onRequestClose={() => setLocationSheetVisible(false)}
         >
            <Pressable
               style={styles.sheetOverlay}
               onPress={() => setLocationSheetVisible(false)}
            />
            <View style={styles.sheetWrap}>
               <View style={styles.sheetHandle} />

               <View style={styles.sheetHeaderRow}>
                  <Text style={styles.sheetTitle}>
                     Select delivery location
                  </Text>
                  <TouchableOpacity
                     style={styles.sheetCloseBtn}
                     onPress={() => setLocationSheetVisible(false)}
                  >
                     <Ionicons name='close' size={24} color='#111' />
                  </TouchableOpacity>
               </View>

               <View style={styles.sheetSearchWrap}>
                  <Ionicons name='search' size={20} color='#6B7280' />
                  <Text style={styles.sheetSearchText}>
                     Search for area, street name...
                  </Text>
               </View>

               <View style={styles.sheetList}>
                  {addressActions.map((item, index) => (
                     <TouchableOpacity
                        key={item.id}
                        style={[
                           styles.sheetItem,
                           index === addressActions.length - 1 &&
                              styles.sheetItemLast,
                        ]}
                        activeOpacity={0.8}
                     >
                        <View style={styles.sheetIconWrap}>
                           <Ionicons
                              name={item.icon}
                              size={22}
                              color='#138A08'
                           />
                        </View>
                        <View style={styles.sheetTextBlock}>
                           <Text style={styles.sheetItemTitle}>
                              {item.title}
                           </Text>
                           <Text
                              style={styles.sheetItemSubtitle}
                              numberOfLines={2}
                           >
                              {item.subtitle}
                           </Text>
                        </View>
                        <Ionicons
                           name='chevron-forward'
                           size={20}
                           color='#9CA3AF'
                        />
                     </TouchableOpacity>
                  ))}
               </View>

               <View style={styles.savedSection}>
                  <Text style={styles.savedTitle}>Your saved addresses</Text>
                  <View style={styles.savedCard}>
                     <View style={styles.savedCardHeader}>
                        <View style={styles.savedAvatar}>
                           <Ionicons name='home' size={18} color='#C99A00' />
                        </View>
                        <View style={{ flex: 1 }}>
                           <Text style={styles.savedCardTitle}>Home</Text>
                           <Text
                              style={styles.savedCardSubtitle}
                              numberOfLines={2}
                           >
                              Shankar vihar colony, House no 172, Radha Krishna
                              public school, Lal Kuan, Ghaziabad
                           </Text>
                           <Text style={styles.savedPhone}>
                              Phone number: 7065429235
                           </Text>
                        </View>
                        <Ionicons
                           name='chevron-forward'
                           size={18}
                           color='#9CA3AF'
                        />
                     </View>
                  </View>
               </View>
            </View>
         </Modal>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: '#F7F8F4' },
   contentContainer: { paddingBottom: 110 },
   heroWrap: {
      paddingHorizontal: Spacing.lg,
      overflow: 'hidden',
      minHeight: 130,
   },
   heroBlob: {
      position: 'absolute',
      width: 210,
      height: 210,
      borderRadius: 105,
      top: -82,
      right: -55,
      opacity: 0.38,
   },
   heroLabel: {
      fontFamily: FontFamily.heading,
   },
   heroTitleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 1 },
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
   locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 0,
      paddingVertical: 3,
      alignSelf: 'flex-start',
   },
   locationTag: { fontSize: 14, fontFamily: FontFamily.bodyBold },
   locationText: { fontSize: 14, fontFamily: FontFamily.body },

   stickyWrap: {
      backgroundColor: '#F7F8F4',
      paddingHorizontal: Spacing.lg,
      paddingTop: 8,
      paddingBottom: 6,
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
   promoRow: { paddingHorizontal: Spacing.lg, paddingBottom: 4 },
   promoCard: {
      width: 206,
      borderRadius: 24,
      marginRight: Spacing.sm,
      height: 140,
      overflow: 'hidden',
      backgroundColor: 'transparent',
      borderWidth: 0,
      borderColor: '#EEF1EA',
   },
   promoImageWrap: {
      width: '100%',
      height: '100%',
      borderRadius: 24,
      overflow: 'hidden',
      padding: 0,
      backgroundColor: '#FFF',
   },
   promoImage: {
      width: '100%',
      height: '100%',
   },

   demoProductCard: {
      width: 168,
      marginRight: 12,
      borderRadius: 24,
      backgroundColor: '#FFFFFF',
      padding: 12,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
      elevation: 2,
   },
   demoProductImageWrap: {
      width: '100%',
      height: 120,
      borderRadius: 18,
      backgroundColor: '#F6F7F2',
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
   },
   demoProductImage: {
      width: '86%',
      height: '86%',
   },
   demoProductTitle: {
      marginTop: 10,
      fontSize: 14,
      lineHeight: 18,
      fontFamily: FontFamily.bodySemiBold,
      color: '#1E1E1E',
   },
   demoProductDescription: {
      marginTop: 4,
      fontSize: 11,
      lineHeight: 15,
      fontFamily: FontFamily.body,
      color: '#7B7B7B',
      minHeight: 30,
   },
   demoProductFooter: {
      marginTop: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
   },
   demoProductPrice: {
      fontSize: 14,
      lineHeight: 18,
      fontFamily: FontFamily.bodyBold,
      color: '#1E1E1E',
   },
   demoAddButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: BorderRadius.full,
      backgroundColor: '#EAF7EE',
   },
   demoAddButtonText: {
      fontSize: 11,
      fontFamily: FontFamily.bodyBold,
      color: '#14802E',
      letterSpacing: 0.4,
   },

   freqCard: {
      width: '47%',
      marginBottom: 16,
   },
   freqGrid: {
      paddingHorizontal: Spacing.lg,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
   },
   freqCardSurface: {
      borderRadius: 24,
      backgroundColor: '#FFFFFF',
      padding: 10,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
      elevation: 2,
   },
   freqArtWrap: {
      borderRadius: 18,
      height: 148,
      padding: 12,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
   },
   freqImageStack: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      flex: 1,
      gap: 10,
   },
   freqImageFrame: {
      flex: 1,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
      backgroundColor: 'rgba(255,255,255,0.32)',
   },
   freqImageFrameLeft: {
      transform: [{ rotate: '-4deg' }, { translateY: 4 }],
   },
   freqImageFrameRight: {
      transform: [{ rotate: '4deg' }, { translateY: -2 }],
   },
   freqImage: {
      width: '88%',
      height: '88%',
   },
   freqMoreChip: {
      position: 'absolute',
      right: 10,
      top: 10,
      backgroundColor: '#FFFFFF',
      borderRadius: BorderRadius.full,
      paddingHorizontal: 10,
      paddingVertical: 5,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
   },
   freqMoreText: {
      fontSize: 11,
      fontFamily: FontFamily.bodySemiBold,
      color: '#2D7A57',
   },
   freqTitle: {
      fontSize: 13,
      lineHeight: 17,
      fontFamily: FontFamily.bodySemiBold,
      color: '#212121',
      textAlign: 'left',
   },
   freqTextBlock: {
      paddingHorizontal: 2,
      paddingTop: 10,
      gap: 2,
   },
   freqSubtitle: {
      fontSize: 11,
      lineHeight: 14,
      fontFamily: FontFamily.body,
      color: '#7D7D7D',
   },

   sheetOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.35)',
   },
   sheetWrap: {
      marginTop: 'auto',
      backgroundColor: '#F7F7FC',
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingHorizontal: Spacing.lg,
      paddingTop: 10,
      paddingBottom: 24,
      maxHeight: '88%',
   },
   sheetHandle: {
      alignSelf: 'center',
      width: 54,
      height: 5,
      borderRadius: 999,
      backgroundColor: '#D7DAE2',
      marginBottom: 14,
   },
   sheetHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
   },
   sheetTitle: {
      fontSize: 20,
      fontFamily: FontFamily.headingSemiBold,
      color: '#222',
      flex: 1,
      paddingRight: 12,
   },
   sheetCloseBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
   },
   sheetSearchWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: '#FFFFFF',
      borderRadius: 18,
      paddingHorizontal: 16,
      height: 58,
      borderWidth: 1,
      borderColor: '#ECEEF3',
      marginBottom: 14,
   },
   sheetSearchText: {
      flex: 1,
      color: '#7C8594',
      fontSize: 15,
      fontFamily: FontFamily.bodyMedium,
   },
   sheetList: {
      backgroundColor: '#FFFFFF',
      borderRadius: 22,
      borderWidth: 1,
      borderColor: '#ECEEF3',
      overflow: 'hidden',
   },
   sheetItem: {
      minHeight: 66,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      borderBottomWidth: 1,
      borderBottomColor: '#F1F3F7',
      gap: 12,
   },
   sheetItemLast: {
      borderBottomWidth: 0,
   },
   sheetIconWrap: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: '#F0F8EE',
      alignItems: 'center',
      justifyContent: 'center',
   },
   sheetTextBlock: { flex: 1 },
   sheetItemTitle: {
      fontSize: 15,
      fontFamily: FontFamily.bodySemiBold,
      color: '#1E1E1E',
   },
   sheetItemSubtitle: {
      marginTop: 2,
      fontSize: 12,
      fontFamily: FontFamily.body,
      color: '#6B7280',
      lineHeight: 17,
   },
   savedSection: {
      marginTop: 18,
   },
   savedTitle: {
      fontSize: 14,
      color: '#8A8F9B',
      fontFamily: FontFamily.bodyMedium,
      marginBottom: 10,
   },
   savedCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 22,
      borderWidth: 1,
      borderColor: '#ECEEF3',
      padding: 14,
   },
   savedCardHeader: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'flex-start',
   },
   savedAvatar: {
      width: 34,
      height: 34,
      borderRadius: 12,
      backgroundColor: '#F6F0DA',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
   },
   savedCardTitle: {
      fontSize: 16,
      fontFamily: FontFamily.bodySemiBold,
      color: '#222',
   },
   savedCardSubtitle: {
      marginTop: 4,
      fontSize: 13,
      fontFamily: FontFamily.body,
      color: '#606775',
      lineHeight: 18,
   },
   savedPhone: {
      marginTop: 6,
      fontSize: 13,
      fontFamily: FontFamily.bodyMedium,
      color: '#4E5562',
   },

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
      rowGap: 14,
   },
   categoryTile: {
      width: '31.5%',
      backgroundColor: 'transparent',
      borderRadius: 0,
      paddingVertical: 0,
      alignItems: 'center',
   },
   categoryIconWrap: {
      width: '100%',
      aspectRatio: 0.7,
      borderRadius: 0,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      padding: 0,
      backgroundColor: 'transparent',
   },
   categoryImage: {
      width: '100%',
      height: '100%',
      borderRadius: 0,
   },

   categoryLabel: {
      marginTop: 7,
      fontSize: 11,
      fontFamily: FontFamily.bodySemiBold,
      color: '#262626',
      textAlign: 'center',
      minHeight: 32,
   },
   bottomSpace: { height: 30 },
});
