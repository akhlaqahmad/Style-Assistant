# Feedback Implementation Phase 1 Spec

## Why
User feedback indicates a need for a more personalized and scientifically grounded onboarding process (Tonal Analysis, Body Shape), a restructured navigation flow to better support daily habits ("Today" tab) and wardrobe management ("Style Studio"), and clearer terminology throughout the app.

## What Changes
### 1. Onboarding Refinements
- **Tonal Analysis**: Implement a 3-step photo capture flow (Face, Wrist, White Balance) to determine skin tone more accurately.
  - **New Screens**: `onboarding/tone-analysis/intro`, `capture-face`, `capture-wrist`, `capture-card`, `analysis-result`.
- **Body Shape ("Celebrate your body")**:
  - Update `onboarding/loves.tsx` to use "Highlight" (1 tap), "Soften" (2 taps), "Neutral" (default) logic.
  - Update list of features (Shoulders, Neck, Arms, etc.).
- **Style Selection**:
  - Rename to "Which styles feel most like you?".
  - Update options to: Classic, Minimal/Modern, Sporty/Casual, Elegant/Refined, Creative/Artistic, Romantic/Soft, Edgy/Contemporary, Relaxed/Effortless, Trend-forward.
- **Notification Setup**:
  - Add screens for "Style Alerts" (Daily Planner, Weather, Mood) and "Feedback Prompt".

### 2. Navigation & Information Architecture
- **Tab Bar Update**:
  1.  **Today**: Daily dashboard (Weather, Outfit, Reflection).
  2.  **Style Studio**: (Renamed from Wardrobe) Collection management.
  3.  **Discover**: (New/Merged) Inspiration, Travel Planner, Event Styling, Style Experts.
  4.  **Insights**: (New) Wardrobe analytics and style evolution.
  5.  **Profile**: Settings and "Style Identity".
- **Remove**: Standalone `Stylists` tab (moved to Discover).

### 3. Feature Updates
- **Today Tab**:
  - Hero "Today's Outfit" section.
  - Weather integration display.
  - Daily Reflection ("How did your outfit feel?").
- **Style Studio**:
  - "Start Your Studio" onboarding prompt (Core pieces first).
  - Updated Category Taxonomy (Tops, Bottoms, Dresses, Outerwear, Knitwear, Activewear, Loungewear, Shoes, Bags, Accessories, Jewellery, Occasionwear).
- **Profile**:
  - Structure: "Your Style Identity" (Fit, Colour, Personal Style), "Style Alerts", "Settings".
  - Add "Your Style Insights" summary.

## Impact
- **Affected Specs**: Onboarding, Navigation, Wardrobe, Profile.
- **Affected Code**: `app/_layout.tsx`, `app/(tabs)/_layout.tsx`, `app/onboarding/*`, `context/AppContext.tsx`.

## ADDED Requirements
### Requirement: Tonal Analysis Flow
The system SHALL provide a guided flow for users to take 3 photos (Face, Wrist, White Reference) to determine their tone profile.
#### Scenario: Successful Capture
- **WHEN** user completes all 3 photos
- **THEN** system displays a "Calculating..." state and then the Tonal Result (Warm/Cool/Neutral) with a confidence score.

### Requirement: Body Feature Preferences
The system SHALL allow users to mark body features as "Highlight" or "Soften".
#### Scenario: Selection
- **WHEN** user taps a feature (e.g., "Waist") once -> "Highlight" (Green).
- **WHEN** user taps again -> "Soften" (Orange/Different Color).
- **WHEN** user taps again -> "Neutral" (Default).

### Requirement: Tab Restructure
The system SHALL display 5 tabs: Today, Style Studio, Discover, Insights, Profile.

## MODIFIED Requirements
### Requirement: Wardrobe to Style Studio
- Rename "Wardrobe" to "Style Studio".
- Implement "Start Your Studio" prompt if item count < 5.

## REMOVED Requirements
- **Stylists Tab**: Removed as a top-level tab; content moved to "Discover".
