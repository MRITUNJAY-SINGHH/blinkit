import {
   AppColors,
   BorderRadius,
   FontFamily,
   Spacing,
} from '@/constants/theme';
import { loginSuccess } from '@/store/authSlice';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
   KeyboardAvoidingView,
   Platform,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from 'react-native';
import { useDispatch } from 'react-redux';

export default function LoginScreen() {
   const router = useRouter();
   const dispatch = useDispatch();
   const [phone, setPhone] = useState('');

   const go = () => {
      dispatch(loginSuccess(phone.trim()));
      router.replace('/(tabs)');
   };

   return (
      <KeyboardAvoidingView
         style={s.container}
         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
         <View style={s.content}>
            <View style={s.logoWrap}>
               <View style={s.logoCircle}>
                  <Text style={s.logoEmoji}>🛒</Text>
               </View>
               <Text style={s.logoText}>Bachat Bazar</Text>
               <Text style={s.tagline}>Groceries delivered in minutes</Text>
            </View>

            <View style={s.inputSection}>
               <Text style={s.inputLabel}>Enter your phone number</Text>
               <View style={s.phoneRow}>
                  <View style={s.code}>
                     <Text style={s.codeText}>🇮🇳 +91</Text>
                  </View>
                  <TextInput
                     style={s.phoneInput}
                     placeholder='Enter phone number'
                     placeholderTextColor={AppColors.secondaryGrey}
                     keyboardType='phone-pad'
                     value={phone}
                     onChangeText={setPhone}
                     maxLength={10}
                  />
               </View>
               <TouchableOpacity style={s.continueBtn} onPress={go}>
                  <Text style={s.continueText}>Continue</Text>
               </TouchableOpacity>

               <View style={s.divider}>
                  <View style={s.line} />
                  <Text style={s.dividerText}>or continue with</Text>
                  <View style={s.line} />
               </View>

               <View style={s.socialRow}>
                  <TouchableOpacity style={s.socialBtn} onPress={go}>
                     <Text
                        style={{
                           fontSize: 18,
                           fontWeight: '700',
                           color: '#4285F4',
                        }}
                     >
                        G
                     </Text>
                     <Text style={s.socialLabel}>Google</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.socialBtn} onPress={go}>
                     <Ionicons
                        name='logo-apple'
                        size={20}
                        color={AppColors.primaryBlack}
                     />
                     <Text style={s.socialLabel}>Apple</Text>
                  </TouchableOpacity>
               </View>
            </View>

            <Text style={s.terms}>
               By continuing, you agree to our{' '}
               <Text style={s.link}>Terms of Service</Text> &{' '}
               <Text style={s.link}>Privacy Policy</Text>
            </Text>
         </View>
      </KeyboardAvoidingView>
   );
}

const s = StyleSheet.create({
   container: { flex: 1, backgroundColor: AppColors.white },
   content: {
      flex: 1,
      paddingHorizontal: Spacing.xxl,
      justifyContent: 'center',
   },
   logoWrap: { alignItems: 'center', marginBottom: 48 },
   logoCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: AppColors.lightGreen,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.lg,
   },
   logoEmoji: { fontSize: 40 },
   logoText: {
      fontSize: 28,
      fontFamily: FontFamily.heading,
      color: AppColors.primaryGreen,
   },
   tagline: {
      fontSize: 14,
      fontFamily: FontFamily.body,
      color: AppColors.secondaryGrey,
      marginTop: 4,
   },
   inputSection: { marginBottom: Spacing.xxl },
   inputLabel: {
      fontSize: 15,
      fontFamily: FontFamily.bodySemiBold,
      color: AppColors.primaryBlack,
      marginBottom: Spacing.md,
   },
   phoneRow: {
      flexDirection: 'row',
      gap: Spacing.sm,
      marginBottom: Spacing.lg,
   },
   code: {
      backgroundColor: AppColors.lightGrey,
      borderRadius: BorderRadius.lg,
      paddingHorizontal: Spacing.md,
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: AppColors.cardBorder,
   },
   codeText: {
      fontSize: 14,
      fontFamily: FontFamily.bodyMedium,
      color: AppColors.primaryBlack,
   },
   phoneInput: {
      flex: 1,
      backgroundColor: AppColors.lightGrey,
      borderRadius: BorderRadius.lg,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md + 2,
      fontSize: 15,
      borderWidth: 1,
      borderColor: AppColors.cardBorder,
      color: AppColors.primaryBlack,
      fontFamily: FontFamily.body,
   },
   continueBtn: {
      backgroundColor: AppColors.primaryGreen,
      borderRadius: BorderRadius.lg,
      paddingVertical: Spacing.lg,
      alignItems: 'center',
      marginBottom: Spacing.xxl,
   },
   continueText: {
      color: AppColors.white,
      fontSize: 16,
      fontFamily: FontFamily.heading,
   },
   divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.xxl,
   },
   line: { flex: 1, height: 1, backgroundColor: AppColors.cardBorder },
   dividerText: {
      marginHorizontal: Spacing.md,
      fontSize: 13,
      fontFamily: FontFamily.body,
      color: AppColors.secondaryGrey,
   },
   socialRow: { flexDirection: 'row', gap: Spacing.md },
   socialBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.sm,
      borderWidth: 1,
      borderColor: AppColors.cardBorder,
      borderRadius: BorderRadius.lg,
      paddingVertical: Spacing.md,
   },
   socialLabel: {
      fontSize: 14,
      fontFamily: FontFamily.bodyMedium,
      color: AppColors.primaryBlack,
   },
   terms: {
      fontSize: 12,
      fontFamily: FontFamily.body,
      color: AppColors.secondaryGrey,
      textAlign: 'center',
      lineHeight: 18,
   },
   link: { color: AppColors.primaryGreen, fontFamily: FontFamily.bodySemiBold },
});
