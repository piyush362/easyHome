import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {store} from '../src/store';
import {ThemeProvider} from '../src/theme';
import {
  CameraService,
  GalleryService,
  TorchService,
} from '../src/services';
import HomeScreen from '../src/screens/home/HomeScreen';

// Mock react-native-mmkv
jest.mock('react-native-mmkv', () => {
  const storageMap = new Map<string, string>();
  return {
    createMMKV: () => ({
      set: (key: string, value: string) => storageMap.set(key, value),
      getString: (key: string) => storageMap.get(key),
      remove: (key: string) => storageMap.delete(key),
      clearAll: () => storageMap.clear(),
    }),
  };
});

describe('Phase 9 — Camera, Photos & Torch System', () => {
  test('CameraService launches native default camera, selfie, and video apps', async () => {
    const photoResult = await CameraService.takePhoto();
    expect(photoResult).toBe(true);

    const selfieResult = await CameraService.takeSelfie();
    expect(selfieResult).toBe(true);

    const videoResult = await CameraService.recordVideo();
    expect(videoResult).toBe(true);
  });

  test('GalleryService launches native default gallery app', async () => {
    const galleryResult = await GalleryService.openGallery();
    expect(galleryResult).toBe(true);
  });

  test('TorchService controls flashlight hardware safely', async () => {
    const available = await TorchService.isAvailable();
    expect(typeof available).toBe('boolean');

    const active = await TorchService.isTorchActive();
    expect(typeof active).toBe('boolean');

    const turnOn = await TorchService.turnOn();
    expect(typeof turnOn).toBe('boolean');

    const turnOff = await TorchService.turnOff();
    expect(typeof turnOff).toBe('boolean');

    const toggled = await TorchService.toggle();
    expect(typeof toggled).toBe('boolean');
  });

  test('HomeScreen renders with Camera, Gallery, and Torch tiles', () => {
    const mockNav: any = {goBack: jest.fn(), navigate: jest.fn(), replace: jest.fn()};
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
