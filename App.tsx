/**
 * EasyHome — A simpler phone for the people you love.
 *
 * Phase 1: Android Launcher Foundation
 * Phase 2: Project Architecture & Folder Structure
 * Phase 3: Redux Toolkit & Local Persistence (MMKV)
 *
 * @format
 */

import React, {useEffect} from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider} from 'react-redux';

import {store, restoreAppState, useAppDispatch} from './src/store';
import {LauncherSetupScreen, MinimalHomeScreen} from './src/screens';

export type RootStackParamList = {
  LauncherSetup: undefined;
  MinimalHome: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppContent() {
  const isDarkMode = useColorScheme() === 'dark';
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreAppState());
  }, [dispatch]);

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

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
