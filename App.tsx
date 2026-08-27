/**
 * EasyHome — A simpler phone for the people you love.
 *
 * Phase 1: Android Launcher Foundation
 * - LauncherSetupScreen: Check/set EasyHome as default launcher
 * - MinimalHomeScreen: Placeholder home screen proving launcher works
 *
 * @format
 */

import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {LauncherSetupScreen, MinimalHomeScreen} from './src/screens';

export type RootStackParamList = {
  LauncherSetup: undefined;
  MinimalHome: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="LauncherSetup"
          screenOptions={{
            headerShown: false,
            animation: 'fade',
          }}>
          <Stack.Screen
            name="LauncherSetup"
            component={LauncherSetupScreen}
          />
          <Stack.Screen name="MinimalHome" component={MinimalHomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
