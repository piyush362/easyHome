# EasyHome — Development Phases (Revised)

> **Document Purpose**: This is the step-by-step implementation guide for building EasyHome.
> Each phase is self-contained. An AI agent or developer should be able to read ONE phase and execute it completely without needing to guess anything.
>
> **Read `brd_V01.md` first** — it contains the full product vision, user personas, and feature definitions referenced throughout this document.

---

## Project Context

| Key                     | Value                                               |
| ----------------------- | --------------------------------------------------- |
| **Product**             | EasyHome — Parent-friendly Android Launcher         |
| **Framework**           | React Native 0.87.1 (New Architecture / Fabric)     |
| **Language**            | TypeScript (React Native) + Kotlin (Android native) |
| **State**               | Redux Toolkit + react-redux                         |
| **Storage**             | react-native-mmkv                                   |
| **Navigation**          | @react-navigation/native + native-stack             |
| **Package Name**        | `com.easyhome`                                      |
| **Min SDK**             | 24                                                  |
| **Target SDK**          | 36                                                  |
| **Kotlin**              | 2.2.0                                               |
| **Android Native Path** | `android/app/src/main/java/com/easyhome/`           |
| **React Native Source** | `src/`                                              |

---

## Phase Dependencies

```
Phase 1  (Launcher Foundation)
  └─► Phase 2  (Folder Structure)
        └─► Phase 3  (Redux + MMKV Persistence)
              └─► Phase 4  (Navigation)
                    └─► Phase 5  (Design System)
                          └─► Phase 6  (Home Screen — mock data)
                                ├─► Phase 7  (App Discovery)
                                ├─► Phase 8  (Family & Contacts)
                                ├─► Phase 9  (Camera, Photos, Torch)
                                └─► Phase 10 (Family Setup Wizard)
                                      └─► Phase 11 (Personalization)
                                            └─► Phase 12 (Reminders)
                                                  └─► Phase 13 (Emergency & Location)
                                                        └─► Phase 14 (Protected Settings / PIN)
                                                              └─► Phase 15 (Battery & Weather)
                                                                    └─► Phase 16 (Final Integration)
                                                                          └─► Phase 17 (Testing & Hardening)
                                                                                └─► Phase 18 (Release Build)
```

> **Phases 7, 8, 9** can run in parallel after Phase 6 is complete.

---

## Phase 1 — Android Launcher Foundation

> **Status**: ✅ COMPLETED

### Goal

Make EasyHome recognized by Android as a Home/Launcher application. Prove it can be selected as the default launcher, respond to the Home button, and survive launcher switching.

### Prerequisites

- Working React Native 0.87 project that builds and runs on Android.

### Tasks

#### 1.1 AndroidManifest.xml — Launcher Intent Filters

**File**: `android/app/src/main/AndroidManifest.xml`

- Add `<category android:name="android.intent.category.HOME" />` to MainActivity's intent-filter.
- Add `<category android:name="android.intent.category.DEFAULT" />` to the same intent-filter.
- Keep `LAUNCHER` category so the app remains findable in the app drawer.
- Add `android:stateNotNeeded="true"` to the activity element (standard for launchers).
- Keep `android:launchMode="singleTask"` (already present).

#### 1.2 Kotlin Native Module — LauncherModule

**Create file**: `android/app/src/main/java/com/easyhome/launcher/LauncherModule.kt`

Expose two methods to React Native via `NativeModules.LauncherModule`:

| Method                          | Returns            | Behavior                                                                                                                                                                |
| ------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isDefaultLauncher()`           | `Promise<Boolean>` | API 29+: use `RoleManager.isRoleHeld(ROLE_HOME)`. Below API 29: resolve `ACTION_MAIN + CATEGORY_HOME` intent and compare package names.                                 |
| `openDefaultLauncherSettings()` | `Promise<Boolean>` | API 29+: `RoleManager.createRequestRoleIntent(ROLE_HOME)` → `startActivity()`. Below API 29: open `Settings.ACTION_HOME_SETTINGS` with fallback to HOME intent chooser. |

**Important**: Store the `ReactApplicationContext` as a `private val` in the constructor. Access `currentActivity` via `reactContext.currentActivity` (Kotlin 2.2 does not implicitly resolve inherited Java properties).

#### 1.3 Register the Native Module

**Create file**: `android/app/src/main/java/com/easyhome/launcher/LauncherPackage.kt`

- Implement `ReactPackage`.
- Return `LauncherModule` from `createNativeModules()`.
- Return empty list from `createViewManagers()`.

**Modify file**: `android/app/src/main/java/com/easyhome/MainApplication.kt`

- Import `com.easyhome.launcher.LauncherPackage`.
- Add `LauncherPackage()` inside the `packages.apply { }` block.

#### 1.4 Back Button Handling

**File**: `android/app/src/main/java/com/easyhome/MainActivity.kt`

- Override `onBackPressed()` with an empty body.
- Launchers must NOT exit when the user presses Back on the home screen.

#### 1.5 React Native — LauncherSetupScreen

**Create file**: `src/screens/LauncherSetupScreen.tsx`

Two states:

**State A — Not default launcher:**

```
EasyHome
A simpler phone for the people you love.

○
EasyHome is not your default launcher.

[ Set EasyHome as Default Launcher ]   ← calls LauncherModule.openDefaultLauncherSettings()
[ Open Launcher Settings ]              ← calls LauncherModule.openDefaultLauncherSettings()
```

**State B — Is default launcher:**

```
EasyHome
A simpler phone for the people you love.

✓
EasyHome is your default launcher.

[ Continue ]   ← navigates to MinimalHome screen
```

**Behavior**:

- On mount: call `LauncherModule.isDefaultLauncher()`.
- On `AppState` change to `'active'`: re-check launcher status (user may return from settings).
- Show `ActivityIndicator` while loading.

#### 1.6 React Native — MinimalHomeScreen

**Create file**: `src/screens/MinimalHomeScreen.tsx`

- Display live clock (12-hour format with AM/PM, updated every 1 second via `setInterval`).
- Display day and date (e.g., "Wednesday, August 27").
- Display "You are home" with 🏠 emoji.
- Display launcher status badge.
- This screen proves the launcher works when the Home button is pressed.

#### 1.7 App.tsx — Wire Navigation

**Modify file**: `App.tsx`

- Remove default React Native boilerplate.
- Use `NavigationContainer` + `createNativeStackNavigator`.
- Two screens: `LauncherSetup` (initial) → `MinimalHome`.
- `headerShown: false`, `animation: 'fade'`.

### Do NOT Implement

Family, Contacts, App discovery, Camera, Torch, Reminders, Emergency, Themes, Database, Final Home UI, Family Setup.

### Completion Criteria

- [ ] App builds successfully (`npx react-native run-android`).
- [ ] TypeScript compiles (`npx tsc --noEmit` exits with code 0).
- [ ] EasyHome appears in Android's Home app picker.
- [ ] Can be selected as default launcher.
- [ ] Home button returns to EasyHome (MinimalHomeScreen).
- [ ] Switching to another launcher works.
- [ ] Switching back to EasyHome works without crash.
- [ ] Back button does NOT exit the launcher.

---

## Phase 2 — Project Architecture & Folder Structure

> **Status**: ✅ COMPLETED

### Goal

Reorganize `src/` into a scalable, layered folder structure BEFORE building features. Move Phase 1 files into the new structure. No new features are added.

### Prerequisites

- Phase 1 completed and working.

### Tasks

#### 2.1 Create React Native Directory Structure

Create the following directories under `src/`. Each directory gets an `index.ts` barrel file for clean imports.

```
src/
├── app/                  # App-level setup (providers, root component)
├── components/           # Reusable UI components
│   ├── common/           # Generic: Text, Button, Card, Avatar, etc.
│   ├── buttons/          # Specialized button components
│   ├── cards/            # Card variants
│   ├── forms/            # Form inputs, pickers
│   └── feedback/         # Loaders, toasts, modals
├── screens/              # Feature screens grouped by area
│   ├── home/             # Parent home screen
│   ├── family/           # Family contacts screens
│   ├── apps/             # App listing screens
│   ├── setup/            # Family Setup wizard screens
│   ├── reminders/        # Reminder management screens
│   ├── settings/         # Settings and personalization screens
│   └── safety/           # Emergency and help screens
├── navigation/           # Navigator definitions and types
├── store/                # Redux store, slices, typed hooks
├── database/             # MMKV storage layer (repositories)
├── services/             # Service abstractions for native modules
├── native/               # TypeScript interfaces for native modules
├── theme/                # Design tokens, theme provider
├── types/                # Shared TypeScript type definitions
└── utils/                # Helper functions and utilities
```

#### 2.2 Create Android Native Directory Structure

Create subdirectories under `android/app/src/main/java/com/easyhome/`:

```
easyhome/
├── launcher/             # Already exists from Phase 1
├── modules/              # Shared native module utilities
├── apps/                 # App discovery module (Phase 7)
├── contacts/             # Contacts module (Phase 8)
├── camera/               # Camera module (Phase 9)
├── torch/                # Torch module (Phase 9)
├── battery/              # Battery module (Phase 15)
├── reminders/            # Reminder scheduling module (Phase 12)
└── emergency/            # Emergency module (Phase 13)
```

#### 2.3 Move Phase 1 Files Into New Structure

- Move `src/screens/LauncherSetupScreen.tsx` → `src/screens/setup/LauncherSetupScreen.tsx`
- Move `src/screens/MinimalHomeScreen.tsx` → `src/screens/home/MinimalHomeScreen.tsx`
- Update imports in `App.tsx`.

#### 2.4 Create Architecture Rules File

**Create file**: `src/ARCHITECTURE.md`
Document these rules:

1. UI components must not call native modules directly — use services.
2. Services abstract native module calls behind TypeScript interfaces.
3. Redux slices must not import MMKV directly — use repository files.
4. Each screen folder is self-contained with its own components if needed.
5. Shared types live in `src/types/`.
6. No circular dependencies between directories.

### Do NOT Implement

No new features. No Redux slices. No new native modules. Only restructure files.

### Completion Criteria

- [x] All directories exist with barrel `index.ts` files.
- [x] Phase 1 screens are in their new locations.
- [x] App builds successfully.
- [x] TypeScript compiles.
- [x] Launcher functionality still works exactly as before.

---

## Phase 3 — Redux Toolkit & Local Persistence (MMKV)

> **Status**: ✅ COMPLETED

### Goal

Create the central state management layer (Redux) and persistence layer (MMKV). After this phase, the app can store, retrieve, and persist all configuration data across restarts.

### Prerequisites

- Phase 2 completed. Folder structure exists.
- Already installed: `@reduxjs/toolkit`, `react-redux`, `react-native-mmkv`.

### Tasks

#### 3.1 TypeScript Models

**Create in** `src/types/models.ts`:

```typescript
interface Parent {
  id: string;
  name: string;
  photo: string | null; // URI or null
}

interface FamilyMember {
  id: string;
  name: string;
  relationship: string; // "Daughter", "Son", "Wife", etc.
  phoneNumber: string;
  photo: string | null;
  preferredCommunication: 'call' | 'whatsapp' | 'video' | 'message';
}

interface InstalledApp {
  packageName: string;
  appName: string;
  icon: string | null; // Base64 or URI
  isImportant: boolean;
}

interface HomeAction {
  id: string;
  type:
    | 'call'
    | 'whatsapp'
    | 'camera'
    | 'selfie'
    | 'video'
    | 'youtube'
    | 'instagram'
    | 'photos'
    | 'torch'
    | 'reminder'
    | 'help'
    | 'app';
  label: string;
  enabled: boolean;
  order: number;
}

interface Reminder {
  id: string;
  type: 'medicine' | 'doctor' | 'water' | 'exercise' | 'event' | 'family';
  title: string;
  description: string;
  time: string; // ISO 8601
  recurring: boolean;
  recurringPattern: 'daily' | 'weekly' | 'monthly' | null;
  enabled: boolean;
}

interface AppearanceSettings {
  theme: 'ocean' | 'green' | 'rose' | 'warm' | 'blue' | 'dark';
  textSize: 'large' | 'extraLarge';
  iconSize: 'large' | 'extraLarge';
  buttonSize: 'large' | 'extraLarge';
  appearance: 'light' | 'dark';
}

interface SafetySettings {
  emergencyContactId: string | null;
  emergencyNumber: string;
  locationSharingEnabled: boolean;
  familyPIN: string | null; // Hashed, never stored plain
  settingsProtected: boolean;
}

interface LauncherSettings {
  isDefaultLauncher: boolean;
  setupCompleted: boolean;
  setupStep: number; // 0–8 for wizard progress
}
```

#### 3.2 Redux Store Setup

**Create file**: `src/store/store.ts`

- Configure store with `configureStore()`.
- Combine all slices.
- Export typed `RootState`, `AppDispatch`.

**Create file**: `src/store/hooks.ts`

- Export `useAppSelector` (typed `useSelector`).
- Export `useAppDispatch` (typed `useDispatch`).

#### 3.3 Redux Slices

Create one file per slice in `src/store/slices/`:

| File               | Slice Name  | State Shape                           | Key Actions                                                                |
| ------------------ | ----------- | ------------------------------------- | -------------------------------------------------------------------------- |
| `appSlice.ts`      | `app`       | `{ isLoading, isInitialized, error }` | `setLoading`, `setInitialized`, `setError`                                 |
| `parentSlice.ts`   | `parent`    | `Parent \| null`                      | `setParent`, `updateParent`, `clearParent`                                 |
| `familySlice.ts`   | `family`    | `FamilyMember[]`                      | `addMember`, `updateMember`, `removeMember`, `setMembers`                  |
| `homeSlice.ts`     | `home`      | `{ actions: HomeAction[] }`           | `setActions`, `updateAction`, `reorderActions`                             |
| `settingsSlice.ts` | `settings`  | `AppearanceSettings`                  | `setTheme`, `setTextSize`, `setIconSize`, `setButtonSize`, `setAppearance` |
| `reminderSlice.ts` | `reminders` | `Reminder[]`                          | `addReminder`, `updateReminder`, `removeReminder`, `setReminders`          |
| `launcherSlice.ts` | `launcher`  | `LauncherSettings`                    | `setIsDefault`, `setSetupCompleted`, `setSetupStep`                        |
| `safetySlice.ts`   | `safety`    | `SafetySettings`                      | `setEmergencyContact`, `setPIN`, `setProtected`                            |

#### 3.4 MMKV Storage Layer

**Create file**: `src/database/storage.ts`

- Initialize a single MMKV instance with ID `'easyhome-storage'`.
- Export typed read/write helpers.

**Create file**: `src/database/repository.ts`

- One function per data domain: `saveParent()`, `loadParent()`, `saveFamily()`, `loadFamily()`, etc.
- All MMKV access goes through this file. No other file imports MMKV directly.

**Data flow**:

```
React Component → useAppDispatch() → Redux Slice → Repository → MMKV
MMKV → Repository → Redux (on app startup restore)
```

#### 3.5 Wrap App with Redux Provider

**Modify file**: `App.tsx`

- Wrap `NavigationContainer` with `<Provider store={store}>`.
- On app mount, call a `restoreState()` thunk that loads all persisted data from MMKV into Redux.

### Do NOT Implement

No UI changes. No new screens. No native modules. Only state and persistence.

### Completion Criteria

- [x] Redux store is configured and typed.
- [x] All slices exist with their actions and reducers.
- [x] MMKV storage layer works (write → restart → read).
- [x] App restores persisted state on startup.
- [x] TypeScript compiles.
- [x] App builds and runs.
- [x] Launcher still works.

---

## Phase 4 — Navigation Architecture

> **Status**: ✅ COMPLETED

### Goal

Create the complete navigation structure for the entire app. After this phase, every screen area has a route — even if the screen is a placeholder.

### Prerequisites

- Phase 3 completed. Redux store exists.
- Already installed: `@react-navigation/native`, `@react-navigation/native-stack`, `react-native-screens`, `react-native-safe-area-context`.

### Tasks

#### 4.1 Navigation Type Definitions

**Create file**: `src/navigation/types.ts`

```typescript
export type RootStackParamList = {
  LauncherSetup: undefined;
  Home: undefined;
  Family: undefined;
  Apps: undefined;
  Settings: undefined;
  FamilySetup: undefined;
};

export type FamilySetupStackParamList = {
  Welcome: undefined;
  ParentProfile: undefined;
  FamilyMembers: undefined;
  ImportantApps: undefined;
  Appearance: undefined;
  Reminders: undefined;
  Safety: undefined;
  Review: undefined;
  Complete: undefined;
};
```

#### 4.2 Root Navigator

**Create file**: `src/navigation/RootNavigator.tsx`

- Stack navigator with screens: `LauncherSetup`, `Home`, `Family`, `Apps`, `Settings`, `FamilySetup`.
- `headerShown: false` globally.
- Initial route depends on Redux state:
  - If `launcher.setupCompleted === false` → `LauncherSetup`.
  - If `launcher.isDefaultLauncher && launcher.setupCompleted` → `Home`.

#### 4.3 Family Setup Navigator

**Create file**: `src/navigation/FamilySetupNavigator.tsx`

- Nested stack navigator for the setup wizard.
- Screens: Welcome → ParentProfile → FamilyMembers → ImportantApps → Appearance → Reminders → Safety → Review → Complete.
- Show a progress indicator (step X of 8).
- Allow back navigation (previous step).

#### 4.4 Placeholder Screens

For any screen that doesn't exist yet, create a simple placeholder:

- Screen name centered on screen.
- "Coming in Phase X" subtitle.
- Place in the appropriate `src/screens/` subfolder.

#### 4.5 Update App.tsx

- Replace inline navigation with `RootNavigator`.
- Navigation state is driven by Redux `launcher` slice.

### Do NOT Implement

No actual screen content beyond placeholders. No forms. No data entry.

### Completion Criteria

- [x] Every route in `RootStackParamList` and `FamilySetupStackParamList` renders a screen.
- [x] Navigation between screens works.
- [x] Back button behavior is correct (blocked on Home, works in setup wizard).
- [x] TypeScript compiles.
- [x] App builds and runs.

---

## Phase 5 — EasyHome Design System

> **Status**: ✅ COMPLETED

### Goal

Create all reusable UI components and design tokens. After this phase, every screen built in later phases uses consistent styling from a central theme.

### Prerequisites

- Phase 4 completed. Navigation exists.

### Tasks

#### 5.1 Design Tokens

**Create file**: `src/theme/tokens.ts`

Define all values as TypeScript constants:

| Token Category     | Values to Define                                                                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Colors**         | Primary, secondary, background, surface, text (primary/secondary/muted), success, error, warning, border, shadow — for EACH theme (ocean, green, rose, warm, blue, dark) |
| **Typography**     | Font sizes for `large` and `extraLarge` modes: heading1, heading2, body, caption, button                                                                                 |
| **Spacing**        | xs (4), sm (8), md (16), lg (24), xl (32), xxl (48)                                                                                                                      |
| **Border Radius**  | sm (8), md (12), lg (16), xl (24), round (9999)                                                                                                                          |
| **Elevation**      | low (2), medium (4), high (8) — with corresponding shadow styles                                                                                                         |
| **Touch Targets**  | Minimum 48px. Large: 56px. Extra Large: 64px.                                                                                                                            |
| **Icon Sizes**     | large (32), extraLarge (44)                                                                                                                                              |
| **Button Heights** | large (56), extraLarge (68)                                                                                                                                              |

#### 5.2 Theme Provider

**Create file**: `src/theme/ThemeProvider.tsx`

- React Context that reads `settings.theme`, `settings.textSize`, `settings.iconSize`, `settings.buttonSize`, `settings.appearance` from Redux.
- Provides resolved design tokens to all child components via `useTheme()` hook.
- When Redux settings change, all components re-render with new values.

**Create file**: `src/theme/useTheme.ts`

- Hook that returns the current resolved theme object.

#### 5.3 Reusable Components

Create in `src/components/common/`:

| Component       | Props                                                                                                               | Purpose                                                            |
| --------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `EHText`        | `variant` (heading1/heading2/body/caption/button), `color?`, `align?`, `children`                                   | All text rendering. Uses theme typography. Never use raw `<Text>`. |
| `EHButton`      | `label`, `onPress`, `variant` (primary/secondary/outline/ghost), `size?` (auto from theme), `disabled?`, `loading?` | All buttons. Uses theme button sizes and colors.                   |
| `EHIconButton`  | `icon` (emoji or component), `label`, `onPress`, `size?`                                                            | Icon-based action buttons (for home screen actions).               |
| `EHCard`        | `children`, `onPress?`, `elevation?`                                                                                | Container card with rounded corners and shadow.                    |
| `EHAvatar`      | `source` (URI or null), `name`, `size?`                                                                             | Profile photos with fallback to initials.                          |
| `EHListItem`    | `title`, `subtitle?`, `left?`, `right?`, `onPress?`                                                                 | Standard list row.                                                 |
| `EHSection`     | `title`, `children`                                                                                                 | Section container with a header.                                   |
| `EHModal`       | `visible`, `onClose`, `title`, `children`                                                                           | Centered modal dialog.                                             |
| `EHBottomSheet` | `visible`, `onClose`, `children`                                                                                    | Bottom slide-up sheet.                                             |
| `EHSwitch`      | `value`, `onValueChange`, `label`                                                                                   | Labeled toggle switch.                                             |

Every component reads sizes/colors from `useTheme()`. No hardcoded dimensions.

#### 5.4 Component Showcase Screen

**Create file**: `src/screens/settings/ComponentShowcaseScreen.tsx`

- A development-only screen (removed in Phase 18).
- Renders every component in every variant and size.
- Useful for visual testing.

### Do NOT Implement

No actual feature screens. No data integration. Showcase screen only.

### Completion Criteria

- [x] All 10 components exist and render correctly.
- [x] Changing theme in Redux updates all component colors.
- [x] Changing text/icon/button size in Redux updates all component dimensions.
- [x] Showcase screen displays all components.
- [x] TypeScript compiles.
- [x] App builds and runs.

---

## Phase 6 — Parent Home Screen

> **Status**: ✅ COMPLETED

### Goal

Build the complete visual Home screen layout. Uses **mock data** — no native functionality yet. This is the screen the parent sees every day.

### Prerequisites

- Phase 5 completed. Design system and all components exist.

### Tasks

#### 6.1 Home Screen Layout

**Create file**: `src/screens/home/HomeScreen.tsx`

The Home screen is a vertical `ScrollView` with these sections (top to bottom):

| Section           | Content                                                                                                                                              | Data Source                                                    |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Clock**         | Large time (e.g., "10:42 AM"), day, date                                                                                                             | `new Date()` — live updating                                   |
| **Weather**       | Icon + temperature + condition (e.g., "☀️ 29°C Sunny")                                                                                               | Mock: hardcoded `{ temp: 29, condition: 'Sunny', icon: '☀️' }` |
| **Family**        | Horizontal scrollable row of family contact cards. Each card: photo/avatar, name, relationship. Tap → bottom sheet with Call/WhatsApp/Video options. | Mock: 3–4 `FamilyMember` objects from Redux                    |
| **Communication** | Large "WhatsApp" button                                                                                                                              | Mock: opens nothing, logs to console                           |
| **Camera**        | Three side-by-side buttons: 📸 Photo, 🤳 Selfie, 🎥 Video                                                                                            | Mock: logs to console                                          |
| **Entertainment** | Two buttons: ▶️ YouTube, 📷 Instagram, 🖼️ Photos                                                                                                     | Mock: logs to console                                          |
| **Utilities**     | 🔦 Torch toggle, 💊 Reminder (shows "Next: 1:00 PM")                                                                                                 | Mock                                                           |
| **Safety**        | 🆘 Help button (prominent, with confirmation intent)                                                                                                 | Mock                                                           |

#### 6.2 Requirements

- Use `EHText`, `EHButton`, `EHIconButton`, `EHCard`, `EHAvatar` from the design system.
- Read family members from Redux `family` slice.
- Read appearance settings from Redux `settings` slice.
- Layout must be responsive to `textSize` and `iconSize` changes.
- Keep the interface calm and uncluttered — generous spacing, no visual noise.
- Populate Redux with mock data on app startup (in a `loadMockData()` function) until real data is implemented.

#### 6.3 Replace MinimalHomeScreen

- Update navigation to use `HomeScreen` instead of `MinimalHomeScreen`.
- `MinimalHomeScreen` can be deleted.

### Do NOT Implement

No actual native calls (camera, torch, app launching). No real weather API. No real contacts. All actions log to console.

### Completion Criteria

- [x] Home screen renders all sections with mock data.
- [x] Changing theme/text size/icon size updates the Home screen.
- [x] Family cards show photos, names, relationships.
- [x] Tapping a family card shows a communication bottom sheet.
- [x] All action buttons are tappable (log to console).
- [x] Layout is clean and calm.
- [x] TypeScript compiles. App builds and runs.

---

## Phase 7 — Android App Discovery & Launching

### Goal

Allow EasyHome to discover all installed apps on the device and launch them. Separate "Important Apps" from "All Apps".

### Prerequisites

- Phase 6 completed. Home screen exists.

### Tasks

#### 7.1 Kotlin Native Module — AppDiscoveryModule

**Create file**: `android/app/src/main/java/com/easyhome/apps/AppDiscoveryModule.kt`

| Method                        | Returns            | Behavior                                                                                                                                                       |
| ----------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getInstalledApps()`          | `Promise<Array>`   | Query `PackageManager` for all launchable apps. Return array of `{ packageName, appName, icon }`. Icon = Base64 encoded PNG from `applicationInfo.loadIcon()`. |
| `isAppInstalled(packageName)` | `Promise<Boolean>` | Check if a package exists.                                                                                                                                     |
| `launchApp(packageName)`      | `Promise<Boolean>` | Get launch intent from `PackageManager`, call `startActivity()`. Reject if app not found.                                                                      |

**Create file**: `android/app/src/main/java/com/easyhome/apps/AppDiscoveryPackage.kt`

- Register `AppDiscoveryModule`.

**Modify**: `MainApplication.kt` — add `AppDiscoveryPackage()`.

#### 7.2 React Native Service Layer

**Create file**: `src/services/AppsService.ts`

- TypeScript wrapper around `NativeModules.AppDiscoveryModule`.
- Methods: `getInstalledApps()`, `isAppInstalled()`, `launchApp()`.

#### 7.3 Redux Integration

- Update `InstalledApp` type if needed.
- Add apps to Redux store via the existing `homeSlice` or a new `appsSlice`.
- Distinguish `isImportant: true` apps from all apps.

#### 7.4 Screens

**Create file**: `src/screens/apps/ImportantAppsScreen.tsx`

- Grid of "important" apps (large icons, clear labels).
- Tap to launch.

**Create file**: `src/screens/apps/AllAppsScreen.tsx`

- Scrollable list/grid of ALL installed apps.
- Search/filter capability.
- Tap to launch.

### Completion Criteria

- [ ] EasyHome discovers all installed apps on the device.
- [ ] Apps display with name and icon.
- [ ] Tapping an app launches it.
- [ ] Important vs All Apps distinction works.
- [ ] Handles uninstalled/unavailable apps gracefully.
- [ ] TypeScript compiles. App builds and runs.

---

## Phase 8 — Family & Contacts

> **Status**: ✅ COMPLETED

### Goal

Implement the family contacts system. Family members appear on the Home screen and can be called, messaged, or WhatsApp'd directly.

### Prerequisites

- Phase 6 completed. Home screen exists.

### Tasks

#### 8.1 Kotlin Native Module — ContactsModule

**Create file**: `android/app/src/main/java/com/easyhome/contacts/ContactsModule.kt`

| Method                      | Returns            | Behavior                                                                   |
| --------------------------- | ------------------ | -------------------------------------------------------------------------- |
| `requestPermission()`       | `Promise<Boolean>` | Request `READ_CONTACTS` runtime permission.                                |
| `getContacts()`             | `Promise<Array>`   | Read contacts: name, phone numbers, photo URI.                             |
| `makeCall(phoneNumber)`     | `Promise<Boolean>` | Fire `ACTION_CALL` intent (requires `CALL_PHONE` permission).              |
| `openWhatsApp(phoneNumber)` | `Promise<Boolean>` | Fire WhatsApp intent with the phone number. Handle WhatsApp not installed. |
| `sendMessage(phoneNumber)`  | `Promise<Boolean>` | Fire `ACTION_SENDTO` SMS intent.                                           |

Register package, update `MainApplication.kt`.

#### 8.2 Family Management Screens

**Create file**: `src/screens/family/FamilyListScreen.tsx` — List of configured family members.
**Create file**: `src/screens/family/AddFamilyMemberScreen.tsx` — Pick from contacts, set relationship, photo, preferred communication.
**Create file**: `src/screens/family/EditFamilyMemberScreen.tsx` — Edit existing member.

#### 8.3 Home Screen Integration

- Replace mock family data with real Redux data.
- Tapping a family card → bottom sheet → Call / WhatsApp / Message actions that invoke real native methods.

#### 8.4 Persistence

- Save/restore family members via MMKV repository.

### Completion Criteria

- [x] Can pick contacts from the device.
- [x] Can add/edit/remove family members.
- [x] Family members appear on the Home screen.
- [x] Tapping a family member → can call them.
- [x] WhatsApp action works (if WhatsApp installed).
- [x] Data persists across app restarts.
- [x] Handles contacts permission denial gracefully.

---

## Phase 9 — Camera, Photos & Torch

> **Status**: ✅ COMPLETED

### Goal

Make the three camera actions (Photo, Selfie, Video), the Photos/Gallery action, and the Torch toggle functional.

### Prerequisites

- Phase 6 completed. Home screen exists with mock camera/torch buttons.

### Tasks

#### 9.1 Camera

Use `react-native-image-picker` (already installed).

**Create file**: `src/services/CameraService.ts`

| Function        | Behavior                                                                                    |
| --------------- | ------------------------------------------------------------------------------------------- |
| `takePhoto()`   | Open camera in photo mode via `launchCamera({ mediaType: 'photo', cameraType: 'back' })`.   |
| `takeSelfie()`  | Open camera in selfie mode via `launchCamera({ mediaType: 'photo', cameraType: 'front' })`. |
| `recordVideo()` | Open camera in video mode via `launchCamera({ mediaType: 'video', cameraType: 'back' })`.   |

#### 9.2 Photos/Gallery

**Create file**: `src/services/GalleryService.ts`

- `openGallery()` — use `launchImageLibrary()` from `react-native-image-picker` or launch the device's gallery app via `AppDiscoveryModule.launchApp('com.google.android.apps.photos')` with fallback.

#### 9.3 Kotlin Torch Module

**Create file**: `android/app/src/main/java/com/easyhome/torch/TorchModule.kt`

| Method          | Returns            | Behavior                                                               |
| --------------- | ------------------ | ---------------------------------------------------------------------- |
| `turnOn()`      | `Promise<Boolean>` | Use `CameraManager.setTorchMode(cameraId, true)`.                      |
| `turnOff()`     | `Promise<Boolean>` | Use `CameraManager.setTorchMode(cameraId, false)`.                     |
| `isAvailable()` | `Promise<Boolean>` | Check `context.packageManager.hasSystemFeature(FEATURE_CAMERA_FLASH)`. |

Register package, update `MainApplication.kt`.

**Create file**: `src/services/TorchService.ts` — TypeScript wrapper.

#### 9.4 Home Screen Integration

- Connect Photo, Selfie, Video buttons to `CameraService`.
- Connect Photos button to `GalleryService`.
- Connect Torch button to `TorchService` (toggle on/off with state).

### Completion Criteria

- [x] 📸 Photo opens back camera, takes photo.
- [x] 🤳 Selfie opens front camera, takes photo.
- [x] 🎥 Video opens camera in video mode.
- [x] 🖼️ Photos opens gallery.
- [x] 🔦 Torch turns on/off.
- [x] Handles missing camera/flash hardware gracefully.

---

## Phase 10 — Family Setup Wizard

### Goal

Build the complete setup wizard that a child/caregiver walks through to configure the parent's phone.

### Prerequisites

- Phase 8 (Family), Phase 7 (Apps), Phase 5 (Design System) completed.

### Tasks

#### 10.1 Wizard Flow

8 screens, in order:

| Step | Screen            | What It Configures                                                                  |
| ---- | ----------------- | ----------------------------------------------------------------------------------- |
| 1    | Welcome           | Explains EasyHome. "Set up for your parent" message.                                |
| 2    | ParentProfile     | Parent's name + profile photo (from camera or gallery).                             |
| 3    | FamilyMembers     | Add family members from contacts. Set relationships.                                |
| 4    | ImportantApps     | Select which installed apps appear on the home screen.                              |
| 5    | Appearance        | Choose theme (ocean/green/rose/warm/blue/dark), text size, icon size. Live preview. |
| 6    | Reminders         | Add medicine/doctor/water/exercise reminders with times.                            |
| 7    | Safety            | Set emergency contact, emergency number.                                            |
| 8    | Review → Complete | Summary of all settings. "Start EasyHome" button.                                   |

#### 10.2 Requirements

- Progress bar showing step X of 8.
- Each step saves to Redux + MMKV immediately (if user force-quits, progress is saved).
- Back button navigates to previous step.
- Final step marks `launcher.setupCompleted = true` in Redux and navigates to Home.
- If the app detects an incomplete setup on startup, resume from the last incomplete step.

### Completion Criteria

- [ ] Fresh install → opens setup wizard.
- [ ] Can complete all 8 steps.
- [ ] Data persists if app is killed mid-setup.
- [ ] After completion, Home screen shows configured data.
- [ ] Re-running setup (from settings) works.

---

## Phase 11 — Personalization System

### Goal

Make theme, text size, icon size, button size, and light/dark mode dynamically configurable. Changing any setting updates the entire UI instantly.

### Prerequisites

- Phase 5 (Design System) and Phase 10 (Setup Wizard — Appearance step) completed.

### Tasks

#### 11.1 Theme Definitions

In `src/theme/tokens.ts`, define complete color palettes for each theme:

- **Ocean** — Blue tones, calm feel.
- **Green** — Nature tones, fresh feel.
- **Rose** — Pink/warm tones, soft feel.
- **Warm** — Orange/amber tones, cozy feel.
- **Blue** — Standard blue, trustworthy feel.
- **Dark** — Dark background, light text.

#### 11.2 Settings Screen

**Create file**: `src/screens/settings/AppearanceSettingsScreen.tsx`

- Theme picker (visual swatches with theme names).
- Text size toggle: Large / Extra Large.
- Icon size toggle: Large / Extra Large.
- Button size toggle: Large / Extra Large.
- Light / Dark appearance toggle.
- Each change dispatches to Redux → persists to MMKV → ThemeProvider re-renders.

#### 11.3 Verify Full Integration

- Ensure ALL design system components respond to theme changes.
- Ensure Home screen, Family screens, Setup wizard all update.

### Completion Criteria

- [ ] Switching theme changes all colors across the app.
- [ ] Switching text size changes all text sizes.
- [ ] Switching icon/button size changes all icon/button dimensions.
- [ ] Dark mode works.
- [ ] Settings persist across restarts.

---

## Phase 12 — Reminder System

### Goal

Build a reliable local reminder system with Android-native scheduling and notifications.

### Prerequisites

- Phase 6 (Home Screen) and Phase 3 (Redux/MMKV) completed.

### Tasks

#### 12.1 Kotlin Reminder Module

**Create file**: `android/app/src/main/java/com/easyhome/reminders/ReminderModule.kt`

| Method                                                                 | Behavior                                                                                                            |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `scheduleReminder(id, title, message, timeMillis, recurring, pattern)` | Use `AlarmManager.setExactAndAllowWhileIdle()` to schedule. Create a `BroadcastReceiver` that fires a notification. |
| `cancelReminder(id)`                                                   | Cancel the scheduled alarm.                                                                                         |
| `createNotificationChannel()`                                          | Create an Android notification channel named "EasyHome Reminders" with high importance.                             |
| `requestNotificationPermission()`                                      | Request `POST_NOTIFICATIONS` permission (API 33+).                                                                  |

**Create file**: `android/app/src/main/java/com/easyhome/reminders/ReminderReceiver.kt`

- `BroadcastReceiver` that shows the notification when alarm fires.

**Create file**: `android/app/src/main/java/com/easyhome/reminders/BootReceiver.kt`

- `BroadcastReceiver` for `BOOT_COMPLETED` — reschedule all reminders after device reboot.

Register in `AndroidManifest.xml`: receivers, permissions (`SCHEDULE_EXACT_ALARM`, `RECEIVE_BOOT_COMPLETED`).

#### 12.2 React Native Screens

**Create file**: `src/screens/reminders/ReminderListScreen.tsx` — List all reminders.
**Create file**: `src/screens/reminders/AddReminderScreen.tsx` — Add new reminder (type, title, time, recurring).
**Create file**: `src/screens/reminders/EditReminderScreen.tsx` — Edit existing.

#### 12.3 Home Screen Integration

- Home screen shows next upcoming reminder (e.g., "💊 Medicine — Next: 1:00 PM").

### Completion Criteria

- [ ] Can create one-time and recurring reminders.
- [ ] Reminder notification fires at the correct time, even when app is closed.
- [ ] Reminders survive device reboot.
- [ ] Home screen shows next reminder.
- [ ] Notification is clear: "💊 Medicine Reminder — It is time for your scheduled medicine."

---

## Phase 13 — Emergency, Help & Location

### Goal

Implement the 🆘 Help functionality with protection against accidental activation.

### Prerequisites

- Phase 8 (Family & Contacts) completed.

### Tasks

#### 13.1 Help Screen

**Create file**: `src/screens/safety/HelpScreen.tsx`

Flow:

```
User taps 🆘 HELP
    → Confirmation screen: "Are you sure you need help?"
        → [Call Family] → calls emergency contact
        → [Call Emergency] → calls emergency number
        → [Share Location] → shares current GPS coordinates
        → [Cancel] → returns to Home
```

**Must require deliberate confirmation** — no single-tap emergency actions.

#### 13.2 Location Module

**Create file**: `android/app/src/main/java/com/easyhome/emergency/LocationModule.kt`

| Method                       | Behavior                                                             |
| ---------------------------- | -------------------------------------------------------------------- |
| `requestPermission()`        | Request `ACCESS_FINE_LOCATION`.                                      |
| `getCurrentLocation()`       | Use `FusedLocationProviderClient`. Return `{ latitude, longitude }`. |
| `shareLocation(phoneNumber)` | Send SMS with Google Maps link containing coordinates.               |

#### 13.3 Home Screen Integration

- 🆘 Help button on Home navigates to HelpScreen.

### Completion Criteria

- [ ] Help button → confirmation → action (call/location).
- [ ] Cannot accidentally trigger emergency call.
- [ ] Location sharing sends SMS with map link.
- [ ] Handles permission denial gracefully.

---

## Phase 14 — Protected Settings & Family PIN

### Goal

Prevent the parent from accidentally changing important settings. Sensitive configuration requires a 4-digit Family PIN.

### Prerequisites

- Phase 10 (Setup Wizard) completed.

### Tasks

#### 14.1 PIN Setup

- During Family Setup (step 7 — Safety), the child sets a 4-digit PIN.
- Store PIN hash (not plaintext) using `crypto` or a simple hash in MMKV.

#### 14.2 PIN Verification Screen

**Create file**: `src/screens/settings/PINScreen.tsx`

- Large number pad, 4 dots for PIN entry.
- Incorrect PIN → shake animation + "Incorrect PIN" message.
- 5 failed attempts → 30-second lockout.

#### 14.3 Protected Screens

Before navigating to any of these, show the PIN screen:

- Family Settings (add/edit/remove members).
- App Settings (change important apps).
- Appearance Settings (change theme/sizes).
- Safety Settings (change emergency contact).
- Full Settings screen.

### Completion Criteria

- [ ] PIN is required to access protected settings.
- [ ] Incorrect PIN shows error.
- [ ] Lockout after 5 failures.
- [ ] Parent can use Home, make calls, use camera — without PIN.
- [ ] PIN persists across restarts.

---

## Phase 15 — Battery & Weather

### Goal

Show battery status and weather information on the Home screen.

### Prerequisites

- Phase 6 (Home Screen) completed.

### Tasks

#### 15.1 Battery Module

**Create file**: `android/app/src/main/java/com/easyhome/battery/BatteryModule.kt`

| Method              | Behavior                                               |
| ------------------- | ------------------------------------------------------ |
| `getBatteryLevel()` | Read from `BatteryManager`. Return percentage (0–100). |
| `isCharging()`      | Check charging status. Return boolean.                 |

**Home screen integration**: Show "🔋 78%" badge. When below 20%: "Battery is low. Please connect your charger."

#### 15.2 Weather Service

**Create file**: `src/services/WeatherService.ts`

- Call a free weather API (e.g., OpenWeatherMap or Open-Meteo).
- Input: latitude/longitude (from location permission, or a default city).
- Output: `{ temperature, condition, icon }`.
- Cache result for 30 minutes.
- Handle: loading, error, offline states.

**Home screen integration**: Replace mock weather with real data. Show "☀️ 29°C Sunny".

### Completion Criteria

- [ ] Battery percentage shown on Home screen.
- [ ] Low battery warning appears below 20%.
- [ ] Weather shows real data (or graceful fallback).
- [ ] Weather handles offline state.

---

## Phase 16 — Final Launcher Integration

### Goal

Connect ALL real data and remove ALL mock data. This is the "glue" phase.

### Prerequisites

- ALL phases 1–15 completed.

### Tasks

#### 16.1 Connect Everything

- Home screen reads real family, apps, reminders, weather, battery from Redux.
- All actions (call, WhatsApp, camera, torch, app launch, help) invoke real native modules.
- Remove `loadMockData()` and any hardcoded test data.

#### 16.2 Launcher Lifecycle

Test and fix:

- Returning from external apps (camera, WhatsApp, YouTube) → EasyHome Home.
- Home button always returns to Home screen.
- Back button on Home does nothing.
- Recent Apps shows EasyHome.
- Switching default launcher and switching back.
- Missing/uninstalled apps → show message instead of crash.
- Permission denied at any point → graceful fallback.

#### 16.3 Navigation Polish

- First launch → Setup Wizard → Home.
- Subsequent launches → straight to Home.
- Settings accessible from Home (gear icon or swipe).

### Completion Criteria

- [ ] Zero mock data remaining.
- [ ] Every Home screen action works with real native functionality.
- [ ] Complete parent journey works: unlock → see time/family → call daughter → take selfie → check reminder.
- [ ] No crashes during normal use.

---

## Phase 17 — Testing & Hardening

### Goal

Systematically test every feature and fix all issues before release.

### Prerequisites

- Phase 16 completed. Full integration done.

### Tasks

#### 17.1 Test Matrix

Run each test. Log pass/fail:

**Launcher Tests**: Install, uninstall, reinstall, set default, switch launcher, switch back, reboot, Home button, Back button, Recent Apps, launch external app, return to EasyHome.

**Permission Tests**: Contacts denied, Camera denied, Notifications denied, Location denied, permissions revoked after initial grant.

**Data Tests**: Fresh install, app restart, device reboot, MMKV persistence, incomplete setup resume, corrupt/missing data, app upgrade.

**Feature Tests**: Family contacts, app launching, camera (photo/selfie/video), torch, photos, reminders, notifications, emergency, location, PIN protection, all 6 themes, Large/Extra Large UI modes.

**Device Tests**: Test on at least 2 different Android versions (API 29 and API 34+), 2 different screen sizes.

#### 17.2 Fix All Failures

For each failing test, fix the issue and re-test.

### Completion Criteria

- [ ] No critical crashes.
- [ ] No broken launcher lifecycle.
- [ ] No data loss.
- [ ] No permission failures that crash the app.
- [ ] Reminders work reliably.
- [ ] UI is usable at all text/icon sizes.
- [ ] Production build succeeds (`./gradlew assembleRelease`).

---

## Phase 18 — MVP Release Build

### Goal

Produce a production-ready APK/AAB for real-device distribution.

### Prerequisites

- Phase 17 completed. All tests pass.

### Tasks

#### 18.1 Cleanup

- Remove `ComponentShowcaseScreen` and any dev-only screens.
- Remove all `console.log` / `console.warn` debug logging.
- Remove unused dependencies from `package.json`.
- Remove unused imports and dead code.

#### 18.2 Branding

- Finalize app icon (launcher icon).
- Finalize splash screen (if any).
- Verify `app_name` string in `strings.xml`.
- Verify `applicationId` in `build.gradle`.

#### 18.3 Release Build

- Generate a release keystore (if not done).
- Configure signing in `build.gradle`.
- Verify ProGuard/R8 doesn't strip needed classes.
- Build: `./gradlew assembleRelease` (APK) and `./gradlew bundleRelease` (AAB).
- Test the release APK on a clean device:
  - Complete Family Setup.
  - Complete full parent daily journey.
  - Verify launcher persists as default after reboot.

### Completion Criteria

- [ ] Release APK installs on a clean device.
- [ ] Full setup → daily usage works.
- [ ] No crashes, no debug output.
- [ ] APK size is reasonable.
- [ ] Ready for distribution (sideload or Play Store).
