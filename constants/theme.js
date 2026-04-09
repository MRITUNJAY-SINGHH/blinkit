/**
 * Global Design Tokens — Single source of truth.
 * Change colors/fonts here to retheme the entire app.
 */

export const AppColors = {
  primaryGreen: '#388E3C',
  secondaryGreen: '#8BC34A',
  darkGreen: '#2E7D32',
  lightGreen: '#E8F5E9',
  primaryBlack: '#212121',
  secondaryGrey: '#757575',
  highlightYellow: '#FFEB3B',
  background: '#FFFFFF',
  cardBorder: '#E0E0E0',
  lightGrey: '#F5F5F5',
  error: '#D32F2F',
  white: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.5)',
  darkHeader: '#0F1B2D',
  darkHeaderLight: '#1A2D45',
};

export const FontFamily = {
  heading: 'SpaceGrotesk_700Bold',
  headingSemiBold: 'SpaceGrotesk_600SemiBold',
  headingMedium: 'SpaceGrotesk_500Medium',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
};

export const Typography = {
  largeTitle: { fontSize: 22, fontFamily: FontFamily.heading, color: '#212121' },
  title: { fontSize: 18, fontFamily: FontFamily.headingSemiBold, color: '#212121' },
  subtitle: { fontSize: 16, fontFamily: FontFamily.headingMedium, color: '#212121' },
  productName: { fontSize: 13, fontFamily: FontFamily.bodyMedium, color: '#212121' },
  price: { fontSize: 15, fontFamily: FontFamily.bodyBold, color: '#212121' },
  mrp: { fontSize: 12, fontFamily: FontFamily.body, textDecorationLine: 'line-through', color: '#757575' },
  discountBadge: { fontSize: 10, fontFamily: FontFamily.bodySemiBold, color: '#212121' },
  body: { fontSize: 14, fontFamily: FontFamily.body, color: '#212121' },
  caption: { fontSize: 12, fontFamily: FontFamily.body, color: '#757575' },
  button: { fontSize: 14, fontFamily: FontFamily.bodySemiBold },
};

export const Spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32,
};

export const BorderRadius = {
  sm: 4, md: 8, lg: 12, xl: 16, xxl: 20, full: 999,
};
