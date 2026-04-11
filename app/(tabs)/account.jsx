import { AppColors, BorderRadius, Spacing } from '@/constants/theme';
import { logout } from '@/store/authSlice';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

const menuItems = [
   { icon: 'person-outline', label: 'Edit Profile' },
   { icon: 'location-outline', label: 'Saved Addresses' },
   { icon: 'card-outline', label: 'Payment Methods' },
   { icon: 'notifications-outline', label: 'Notifications' },
   { icon: 'help-circle-outline', label: 'Help & Support' },
   { icon: 'shield-checkmark-outline', label: 'Privacy Policy' },
   { icon: 'document-text-outline', label: 'Terms of Service' },
   { icon: 'information-circle-outline', label: 'About' },
];

export default function AccountScreen() {
   const dispatch = useDispatch();
   const router = useRouter();

   const handleLogout = () => {
      dispatch(logout());
      router.replace('/login');
   };

   return (
      <SafeAreaView style={styles.container}>
         <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.header}>Account</Text>

            {/* Profile Card */}
            <View style={styles.profileCard}>
               <View style={styles.avatar}>
                  <Text style={{ fontSize: 32 }}>👤</Text>
               </View>
               <View>
                  <Text style={styles.name}>QuickComm User</Text>
                  <Text style={styles.phone}>+91 98765 43210</Text>
               </View>
               <Ionicons
                  name='chevron-forward'
                  size={20}
                  color={AppColors.secondaryGrey}
                  style={{ marginLeft: 'auto' }}
               />
            </View>

            {/* Menu */}
            {menuItems.map((item, idx) => (
               <TouchableOpacity key={idx} style={styles.menuItem}>
                  <Ionicons
                     name={item.icon}
                     size={22}
                     color={AppColors.primaryBlack}
                  />
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Ionicons
                     name='chevron-forward'
                     size={18}
                     color={AppColors.secondaryGrey}
                     style={{ marginLeft: 'auto' }}
                  />
               </TouchableOpacity>
            ))}

            {/* Logout */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
               <Ionicons
                  name='log-out-outline'
                  size={22}
                  color={AppColors.error}
               />
               <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

            <Text style={styles.version}>Version 1.0.0</Text>
         </ScrollView>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: AppColors.background },
   header: {
      fontSize: 22,
      fontWeight: '700',
      color: AppColors.primaryBlack,
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.lg,
      paddingBottom: Spacing.md,
   },
   profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      marginHorizontal: Spacing.lg,
      padding: Spacing.lg,
      backgroundColor: AppColors.lightGreen,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.lg,
   },
   avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: AppColors.white,
      alignItems: 'center',
      justifyContent: 'center',
   },
   name: { fontSize: 16, fontWeight: '700', color: AppColors.primaryBlack },
   phone: { fontSize: 13, color: AppColors.secondaryGrey, marginTop: 2 },
   menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: AppColors.lightGrey,
   },
   menuLabel: {
      fontSize: 15,
      color: AppColors.primaryBlack,
      fontWeight: '500',
   },
   logoutBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.lg,
      marginTop: Spacing.md,
   },
   logoutText: { fontSize: 15, fontWeight: '600', color: AppColors.error },
   version: {
      textAlign: 'center',
      fontSize: 12,
      color: AppColors.secondaryGrey,
      marginVertical: Spacing.xxl,
   },
});
