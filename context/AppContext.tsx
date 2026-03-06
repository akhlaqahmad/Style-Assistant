import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSeedWardrobe } from '@/constants/seedWardrobe';

export interface UserProfile {
  name: string;
  email: string;
  ageRange: string;
  gender: string;
  eyeColour: string;
  hairColour: string;
  tanningBehaviour: string;
  bodyLoves: string[];
  bodyDownplay: string[];
  colourPreferences: string[];
  colourDislikes: string[];
  styleFamiliarity: string;
  preferredStyles: string[];
  lifestyle: string[];
  budgetRange: string;
  weatherAware: boolean;
  nightReminders: boolean;
  moodTracking: boolean;
  feedbackPrompts: boolean;
  onboardingComplete: boolean;
  currency: 'GBP' | 'AUD' | 'USD' | 'EUR' | 'CAD' | 'JPY';
}

export interface BodyProfile {
  height: string;
  bust: string;
  waist: string;
  hips: string;
  silhouetteGuidance: string[];
  layeringTips: string[];
  fabricSuggestions: string[];
}

export interface AvatarProfile {
  heightCm: number;
  shoulderWidth: number;
  bust: number;
  waist: number;
  hips: number;
  inseam: number;
  skinTone: string;
  bodyShape: string;
  frontPhotoUri: string;
  sidePhotoUri: string;
  avatarGenerated: boolean;
}

export interface ToneProfile {
  toneType: 'warm' | 'cool' | 'neutral' | '';
  palette: string[];
  guidance: string;
}

export interface WardrobeItem {
  id: string;
  category: string;
  subCategory?: string;
  image: any;
  brand: string;
  notes: string;
  tag: 'keep' | 'review' | 'donate';
  favourite: boolean;
  hidden: boolean;
  createdAt: string;
  colour: string;
  pattern?: string;
  style?: string;
  fabric?: string;
  sleeveLength?: string;
  neckline?: string;
  fit?: string;
  features?: string[];
  genderCategory?: 'male' | 'female' | 'unisex';
}

export interface StyleGap {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  priority: 'high' | 'medium' | 'low';
}

export interface OutfitPlan {
  id: string;
  date: string;
  mood: string;
  context: string;
  weather: string;
  top: string;
  bottom: string;
  shoes: string;
  accessories: string;
  wardrobeItems: string[];
  generated: boolean;
}

export interface FeedbackEntry {
  id: string;
  outfitId: string;
  score: number;
  sentiment: string;
  whatWorked: string[];
  whatDidnt: string[];
  createdAt: string;
}

export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  tripType: string;
  luggageType: string;
  outfitDays: TripDay[];
  packingList: PackingItem[];
  createdAt: string;
}

export interface TripDay {
  date: string;
  outfit: string;
  activities: string;
}

export interface PackingItem {
  id: string;
  name: string;
  category: string;
  packed: boolean;
}

export interface Stylist {
  id: string;
  name: string;
  specialty: string;
  pricing: number;
  pricingUnit: string;
  rating: number;
  reviewCount: number;
  bio: string;
  avatar: string;
  availability: string[];
  tags: string[];
}

export interface Booking {
  id: string;
  stylistId: string;
  date: string;
  time: string;
  notes: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  total: number;
  createdAt: string;
}

const defaultUser: UserProfile = {
  name: '',
  email: '',
  ageRange: '',
  gender: '',
  eyeColour: '',
  hairColour: '',
  tanningBehaviour: '',
  bodyLoves: [],
  bodyDownplay: [],
  colourPreferences: [],
  colourDislikes: [],
  styleFamiliarity: '',
  preferredStyles: [],
  lifestyle: [],
  budgetRange: '',
  weatherAware: true,
  nightReminders: false,
  moodTracking: true,
  feedbackPrompts: true,
  onboardingComplete: false,
  currency: 'AUD',
};

const defaultBodyProfile: BodyProfile = {
  height: '',
  bust: '',
  waist: '',
  hips: '',
  silhouetteGuidance: [],
  layeringTips: [],
  fabricSuggestions: [],
};

const defaultAvatarProfile: AvatarProfile = {
  heightCm: 0,
  shoulderWidth: 0,
  bust: 0,
  waist: 0,
  hips: 0,
  inseam: 0,
  skinTone: '#D4A06A',
  bodyShape: '',
  frontPhotoUri: '',
  sidePhotoUri: '',
  avatarGenerated: false,
};

const defaultToneProfile: ToneProfile = {
  toneType: '',
  palette: [],
  guidance: '',
};

const MOCK_STYLISTS: Stylist[] = [
  {
    id: 's1',
    name: 'Maya Chen',
    specialty: 'Corporate & Workwear',
    pricing: 150,
    pricingUnit: 'session',
    rating: 4.9,
    reviewCount: 124,
    bio: 'Former fashion director with 10+ years helping professionals build powerful wardrobes that command attention in the boardroom.',
    avatar: 'MC',
    availability: ['Mon', 'Wed', 'Fri'],
    tags: ['Corporate', 'Capsule', 'Personal Shopping'],
  },
  {
    id: 's2',
    name: 'Sofia Rossi',
    specialty: 'Everyday & Casual Chic',
    pricing: 95,
    pricingUnit: 'session',
    rating: 4.8,
    reviewCount: 87,
    bio: 'Specialising in effortless everyday style — helping you look polished without trying too hard. Lover of minimalism and quality basics.',
    avatar: 'SR',
    availability: ['Tue', 'Thu', 'Sat'],
    tags: ['Casual', 'Minimalist', 'Basics'],
  },
  {
    id: 's3',
    name: 'James Okafor',
    specialty: 'Special Events & Evening Wear',
    pricing: 200,
    pricingUnit: 'session',
    rating: 5.0,
    reviewCount: 56,
    bio: 'Red-carpet ready. I help clients find show-stopping looks for weddings, galas, and milestone events that they\'ll remember forever.',
    avatar: 'JO',
    availability: ['Wed', 'Sat', 'Sun'],
    tags: ['Evening', 'Events', 'Glamour'],
  },
  {
    id: 's4',
    name: 'Priya Sharma',
    specialty: 'Body-Positive Styling',
    pricing: 120,
    pricingUnit: 'session',
    rating: 4.9,
    reviewCount: 203,
    bio: 'Empowering clients of all shapes and sizes to love what they wear. Certified in body-positive styling and size-inclusive fashion.',
    avatar: 'PS',
    availability: ['Mon', 'Tue', 'Thu', 'Fri'],
    tags: ['Body-Positive', 'All Sizes', 'Confidence'],
  },
];

interface AppContextValue {
  userProfile: UserProfile;
  bodyProfile: BodyProfile;
  toneProfile: ToneProfile;
  avatarProfile: AvatarProfile;
  wardrobe: WardrobeItem[];
  styleGaps: StyleGap[];
  outfits: OutfitPlan[];
  feedback: FeedbackEntry[];
  trips: Trip[];
  bookings: Booking[];
  stylists: Stylist[];
  isLoading: boolean;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  updateBodyProfile: (updates: Partial<BodyProfile>) => void;
  updateToneProfile: (updates: Partial<ToneProfile>) => void;
  updateAvatarProfile: (updates: Partial<AvatarProfile>) => void;
  addWardrobeItem: (item: Omit<WardrobeItem, 'id' | 'createdAt'>) => void;
  updateWardrobeItem: (id: string, updates: Partial<WardrobeItem>) => void;
  removeWardrobeItem: (id: string) => void;
  addOutfit: (outfit: Omit<OutfitPlan, 'id'>) => void;
  addFeedback: (fb: Omit<FeedbackEntry, 'id' | 'createdAt'>) => void;
  addTrip: (trip: Omit<Trip, 'id' | 'createdAt'>) => void;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  removeTrip: (id: string) => void;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  completeOnboarding: () => void;
  formatPrice: (amount: number) => string;
}

const AppContext = createContext<AppContextValue | null>(null);

function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUser);
  const [bodyProfile, setBodyProfile] = useState<BodyProfile>(defaultBodyProfile);
  const [toneProfile, setToneProfile] = useState<ToneProfile>(defaultToneProfile);
  const [avatarProfile, setAvatarProfile] = useState<AvatarProfile>(defaultAvatarProfile);
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);
  const [outfits, setOutfits] = useState<OutfitPlan[]>([]);
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ GBP: 1, AUD: 1.9, USD: 1.25, EUR: 1.15, CAD: 1.7, JPY: 185 });

  useEffect(() => {
    loadData();
    fetchExchangeRates();
  }, []);

  async function fetchExchangeRates() {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/GBP');
      const data = await response.json();
      if (data && data.rates) {
        setExchangeRates(data.rates);
      }
    } catch (e) {
      console.log('Using fallback exchange rates');
    }
  }

  async function loadData() {
    try {
      const [up, bp, tp, ap, w, o, fb, tr, bk] = await Promise.all([
        AsyncStorage.getItem('userProfile'),
        AsyncStorage.getItem('bodyProfile'),
        AsyncStorage.getItem('toneProfile'),
        AsyncStorage.getItem('avatarProfile'),
        AsyncStorage.getItem('wardrobe'),
        AsyncStorage.getItem('outfits'),
        AsyncStorage.getItem('feedback'),
        AsyncStorage.getItem('trips'),
        AsyncStorage.getItem('bookings'),
      ]);
      if (up) setUserProfile(JSON.parse(up));
      if (bp) setBodyProfile(JSON.parse(bp));
      if (tp) setToneProfile(JSON.parse(tp));
      if (ap) setAvatarProfile(JSON.parse(ap));
      if (w) setWardrobe(JSON.parse(w));
      if (o) setOutfits(JSON.parse(o));
      if (fb) setFeedback(JSON.parse(fb));
      if (tr) setTrips(JSON.parse(tr));
      if (bk) setBookings(JSON.parse(bk));
    } catch (e) {
      console.error('Failed to load data', e);
    } finally {
      setIsLoading(false);
    }
  }

  async function persist(key: string, value: unknown) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Failed to persist', key, e);
    }
  }

  function updateUserProfile(updates: Partial<UserProfile>) {
    setUserProfile(prev => {
      const next = { ...prev, ...updates };
      persist('userProfile', next);
      return next;
    });
  }

  function updateBodyProfile(updates: Partial<BodyProfile>) {
    setBodyProfile(prev => {
      const next = { ...prev, ...updates };
      persist('bodyProfile', next);
      return next;
    });
  }

  function updateToneProfile(updates: Partial<ToneProfile>) {
    setToneProfile(prev => {
      const next = { ...prev, ...updates };
      persist('toneProfile', next);
      return next;
    });
  }

  function updateAvatarProfile(updates: Partial<AvatarProfile>) {
    setAvatarProfile(prev => {
      const next = { ...prev, ...updates };
      persist('avatarProfile', next);
      return next;
    });
  }

  function addWardrobeItem(item: Omit<WardrobeItem, 'id' | 'createdAt'>) {
    const newItem: WardrobeItem = { ...item, id: generateId(), createdAt: new Date().toISOString() };
    setWardrobe(prev => {
      const next = [...prev, newItem];
      persist('wardrobe', next);
      return next;
    });
  }

  function updateWardrobeItem(id: string, updates: Partial<WardrobeItem>) {
    setWardrobe(prev => {
      const next = prev.map(item => item.id === id ? { ...item, ...updates } : item);
      persist('wardrobe', next);
      return next;
    });
  }

  function removeWardrobeItem(id: string) {
    setWardrobe(prev => {
      const next = prev.filter(item => item.id !== id);
      persist('wardrobe', next);
      return next;
    });
  }

  function addOutfit(outfit: Omit<OutfitPlan, 'id'>) {
    const newOutfit: OutfitPlan = { ...outfit, id: generateId() };
    setOutfits(prev => {
      const next = [...prev, newOutfit];
      persist('outfits', next);
      return next;
    });
  }

  function addFeedback(fb: Omit<FeedbackEntry, 'id' | 'createdAt'>) {
    const entry: FeedbackEntry = { ...fb, id: generateId(), createdAt: new Date().toISOString() };
    setFeedback(prev => {
      const next = [...prev, entry];
      persist('feedback', next);
      return next;
    });
  }

  function addTrip(trip: Omit<Trip, 'id' | 'createdAt'>) {
    const newTrip: Trip = { ...trip, id: generateId(), createdAt: new Date().toISOString() };
    setTrips(prev => {
      const next = [...prev, newTrip];
      persist('trips', next);
      return next;
    });
  }

  function updateTrip(id: string, updates: Partial<Trip>) {
    setTrips(prev => {
      const next = prev.map(t => t.id === id ? { ...t, ...updates } : t);
      persist('trips', next);
      return next;
    });
  }

  function removeTrip(id: string) {
    setTrips(prev => {
      const next = prev.filter(t => t.id !== id);
      persist('trips', next);
      return next;
    });
  }

  function addBooking(booking: Omit<Booking, 'id' | 'createdAt'>) {
    const newBooking: Booking = { ...booking, id: generateId(), createdAt: new Date().toISOString() };
    setBookings(prev => {
      const next = [...prev, newBooking];
      persist('bookings', next);
      return next;
    });
  }

  function completeOnboarding() {
    updateUserProfile({ onboardingComplete: true });
  }

  const formatPrice = useCallback((amount: number) => {
    const currency = userProfile.currency || 'GBP';
    const rate = exchangeRates[currency] || 1;
    const converted = amount * rate;
    
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(converted);
  }, [userProfile.currency, exchangeRates]);

  useEffect(() => {
    if (!isLoading && userProfile.onboardingComplete && wardrobe.length === 0) {
      const seedItems = getSeedWardrobe(userProfile.gender);
      const seeded: WardrobeItem[] = seedItems.map((item, i) => ({
        ...item,
        id: generateId() + i.toString(),
        createdAt: new Date().toISOString(),
      }));
      setWardrobe(seeded);
      persist('wardrobe', seeded);
    }
  }, [isLoading, userProfile.onboardingComplete, userProfile.gender, wardrobe.length]);

  const styleGaps = useMemo((): StyleGap[] => {
    const categories = wardrobe.map(w => w.category);
    const gaps: StyleGap[] = [];
    if (!categories.includes('outerwear')) {
      gaps.push({ id: 'g1', title: 'Layering Piece', description: 'A versatile jacket or cardigan pulls any outfit together and adapts to changing temperatures.', category: 'outerwear', imageUrl: '', priority: 'high' });
    }
    if (!categories.includes('shoes') || categories.filter(c => c === 'shoes').length < 2) {
      gaps.push({ id: 'g2', title: 'Versatile Shoes', description: 'A pair of clean, neutral shoes that work from desk to dinner are a wardrobe essential.', category: 'shoes', imageUrl: '', priority: 'high' });
    }
    if (!categories.includes('accessories')) {
      gaps.push({ id: 'g3', title: 'Statement Accessory', description: 'One bold bag or piece of jewellery elevates even the simplest outfit instantly.', category: 'accessories', imageUrl: '', priority: 'medium' });
    }
    if (!categories.includes('dresses')) {
      gaps.push({ id: 'g4', title: 'Occasion Dress', description: 'A go-to dress for events means less stress and better decisions when invitations arrive.', category: 'dresses', imageUrl: '', priority: 'medium' });
    }
    if (!categories.includes('basics')) {
      gaps.push({ id: 'g5', title: 'Quality Basics', description: 'Investing in 3–5 high-quality basics in neutral tones unlocks dozens of outfit combinations.', category: 'basics', imageUrl: '', priority: 'low' });
    }
    if (gaps.length === 0) {
      gaps.push({ id: 'g6', title: 'Travel Capsule', description: 'A curated set of lightweight, mix-and-match pieces that fit in a carry-on and cover any itinerary.', category: 'travel', imageUrl: '', priority: 'low' });
    }
    return gaps;
  }, [wardrobe]);

  const value = useMemo(() => ({
    userProfile,
    bodyProfile,
    toneProfile,
    avatarProfile,
    wardrobe,
    styleGaps,
    outfits,
    feedback,
    trips,
    bookings,
    stylists: MOCK_STYLISTS,
    isLoading,
    updateUserProfile,
    updateBodyProfile,
    updateToneProfile,
    updateAvatarProfile,
    addWardrobeItem,
    updateWardrobeItem,
    removeWardrobeItem,
    addOutfit,
    addFeedback,
    addTrip,
    updateTrip,
    removeTrip,
    addBooking,
    completeOnboarding,
    formatPrice,
  }), [userProfile, bodyProfile, toneProfile, avatarProfile, wardrobe, styleGaps, outfits, feedback, trips, bookings, isLoading, exchangeRates, formatPrice]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
