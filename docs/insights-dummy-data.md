# Insights Dummy Data Implementation

## Overview
This document details the implementation of the dummy data generation system for the Insights feature. The system creates realistic, relational data across Wardrobe Items, Outfits, and Feedback to verify analytics visualizations.

## Data Schema & Relationships

### 1. Wardrobe Item (Enhanced)
The `WardrobeItem` interface has been extended to support analytics:
- **`price`** (number): Purchase price in user's currency.
- **`wearCount`** (number): Total number of times worn.
- **`purchaseDate`** (ISO Date): When the item was acquired.
- **`lastWorn`** (ISO Date): Most recent usage date.

**Relationships**:
- Referenced by `OutfitPlan.wardrobeItems`.

### 2. Outfit Plan
- **`date`**: Timestamp of the outfit usage.
- **`wardrobeItems`**: Array of IDs linking back to Wardrobe Items.
- **`context`**: Usage scenario (Work, Party, etc.).

**Relationships**:
- Links to multiple `WardrobeItems`.
- Referenced by `FeedbackEntry.outfitId`.

### 3. Feedback Entry
- **`outfitId`**: ID of the outfit being rated.
- **`score`**: 1-5 rating.
- **`sentiment`**: Derived from score (positive/neutral/negative).

## Data Generation Logic (`utils/insightGenerator.ts`)

### Generator Functions
- **`generateDummyWardrobe(count)`**:
    - Generates `count` items.
    - **Distribution**: Randomly selects Category, Brand, Color, Fabric from predefined realistic sets.
    - **Price Logic**: Random range $20 - $220.
    - **Wear Logic**: Random 0-50 wears; `lastWorn` calculated based on wear frequency.
- **`generateDummyOutfits(wardrobe, days)`**:
    - Generates one outfit per day for the last `days`.
    - **Selection**: Randomly picks Top + Bottom + Shoes from the provided wardrobe.
- **`generateDummyFeedback(outfits)`**:
    - Generates feedback for each outfit.
    - **Score Logic**: Biased towards positive scores (3-5) to mimic realistic user behavior, with occasional outliers (1-2).

### Validation
`validateInsightData()` ensures referential integrity:
- Checks that all feedback points to existing outfits.
- Summarizes total items, average price, and utilization rates.

## Usage in UI
The `InsightsScreen` uses this data to calculate:
- **Total Value**: Sum of all item prices.
- **Avg Cost Per Wear (CPW)**: `Sum(Price / WearCount) / TotalItems`.
- **Utilization**: Count of items worn vs. unworn within the selected time range.
- **Top Categories/Colors**: Aggregated counts.

## Configuration
The generator is called in `InsightsScreen` when real data is insufficient (< 5 items):
```typescript
const w = generateDummyWardrobe(50); // 50 Items
const o = generateDummyOutfits(w, 90); // 90 Days history
const f = generateDummyFeedback(o); // Feedback for those outfits
```
