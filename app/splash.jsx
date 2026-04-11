import { AppColors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
   useAnimatedStyle,
   useSharedValue,
   withTiming,
} from 'react-native-reanimated';

export default function SplashScreen() {
   const router = useRouter();
   const opacity = useSharedValue(0);
   const scale = useSharedValue(0.8);

   useEffect(() => {
      opacity.value = withTiming(1, { duration: 800 });
      scale.value = withTiming(1, { duration: 800 });
      const t = setTimeout(() => router.replace('/onboarding'), 2500);
      return () => clearTimeout(t);
   }, []);

   const anim = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
   }));

   return (
      <View style={styles.bg}>
         <Animated.View style={[styles.center, anim]}>
            <Text style={styles.emoji}>🛒</Text>
            <Text style={styles.logo}>Bachat Bazar</Text>
            <Text style={styles.tag}>Delivery in minutes</Text>
         </Animated.View>
      </View>
   );
}

const styles = StyleSheet.create({
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
   },
   tag: {
      fontSize: 16,
      color: 'rgba(255,255,255,0.8)',
      marginTop: 8,
      fontWeight: '500',
   },
});
