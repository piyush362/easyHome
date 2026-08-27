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

// Mock react-native-image-picker
jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn(async (options: any) => {
    return {
      assets: [{uri: 'file://mock-photo.jpg', width: 1000, height: 1000}],
    };
  }),
  launchImageLibrary: jest.fn(async (options: any) => {
    return {
      assets: [{uri: 'file://mock-gallery-photo.jpg', width: 1000, height: 1000}],
    };
  }),
}));

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
  test('CameraService takes photo, selfie, and records video', async () => {
    const photoResult = await CameraService.takePhoto();
    expect(photoResult.success).toBe(true);
    expect(photoResult.uri).toBe('file://mock-photo.jpg');

    const selfieResult = await CameraService.takeSelfie();
    expect(selfieResult.success).toBe(true);
    expect(selfieResult.uri).toBe('file://mock-photo.jpg');

    const videoResult = await CameraService.recordVideo();
    expect(videoResult.success).toBe(true);
    expect(videoResult.uri).toBe('file://mock-photo.jpg');
  });

  test('GalleryService opens gallery and picks photo', async () => {
    const pickResult = await GalleryService.pickPhoto();
    expect(pickResult.success).toBe(true);
    expect(pickResult.uri).toBe('file://mock-gallery-photo.jpg');

    const galleryResult = await GalleryService.openGallery();
    expect(galleryResult.success).toBe(true);
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
