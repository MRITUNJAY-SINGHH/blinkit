const FOODS_BASE_URL = 'https://api.the9to9restaurant.com/v1/api/foods';
const CATEGORIES_BASE_URL =
   'https://api.the9to9restaurant.com/v1/api/categories';

export async function getAllFoods() {
   try {
      const res = await fetch(`${FOODS_BASE_URL}/getAllFood`);
      const data = await res.json();
      if (data.success) return data.foods.map(mapFood);
      return [];
   } catch (e) {
      console.warn('getAllFoods error:', e);
      return [];
   }
}

export async function getCategories() {
   try {
      const res = await fetch(`${CATEGORIES_BASE_URL}/getAllCategories`);
      const data = await res.json();
      if (data.success) return data.categories || [];
      return [];
   } catch (e) {
      console.warn('getCategories error:', e);
      return [];
   }
}

export async function searchFoods(query) {
   try {
      const res = await fetch(
         `${FOODS_BASE_URL}/searchFoods?query=${encodeURIComponent(query)}`,
      );
      const data = await res.json();
      if (data.success) return (data.foods || []).map(mapFood);
      return [];
   } catch (e) {
      console.warn('searchFoods error:', e);
      return [];
   }
}

export async function searchSuggestions(query) {
   try {
      const res = await fetch(
         `${FOODS_BASE_URL}/searchSuggestions?query=${encodeURIComponent(query)}`,
      );
      const data = await res.json();
      return data.suggestions || [];
   } catch (e) {
      return [];
   }
}

export async function getFoodsByCategory(categoryId) {
   try {
      const res = await fetch(
         `${FOODS_BASE_URL}/getFoodsByCategory/${categoryId}`,
      );
      const data = await res.json();
      if (data.success) return (data.foods || []).map(mapFood);
      return [];
   } catch (e) {
      console.warn('getFoodsByCategory error:', e);
      return [];
   }
}

function mapFood(f) {
   const v = f.variants?.[0] || {};
   const price = v.price || 0;
   const mrp =
      f.discount > 0 ? Math.round(price / (1 - f.discount / 100)) : price;
   return {
      id: f._id,
      name: f.name,
      description: f.description || '',
      size: v.size || '',
      price,
      mrp,
      discount: f.discount || 0,
      image: f.foodImages?.[0] || null,
      itemType: f.itemType || 'Veg',
      isFeatured: f.isFeatured,
      isRecommended: f.isRecommended,
      isHotProduct: f.isHotProduct,
      category: f.category,
   };
}
