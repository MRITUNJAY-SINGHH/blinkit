import {
   AppColors,
   BorderRadius,
   FontFamily,
   Spacing,
} from '@/constants/theme';
import { markOnboardingCompleted } from '@/store/authSlice';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
   Dimensions,
   FlatList,
   Image,
   StatusBar,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from 'react-native';
import Animated, {
   Easing,
   useAnimatedStyle,
   useSharedValue,
   withDelay,
   withRepeat,
   withSequence,
   withSpring,
   withTiming,
} from 'react-native-reanimated';
import { useDispatch } from 'react-redux';

const { width, height } = Dimensions.get('window');
const RNAnimated = require('react-native').Animated;

const slides = [
   {
      id: '1',
      title: 'Fresh Groceries Delivered',
      description:
         'Get farm-fresh fruits, vegetables & daily essentials delivered right to your doorstep in minutes.',
      iconName: 'cart',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop&q=80',
      gradient: '#388E3C',
      accentColor: '#81C784',
      bgOrbs: ['#388E3C', '#4CAF50', '#81C784'],
   },
   {
      id: '2',
      title: 'Lightning Fast Delivery',
      description:
         'Our delivery partners ensure your order reaches you fresh in just 10 minutes!',
      iconName: 'flash',
      image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600&h=400&fit=crop&q=80',
      gradient: '#FF6F00',
      accentColor: '#FFB74D',
      bgOrbs: ['#FF6F00', '#FF9800', '#FFB74D'],
   },
   {
      id: '3',
      title: 'Thousands of Products',
      description:
         'From snacks to personal care, find everything you need at unbeatable prices.',
      iconName: 'grid',
      image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&h=400&fit=crop&q=80',
      gradient: '#7C4DFF',
      accentColor: '#B388FF',
      bgOrbs: ['#7C4DFF', '#9575CD', '#B388FF'],
   },
   {
      id: '4',
      title: 'Easy & Secure Checkout',
      description:
         'Multiple payment options with bank-grade security. Quick, easy and always safe.',
      iconName: 'shield-checkmark',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&q=80',
      gradient: '#0288D1',
      accentColor: '#4FC3F7',
      bgOrbs: ['#0288D1', '#03A9F4', '#4FC3F7'],
   },
];

const BackgroundOrb = ({ color, size, x, y, delay: d }) => {
   const translateY = useSharedValue(0);
   const translateX = useSharedValue(0);
   const scale = useSharedValue(0.6);
   const opacity = useSharedValue(0);
   useEffect(() => {
      opacity.value = withDelay(d, withTiming(0.08, { duration: 1200 }));
      scale.value = withDelay(d, withSpring(1, { damping: 8, stiffness: 40 }));
      translateY.value = withDelay(
         d,
         withRepeat(
            withSequence(
               withTiming(-30, {
                  duration: 4000 + d,
                  easing: Easing.inOut(Easing.ease),
               }),
               withTiming(30, {
                  duration: 4000 + d,
                  easing: Easing.inOut(Easing.ease),
               }),
            ),
            -1,
            true,
         ),
      );
      translateX.value = withDelay(
         d,
         withRepeat(
            withSequence(
               withTiming(20, {
                  duration: 5000 + d,
                  easing: Easing.inOut(Easing.ease),
               }),
               withTiming(-20, {
                  duration: 5000 + d,
                  easing: Easing.inOut(Easing.ease),
               }),
            ),
            -1,
            true,
         ),
      );
   }, []);
   const a = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [
         { translateX: translateX.value },
         { translateY: translateY.value },
         { scale: scale.value },
      ],
   }));
   return (
      <Animated.View
         style={[
            {
               position: 'absolute',
               left: x,
               top: y,
               width: size,
               height: size,
               borderRadius: size / 2,
               backgroundColor: color,
            },
            a,
         ]}
      />
   );
};

const Particle = ({ color, size, x, y, delay: d }) => {
   const translateY = useSharedValue(0);
   const opacity = useSharedValue(0);
   const rotate = useSharedValue(0);
   useEffect(() => {
      opacity.value = withDelay(d, withTiming(0.15, { duration: 800 }));
      translateY.value = withDelay(
         d,
         withRepeat(
            withSequence(
               withTiming(-15, {
                  duration: 2500 + d,
                  easing: Easing.inOut(Easing.ease),
               }),
               withTiming(15, {
                  duration: 2500 + d,
                  easing: Easing.inOut(Easing.ease),
               }),
            ),
            -1,
            true,
         ),
      );
      rotate.value = withRepeat(
         withTiming(360, { duration: 12000 + d * 3, easing: Easing.linear }),
         -1,
         false,
      );
   }, []);
   const a = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [
         { translateY: translateY.value },
         { rotate: `${rotate.value}deg` },
      ],
   }));
   return (
      <Animated.View
         style={[
            {
               position: 'absolute',
               left: x,
               top: y,
               width: size,
               height: size,
               borderRadius: size > 12 ? size / 2 : size / 4,
               backgroundColor: color,
            },
            a,
         ]}
      />
   );
};

export default function OnboardingScreen() {
   const router = useRouter();
   const dispatch = useDispatch();
   const [currentIndex, setCurrentIndex] = useState(0);
   const scrollX = useRef(new RNAnimated.Value(0)).current;
   const slidesRef = useRef(null);
   const buttonPulse = useSharedValue(1);

   useEffect(() => {
      if (currentIndex === slides.length - 1) {
         buttonPulse.value = withRepeat(
            withSequence(
               withTiming(1.05, {
                  duration: 1000,
                  easing: Easing.inOut(Easing.ease),
               }),
               withTiming(1, {
                  duration: 1000,
                  easing: Easing.inOut(Easing.ease),
               }),
            ),
            -1,
            true,
         );
      } else {
         buttonPulse.value = withTiming(1, { duration: 200 });
      }
   }, [currentIndex]);

   const pulseStyle = useAnimatedStyle(() => ({
      transform: [{ scale: buttonPulse.value }],
   }));
   const viewChanged = useRef(({ viewableItems }) => {
      if (viewableItems[0]) setCurrentIndex(viewableItems[0].index);
   }).current;

   const completeOnboarding = () => {
      dispatch(markOnboardingCompleted());
      router.replace('/login');
   };

   const scrollTo = () => {
      if (currentIndex < slides.length - 1)
         slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
      else completeOnboarding();
   };

   const currentSlide = slides[currentIndex];

   const renderSlide = ({ item, index: idx }) => {
      const inputRange = [(idx - 1) * width, idx * width, (idx + 1) * width];
      const imageTranslateX = scrollX.interpolate({
         inputRange,
         outputRange: [width * 0.15, 0, -width * 0.15],
         extrapolate: 'clamp',
      });
      const slideFade = scrollX.interpolate({
         inputRange,
         outputRange: [0, 1, 0],
         extrapolate: 'clamp',
      });
      return (
         <View style={[st.slide, { width }]}>
            <RNAnimated.View style={[st.slideInner, { opacity: slideFade }]}>
               <RNAnimated.View
                  style={{ transform: [{ translateX: imageTranslateX }] }}
               >
                  <View
                     style={[st.imageWrapper, { shadowColor: item.gradient }]}
                  >
                     <Image
                        source={{ uri: item.image }}
                        style={st.slideImage}
                        resizeMode='cover'
                     />
                     <View
                        style={[
                           st.imageBadge,
                           { backgroundColor: item.gradient },
                        ]}
                     >
                        <Ionicons name={item.iconName} size={26} color='#FFF' />
                     </View>
                  </View>
               </RNAnimated.View>
               <View style={st.textBlock}>
                  <Text style={st.title}>{item.title}</Text>
                  <Text style={st.description}>{item.description}</Text>
               </View>
            </RNAnimated.View>
         </View>
      );
   };

   const Paginator = () => (
      <View style={st.paginatorRow}>
         {slides.map((item, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
               inputRange,
               outputRange: [8, 28, 8],
               extrapolate: 'clamp',
            });
            const dotOpacity = scrollX.interpolate({
               inputRange,
               outputRange: [0.3, 1, 0.3],
               extrapolate: 'clamp',
            });
            const bgColor = scrollX.interpolate({
               inputRange,
               outputRange: ['#C0C0C0', item.gradient, '#C0C0C0'],
               extrapolate: 'clamp',
            });
            return (
               <RNAnimated.View
                  key={i}
                  style={[
                     st.dot,
                     {
                        width: dotWidth,
                        opacity: dotOpacity,
                        backgroundColor: bgColor,
                     },
                  ]}
               />
            );
         })}
      </View>
   );

   return (
      <View style={st.container}>
         <StatusBar barStyle='dark-content' />
         <View style={StyleSheet.absoluteFill} pointerEvents='none'>
            {currentSlide.bgOrbs.map((c, i) => (
               <BackgroundOrb
                  key={`o-${currentIndex}-${i}`}
                  color={c}
                  size={180 + i * 60}
                  x={-40 + i * (width * 0.35)}
                  y={height * 0.05 + i * (height * 0.25)}
                  delay={i * 300}
               />
            ))}
            <Particle
               color={currentSlide.accentColor}
               size={14}
               x={width * 0.1}
               y={height * 0.15}
               delay={100}
            />
            <Particle
               color={currentSlide.accentColor}
               size={10}
               x={width * 0.8}
               y={height * 0.2}
               delay={500}
            />
            <Particle
               color={currentSlide.accentColor}
               size={18}
               x={width * 0.6}
               y={height * 0.08}
               delay={300}
            />
            <Particle
               color={currentSlide.accentColor}
               size={8}
               x={width * 0.25}
               y={height * 0.42}
               delay={700}
            />
            <Particle
               color={currentSlide.gradient}
               size={16}
               x={width * 0.05}
               y={height * 0.6}
               delay={600}
            />
            <Particle
               color={currentSlide.gradient}
               size={10}
               x={width * 0.75}
               y={height * 0.55}
               delay={200}
            />
         </View>

         <View style={st.topBar}>
            <View />
            <TouchableOpacity style={st.skipBtn} onPress={completeOnboarding}>
               <Text style={st.skipText}>Skip</Text>
               <Ionicons
                  name='chevron-forward'
                  size={14}
                  color={AppColors.secondaryGrey}
               />
            </TouchableOpacity>
         </View>

         <View style={st.slidesArea}>
            <FlatList
               ref={slidesRef}
               data={slides}
               renderItem={renderSlide}
               horizontal
               showsHorizontalScrollIndicator={false}
               pagingEnabled
               bounces={false}
               keyExtractor={(i) => i.id}
               onScroll={RNAnimated.event(
                  [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                  { useNativeDriver: false },
               )}
               onViewableItemsChanged={viewChanged}
               viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
            />
         </View>

         <View style={st.bottomArea}>
            <Paginator />
            <View style={st.btnRow}>
               {currentIndex === slides.length - 1 ? (
                  <Animated.View style={[{ width: '100%' }, pulseStyle]}>
                     <TouchableOpacity
                        style={[
                           st.primaryBtn,
                           { backgroundColor: currentSlide.gradient },
                        ]}
                        onPress={completeOnboarding}
                        activeOpacity={0.8}
                     >
                        <Ionicons
                           name='rocket-outline'
                           size={20}
                           color='#FFF'
                           style={{ marginRight: 8 }}
                        />
                        <Text style={st.primaryBtnText}>Get Started</Text>
                        <Ionicons
                           name='arrow-forward'
                           size={18}
                           color='#FFF'
                           style={{ marginLeft: 8 }}
                        />
                     </TouchableOpacity>
                  </Animated.View>
               ) : (
                  <View style={st.navRow}>
                     {currentIndex > 0 && (
                        <TouchableOpacity
                           style={st.backBtn}
                           onPress={() =>
                              slidesRef.current?.scrollToIndex({
                                 index: currentIndex - 1,
                              })
                           }
                        >
                           <Ionicons name='arrow-back' size={18} color='#FFF' />
                        </TouchableOpacity>
                     )}
                     <TouchableOpacity
                        style={[
                           st.nextBtn,
                           { backgroundColor: currentSlide.gradient },
                        ]}
                        onPress={scrollTo}
                        activeOpacity={0.8}
                     >
                        <Text style={st.nextBtnText}>Continue</Text>
                        <Ionicons
                           name='arrow-forward'
                           size={18}
                           color='#FFF'
                           style={{ marginLeft: 8 }}
                        />
                     </TouchableOpacity>
                  </View>
               )}
            </View>
         </View>
      </View>
   );
}

const st = StyleSheet.create({
   container: { flex: 1, backgroundColor: AppColors.white },
   topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      paddingTop: 52,
      paddingBottom: 4,
      zIndex: 20,
   },
   skipBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: BorderRadius.full,
      backgroundColor: 'rgba(0,0,0,0.05)',
      gap: 2,
   },
   skipText: {
      fontSize: 13,
      fontFamily: FontFamily.bodySemiBold,
      color: AppColors.secondaryGrey,
   },
   slidesArea: { flex: 1, zIndex: 10 },
   slide: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
   },
   slideInner: { alignItems: 'center', paddingHorizontal: Spacing.lg },
   imageWrapper: {
      borderRadius: 20,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 14,
      marginBottom: 36,
   },
   slideImage: { width: width * 0.82, height: width * 0.52, borderRadius: 20 },
   imageBadge: {
      position: 'absolute',
      bottom: -18,
      alignSelf: 'center',
      width: 52,
      height: 52,
      borderRadius: 26,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 10,
   },
   textBlock: { alignItems: 'center', paddingHorizontal: Spacing.sm },
   title: {
      fontSize: 28,
      fontFamily: FontFamily.heading,
      textAlign: 'center',
      marginBottom: 10,
      letterSpacing: -0.3,
      color: AppColors.primaryBlack,
   },
   description: {
      fontSize: 15,
      fontFamily: FontFamily.body,
      textAlign: 'center',
      lineHeight: 24,
      color: AppColors.secondaryGrey,
      paddingHorizontal: Spacing.sm,
   },
   bottomArea: { paddingHorizontal: Spacing.lg, paddingBottom: 36, zIndex: 20 },
   paginatorRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
   },
   dot: { height: 7, borderRadius: 4, marginHorizontal: 4 },
   btnRow: { width: '100%' },
   primaryBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      borderRadius: BorderRadius.xl,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 12,
   },
   primaryBtnText: {
      fontSize: 17,
      color: '#FFF',
      fontFamily: FontFamily.heading,
   },
   navRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
   backBtn: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000',
   },
   nextBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 15,
      borderRadius: BorderRadius.xl,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
   },
   nextBtnText: {
      fontSize: 16,
      color: '#FFF',
      fontFamily: FontFamily.headingSemiBold,
   },
});
