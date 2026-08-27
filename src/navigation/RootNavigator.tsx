import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {RootStackParamList} from './types';
import {useAppSelector} from '../store';
import {
  LauncherSetupScreen,
  HomeScreen,
  FamilyScreen,
  AppsScreen,
  SettingsScreen,
  ComponentShowcaseScreen,
} from '../screens';
import FamilySetupNavigator from './FamilySetupNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const launcher = useAppSelector(state => state.launcher.settings);
  const isInitialized = useAppSelector(state => state.app.isInitialized);

  // Determine initial route based on setup status and launcher defaults
  const initialRoute: keyof RootStackParamList =
    launcher.setupCompleted && launcher.isDefaultLauncher
      ? 'Home'
      : 'LauncherSetup';

  return (
    <Stack.Navigator
      key={isInitialized ? 'initialized' : 'loading'}
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}>
      <Stack.Screen name="LauncherSetup" component={LauncherSetupScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
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
        name="Settings"
        component={SettingsScreen}
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
