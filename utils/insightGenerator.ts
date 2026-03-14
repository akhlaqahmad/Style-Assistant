import { WardrobeItem, OutfitPlan, FeedbackEntry } from '@/context/AppContext';
import { generateId } from '@/context/AppContext';

/**
 * Constants for Data Generation
 */
const CATEGORIES = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Bags', 'Accessories'];
const BRANDS = ['Zara', 'Uniqlo', 'H&M', 'Nike', 'Adidas', 'Gucci', 'Prada', 'Mango', 'Cos', 'Arket'];
const COLORS = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Beige', 'Grey', 'Navy', 'Pink'];
const FABRICS = ['Cotton', 'Polyester', 'Wool', 'Silk', 'Linen', 'Denim', 'Leather'];
const STYLES = ['Casual', 'Formal', 'Sporty', 'Boho', 'Chic', 'Vintage', 'Minimalist'];
const PATTERNS = ['Solid', 'Striped', 'Floral', 'Plaid', 'Polka Dot', 'Geometric'];

/**
 * Generates a realistic dummy wardrobe with diverse attributes
 * @param count Number of items to generate
 * @returns Array of WardrobeItems
 */
export function generateDummyWardrobe(count: number): WardrobeItem[] {
  const wardrobe: WardrobeItem[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const purchaseDate = new Date(now.getTime() - Math.random() * 365 * 2 * 24 * 60 * 60 * 1000); // Past 2 years
    const price = Math.floor(Math.random() * 200) + 20; // $20 - $220
    const wearCount = Math.floor(Math.random() * 50); // 0 - 50 wears
    
    // Calculate last worn based on wear count (approx)
    const lastWorn = wearCount > 0 
      ? new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() 
      : undefined;

    wardrobe.push({
      id: `dummy_item_${i}`,
      category,
      subcategory: 'General', // Simplified
      brand: BRANDS[Math.floor(Math.random() * BRANDS.length)],
      colour: COLORS[Math.floor(Math.random() * COLORS.length)],
      fabric: FABRICS[Math.floor(Math.random() * FABRICS.length)],
      style: STYLES[Math.floor(Math.random() * STYLES.length)],
      pattern: PATTERNS[Math.floor(Math.random() * PATTERNS.length)],
      price,
      purchaseDate: purchaseDate.toISOString(),
      wearCount,
      lastWorn,
      notes: 'Generated dummy item',
      tag: Math.random() > 0.8 ? 'donate' : (Math.random() > 0.6 ? 'review' : 'keep'),
      favourite: Math.random() > 0.8,
      hidden: false,
      image: null, // Placeholder
      createdAt: purchaseDate.toISOString(),
    });
  }
  return wardrobe;
}

/**
 * Generates outfit history based on wardrobe items
 * @param wardrobe The wardrobe items to use
 * @param days Number of days of history
 * @returns Array of OutfitPlans
 */
export function generateDummyOutfits(wardrobe: WardrobeItem[], days: number): OutfitPlan[] {
  const outfits: OutfitPlan[] = [];
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    // Select random items for an outfit
    const top = wardrobe.filter(w => w.category === 'Tops')[Math.floor(Math.random() * wardrobe.filter(w => w.category === 'Tops').length)];
    const bottom = wardrobe.filter(w => w.category === 'Bottoms')[Math.floor(Math.random() * wardrobe.filter(w => w.category === 'Bottoms').length)];
    const shoes = wardrobe.filter(w => w.category === 'Shoes')[Math.floor(Math.random() * wardrobe.filter(w => w.category === 'Shoes').length)];

    if (top && bottom && shoes) {
      outfits.push({
        id: `dummy_outfit_${i}`,
        date: date.toISOString(),
        mood: ['Happy', 'Confident', 'Relaxed', 'Busy'][Math.floor(Math.random() * 4)],
        context: ['Work', 'Home', 'Party', 'Date'][Math.floor(Math.random() * 4)],
        weather: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
        top: top.id,
        bottom: bottom.id,
        shoes: shoes.id,
        accessories: '',
        wardrobeItems: [top.id, bottom.id, shoes.id],
        generated: Math.random() > 0.5,
      });
    }
  }
  return outfits;
}

/**
 * Generates feedback for the generated outfits
 * @param outfits The outfits to rate
 * @returns Array of FeedbackEntries
 */
export function generateDummyFeedback(outfits: OutfitPlan[]): FeedbackEntry[] {
  return outfits.map((outfit, index) => {
    // Generate a score: Bias towards higher scores
    const score = Math.floor(Math.random() * 2) + 3; // 3, 4, or 5 mostly
    
    return {
      id: `dummy_feedback_${index}`,
      outfitId: outfit.id,
      score: Math.random() > 0.1 ? score : Math.floor(Math.random() * 5) + 1, // Occasional low score
      sentiment: score >= 4 ? 'positive' : (score === 3 ? 'neutral' : 'negative'),
      whatWorked: ['Comfort', 'Style', 'Fit'].slice(0, Math.floor(Math.random() * 3)),
      whatDidnt: score < 4 ? ['Too tight', 'Wrong color'] : [],
      createdAt: outfit.date,
    };
  });
}

/**
 * Validates the generated data for consistency
 */
export function validateInsightData(wardrobe: WardrobeItem[], outfits: OutfitPlan[], feedback: FeedbackEntry[]) {
  const report = {
    totalItems: wardrobe.length,
    totalOutfits: outfits.length,
    totalFeedback: feedback.length,
    avgPrice: wardrobe.reduce((acc, item) => acc + (item.price || 0), 0) / wardrobe.length,
    itemsWithWears: wardrobe.filter(i => (i.wearCount || 0) > 0).length,
    orphanedFeedback: feedback.filter(f => !outfits.find(o => o.id === f.outfitId)).length,
  };
  
  console.log('Insight Data Validation Report:', report);
  return report;
}
