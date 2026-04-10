import {
   AppColors,
   BorderRadius,
   FontFamily,
   Spacing,
} from '@/constants/theme';
import { useCart } from '@/context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QuantitySelector from './QuantitySelector';

export default function ProductCard({
   product,
   variant = 'default',
   showFooterCta = false,
   style,
}) {
   const router = useRouter();
   const { items, addToCart, updateQuantity } = useCart();
   const cartItem = items.find((i) => i.id === product.id);
   const isVeg = product.itemType === 'Veg';
   const isPremium = variant === 'premium';
   const ratingValue = Number(product.rating || 4.2).toFixed(1);
   const ratingCount = product.ratingCount || 120;

   return (
      <TouchableOpacity
         style={[s.card, isPremium && s.cardPremium, style]}
         activeOpacity={0.9}
         onPress={() => router.push(`/product/${product.id}`)}
      >
         {isPremium && (
            <View style={s.badgeWrap}>
               <Text style={s.badgeText}>Popular</Text>
            </View>
         )}

         {/* Wishlist */}
         <TouchableOpacity style={s.heart}>
            <Ionicons
               name='heart-outline'
               size={16}
               color={AppColors.secondaryGrey}
            />
         </TouchableOpacity>

         {/* Image */}
         <View style={s.imgWrap}>
            {product.image ? (
               <Image
                  source={{ uri: product.image }}
                  style={s.img}
                  resizeMode='cover'
               />
            ) : (
               <View style={[s.img, s.placeholder]}>
                  <Text style={{ fontSize: 36 }}>{product.emoji || '🍽️'}</Text>
               </View>
            )}
            {/* ADD Button overlaid at bottom of image */}
            <View style={s.addWrap}>
               {cartItem ? (
                  <QuantitySelector
                     quantity={cartItem.quantity}
                     onIncrease={() =>
                        updateQuantity(product.id, cartItem.quantity + 1)
                     }
                     onDecrease={() =>
                        updateQuantity(product.id, cartItem.quantity - 1)
                     }
                  />
               ) : (
                  <TouchableOpacity
                     style={s.addBtn}
                     onPress={() => addToCart(product)}
                  >
                     <Text style={s.addText}>ADD</Text>
                  </TouchableOpacity>
               )}
            </View>
         </View>

         {/* Info */}
         <View style={[s.info, isPremium && s.infoPremium]}>
            {/* Type + Size */}
            <View style={s.typeRow}>
               <View
                  style={[
                     s.typeDot,
                     { backgroundColor: isVeg ? '#0F8A2A' : '#E23744' },
                  ]}
               />
               <Text style={s.sizeText}>{product.size}</Text>
            </View>

            {/* Name */}
            <Text style={s.name} numberOfLines={2}>
               {product.name}
            </Text>

            {/* Delivery */}
            <View style={s.delivRow}>
               <Ionicons
                  name='time-outline'
                  size={12}
                  color={AppColors.secondaryGrey}
               />
               <Text style={s.delivText}>10 MINS</Text>
            </View>

            {isPremium && (
               <View style={s.ratingRow}>
                  <Ionicons name='star' size={12} color='#F4B400' />
                  <Text style={s.ratingText}>{ratingValue}</Text>
                  <Text style={s.ratingCount}>({ratingCount})</Text>
               </View>
            )}

            {/* Price */}
            <View style={s.priceRow}>
               {product.discount > 0 && (
                  <Text style={s.discLabel}>{product.discount}% OFF</Text>
               )}
               <Text style={s.price}>₹{product.price}</Text>
               {product.discount > 0 && (
                  <Text style={s.mrp}>MRP ₹{product.mrp}</Text>
               )}
            </View>

            {showFooterCta && (
               <TouchableOpacity style={s.footerCta} activeOpacity={0.85}>
                  <Text style={s.footerText}>See more like this</Text>
                  <Ionicons name='chevron-forward' size={14} color='#2F8E47' />
               </TouchableOpacity>
            )}
         </View>
      </TouchableOpacity>
   );
}

const s = StyleSheet.create({
   card: {
      backgroundColor: '#FFFFFF',
      borderRadius: BorderRadius.xl,
      width: 175,
      marginRight: Spacing.md,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
   },
   cardPremium: {
      shadowColor: '#168C33',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 14,
      elevation: 6,
      backgroundColor: '#FAFBF8',
   },
   badgeWrap: {
      position: 'absolute',
      top: 10,
      left: 10,
      zIndex: 3,
      backgroundColor: '#FFEB3B',
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: BorderRadius.full,
   },
   badgeText: {
      fontSize: 10,
      fontFamily: FontFamily.bodyBold,
      color: '#1E2A1F',
   },
   heart: { position: 'absolute', top: 10, right: 10, zIndex: 2 },
   imgWrap: {
      position: 'relative',
      alignItems: 'center',
      backgroundColor: '#F9F9F9',
   },
   img: {
      width: '100%',
      height: 140,
      borderTopLeftRadius: BorderRadius.xl,
      borderTopRightRadius: BorderRadius.xl,
   },
   placeholder: {
      backgroundColor: '#FFF3E0',
      alignItems: 'center',
      justifyContent: 'center',
   },
   addWrap: { position: 'absolute', bottom: -14, zIndex: 2 },
   addBtn: {
      backgroundColor: '#FFFFFF',
      borderWidth: 2,
      borderColor: '#168C33',
      borderRadius: BorderRadius.lg,
      paddingHorizontal: 26,
      paddingVertical: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
   },
   addText: {
      color: '#168C33',
      fontFamily: FontFamily.heading,
      fontSize: 13,
      fontWeight: '700',
   },
   info: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.md },
   infoPremium: { paddingVertical: Spacing.md },
   typeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginBottom: 3,
   },
   typeDot: { width: 7, height: 7, borderRadius: 1 },
   sizeText: {
      fontSize: 11,
      fontFamily: FontFamily.bodySemiBold,
      color: '#666',
   },
   name: {
      fontSize: 13,
      fontFamily: FontFamily.bodyMedium,
      color: '#1F1F1F',
      lineHeight: 17,
      minHeight: 34,
      marginBottom: 2,
   },
   delivRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      marginTop: 2,
   },
   delivText: {
      fontSize: 10,
      fontFamily: FontFamily.bodySemiBold,
      color: '#888',
   },
   ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      marginTop: 3,
   },
   ratingText: {
      fontSize: 11,
      fontFamily: FontFamily.bodyBold,
      color: '#1F1F1F',
   },
   ratingCount: { fontSize: 10, fontFamily: FontFamily.body, color: '#888' },
   priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      marginTop: 5,
      flexWrap: 'wrap',
   },
   discLabel: {
      fontSize: 10,
      fontFamily: FontFamily.bodyBold,
      color: '#168C33',
      backgroundColor: '#E8F5E9',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 3,
   },
   price: { fontSize: 15, fontFamily: FontFamily.heading, color: '#1F1F1F' },
   mrp: {
      fontSize: 10,
      fontFamily: FontFamily.body,
      color: '#999',
      textDecorationLine: 'line-through',
   },
   footerCta: {
      marginTop: Spacing.sm,
      backgroundColor: '#E8F5E9',
      borderRadius: BorderRadius.md,
      paddingVertical: 8,
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 0.5,
      borderColor: '#168C33',
   },
   footerText: {
      fontSize: 12,
      fontFamily: FontFamily.bodySemiBold,
      color: '#168C33',
   },
});
