import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {CompositeScreenProps, NavigatorScreenParams} from '@react-navigation/native';

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

export type RootStackParamList = {
  LauncherSetup: undefined;
  Home: undefined;
  Family: undefined;
  Apps: undefined;
  Settings: undefined;
  ThemeSettings: undefined;
  AppDrawerSettings: undefined;
  ComponentShowcase: undefined;
  FamilySetup: NavigatorScreenParams<FamilySetupStackParamList> | undefined;
};

// Root Stack Screen Props
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

// Family Setup Wizard Screen Props (with root stack composite navigation support)
export type FamilySetupScreenProps<
  T extends keyof FamilySetupStackParamList,
> = CompositeScreenProps<
  NativeStackScreenProps<FamilySetupStackParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;
