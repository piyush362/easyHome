/**
 * EasyHome — A simpler phone for the people you love.
 *
 * @format
 */

import React, {useEffect} from 'react';
import {StatusBar, StyleSheet, LogBox} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

// Suppress third-party library web-compatibility warning from Reanimated
LogBox.ignoreLogs([
  '[Reanimated] dependencies should only be used in web implementation',
]);

import {store, restoreAppState, fetchInstalledApps, useAppDispatch} from './src/store';
import {ThemeProvider, useTheme} from './src/theme';
import {RootNavigator, navigationRef, navigateToHomeScreen} from './src/navigation';
import {LauncherService} from './src/services';

function AppContent() {
  const {colors} = useTheme();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Restore persistent store and prefetch installed apps in background on app startup
    dispatch(restoreAppState());
    dispatch(fetchInstalledApps(false));

    // Listen for system Home button / gesture press and return to Home screen
    const unsubscribeHome = LauncherService.addHomeButtonPressedListener(() => {
      navigateToHomeScreen();
    });

    return () => {
      unsubscribeHome();
    };
  }, [dispatch]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <StatusBar barStyle={colors.statusBar} />
          <NavigationContainer ref={navigationRef}>
            <RootNavigator />
          </NavigationContainer>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
