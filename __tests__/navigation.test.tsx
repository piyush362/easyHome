import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {store} from '../src/store';
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
  test('RootNavigator renders inside NavigationContainer and Redux Provider', async () => {
    let tree: any;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </Provider>,
      );
    });
    expect(tree).toBeDefined();
  });

  test('FamilySetupNavigator renders welcome step', async () => {
    let tree: any;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <NavigationContainer>
            <FamilySetupNavigator />
          </NavigationContainer>
        </Provider>,
      );
    });
    expect(tree).toBeDefined();
  });

  test('HomeScreen renders correctly with quick navigation', async () => {
    const mockNav: any = {navigate: jest.fn()};
    let tree: any;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <NavigationContainer>
            <HomeScreen navigation={mockNav} route={{} as any} />
          </NavigationContainer>
        </Provider>,
      );
    });
    expect(tree).toBeDefined();
  });

  test('Placeholder screens render properly', async () => {
    const mockNav: any = {goBack: jest.fn()};
    let familyTree: any;
    let appsTree: any;
    let settingsTree: any;

    await ReactTestRenderer.act(async () => {
      familyTree = ReactTestRenderer.create(
        <Provider store={store}>
          <FamilyScreen navigation={mockNav} route={{} as any} />
        </Provider>,
      );
      appsTree = ReactTestRenderer.create(
        <Provider store={store}>
          <AppsScreen navigation={mockNav} route={{} as any} />
        </Provider>,
      );
      settingsTree = ReactTestRenderer.create(
        <Provider store={store}>
          <SettingsScreen navigation={mockNav} route={{} as any} />
        </Provider>,
      );
    });

    expect(familyTree).toBeDefined();
    expect(appsTree).toBeDefined();
    expect(settingsTree).toBeDefined();
  });

  test('Wizard Welcome and Complete screens render', async () => {
    const mockNav: any = {navigate: jest.fn(), replace: jest.fn()};
    let welcomeTree: any;
    let completeTree: any;

    await ReactTestRenderer.act(async () => {
      welcomeTree = ReactTestRenderer.create(
        <Provider store={store}>
          <WelcomeStepScreen navigation={mockNav} route={{} as any} />
        </Provider>,
      );
      completeTree = ReactTestRenderer.create(
        <Provider store={store}>
          <CompleteStepScreen navigation={mockNav} route={{} as any} />
        </Provider>,
      );
    });

    expect(welcomeTree).toBeDefined();
    expect(completeTree).toBeDefined();
  });
});
