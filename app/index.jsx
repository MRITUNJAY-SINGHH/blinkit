import { AppColors, FontFamily } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
   useAnimatedStyle,
   useSharedValue,
   withDelay,
   withTiming,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';

export default function SplashScreen() {
   const router = useRouter();
   const { onboardingCompleted, isLoggedIn } = useSelector(
      (state) => state.auth,
   );
   const opacity = useSharedValue(0);
   const scale = useSharedValue(0.8);
   const tagOp = useSharedValue(0);

   useEffect(() => {
      opacity.value = withTiming(1, { duration: 800 });
      scale.value = withTiming(1, { duration: 800 });
      tagOp.value = withDelay(600, withTiming(1, { duration: 600 }));
      const t = setTimeout(() => {
         if (!onboardingCompleted) {
            router.replace('/onboarding');
            return;
         }

         if (isLoggedIn) {
            router.replace('/(tabs)');
            return;
         }

         router.replace('/login');
      }, 2500);
      return () => clearTimeout(t);
   }, [isLoggedIn, onboardingCompleted, router]);

   const logoAnim = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
   }));
   const tagAnim = useAnimatedStyle(() => ({ opacity: tagOp.value }));

   return (
      <View style={s.bg}>
         <Animated.View style={[s.center, logoAnim]}>
            <Text style={s.emoji}>🛒</Text>
            <Text style={s.logo}>Bachat Bazar</Text>
         </Animated.View>
         <Animated.View style={tagAnim}>
            <Text style={s.tag}>Delivery in minutes</Text>
         </Animated.View>
      </View>
   );
}

const s = StyleSheet.create({
   bg: {
      flex: 1,
      backgroundColor: AppColors.primaryGreen,
      alignItems: 'center',
      justifyContent: 'center',
   },
   center: { alignItems: 'center' },
   emoji: { fontSize: 72, marginBottom: 16 },
   logo: {
      fontSize: 36,
      fontWeight: '800',
      color: AppColors.white,
      letterSpacing: 1,
      fontFamily: FontFamily.heading,
   },
   tag: {
      fontSize: 16,
      color: 'rgba(255,255,255,0.8)',
      marginTop: 12,
      fontFamily: FontFamily.bodyMedium,
   },
});
