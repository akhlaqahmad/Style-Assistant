# Design System Implementation Plan: Style-Assistant

## Executive Summary
This document outlines the strategy to transition "Style-Assistant" from ad-hoc styling to a scalable, token-based Design System. The goal is to unify UI consistency, accelerate development, and ensure accessibility compliance across all views.

## 1. Audit & Discovery
**Objective:** Map the current state of UI to identify inconsistencies and consolidation opportunities.

*   **Visual Audit:** Screenshot all existing screens (Onboarding, Wardrobe, Body Scan, Planner). Group them by patterns (Forms, Lists, Modals).
*   **Code Audit:**
    *   Scan for hardcoded hex values in `app/**/*.tsx` and replace candidates with tokens.
    *   Identify repeated UI patterns (e.g., the "Button" in `onboarding/index.tsx` vs other buttons).
    *   Analyze font usage: standardize font-size, line-height, and font-weight combinations.
*   **Deliverable:** An "Inventory Spreadsheet" listing all unique colors, font styles, and UI components currently in production.

## 2. Foundation: Design Tokens
**Objective:** Establish the atomic units of style.

*   **Refine `constants/colors.ts`:**
    *   **Primitive Tokens:** Define the raw palette (e.g., `primitive.orange.500`).
    *   **Semantic Tokens:** Map primitives to context (e.g., `text.primary`, `background.card`, `border.default`, `status.success`).
*   **Typography System (`constants/typography.ts`):**
    *   Define scale: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`.
    *   Define weights: `regular` (400), `medium` (500), `semibold` (600), `bold` (700).
    *   Define variants: `Heading1`, `Body`, `Caption`, `ButtonText`.
*   **Spacing & Layout (`constants/spacing.ts`):**
    *   4px grid system (e.g., `space.2` = 8px, `space.4` = 16px).
*   **Radius & Shadows (`constants/effects.ts`):**
    *   Standardize border radii (`sm`, `md`, `lg`, `full`).

## 3. Component Library Architecture
**Objective:** Build a centralized set of "dumb" UI components in `components/ui/`.

*   **Atomic Components (Phase 1):**
    *   `Typography` (Text wrapper enforcing theme fonts).
    *   `Button` (Variants: Primary, Secondary, Ghost, Outline; Sizes: sm, md, lg).
    *   `Icon` (Wrapper for icon sets with standardized sizing/coloring).
    *   `Box` / `Stack` (Layout primitives to replace raw `<View>` with spacing props).
*   **Molecular Components (Phase 2):**
    *   `Input` / `FormGroup` (Label, Input, ErrorText).
    *   `Card` (Container with standard padding/elevation).
    *   `Modal` / `BottomSheet`.
*   **Tech Stack:**
    *   Continue using `StyleSheet` but fed by tokens.
    *   Consider `Restyle` or `Tamagui` concepts if a full styling engine is desired, otherwise strict `StyleSheet` + Token constants is sufficient for now.

## 4. Governance & Process
**Objective:** Maintain system integrity over time.

*   **Contribution Model:**
    *   "Snowflake" components (one-off) live in feature folders.
    *   If a component is used >3 times, it is promoted to `components/ui`.
*   **Versioning:**
    *   Treat the Design System as an internal product. Semantic versioning for breaking changes (e.g., renaming a token).
*   **Design Handoff:**
    *   Figma files must use the same token names as the code.

## 5. Automated Quality Assurance
**Objective:** Enforce rules via tooling.

*   **Linting:**
    *   `eslint-plugin-react-native`: Enforce no inline styles (optional but recommended).
    *   Custom rule: Warn on hardcoded hex colors; suggest imports from `@/constants`.
*   **Testing:**
    *   Snapshot tests for all Core Components to catch regression.
    *   Accessibility testing: Ensure all interactive components have `accessibilityRole` and `accessibilityLabel` props.

## 6. Documentation & Training
**Objective:** Ensure team adoption.

*   **Storybook (Optional but Recommended):**
    *   Set up React Native Storybook to browse components in isolation.
*   **Cheatsheet:**
    *   A simple markdown file `docs/DESIGN_SYSTEM.md` mapping "Old Way" to "New Way".
    *   Example: "Don't use `color: '#F5F0E8'`, use `color: C.text`".

## 7. Metrics & Adoption
**Objective:** Measure success.

*   **Adoption Rate:** % of files importing from `components/ui` vs `react-native` primitives.
*   **Consistency Score:** # of unique hardcoded hex values (target: 0).

## Implementation Roadmap

### Milestone 1: Foundation (Week 1)
- [ ] Complete UI Audit.
- [ ] Finalize `constants/colors.ts` (Semantic layer).
- [ ] Create `constants/typography.ts` and `constants/spacing.ts`.

### Milestone 2: Core Components (Week 2)
- [ ] Build `Typography` component (Text).
- [ ] Build `Button` component.
- [ ] Build `Container/Screen` layout component.

### Milestone 3: Migration (Week 3-4)
- [ ] Refactor `onboarding` flow to use new components.
- [ ] Refactor `wardrobe` screens.
- [ ] Refactor `planner` screens.

### Milestone 4: Tooling & Docs (Week 5)
- [ ] Set up linting rules.
- [ ] Write documentation.
