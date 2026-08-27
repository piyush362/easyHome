# EasyHome — Development Workflow Log: Phase 7 (App Discovery & Pixel Blur Drawer)

This document tracks the implementation of Android App Discovery & Launching with the Pixel UI Frosted BottomSheet Drawer.

---

## Phase 7 — Android App Discovery & Pixel Blur Drawer
**Status**: ✅ Completed  
**Date**: 2026-08-27  
**Goal**: Allow EasyHome to discover all installed applications on the device, extract their icons, display them in a Google Pixel-style frosted glass (`BlurView`) bottom sheet drawer directly over the Home screen with a 5-column adaptive grid, right-side Lucide refresh icon, smooth scrolling with pull-to-refresh disabled, and prefetching data on app mount.

---

### What Was Done

#### Task 1: Android Manifest & Native Module
- Added `<uses-permission android:name="android.permission.QUERY_ALL_PACKAGES" />` in `AndroidManifest.xml`.
- Created `AppDiscoveryModule.kt` querying launchable apps in background thread with Base64 PNG icon extraction.
- Registered `AppDiscoveryPackage.kt` in `MainApplication.kt`.

#### Task 2: Prefetching On App Startup
- In `App.tsx`:
  - Dispatches `fetchInstalledApps(false)` on root mount (`useEffect`).
  - Wrapped app with `GestureHandlerRootView` and `BottomSheetModalProvider`.

#### Task 3: Pixel Drawer Component with Lucide Icons
- In `src/components/apps/PixelAppDrawer.tsx`:
  - **Lucide Icons**: Switched to `lucide-react-native` (`Search`, `RotateCw`, `X`).
  - **Right-side Refresh Button**: Positioned the `RotateCw` refresh icon on the **right side** of the search pill. Tapping it re-scans apps and shows a loading spinner.
  - **Left-side Search Icon**: Subtle `Search` icon from `lucide-react-native`.
  - **Fixed Scrolling**: Configured `BottomSheetFlatList` with `flex: 1`, `nestedScrollEnabled={true}`, and `enableContentPanningGesture={true}`.
  - **Disabled Accidental Pull-to-Refresh**: Removed `refreshing` and `onRefresh` from the scrollable list.
  - **No White Screen / Direct Drawer**: Integrated directly over the Home Screen (`HomeScreen.tsx`) with a translucent blurred backdrop (`BlurView`).
  - **Fixed Search Bar Overlap**: Pinned header with an opaque frosted background (`isDark ? 'rgba(15,23,42,0.98)' : 'rgba(248,250,252,0.98)'`) and `zIndex: 10`.
  - **Status Bar Inset**: Dynamic top inset (`topInset = insets.top + 10`) using `useSafeAreaInsets()`.
  - **5-Column Grid**: 5-column layout matching Pixel launcher drawer with circular adaptive icons and single-line labels.
  - **Direct App Launch**: Tapping any app tile immediately launches the native app on the device.

#### Task 4: Testing & Verification
- Updated `jest.config.js` and `jest.setup.js` with official mocks for `@gorhom/bottom-sheet`, `@react-native-community/blur`, `react-native-gesture-handler`, `react-native-safe-area-context`, `react-native-svg`, and `lucide-react-native`.
- Validated all 5 test suites (21/21 tests passing).
- Clean TypeScript compilation (`0` errors).

---

### Files Changed Summary

| Action | File | Purpose |
|--------|------|---------|
| MODIFY | `src/components/apps/PixelAppDrawer.tsx` | Lucide icons (Search, RotateCw, X) with right-side refresh |
| MODIFY | `src/screens/home/HomeScreen.tsx` | Direct PixelAppDrawer rendering on Home screen |
| MODIFY | `src/screens/apps/AppsScreen.tsx` | Lightweight wrapper for navigation route |
| MODIFY | `App.tsx` | GestureHandlerRootView + BottomSheetModalProvider + prefetch on mount |
| MODIFY | `jest.setup.js` | Official safe-area-context, BlurView, BottomSheet, GestureHandler, SVG, and Lucide mocks |
| MODIFY | `src/_WORKFLOW/workflow_log_07.md` | Phase 7 workflow log |

---

### Completion Criteria Verification

- ✅ Lucide icons (`Search`, `RotateCw`, `X`) integrated
- ✅ Refresh button placed on the right side of the search pill
- ✅ Smooth vertical scrolling in 5-column app list
- ✅ Disabled accidental pull-to-refresh
- ✅ Direct bottom sheet drawer on Home screen (no white screen flash)
- ✅ Search bar pinned with solid background (no text overlap)
- ✅ Stays cleanly below the status bar (`topInset`)
- ✅ Prefetches app list data immediately when the app mounts
- ✅ Frosted glass blur background (`BlurView`) behind bottom sheet
- ✅ Direct app launching on tap
- ✅ TypeScript compiles cleanly (`npx tsc --noEmit` exits with 0 errors)
- ✅ Jest test suite passes (21/21 tests passing across 5 test suites)
