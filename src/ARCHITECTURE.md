# EasyHome — Architectural Guidelines & Boundaries

This document defines the structural patterns, layer responsibilities, and dependency rules for the EasyHome codebase.

---

## 1. Directory Structure Overview

```
src/
├── app/                  # App-level setup (providers, root component wrappers)
├── components/           # Reusable UI component library
│   ├── common/           # Generic: Text, Avatar, Card, etc.
│   ├── buttons/          # Specialized buttons (Action buttons, quick toggles)
│   ├── cards/            # Content cards, family cards
│   ├── forms/            # Form inputs, pin pads, pickers
│   └── feedback/         # Loaders, toasts, dialogs, modals
├── screens/              # Feature screens grouped by domain
│   ├── home/             # Parent home screen & widgets
│   ├── family/           # Family contacts & calling flows
│   ├── apps/             # App discovery & launch drawer
│   ├── setup/            # Launcher setup & Family Setup wizard
│   ├── reminders/        # Medicine & general reminder screens
│   ├── settings/         # Appearance, preferences, personalisation
│   └── safety/           # Emergency help, SOS, location assistance
├── navigation/           # Navigators, route stacks, and navigation types
├── store/                # Redux Toolkit store, slices, typed hooks
├── database/             # MMKV storage layer (repositories & serializers)
├── services/             # Native module abstractions & external integrations
├── native/               # TypeScript interfaces & definitions for NativeModules
├── theme/                # Design system tokens (colors, typography, spacing)
├── types/                # Shared domain models and TypeScript types
└── utils/                # Pure helper functions, formatting, validators
```

---

## 2. Core Architectural Rules

### Rule 1: UI Components Must Never Call Native Modules Directly
UI components (screens, buttons, cards) must not import `NativeModules` from `react-native` directly. All native interactions must be performed through abstractions provided by `src/services/`.

### Rule 2: Services Abstract Native Modules Behind TypeScript Interfaces
Each native module has a strongly-typed TypeScript interface located in `src/native/`. A service in `src/services/` wraps the native call, handles error normalization, permission checks, and provides clean Promise-based APIs.

### Rule 3: Redux Slices Must Not Import MMKV Directly
Redux slices must interact with local persistence solely through repository abstractions in `src/database/`. This decouples business logic from the underlying storage mechanism.

### Rule 4: Self-Contained Screen Domains
Each screen directory under `src/screens/` should encapsulate components, hooks, or sub-views that are specific only to that screen domain. Common components used across multiple domains must be moved to `src/components/`.

### Rule 5: Centralized Shared Types
Shared business entities, domain interfaces, and global types must reside in `src/types/`. Avoid duplicating domain types across screens or components.

### Rule 6: Strict Dependency Flow / No Circular Dependencies
Dependencies must flow top-down:
`Screens / Components` ➔ `Services / Store / Hooks` ➔ `Database / Native Interfaces / Theme / Utils`

Circular dependencies between directories or modules are strictly forbidden. Barrel files (`index.ts`) must export only public module surfaces.
