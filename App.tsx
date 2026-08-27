/**
 * EasyHome — A simpler phone for the people you love.
 *
 * Phase 1: Android Launcher Foundation
 * Phase 2: Project Architecture & Folder Structure
 * Phase 3: Redux Toolkit & Local Persistence (MMKV)
 * Phase 4: Navigation Architecture
 *
 * @format
 */

import React, {useEffect} from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';

import {store, restoreAppState, useAppDispatch} from './src/store';
import {RootNavigator} from './src/navigation';

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
        <RootNavigator />
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
