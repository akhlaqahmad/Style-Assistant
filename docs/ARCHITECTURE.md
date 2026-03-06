# Architecture Overview

StylistA is a mobile application built with React Native (Expo) and a backend powered by Express.js.

## Frontend Architecture

The frontend is built using **React Native** with **Expo Router** for navigation.

### Key Technologies

-   **Framework**: React Native (Expo SDK 54)
-   **Navigation**: Expo Router (File-based routing)
-   **State Management**: React Context (`AppContext`) + `AsyncStorage` for local persistence.
-   **Styling**: `StyleSheet` with constants defined in `constants/colors.ts`.
-   **Components**: Custom components in `components/`, using `react-native-svg` for complex graphics (e.g., avatars).

### Directory Structure

-   `app/`: Contains the screens and navigation logic.
    -   `_layout.tsx`: Root layout with providers and navigation guards.
    -   `(tabs)/`: Main application tabs (Home, Wardrobe, Planner, Stylists, Profile).
    -   `onboarding/`: Onboarding flow screens.
    -   `body-scan/`: Body measurement and scanning flow.
    -   `wardrobe/`: Wardrobe item management.
    -   `outfit/`: Outfit generation and feedback.
    -   `planner/`: Travel planning screens.
    -   `stylists/`: Stylist booking screens.
-   `components/`: Reusable UI components (e.g., `Avatar`, `ErrorBoundary`).
-   `context/`: Global application state (`AppContext`).
-   `constants/`: App-wide constants (colors, seed data).
-   `lib/`: Utility functions and helpers.

## Backend Architecture

The backend is a Node.js server using **Express.js**.

### Key Technologies

-   **Server**: Express.js
-   **Database**: PostgreSQL
-   **ORM**: Drizzle ORM
-   **Validation**: Zod (via `drizzle-zod`)

### Directory Structure

-   `server/`: Server source code.
    -   `index.ts`: Entry point, server setup, middleware.
    -   `routes.ts`: API route definitions.
    -   `storage.ts`: Data access layer (likely interacting with DB).
-   `shared/`: Shared code between frontend and backend.
    -   `schema.ts`: Database schema definitions using Drizzle ORM.

## Data Flow

1.  **User Interaction**: User interacts with the React Native app.
2.  **State Update**: Actions update the `AppContext` state.
3.  **Persistence**: State changes are persisted to `AsyncStorage` for offline support.
4.  **API Calls**: The app makes API calls to the Express server for data synchronization or server-side features (e.g., stylist booking, advanced processing).
5.  **Database**: The server interacts with the PostgreSQL database using Drizzle ORM.

## Design System

The app follows a consistent design system:

-   **Theme**: Dark Mode.
-   **Colors**: Defined in `constants/colors.ts`.
    -   Background: `#0F0D0B`
    -   Text: `#F5F0E8`
    -   Accent: `#C17B58`
    -   Card Background: `#1A1714`
    -   Borders: `rgba(245,240,232,0.1)`
-   **Typography**: Inter font family.
