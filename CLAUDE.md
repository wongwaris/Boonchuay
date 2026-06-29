# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**FitEasy** — a React Native (Expo) fitness app for Android. Users complete a personalized onboarding questionnaire then receive a weekly workout plan.

## Commands

```bash
npm start             # Start Expo dev server (scan QR with Expo Go on phone)
npm run android       # Start on connected Android device / emulator
npx tsc --noEmit      # Type-check without building
eas build --platform android --profile preview   # Build APK for sideloading
```

No test runner is configured.

## Architecture

### Tech Stack
- **Expo SDK 52**, React Native 0.76
- **React Navigation** v6 (native-stack)
- **AsyncStorage** — persists `UserProfile` between sessions
- **react-native-svg** — body model diagram, longevity chart
- **expo-linear-gradient** — dark gradient backgrounds throughout

### Data Flow

`ProfileContext` (src/context/ProfileContext.tsx) is the single source of truth. It uses `useReducer` + `AsyncStorage` so profile data survives app restarts. Every onboarding screen reads from `profile` and calls `update(partialProfile)` on continue.

### Navigation Flow

All screens are in a flat `NativeStackNavigator` (no nested navigators). On first launch `initialRouteName` is `'Splash'`; after `onboardingComplete: true` is set it goes straight to `'Home'`.

```
Splash → Gender → Goal → FitnessLevel → TargetZones → Injuries →
WorkoutDuration → ScienceFact → Height → CurrentWeight → TargetWeight →
WaterIntake → HydrationReminder → DietStyle → TrainingDays →
TrainingTime → WorkoutLocation → Equipment → PlanGenerating → Home
```

To add new onboarding steps, add the screen name to `RootStackParamList` in `src/navigation/AppNavigator.tsx`, register it in the `Stack.Navigator`, and wire it into the chain.

### Key Components

| Component | Purpose |
|---|---|
| `OnboardingLayout` | Shared wrapper: progress bar, MY PROFILE header, back button, CONTINUE button |
| `OptionCard` | Selectable list item with icon, label, radio indicator |
| `ScrollPicker` | Drum-roll picker (height/weight). Uses `ScrollView` with `snapToInterval` |
| `BodyModelSVG` | SVG body outline + muscle overlays + label chips for zone selection |
| `LongevityChart` | SVG line chart on the science fact screen |

### Workout Generator (`src/utils/workoutGenerator.ts`)

`generateWorkoutPlan(profile)` returns `WorkoutDay[]` (7 days). Splits are defined per training-days count (3/4/5). Exercise pools are keyed by muscle group and location (`gym` / `home`). To add exercises, extend the `DB` object; to change weekly splits, edit `SPLITS`.

### Styling

- All colors in `src/theme/colors.ts` — dark navy background (`#0B1120`), blue accent (`#4A7CF7`)
- Every screen uses dark theme; `StatusBar` is `light`
- `StyleSheet.create` everywhere — no inline styles in shared components
- No global stylesheet — each component owns its styles

### UserProfile Shape

```typescript
{
  gender, goal, fitnessLevel, targetZones[], injuries[],
  workoutDuration, heightValue, heightUnit ('cm'|'ft'),
  currentWeightValue, currentWeightUnit ('kg'|'lbs'),
  targetWeightValue, targetWeightUnit,
  waterIntake, hydrationReminder, dietStyle,
  trainingDays (3|4|5), trainingTime, workoutLocation ('home'|'gym'),
  equipment[], onboardingComplete
}
```

Resetting onboarding: set `onboardingComplete: false` and navigate to `'Gender'`. The profile icon on HomeScreen does this.
