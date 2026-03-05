# StylistA – Personal Styling App

## Overview
StylistA is a personal styling and wardrobe companion mobile app built with Expo React Native. It helps users understand their body proportions and colour tones, digitise their wardrobe, generate daily outfits, plan travel capsules, and book professional stylists.

## Architecture
- **Frontend**: Expo Router (file-based routing), React Native, TypeScript
- **Backend**: Express.js (serves API + landing page)
- **State**: React Context + AsyncStorage (local persistence)
- **Navigation**: NativeTabs (iOS 26 liquid glass) + classic Tabs fallback

## Key Features
1. **Onboarding flow** - 11 focused single-question screens: Welcome → Name → Age → Gender → Eye colour → Hair colour → Sun response → Body loves → Style picks → Lifestyle → Complete (animated tone reveal)
2. **Tone analysis** - Derived colour palette (warm/cool/neutral) from eye/hair/tanning inputs
3. **Wardrobe management** - Add items with photo, category, colour, tag (Keep/Review/Donate). Default items seeded per gender on onboarding completion (women's, men's, or unisex)
4. **Style gap detection** - Smart detection of missing wardrobe categories
5. **Outfit generator** - Daily outfit suggestions based on mood/occasion/weather
6. **Outfit feedback** - Slider-based rating system to improve future suggestions
7. **Travel planner** - Day-by-day outfit plans and packing checklists for trips
8. **Stylist marketplace** - Browse and book professional stylists (simulated payment)
9. **Body scanning** - Guided measurements input + camera capture for proportional SVG avatar
10. **Virtual try-on** - Dress avatar with wardrobe items by category (tops/bottoms/shoes)

## File Structure
```
app/
  _layout.tsx              # Root layout with navigation guard + providers
  (tabs)/
    _layout.tsx            # Tab navigation (NativeTabs + Tabs fallback, dark blur)
    index.tsx              # Today's Look (home screen)
    wardrobe.tsx           # Wardrobe overview
    planner.tsx            # Travel planner list
    stylists.tsx           # Stylist marketplace
    profile.tsx            # User profile + body scan & try-on entry points
  onboarding/
    _layout.tsx            # Onboarding stack
    index.tsx → complete.tsx  # 11-screen animated onboarding flow
  body-scan/
    _layout.tsx            # Body scan stack
    index.tsx              # Intro screen explaining process
    measurements.tsx       # Input form for height/shoulders/bust/waist/hips/inseam + skin tone
    capture.tsx            # Camera capture (front + side photos) with silhouette guide
    result.tsx             # SVG avatar display with measurements summary
  wardrobe/
    add.tsx                # Add wardrobe item (modal)
    [id].tsx               # Wardrobe item detail + try-on button
  outfit/
    feedback.tsx           # Outfit rating (modal)
  planner/
    new.tsx                # New trip (modal)
    [id].tsx               # Trip detail with outfit plan + packing checklist
  stylists/
    [id].tsx               # Stylist profile + booking flow
  try-on.tsx               # Virtual try-on screen (modal)
components/
  Avatar.tsx               # Proportional 2D SVG avatar (react-native-svg)
  ErrorBoundary.tsx        # Error boundary with restart
context/
  AppContext.tsx            # Full app state with AsyncStorage persistence
constants/
  colors.ts                # Dark theme design system
  seedWardrobe.ts          # Gender-based default wardrobe items (seeded on onboarding complete)
server/
  index.ts                 # Express server
  routes.ts                # API routes
```

## Design System
- **Theme**: Dark mode (#0F0D0B background, #F5F0E8 text, #1A1714 cards)
- **Accent**: Warm terracotta (`#C17B58`)
- **Borders**: `rgba(245,240,232,0.1)`
- **Typography**: Inter (all weights)
- **Aesthetic**: High-fashion editorial, dark and sophisticated
- **Tab bar**: Dark blur tint on iOS, solid dark on Android/web

## Data Model
All data persisted to AsyncStorage:
- `userProfile` - onboarding answers + settings
- `bodyProfile` - body features + silhouette guidance
- `toneProfile` - derived colour type + palette
- `avatarProfile` - body measurements, skin tone, body shape, photos, avatar generated flag
- `wardrobe` - array of clothing items
- `outfits` - generated outfit plans
- `feedback` - outfit rating entries
- `trips` - travel plans with packing lists
- `bookings` - stylist session bookings

## Dependencies
Key packages: expo, expo-router, expo-camera, react-native-svg, @tanstack/react-query, react-native-reanimated, expo-haptics, expo-image-picker, expo-linear-gradient
