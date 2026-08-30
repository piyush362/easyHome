import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {store} from '../src/store';
import {ThemeProvider} from '../src/theme';
import {RootNavigator, FamilySetupNavigator} from '../src/navigation';
import HomeScreen from '../src/screens/home/HomeScreen';
import FamilyScreen from '../src/screens/family/FamilyScreen';
import AppsScreen from '../src/screens/apps/AppsScreen';
import SettingsScreen from '../src/screens/settings/SettingsScreen';
import {
  WelcomeStepScreen,
  CompleteStepScreen,
} from '../src/screens/setup/wizard';

describe('Navigation Architecture', () => {
  test('RootNavigator renders inside NavigationContainer and Redux Provider', () => {
    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </ThemeProvider>
        </Provider>,
      );
    });
    expect(tree).toBeDefined();
    ReactTestRenderer.act(() => {
      tree.unmount();
    });
  });

  test('FamilySetupNavigator renders welcome step', () => {
    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <NavigationContainer>
              <FamilySetupNavigator />
            </NavigationContainer>
          </ThemeProvider>
        </Provider>,
      );
    });
    expect(tree).toBeDefined();
    ReactTestRenderer.act(() => {
      tree.unmount();
    });
  });

  test('HomeScreen renders correctly with quick navigation', () => {
    const mockNav: any = {navigate: jest.fn()};
    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <NavigationContainer>
              <HomeScreen navigation={mockNav} route={{} as any} />
            </NavigationContainer>
          </ThemeProvider>
        </Provider>,
      );
    });
    expect(tree).toBeDefined();
    ReactTestRenderer.act(() => {
      tree.unmount();
    });
  });

  test('Feature screens render properly', () => {
    const mockNav: any = {goBack: jest.fn()};
    let familyTree: any;
    let appsTree: any;
    let settingsTree: any;
    let themeSettingsTree: any;
    let appDrawerSettingsTree: any;

    const {
      ThemeSettingsScreen,
      AppDrawerSettingsScreen,
    } = require('../src/screens/settings');

    ReactTestRenderer.act(() => {
      familyTree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <NavigationContainer>
              <FamilyScreen navigation={mockNav} route={{} as any} />
            </NavigationContainer>
          </ThemeProvider>
        </Provider>,
      );
      appsTree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <NavigationContainer>
              <AppsScreen navigation={mockNav} route={{} as any} />
            </NavigationContainer>
          </ThemeProvider>
        </Provider>,
      );
      settingsTree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <NavigationContainer>
              <SettingsScreen navigation={mockNav} route={{} as any} />
            </NavigationContainer>
          </ThemeProvider>
        </Provider>,
      );
      themeSettingsTree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <NavigationContainer>
              <ThemeSettingsScreen navigation={mockNav} route={{} as any} />
            </NavigationContainer>
          </ThemeProvider>
        </Provider>,
      );
      appDrawerSettingsTree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <NavigationContainer>
              <AppDrawerSettingsScreen navigation={mockNav} route={{} as any} />
            </NavigationContainer>
          </ThemeProvider>
        </Provider>,
      );
    });

    expect(familyTree).toBeDefined();
    expect(appsTree).toBeDefined();
    expect(settingsTree).toBeDefined();
    expect(themeSettingsTree).toBeDefined();
    expect(appDrawerSettingsTree).toBeDefined();

    ReactTestRenderer.act(() => {
      familyTree.unmount();
      appsTree.unmount();
      settingsTree.unmount();
      themeSettingsTree.unmount();
      appDrawerSettingsTree.unmount();
    });
  });

  test('Wizard Welcome and Complete screens render', () => {
    const mockNav: any = {navigate: jest.fn(), replace: jest.fn()};
    let welcomeTree: any;
    let completeTree: any;

    ReactTestRenderer.act(() => {
      welcomeTree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <NavigationContainer>
              <WelcomeStepScreen navigation={mockNav} route={{} as any} />
            </NavigationContainer>
          </ThemeProvider>
        </Provider>,
      );
      completeTree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <NavigationContainer>
              <CompleteStepScreen navigation={mockNav} route={{} as any} />
            </NavigationContainer>
          </ThemeProvider>
        </Provider>,
      );
    });

    expect(welcomeTree).toBeDefined();
    expect(completeTree).toBeDefined();

    ReactTestRenderer.act(() => {
      welcomeTree.unmount();
      completeTree.unmount();
    });
  });

  test('LauncherService registers and cleans up home button listeners', () => {
    const {LauncherService, EVENT_HOME_PRESSED} = require('../src/services/LauncherService');
    const {DeviceEventEmitter} = require('react-native');

    const mockCallback = jest.fn();
    const unsubscribe = LauncherService.addHomeButtonPressedListener(mockCallback);

    DeviceEventEmitter.emit(EVENT_HOME_PRESSED);
    expect(mockCallback).toHaveBeenCalledTimes(1);

    unsubscribe();
    DeviceEventEmitter.emit(EVENT_HOME_PRESSED);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  test('navigateToHomeScreen helper navigates to Home when not on Home', () => {
    const {navigationRef, navigateToHomeScreen} = require('../src/navigation/navigationRef');

    // When navigationRef is not ready
    expect(navigateToHomeScreen()).toBe(false);

    // Mock navigationRef methods
    const mockNavigate = jest.fn();
    const mockDispatch = jest.fn();
    const mockIsReady = jest.fn().mockReturnValue(true);
    const mockGetCurrentRoute = jest.fn();

    (navigationRef as any).isReady = mockIsReady;
    (navigationRef as any).navigate = mockNavigate;
    (navigationRef as any).dispatch = mockDispatch;
    (navigationRef as any).getCurrentRoute = mockGetCurrentRoute;

    // When already on 'Home' screen -> does not navigate
    mockGetCurrentRoute.mockReturnValue({name: 'Home', key: 'home-1'});
    expect(navigateToHomeScreen()).toBe(false);
    expect(mockNavigate).not.toHaveBeenCalled();

    // When on 'Settings' screen -> navigates to 'Home'
    mockGetCurrentRoute.mockReturnValue({name: 'Settings', key: 'settings-1'});
    expect(navigateToHomeScreen()).toBe(true);
    expect(mockNavigate).toHaveBeenCalledWith('Home');

    // When on 'Apps' screen -> navigates to 'Home'
    mockNavigate.mockClear();
    mockGetCurrentRoute.mockReturnValue({name: 'Apps', key: 'apps-1'});
    expect(navigateToHomeScreen()).toBe(true);
    expect(mockNavigate).toHaveBeenCalledWith('Home');
  });
});
