/* eslint-disable react/no-unescaped-entities */
import CartBar from '@/components/CartBar';
import ProductCard from '@/components/ProductCard';
import { BorderRadius, FontFamily, Spacing } from '@/constants/theme';
import { searchFoods } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
   ActivityIndicator,
   FlatList,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from 'react-native';
import {
   SafeAreaView,
   useSafeAreaInsets,
} from 'react-native-safe-area-context';

const searchPlaceholders = [
   'Search aata...',
   'Search rice...',
   'Search chicken...',
   'Search paneer...',
   'Search dal...',
   'Search bread...',
   'Search coke...',
   'Search tea...',
];

export default function SearchScreen() {
   const insets = useSafeAreaInsets();
   const router = useRouter();
   const [searchQuery, setSearchQuery] = useState('');
   const [results, setResults] = useState([]);
   const [loading, setLoading] = useState(false);
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

   // Search when query changes
   useEffect(() => {
      if (!searchQuery.trim()) {
         setResults([]);
         return;
      }

      let mounted = true;
      const timer = setTimeout(async () => {
         setLoading(true);
         try {
            const foods = await searchFoods(searchQuery);
            if (mounted) setResults(foods || []);
         } finally {
            if (mounted) setLoading(false);
         }
      }, 300);

      return () => {
         mounted = false;
         clearTimeout(timer);
      };
   }, [searchQuery]);

   return (
      <SafeAreaView style={styles.container} edges={['top']}>
         <View style={[styles.headerWrap, { paddingTop: insets.top }]}>
            <TouchableOpacity onPress={() => router.back()}>
               <Ionicons name='arrow-back' size={24} color='#1A1A1A' />
            </TouchableOpacity>
            <View style={styles.searchWrap}>
               <Ionicons name='search' size={22} color='#999' />
               <TextInput
                  style={styles.searchInput}
                  placeholder={placeholder}
                  placeholderTextColor='#999'
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
               />
               {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                     <Ionicons name='close-circle' size={20} color='#999' />
                  </TouchableOpacity>
               )}
            </View>
         </View>

         {loading && !results.length && (
            <View style={styles.loaderWrap}>
               <ActivityIndicator size='large' color='#168C33' />
            </View>
         )}

         {!searchQuery.trim() ? (
            <View style={styles.emptyWrap}>
               <Ionicons name='search-outline' size={64} color='#DDD' />
               <Text style={styles.emptyText}>
                  Start searching for food items
               </Text>
            </View>
         ) : results.length === 0 && !loading ? (
            <View style={styles.emptyWrap}>
               <Ionicons name='sad-outline' size={64} color='#DDD' />
               <Text style={styles.emptyText}>
                  No results found for "{searchQuery}"
               </Text>
            </View>
         ) : (
            <FlatList
               data={results}
               numColumns={2}
               columnWrapperStyle={styles.columnWrapper}
               contentContainerStyle={styles.listContent}
               scrollIndicatorInsets={{ right: 1 }}
               keyExtractor={(item) => item.id}
               renderItem={({ item }) => (
                  <View style={styles.cardWrapper}>
                     <ProductCard product={item} variant='premium' />
                  </View>
               )}
            />
         )}

         <View pointerEvents='box-none'>
            <CartBar />
         </View>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: '#F7F8F4' },
   headerWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.md,
      gap: Spacing.sm,
      backgroundColor: '#FFF',
   },
   searchWrap: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F1F1F1',
      borderRadius: BorderRadius.lg,
      paddingHorizontal: Spacing.md,
      gap: Spacing.sm,
   },
   searchInput: {
      flex: 1,
      fontSize: 15,
      fontFamily: FontFamily.regular,
      color: '#1A1A1A',
      paddingVertical: Spacing.sm,
   },
   loaderWrap: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   emptyWrap: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: Spacing.md,
   },
   emptyText: {
      fontSize: 14,
      fontFamily: FontFamily.regular,
      color: '#999',
      textAlign: 'center',
   },
   listContent: {
      paddingHorizontal: Spacing.md,
      paddingTop: Spacing.md,
      paddingBottom: 120,
   },
   columnWrapper: {
      justifyContent: 'space-between',
      gap: Spacing.md,
      marginBottom: Spacing.md,
   },
   cardWrapper: {
      flex: 1,
   },
});
