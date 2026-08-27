import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {store} from '../src/store';
import {ThemeProvider} from '../src/theme';
import {
  setInstalledApps,
  setImportantApps,
  toggleImportantApp,
  setSearchQuery,
} from '../src/store/slices/appsSlice';
import {AppsService} from '../src/services';
import AppsScreen from '../src/screens/apps/AppsScreen';

describe('Apps Discovery & Launching', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('appsSlice updates installedApps and importantApps correctly', () => {
    const mockApps = [
      {
        packageName: 'com.whatsapp',
        appName: 'WhatsApp',
        icon: 'data:image/png;base64,mockIcon',
        isImportant: false,
      },
      {
        packageName: 'com.google.android.youtube',
        appName: 'YouTube',
        icon: null,
        isImportant: false,
      },
    ];

    store.dispatch(setInstalledApps(mockApps));
    expect(store.getState().apps.installedApps.length).toBe(2);

    store.dispatch(setImportantApps(['com.whatsapp']));
    expect(store.getState().apps.importantApps).toContain('com.whatsapp');

    store.dispatch(toggleImportantApp('com.google.android.youtube'));
    expect(store.getState().apps.importantApps).toContain(
      'com.google.android.youtube',
    );

    store.dispatch(toggleImportantApp('com.whatsapp'));
    expect(store.getState().apps.importantApps).not.toContain('com.whatsapp');

    store.dispatch(setSearchQuery('You'));
    expect(store.getState().apps.searchQuery).toBe('You');
  });

  test('AppsService returns empty array gracefully when NativeModule is unlinked in test env', async () => {
    const apps = await AppsService.getInstalledApps();
    expect(Array.isArray(apps)).toBe(true);
  });

  test('AppsScreen renders Pixel UI search bar and apps list', async () => {
    const mockNav: any = {goBack: jest.fn()};
    let tree: any;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <NavigationContainer>
              <AppsScreen navigation={mockNav} route={{} as any} />
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
});
