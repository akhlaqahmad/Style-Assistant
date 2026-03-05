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
3. **Wardrobe management** - Add items with photo, category, colour, tag (Keep/Review/Donate)
4. **Style gap detection** - Smart detection of missing wardrobe categories
5. **Outfit generator** - Daily outfit suggestions based on mood/occasion/weather
6. **Outfit feedback** - Slider-based rating system to improve future suggestions
7. **Travel planner** - Day-by-day outfit plans and packing checklists for trips
8. **Stylist marketplace** - Browse and book professional stylists (simulated payment)

## File Structure
```
app/
  _layout.tsx              # Root layout with navigation guard + providers
  (tabs)/
    _layout.tsx            # Tab navigation (NativeTabs + Tabs fallback)
    index.tsx              # Today's Look (home screen)
    wardrobe.tsx           # Wardrobe overview
    planner.tsx            # Travel planner list
    stylists.tsx           # Stylist marketplace
    profile.tsx            # User profile
  onboarding/
    _layout.tsx            # Onboarding stack
    index.tsx              # Welcome screen
    basics.tsx             # Step 1: Name, age, gender
    tone.tsx               # Step 2: Eye/hair/tanning for colour analysis
    body.tsx               # Step 3: Body features
    style.tsx              # Step 4: Style aesthetics + lifestyle
    complete.tsx           # Completion with tone reveal
  wardrobe/
    add.tsx                # Add wardrobe item (modal)
    [id].tsx               # Wardrobe item detail
  outfit/
    feedback.tsx           # Outfit rating (modal)
  planner/
    new.tsx                # New trip (modal)
    [id].tsx               # Trip detail with outfit plan + packing checklist
  stylists/
    [id].tsx               # Stylist profile + booking flow
context/
  AppContext.tsx           # Full app state with AsyncStorage persistence
constants/
  colors.ts                # Warm terracotta design system
server/
  index.ts                 # Express server
  routes.ts                # API routes
```

## Design System
- **Primary**: Warm terracotta accent (`#C17B58`)
- **Background**: Warm off-white (`#FAF8F5`)
- **Typography**: Inter (all weights)
- **Aesthetic**: High-fashion editorial, warm and sophisticated

## Data Model
All data persisted to AsyncStorage:
- `userProfile` - onboarding answers + settings
- `bodyProfile` - body features + silhouette guidance
- `toneProfile` - derived colour type + palette
- `wardrobe` - array of clothing items
- `outfits` - generated outfit plans
- `feedback` - outfit rating entries
- `trips` - travel plans with packing lists
- `bookings` - stylist session bookings
