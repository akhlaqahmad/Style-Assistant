# Tasks

- [x] Task 1: Restructure Navigation & Tabs
  - [x] SubTask 1.1: Create `app/(tabs)/discover.tsx` and `app/(tabs)/insights.tsx`.
  - [x] SubTask 1.2: Update `app/(tabs)/_layout.tsx` to reflect the 5 new tabs (Today, Style Studio, Discover, Insights, Profile).
  - [x] SubTask 1.3: Rename `wardrobe.tsx` to `studio.tsx` (or update label/icon).
  - [x] SubTask 1.4: Move `stylists.tsx` content to a section in `discover.tsx` and delete `stylists.tsx`.

- [x] Task 2: Enhance Onboarding - Tonal Analysis
  - [x] SubTask 2.1: Install `expo-camera` or `expo-image-picker` (check compatibility).
  - [x] SubTask 2.2: Create `app/onboarding/tone-analysis/` directory.
  - [x] SubTask 2.3: Implement `intro.tsx` (Instructions for natural light, etc.).
  - [x] SubTask 2.4: Implement `capture.tsx` (Reusable component for Face, Wrist, Card).
  - [x] SubTask 2.5: Implement `result.tsx` (Show analysis result - mocked for now if algorithm is not ready).
  - [x] SubTask 2.6: Update `app/onboarding/skin.tsx` to link to this new flow or replace it.

- [x] Task 3: Enhance Onboarding - Body & Style
  - [x] SubTask 3.1: Update `app/onboarding/loves.tsx` to support 3 states (Neutral, Highlight, Soften).
  - [x] SubTask 3.2: Update `app/onboarding/loves.tsx` feature list (Shoulders, Neck, Arms, etc.).
  - [x] SubTask 3.3: Update `app/onboarding/styles.tsx` with new style categories (Classic, Minimal, etc.).
  - [x] SubTask 3.4: Add `app/onboarding/alerts.tsx` for Notification setup (Daily Planner, Weather, Mood).

- [x] Task 4: Update Today Tab (`index.tsx`)
  - [x] SubTask 4.1: Implement "Good Morning" header with Weather widget.
  - [x] SubTask 4.2: Create "Today's Outfit" hero component.
  - [x] SubTask 4.3: Add "Style Note" and "Daily Reflection" sections.

- [x] Task 5: Update Style Studio (Wardrobe)
  - [x] SubTask 5.1: Implement "Start Your Studio" empty state/prompt.
  - [x] SubTask 5.2: Update `AppContext` types for Category/Subcategory to match new taxonomy.
  - [x] SubTask 5.3: Update `add-item` flow to support new categories.

- [x] Task 6: Update Profile Tab
  - [x] SubTask 6.1: Restructure layout to "Style Identity", "Style Alerts", "Settings".
  - [x] SubTask 6.2: Add "Style Insights" summary component.

# Task Dependencies
- Task 1 (Navigation) is a prerequisite for Task 4, 5, 6 UI updates to sit in the right place.
- Task 2 & 3 (Onboarding) can be done in parallel with Task 1.
