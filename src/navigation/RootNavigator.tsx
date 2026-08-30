import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {RootStackParamList} from './types';
import {useAppSelector} from '../store';
import {
  LauncherSetupScreen,
  HomeScreenV2,
  FamilyScreen,
  AppsScreen,
  SettingsScreen,
  ThemeSettingsScreen,
  HomeScreenSettingsScreen,
  ClockSettingsScreen,
  AppDrawerSettingsScreen,
  ReminderListScreen,
  AddReminderScreen,
  EditReminderScreen,
  ComponentShowcaseScreen,
} from '../screens';
import FamilySetupNavigator from './FamilySetupNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const isInitialized = useAppSelector(state => state.app.isInitialized);
  const launcher = useAppSelector(state => state.launcher.settings);

  // If default launcher is not set, open LauncherSetup screen first
  const initialRoute: keyof RootStackParamList = launcher.isDefaultLauncher
    ? 'Home'
    : 'LauncherSetup';

  return (
    <Stack.Navigator
      key={isInitialized ? 'initialized' : 'loading'}
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        animationDuration: 200,
      }}>
      <Stack.Screen name="LauncherSetup" component={LauncherSetupScreen} />
      <Stack.Screen name="Home" component={HomeScreenV2} />
      <Stack.Screen
        name="Family"
        component={FamilyScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="Apps"
        component={AppsScreen}
        options={{animation: 'slide_from_bottom'}}
      />
      <Stack.Screen
        name="ReminderList"
        component={ReminderListScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="AddReminder"
        component={AddReminderScreen}
        options={{animation: 'slide_from_bottom'}}
      />
      <Stack.Screen
        name="EditReminder"
        component={EditReminderScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="ThemeSettings"
        component={ThemeSettingsScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="HomeScreenSettings"
        component={HomeScreenSettingsScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="ClockSettings"
        component={ClockSettingsScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="AppDrawerSettings"
        component={AppDrawerSettingsScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="ComponentShowcase"
        component={ComponentShowcaseScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="FamilySetup"
        component={FamilySetupNavigator}
        options={{animation: 'slide_from_right'}}
      />
    </Stack.Navigator>
  );
}
