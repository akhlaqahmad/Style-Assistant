# Agent Context & Instructions

This file provides context and instructions for AI agents interacting with the StylistA codebase.

## 🎯 Project Goal
StylistA is a personal styling and wardrobe companion mobile app built with Expo React Native. The goal is to help users understand their style, manage their wardrobe, and get outfit recommendations.

## 🏗️ Architecture Overview

-   **Frontend**: React Native with Expo.
    -   Routing: `expo-router` (file-based routing in `app/`).
    -   UI: Custom components in `components/`, using `react-native-svg` for avatars.
    -   State: `AppContext` in `context/AppContext.tsx` for global state, persisted with `AsyncStorage`.
    -   Styling: Custom constants in `constants/colors.ts`.
-   **Backend**: Express.js server in `server/`.
    -   Routes: Defined in `server/routes.ts`.
    -   Database: PostgreSQL, managed by Drizzle ORM (`shared/schema.ts`).
    -   API: JSON-based API for data persistence and features not handled locally.

## 📂 Key Directories

-   `app/`: Screens and navigation structure.
-   `components/`: Reusable UI components.
-   `context/`: Application state management.
-   `server/`: Backend logic and API endpoints.
-   `shared/`: Shared types and schemas (Drizzle/Zod).

## 📝 Coding Conventions

-   **React Native**: Functional components with hooks.
-   **Styling**: Use `StyleSheet.create` or inline styles with constants from `constants/colors.ts`.
-   **Types**: TypeScript is enforced. Use interfaces/types for props and state.
-   **Async**: Use `async/await` for asynchronous operations.
-   **Error Handling**: Use `try/catch` blocks and display user-friendly error messages.

## 🤖 Common Tasks for Agents

1.  **Adding a Screen**:
    -   Create a new file in `app/` (or a subdirectory).
    -   Use `expo-router` conventions (e.g., `_layout.tsx` for stacks/tabs).
    -   Update navigation if necessary.

2.  **Modifying State**:
    -   Update `context/AppContext.tsx`.
    -   Ensure `AsyncStorage` is updated for persistence.

3.  **Backend Changes**:
    -   Update `shared/schema.ts` for database schema changes.
    -   Update `server/routes.ts` for new API endpoints.
    -   Run `npm run db:push` to update the database schema (if applicable).

4.  **UI Updates**:
    -   Check `components/` for reusable components before creating new ones.
    -   Maintain the dark mode aesthetic defined in `constants/colors.ts`.

## 🔍 Context Retrieval

-   Use `search` tool to find relevant files and code snippets.
-   Read `package.json` to understand dependencies.
-   Refer to `docs/` for detailed documentation.
