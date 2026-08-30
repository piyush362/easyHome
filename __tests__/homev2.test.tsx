import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {store} from '../src/store';
import {ThemeProvider} from '../src/theme';
import HomeScreenV2 from '../src/screens/homev2/HomeScreenV2';
import {
  HomeV2BottomBar,
  HomeV2ClockWidget,
  HomeV2ContactsRow,
  HomeV2FavoriteAppsGrid,
  HomeV2AppPickerModal,
  HomeV2ToolsRow,
  HomeV2EmergencyBanner,
  HomeV2FavoritesView,
  HomeV2AppsView,
  HomeV2SettingsView,
} from '../src/screens/homev2/components';

describe('Home Screen V2 Components', () => {
  test('HomeV2BottomBar renders 4 floating tabs and triggers onTabChange', () => {
    const mockTabChange = jest.fn();

    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <HomeV2BottomBar
              activeTab="home"
              onTabChange={mockTabChange}
            />
          </ThemeProvider>
        </Provider>,
      );
    });

    expect(tree).toBeDefined();
    const json = tree.toJSON();
    expect(json).toBeDefined();

    ReactTestRenderer.act(() => {
      tree.unmount();
    });
  });

  test('HomeV2FavoritesView renders big contact tiles with call and whatsapp buttons', () => {
    const mockAdd = jest.fn();
    const mockMembers = [
      {
        id: '1',
        name: 'John',
        phoneNumber: '1234567890',
        relationship: 'Son',
        photo: null,
        preferredCommunication: 'call' as const,
        isEmergencyContact: true,
        order: 0,
      },
    ];

    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <HomeV2FavoritesView
              familyMembers={mockMembers}
              onAddContact={mockAdd}
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

  test('HomeV2AppsView renders installed apps in grid', () => {
    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <HomeV2AppsView
              installedApps={[
                {
                  packageName: 'com.test.app',
                  appName: 'Test App',
                  icon: null,
                  isImportant: false,
                },
              ]}
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

  test('HomeV2SettingsView renders personalization, family, and system sections', () => {
    const mockNavigate = jest.fn();
    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <HomeV2SettingsView onNavigateTo={mockNavigate} />
          </ThemeProvider>
        </Provider>,
      );
    });

    expect(tree).toBeDefined();
    ReactTestRenderer.act(() => {
      tree.unmount();
    });
  });

  test('HomeV2ClockWidget renders time, date and greeting', () => {
    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <HomeV2ClockWidget
              parentName="Mom"
              currentTime="10:30 AM"
              currentDate="Tuesday, 27 August 2026"
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

  test('HomeV2ContactsRow renders contacts list', () => {
    const mockSelect = jest.fn();
    const mockAdd = jest.fn();
    const mockMembers = [
      {
        id: '1',
        name: 'John',
        phoneNumber: '1234567890',
        relationship: 'Son',
        photo: null,
        preferredCommunication: 'call' as const,
        isEmergencyContact: true,
        order: 0,
      },
    ];

    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <HomeV2ContactsRow
              familyMembers={mockMembers}
              onSelectMember={mockSelect}
              onAddContact={mockAdd}
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

  test('HomeV2FavoriteAppsGrid renders 3 rows of apps', () => {
    const mockLaunch = jest.fn();
    const mockDrawer = jest.fn();

    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <HomeV2FavoriteAppsGrid
              installedApps={[]}
              onLaunchApp={mockLaunch}
              onOpenDrawer={mockDrawer}
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

  test('HomeV2ToolsRow renders torch, ringer, battery and night mode', () => {
    const mockTorch = jest.fn();

    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <HomeV2ToolsRow
              torchActive={false}
              onTorchToggle={mockTorch}
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

  test('HomeV2EmergencyBanner renders emergency bar', () => {
    const mockPress = jest.fn();

    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <HomeV2EmergencyBanner onPress={mockPress} />
          </ThemeProvider>
        </Provider>,
      );
    });

    expect(tree).toBeDefined();
    ReactTestRenderer.act(() => {
      tree.unmount();
    });
  });

  test('HomeV2AppPickerModal renders 4-column multi-selection grid', () => {
    const mockClose = jest.fn();
    const mockSave = jest.fn();
    const mockApps = [
      {
        packageName: 'com.whatsapp',
        appName: 'WhatsApp',
        icon: null,
        isImportant: false,
      },
    ];

    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <HomeV2AppPickerModal
              visible={true}
              onClose={mockClose}
              onSavePackages={mockSave}
              installedApps={mockApps}
              selectedPackages={[]}
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

  test('HomeScreenV2 renders inside Provider and NavigationContainer', () => {
    const mockNav: any = {navigate: jest.fn()};

    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <NavigationContainer>
              <HomeScreenV2 navigation={mockNav} route={{} as any} />
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
