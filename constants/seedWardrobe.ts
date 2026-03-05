interface SeedItem {
  category: string;
  image: string | null;
  brand: string;
  notes: string;
  tag: 'keep' | 'review' | 'donate';
  favourite: boolean;
  hidden: boolean;
  colour: string;
}

const WOMEN_ITEMS: SeedItem[] = [
  { category: 'tops', image: null, brand: 'Essentials', notes: 'White fitted blouse', tag: 'keep', favourite: false, hidden: false, colour: '#F5F0E8' },
  { category: 'tops', image: null, brand: 'Essentials', notes: 'Black silk camisole', tag: 'keep', favourite: false, hidden: false, colour: '#2D2D2A' },
  { category: 'tops', image: null, brand: 'Essentials', notes: 'Striped Breton top', tag: 'keep', favourite: false, hidden: false, colour: '#7B9BBF' },
  { category: 'bottoms', image: null, brand: 'Essentials', notes: 'High-waist dark jeans', tag: 'keep', favourite: false, hidden: false, colour: '#2D2D2A' },
  { category: 'bottoms', image: null, brand: 'Essentials', notes: 'Tailored wide-leg trousers', tag: 'keep', favourite: false, hidden: false, colour: '#8B7B6B' },
  { category: 'bottoms', image: null, brand: 'Essentials', notes: 'Midi pleated skirt', tag: 'keep', favourite: false, hidden: false, colour: '#D4A96A' },
  { category: 'dresses', image: null, brand: 'Essentials', notes: 'Little black dress', tag: 'keep', favourite: true, hidden: false, colour: '#2D2D2A' },
  { category: 'dresses', image: null, brand: 'Essentials', notes: 'Floral wrap dress', tag: 'keep', favourite: false, hidden: false, colour: '#7A9B6A' },
  { category: 'outerwear', image: null, brand: 'Essentials', notes: 'Classic trench coat', tag: 'keep', favourite: false, hidden: false, colour: '#D4A96A' },
  { category: 'outerwear', image: null, brand: 'Essentials', notes: 'Cropped denim jacket', tag: 'keep', favourite: false, hidden: false, colour: '#7B9BBF' },
  { category: 'shoes', image: null, brand: 'Essentials', notes: 'Nude pointed-toe heels', tag: 'keep', favourite: false, hidden: false, colour: '#C17B58' },
  { category: 'shoes', image: null, brand: 'Essentials', notes: 'White leather sneakers', tag: 'keep', favourite: false, hidden: false, colour: '#F5F0E8' },
  { category: 'shoes', image: null, brand: 'Essentials', notes: 'Black ankle boots', tag: 'keep', favourite: false, hidden: false, colour: '#2D2D2A' },
  { category: 'accessories', image: null, brand: 'Essentials', notes: 'Gold layered necklace', tag: 'keep', favourite: false, hidden: false, colour: '#D4A96A' },
  { category: 'accessories', image: null, brand: 'Essentials', notes: 'Structured leather tote', tag: 'keep', favourite: false, hidden: false, colour: '#C17B58' },
  { category: 'basics', image: null, brand: 'Essentials', notes: 'White cotton t-shirt', tag: 'keep', favourite: false, hidden: false, colour: '#F5F0E8' },
  { category: 'basics', image: null, brand: 'Essentials', notes: 'Cashmere crew-neck jumper', tag: 'keep', favourite: false, hidden: false, colour: '#8B7B6B' },
  { category: 'basics', image: null, brand: 'Essentials', notes: 'Black leggings', tag: 'keep', favourite: false, hidden: false, colour: '#2D2D2A' },
];

const MEN_ITEMS: SeedItem[] = [
  { category: 'tops', image: null, brand: 'Essentials', notes: 'White Oxford shirt', tag: 'keep', favourite: false, hidden: false, colour: '#F5F0E8' },
  { category: 'tops', image: null, brand: 'Essentials', notes: 'Navy polo shirt', tag: 'keep', favourite: false, hidden: false, colour: '#7B9BBF' },
  { category: 'tops', image: null, brand: 'Essentials', notes: 'Chambray button-down', tag: 'keep', favourite: false, hidden: false, colour: '#7B9BBF' },
  { category: 'bottoms', image: null, brand: 'Essentials', notes: 'Dark indigo jeans', tag: 'keep', favourite: false, hidden: false, colour: '#2D2D2A' },
  { category: 'bottoms', image: null, brand: 'Essentials', notes: 'Khaki chinos', tag: 'keep', favourite: false, hidden: false, colour: '#D4A96A' },
  { category: 'bottoms', image: null, brand: 'Essentials', notes: 'Charcoal dress trousers', tag: 'keep', favourite: false, hidden: false, colour: '#8B7B6B' },
  { category: 'outerwear', image: null, brand: 'Essentials', notes: 'Navy blazer', tag: 'keep', favourite: true, hidden: false, colour: '#2D2D2A' },
  { category: 'outerwear', image: null, brand: 'Essentials', notes: 'Olive bomber jacket', tag: 'keep', favourite: false, hidden: false, colour: '#7A9B6A' },
  { category: 'outerwear', image: null, brand: 'Essentials', notes: 'Grey wool overcoat', tag: 'keep', favourite: false, hidden: false, colour: '#8B7B6B' },
  { category: 'shoes', image: null, brand: 'Essentials', notes: 'White leather sneakers', tag: 'keep', favourite: false, hidden: false, colour: '#F5F0E8' },
  { category: 'shoes', image: null, brand: 'Essentials', notes: 'Brown leather derby shoes', tag: 'keep', favourite: false, hidden: false, colour: '#C17B58' },
  { category: 'shoes', image: null, brand: 'Essentials', notes: 'Chelsea boots', tag: 'keep', favourite: false, hidden: false, colour: '#2D2D2A' },
  { category: 'accessories', image: null, brand: 'Essentials', notes: 'Leather belt', tag: 'keep', favourite: false, hidden: false, colour: '#C17B58' },
  { category: 'accessories', image: null, brand: 'Essentials', notes: 'Silver watch', tag: 'keep', favourite: false, hidden: false, colour: '#B8B8B0' },
  { category: 'basics', image: null, brand: 'Essentials', notes: 'White crew-neck t-shirt', tag: 'keep', favourite: false, hidden: false, colour: '#F5F0E8' },
  { category: 'basics', image: null, brand: 'Essentials', notes: 'Grey marl sweatshirt', tag: 'keep', favourite: false, hidden: false, colour: '#B8B8B0' },
  { category: 'basics', image: null, brand: 'Essentials', notes: 'Black v-neck tee', tag: 'keep', favourite: false, hidden: false, colour: '#2D2D2A' },
];

const NEUTRAL_ITEMS: SeedItem[] = [
  { category: 'tops', image: null, brand: 'Essentials', notes: 'White oversized t-shirt', tag: 'keep', favourite: false, hidden: false, colour: '#F5F0E8' },
  { category: 'tops', image: null, brand: 'Essentials', notes: 'Black turtleneck', tag: 'keep', favourite: false, hidden: false, colour: '#2D2D2A' },
  { category: 'tops', image: null, brand: 'Essentials', notes: 'Linen camp-collar shirt', tag: 'keep', favourite: false, hidden: false, colour: '#D4A96A' },
  { category: 'bottoms', image: null, brand: 'Essentials', notes: 'Relaxed-fit dark jeans', tag: 'keep', favourite: false, hidden: false, colour: '#2D2D2A' },
  { category: 'bottoms', image: null, brand: 'Essentials', notes: 'Wide-leg trousers', tag: 'keep', favourite: false, hidden: false, colour: '#8B7B6B' },
  { category: 'bottoms', image: null, brand: 'Essentials', notes: 'Cargo pants', tag: 'keep', favourite: false, hidden: false, colour: '#7A9B6A' },
  { category: 'outerwear', image: null, brand: 'Essentials', notes: 'Oversized denim jacket', tag: 'keep', favourite: false, hidden: false, colour: '#7B9BBF' },
  { category: 'outerwear', image: null, brand: 'Essentials', notes: 'Black puffer vest', tag: 'keep', favourite: true, hidden: false, colour: '#2D2D2A' },
  { category: 'shoes', image: null, brand: 'Essentials', notes: 'White canvas sneakers', tag: 'keep', favourite: false, hidden: false, colour: '#F5F0E8' },
  { category: 'shoes', image: null, brand: 'Essentials', notes: 'Black chunky boots', tag: 'keep', favourite: false, hidden: false, colour: '#2D2D2A' },
  { category: 'accessories', image: null, brand: 'Essentials', notes: 'Canvas crossbody bag', tag: 'keep', favourite: false, hidden: false, colour: '#8B7B6B' },
  { category: 'accessories', image: null, brand: 'Essentials', notes: 'Beanie', tag: 'keep', favourite: false, hidden: false, colour: '#2D2D2A' },
  { category: 'basics', image: null, brand: 'Essentials', notes: 'Grey hoodie', tag: 'keep', favourite: false, hidden: false, colour: '#B8B8B0' },
  { category: 'basics', image: null, brand: 'Essentials', notes: 'Black joggers', tag: 'keep', favourite: false, hidden: false, colour: '#2D2D2A' },
  { category: 'basics', image: null, brand: 'Essentials', notes: 'White tank top', tag: 'keep', favourite: false, hidden: false, colour: '#F5F0E8' },
];

export function getSeedWardrobe(gender: string): SeedItem[] {
  switch (gender) {
    case 'Woman':
      return WOMEN_ITEMS;
    case 'Man':
      return MEN_ITEMS;
    default:
      return NEUTRAL_ITEMS;
  }
}
