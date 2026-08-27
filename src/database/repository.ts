import {
  Parent,
  FamilyMember,
  HomeAction,
  AppearanceSettings,
  SafetySettings,
  LauncherSettings,
  Reminder,
} from '../types/models';
import {getItem, setItem} from './storage';

const STORAGE_KEYS = {
  PARENT: 'parent_profile',
  FAMILY: 'family_members',
  HOME_ACTIONS: 'home_actions',
  APPEARANCE: 'appearance_settings',
  REMINDERS: 'reminders_list',
  LAUNCHER: 'launcher_settings',
  SAFETY: 'safety_settings',
} as const;

// Parent Profile Repository
export function saveParent(parent: Parent | null): void {
  setItem(STORAGE_KEYS.PARENT, parent);
}

export function loadParent(): Parent | null {
  return getItem<Parent>(STORAGE_KEYS.PARENT);
}

// Family Members Repository
export function saveFamily(members: FamilyMember[]): void {
  setItem(STORAGE_KEYS.FAMILY, members);
}

export function loadFamily(): FamilyMember[] {
  return getItem<FamilyMember[]>(STORAGE_KEYS.FAMILY) || [];
}

// Home Actions Repository
export function saveHomeActions(actions: HomeAction[]): void {
  setItem(STORAGE_KEYS.HOME_ACTIONS, actions);
}

export function loadHomeActions(): HomeAction[] | null {
  return getItem<HomeAction[]>(STORAGE_KEYS.HOME_ACTIONS);
}

// Appearance Settings Repository
export function saveAppearance(settings: AppearanceSettings): void {
  setItem(STORAGE_KEYS.APPEARANCE, settings);
}

export function loadAppearance(): AppearanceSettings | null {
  return getItem<AppearanceSettings>(STORAGE_KEYS.APPEARANCE);
}

// Reminders Repository
export function saveReminders(reminders: Reminder[]): void {
  setItem(STORAGE_KEYS.REMINDERS, reminders);
}

export function loadReminders(): Reminder[] {
  return getItem<Reminder[]>(STORAGE_KEYS.REMINDERS) || [];
}

// Launcher Settings Repository
export function saveLauncherSettings(settings: LauncherSettings): void {
  setItem(STORAGE_KEYS.LAUNCHER, settings);
}

export function loadLauncherSettings(): LauncherSettings | null {
  return getItem<LauncherSettings>(STORAGE_KEYS.LAUNCHER);
}

// Safety Settings Repository
export function saveSafetySettings(settings: SafetySettings): void {
  setItem(STORAGE_KEYS.SAFETY, settings);
}

export function loadSafetySettings(): SafetySettings | null {
  return getItem<SafetySettings>(STORAGE_KEYS.SAFETY);
}

export interface PersistedAppState {
  parent: Parent | null;
  family: FamilyMember[];
  homeActions: HomeAction[] | null;
  appearance: AppearanceSettings | null;
  reminders: Reminder[];
  launcher: LauncherSettings | null;
  safety: SafetySettings | null;
}

// Load all persisted domain states in a single call
export function loadAllPersistedData(): PersistedAppState {
  return {
    parent: loadParent(),
    family: loadFamily(),
    homeActions: loadHomeActions(),
    appearance: loadAppearance(),
    reminders: loadReminders(),
    launcher: loadLauncherSettings(),
    safety: loadSafetySettings(),
  };
}
