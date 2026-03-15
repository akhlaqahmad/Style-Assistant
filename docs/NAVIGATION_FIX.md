# Navigation Fix: Profile & Style Screens

## Issue Description
Users reported that clicking on "Color Profile" and "Personal Style" buttons in the "Today" screen (`app/(tabs)/index.tsx`) was incorrectly redirecting them back to the "Today" page instead of the intended screens.

## Root Cause Analysis
The issue was caused by a `NavigationGuard` component in `app/_layout.tsx`.
This guard enforces the following rules:
1. If onboarding is incomplete, redirect to `/onboarding`.
2. If onboarding is complete, prevent access to any route starting with `/onboarding` and redirect to `/(tabs)`.

Since the "Color Profile" (`/onboarding/tone-analysis/result`) and "Personal Style" (`/onboarding/styles`) screens are located within the `onboarding` directory, the guard was blocking access to them for users who had already completed onboarding.

## Fix Implementation
The `NavigationGuard` logic in `app/_layout.tsx` was updated to whitelist specific onboarding routes that are meant to be revisited for editing profile details.

**Modified Logic:**
```typescript
    const inOnboarding = segments[0] === 'onboarding';
    
    // Allow revisiting specific onboarding screens for profile updates
    const isAllowedOnboardingRoute = 
      segments[1] === 'styles' || 
      segments[1] === 'loves' || 
      segments[1] === 'tone-analysis';

    if (!userProfile.onboardingComplete && !inOnboarding) {
      router.replace('/onboarding');
    } else if (userProfile.onboardingComplete && inOnboarding && !isAllowedOnboardingRoute) {
      router.replace('/(tabs)');
    }
```

## Verification / Regression Testing
To verify the fix and ensure no regressions:

1.  **Prerequisites**: Ensure you are logged in as a user who has completed onboarding.
2.  **Test Case 1: Color Profile**
    *   Navigate to the "Today" tab.
    *   Scroll to the "Style Identity" section.
    *   Click "Color Profile".
    *   **Expected**: Navigates to the Tone Analysis Result screen (`/onboarding/tone-analysis/result`).
    *   **Regression**: Should NOT redirect back to Today screen.
3.  **Test Case 2: Personal Style**
    *   Click "Personal Style".
    *   **Expected**: Navigates to the Style Selection screen (`/onboarding/styles`).
4.  **Test Case 3: Celebrate Your Body**
    *   Click "Celebrate Your Body".
    *   **Expected**: Navigates to the Body Loves screen (`/onboarding/loves`).
5.  **Test Case 4: General Onboarding Block**
    *   Try to manually navigate to `/onboarding/name` (if possible via deep link) or click "Back" until you reach a non-whitelisted screen.
    *   **Expected**: Should redirect to `/(tabs)` if the route is not in the whitelist.

## Notes for Future Development
If new screens are added to the `onboarding` flow that also need to be accessible from the main app (e.g., "Lifestyle"), they must be added to the `isAllowedOnboardingRoute` condition in `app/_layout.tsx`.
Alternatively, consider refactoring these shared screens into a separate `app/profile/` directory to avoid the `NavigationGuard` logic entirely.
