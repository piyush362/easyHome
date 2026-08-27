export interface Parent {
  id: string;
  name: string;
  photo: string | null; // URI or base64 or null
}

export type RelationshipType =
  | 'Son'
  | 'Daughter'
  | 'Spouse'
  | 'Grandchild'
  | 'Doctor'
  | 'Caregiver'
  | 'Friend'
  | 'Other';

export interface FamilyMember {
  id: string;
  name: string;
  relationship: RelationshipType | string;
  phoneNumber: string;
  photo: string | null;
  preferredCommunication: 'call' | 'whatsapp' | 'video' | 'message';
}

export interface InstalledApp {
  packageName: string;
  appName: string;
  icon: string | null; // Base64 or URI
  isImportant: boolean;
}

export type HomeActionType =
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

export interface HomeAction {
  id: string;
  type: HomeActionType;
  label: string;
  enabled: boolean;
  order: number;
  payload?: string; // Optional metadata like phone number, package name, etc.
}

export type ReminderType =
  | 'medicine'
  | 'doctor'
  | 'water'
  | 'exercise'
  | 'event'
  | 'family';

export type ReminderRecurrence = 'daily' | 'weekly' | 'monthly' | null;

export interface Reminder {
  id: string;
  type: ReminderType;
  title: string;
  description: string;
  time: string; // ISO 8601 string or HH:mm
  recurring: boolean;
  recurringPattern: ReminderRecurrence;
  enabled: boolean;
}

export type ColorTheme =
  | 'ocean'
  | 'green'
  | 'rose'
  | 'warm'
  | 'blue'
  | 'dark'
  | 'midnightBloom'
  | 'sunsetWave'
  | 'auroraCyan';

export type SizeScale = 'large' | 'extraLarge';

export type DrawerColumns = 3 | 4 | 5;
export type IconShape = 'circle' | 'rounded' | 'square';

export interface AppearanceSettings {
  theme: ColorTheme;
  textSize: SizeScale;
  iconSize: SizeScale;
  buttonSize: SizeScale;
  appearance: 'light' | 'dark';
  drawerColumns?: DrawerColumns;
  drawerIconShape?: IconShape;
}

export interface SafetySettings {
  emergencyContactId: string | null;
  emergencyNumber: string;
  locationSharingEnabled: boolean;
  familyPIN: string | null; // Hashed PIN, never stored plain text
  settingsProtected: boolean;
}

export interface LauncherSettings {
  isDefaultLauncher: boolean;
  setupCompleted: boolean;
  setupStep: number; // 0–8 for wizard progress
}

export interface AppStatus {
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}
