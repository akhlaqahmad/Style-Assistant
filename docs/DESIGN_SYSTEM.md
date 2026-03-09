# Style-Assistant Design System

## Introduction
This design system unifies the visual language of the Style-Assistant application. It provides a set of standardized tokens and components to ensure consistency, accessibility, and development speed.

## Core Principles
1.  **Semantic Naming:** Use tokens that describe *what* something is (e.g., `text.primary`), not *how* it looks (e.g., `text.white`).
2.  **Constraint-Based:** Use the defined scales for spacing and typography. Avoid magic numbers.
3.  **Component-First:** Prefer using `components/ui` over building custom UI elements.

## Tokens

### Colors
Import `C` from `@/constants/colors`.
- `C.background`: Main app background.
- `C.card`: Surface color for cards/modals.
- `C.text`: Primary text color.
- `C.accent`: Primary brand color.

### Typography
Import `Typography` from `@/constants/typography`.
Available variants:
- `headingXL` (48px)
- `headingL` (36px)
- `headingM` (30px)
- `headingS` (24px)
- `headingXS` (20px)
- `bodyL` (18px)
- `bodyM` (16px) - Default
- `bodyS` (14px)
- `caption` (12px)

### Spacing
Import `Spacing` from `@/constants/spacing`.
- `Spacing.xs` (4px)
- `Spacing.sm` (8px)
- `Spacing.md` (12px)
- `Spacing.lg` (16px)
- `Spacing.xl` (20px)
- `Spacing['2xl']` (24px)
...up to `9xl`.

## Components

### ThemedText
A replacement for `Text` that enforces typography variants.
```tsx
import { ThemedText } from '@/components/ui/ThemedText';

<ThemedText variant="headingM">Hello World</ThemedText>
<ThemedText variant="bodyS" color={C.textMuted}>Subtitle</ThemedText>
```

### Button
A standard button component with variants.
```tsx
import { Button } from '@/components/ui/Button';

<Button title="Save" onPress={handleSave} variant="primary" />
<Button title="Cancel" onPress={handleCancel} variant="ghost" />
```
**Variants:** `primary` (default), `secondary`, `outline`, `ghost`, `danger`.
**Sizes:** `sm`, `md`, `lg`.

### Screen
A layout wrapper that handles SafeArea and standard padding.
```tsx
import { Screen } from '@/components/ui/Screen';

<Screen>
  <ThemedText>Content goes here</ThemedText>
</Screen>
```

## Migration Guide
When working on existing files:
1.  Identify hardcoded colors (e.g., `#F5F0E8`) and replace with `C` tokens.
2.  Identify hardcoded font styles and replace with `ThemedText` or `Typography` styles.
3.  Replace `Pressable` buttons with `<Button />`.
4.  Remove inline `padding: 20` and use `Screen` or `Spacing` tokens.
