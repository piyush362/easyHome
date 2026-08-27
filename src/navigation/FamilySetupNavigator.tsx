import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {FamilySetupStackParamList} from './types';
import {
  WelcomeStepScreen,
  ParentProfileStepScreen,
  FamilyMembersStepScreen,
  ImportantAppsStepScreen,
  AppearanceStepScreen,
  RemindersStepScreen,
  SafetyStepScreen,
  ReviewStepScreen,
  CompleteStepScreen,
} from '../screens/setup/wizard';

const Stack = createNativeStackNavigator<FamilySetupStackParamList>();

export default function FamilySetupNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Welcome" component={WelcomeStepScreen} />
      <Stack.Screen name="ParentProfile" component={ParentProfileStepScreen} />
      <Stack.Screen name="FamilyMembers" component={FamilyMembersStepScreen} />
      <Stack.Screen name="ImportantApps" component={ImportantAppsStepScreen} />
      <Stack.Screen name="Appearance" component={AppearanceStepScreen} />
      <Stack.Screen name="Reminders" component={RemindersStepScreen} />
      <Stack.Screen name="Safety" component={SafetyStepScreen} />
      <Stack.Screen name="Review" component={ReviewStepScreen} />
      <Stack.Screen name="Complete" component={CompleteStepScreen} />
    </Stack.Navigator>
  );
}
