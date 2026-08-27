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
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('RootNavigator renders inside NavigationContainer and Redux Provider', async () => {
    let tree: any;
    await ReactTestRenderer.act(async () => {
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
    await ReactTestRenderer.act(async () => {
      tree.unmount();
    });
  });

  test('FamilySetupNavigator renders welcome step', async () => {
    let tree: any;
    await ReactTestRenderer.act(async () => {
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
    await ReactTestRenderer.act(async () => {
      tree.unmount();
    });
  });

  test('HomeScreen renders correctly with quick navigation', async () => {
    const mockNav: any = {navigate: jest.fn()};
    let tree: any;
    await ReactTestRenderer.act(async () => {
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
    await ReactTestRenderer.act(async () => {
      tree.unmount();
    });
  });

  test('Feature screens render properly', async () => {
    const mockNav: any = {goBack: jest.fn()};
    let familyTree: any;
    let appsTree: any;
    let settingsTree: any;

    await ReactTestRenderer.act(async () => {
      familyTree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <FamilyScreen navigation={mockNav} route={{} as any} />
          </ThemeProvider>
        </Provider>,
      );
      appsTree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <AppsScreen navigation={mockNav} route={{} as any} />
          </ThemeProvider>
        </Provider>,
      );
      settingsTree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <SettingsScreen navigation={mockNav} route={{} as any} />
          </ThemeProvider>
        </Provider>,
      );
    });

    expect(familyTree).toBeDefined();
    expect(appsTree).toBeDefined();
    expect(settingsTree).toBeDefined();

    await ReactTestRenderer.act(async () => {
      familyTree.unmount();
      appsTree.unmount();
      settingsTree.unmount();
    });
  });

  test('Wizard Welcome and Complete screens render', async () => {
    const mockNav: any = {navigate: jest.fn(), replace: jest.fn()};
    let welcomeTree: any;
    let completeTree: any;

    await ReactTestRenderer.act(async () => {
      welcomeTree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <WelcomeStepScreen navigation={mockNav} route={{} as any} />
          </ThemeProvider>
        </Provider>,
      );
      completeTree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <CompleteStepScreen navigation={mockNav} route={{} as any} />
          </ThemeProvider>
        </Provider>,
      );
    });

    expect(welcomeTree).toBeDefined();
    expect(completeTree).toBeDefined();

    await ReactTestRenderer.act(async () => {
      welcomeTree.unmount();
      completeTree.unmount();
    });
  });
});
