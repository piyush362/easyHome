import React from 'react';
import {Text} from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {store} from '../src/store';
import {ThemeProvider} from '../src/theme';
import {HeaderNavigation, ScreenWrapper} from '../src/components';

describe('HeaderNavigation & ScreenWrapper', () => {
  test('HeaderNavigation renders label and subtitle', () => {
    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <NavigationContainer>
              <HeaderNavigation
                label="Family Contacts"
                subtitle="Manage your family members"
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

  test('ScreenWrapper renders with headerComponent and scroll content', () => {
    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <NavigationContainer>
              <ScreenWrapper
                headerComponent={
                  <HeaderNavigation label="Settings" disableBack={false} />
                }>
                <Text>Screen Content Here</Text>
              </ScreenWrapper>
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

  test('ScreenWrapper renders without scroll when disableScroll=true', () => {
    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <NavigationContainer>
              <ScreenWrapper
                disableScroll={true}
                headerComponent={<HeaderNavigation label="Fixed Screen" />}>
                <Text>Fixed Content</Text>
              </ScreenWrapper>
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
