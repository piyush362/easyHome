// Jest setup file
/* eslint-disable no-undef */

// Mock react-native-mmkv
jest.mock('react-native-mmkv', () => {
  const map = new Map();
  return {
    createMMKV: jest.fn(() => ({
      set: jest.fn((key, value) => map.set(key, value)),
      getString: jest.fn(key => map.get(key)),
      getNumber: jest.fn(key => map.get(key)),
      getBoolean: jest.fn(key => map.get(key)),
      remove: jest.fn(key => map.delete(key)),
      clearAll: jest.fn(() => map.clear()),
      contains: jest.fn(key => map.has(key)),
      getAllKeys: jest.fn(() => Array.from(map.keys())),
    })),
  };
});

// Mock NativeModules
import {NativeModules} from 'react-native';
NativeModules.LauncherModule = {
  isDefaultLauncher: jest.fn().mockResolvedValue(false),
  requestSetDefaultLauncher: jest.fn().mockResolvedValue(true),
  openHomeSettings: jest.fn().mockResolvedValue(true),
};
