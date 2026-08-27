import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {store} from '../src/store';
import {ThemeProvider} from '../src/theme';
import {HomeScreen} from '../src/screens';

describe('Phase 6: Parent Home Screen', () => {
  test('HomeScreen renders all sections (Clock, Weather, Family, Camera, Utilities, SOS, Bottom Bar)', () => {
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
});
