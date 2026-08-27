import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {store, setClockStyle} from '../src/store';
import {ThemeProvider} from '../src/theme';
import {
  HomeScreenSettingsScreen,
  ClockSettingsScreen,
} from '../src/screens/settings';
import {HomeHeader} from '../src/screens/home/components';

describe('Home Screen Clock Personalization', () => {
  const mockNav: any = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };

  test('updates clock style in Redux store', () => {
    store.dispatch(setClockStyle('minimal'));
    expect(store.getState().settings.appearance.clockStyle).toBe('minimal');

    store.dispatch(setClockStyle('classic'));
    expect(store.getState().settings.appearance.clockStyle).toBe('classic');

    store.dispatch(setClockStyle('frosted'));
    expect(store.getState().settings.appearance.clockStyle).toBe('frosted');
  });

  test('HomeHeader renders all 3 clock variants correctly', () => {
    // 1. Frosted
    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <HomeHeader
              parentName="Mom"
              currentTime="10:30 AM"
              currentDate="Friday, August 28"
              clockStyle="frosted"
            />
          </ThemeProvider>
        </Provider>,
      );
    });
    expect(tree).toBeDefined();

    // 2. Minimal
    ReactTestRenderer.act(() => {
      tree.update(
        <Provider store={store}>
          <ThemeProvider>
            <HomeHeader
              parentName="Mom"
              currentTime="10:30 AM"
              currentDate="Friday, August 28"
              clockStyle="minimal"
            />
          </ThemeProvider>
        </Provider>,
      );
    });
    expect(tree).toBeDefined();

    // 3. Classic
    ReactTestRenderer.act(() => {
      tree.update(
        <Provider store={store}>
          <ThemeProvider>
            <HomeHeader
              parentName="Mom"
              currentTime="10:30 AM"
              currentDate="Friday, August 28"
              clockStyle="classic"
            />
          </ThemeProvider>
        </Provider>,
      );
    });
    expect(tree).toBeDefined();

    ReactTestRenderer.act(() => {
      tree.unmount();
    });
  });

  test('HomeScreenSettingsScreen and ClockSettingsScreen render properly', () => {
    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <NavigationContainer>
              <HomeScreenSettingsScreen
                navigation={mockNav}
                route={{} as any}
              />
            </NavigationContainer>
          </ThemeProvider>
        </Provider>,
      );
    });
    expect(tree).toBeDefined();

    ReactTestRenderer.act(() => {
      tree.update(
        <Provider store={store}>
          <ThemeProvider>
            <NavigationContainer>
              <ClockSettingsScreen
                navigation={mockNav}
                route={{} as any}
              />
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
});
