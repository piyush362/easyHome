import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {store, setTheme} from '../src/store';
import {ThemeProvider, THEME_PRESETS} from '../src/theme';
import {HomeScreen} from '../src/screens';

describe('Phase 6: Parent Home Screen & Theme Presets', () => {
  test('HomeScreen renders all sections with solid theme', () => {
    store.dispatch(setTheme('warm'));
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

  test('HomeScreen renders with wallpaper themes (Midnight Bloom & Sunset Wave)', () => {
    const mockNav: any = {navigate: jest.fn()};

    // Test Midnight Bloom (theme-1.jpg)
    store.dispatch(setTheme('midnightBloom'));
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

    // Test Sunset Wave (theme-2.jpg)
    store.dispatch(setTheme('sunsetWave'));
    let tree2: any;

    ReactTestRenderer.act(() => {
      tree2 = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <NavigationContainer>
              <HomeScreen navigation={mockNav} route={{} as any} />
            </NavigationContainer>
          </ThemeProvider>
        </Provider>,
      );
    });

    expect(tree2).toBeDefined();

    ReactTestRenderer.act(() => {
      tree2.unmount();
    });
  });

  test('All 9 preset themes have valid definitions and previews', () => {
    expect(THEME_PRESETS.length).toBe(9);

    const wallpaperPresets = THEME_PRESETS.filter(p => p.category === 'wallpaper');
    expect(wallpaperPresets.length).toBe(3);
    wallpaperPresets.forEach(preset => {
      expect(preset.wallpaper).toBeDefined();
      expect(preset.palettePreview.length).toBe(4);
    });

    const solidPresets = THEME_PRESETS.filter(p => p.category === 'solid');
    expect(solidPresets.length).toBe(6);
    solidPresets.forEach(preset => {
      expect(preset.palettePreview.length).toBe(4);
    });
  });
});
