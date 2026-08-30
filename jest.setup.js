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

NativeModules.AppDiscoveryModule = {
  getInstalledApps: jest.fn().mockResolvedValue([
    {
      packageName: 'com.whatsapp',
      appName: 'WhatsApp',
      icon: 'data:image/png;base64,mock',
      isImportant: false,
    },
    {
      packageName: 'com.google.android.youtube',
      appName: 'YouTube',
      icon: null,
      isImportant: false,
    },
  ]),
  launchApp: jest.fn().mockResolvedValue(true),
  isAppInstalled: jest.fn().mockResolvedValue(true),
};

NativeModules.ContactsModule = {
  hasContactsPermission: jest.fn().mockResolvedValue(true),
  hasCallPermission: jest.fn().mockResolvedValue(true),
  requestContactsPermission: jest.fn().mockResolvedValue(true),
  requestCallPermission: jest.fn().mockResolvedValue(true),
  getDeviceContacts: jest.fn().mockResolvedValue([
    {
      id: 'mock-1',
      name: 'Alice Family',
      phoneNumber: '+15551234567',
      photoUri: null,
    },
  ]),
  makeDirectCall: jest.fn().mockResolvedValue(true),
  openWhatsApp: jest.fn().mockResolvedValue(true),
  sendSMS: jest.fn().mockResolvedValue(true),
  openDialer: jest.fn().mockResolvedValue(true),
};

NativeModules.TorchModule = {
  isAvailable: jest.fn().mockResolvedValue(true),
  isTorchActive: jest.fn().mockResolvedValue(false),
  turnOn: jest.fn().mockResolvedValue(true),
  turnOff: jest.fn().mockResolvedValue(false),
  toggle: jest.fn().mockResolvedValue(true),
};

NativeModules.CameraModule = {
  openCamera: jest.fn().mockResolvedValue(true),
  openSelfie: jest.fn().mockResolvedValue(true),
  openVideoCamera: jest.fn().mockResolvedValue(true),
  openGallery: jest.fn().mockResolvedValue(true),
};

NativeModules.ImageCompressorModule = {
  compressImage: jest.fn().mockResolvedValue({
    uri: 'file://mock-compressed.jpg',
    width: 512,
    height: 512,
    sizeBytes: 45000,
  }),
};

// Mock react-native-image-picker
jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn(async (options) => ({
    assets: [{uri: 'file://mock-photo.jpg', width: 1000, height: 1000}],
  })),
  launchImageLibrary: jest.fn(async (options) => ({
    assets: [{uri: 'file://mock-gallery-photo.jpg', width: 1000, height: 1000}],
  })),
}));

// Mock react-native-linear-gradient
jest.mock('react-native-linear-gradient', () => {
  const React = require('react');
  const {View} = require('react-native');
  return ({children, style, ...props}) => {
    return React.createElement(View, {style, ...props}, children);
  };
});

// Mock react-native-safe-area-context
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';
jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

// Mock @react-native-community/blur
jest.mock('@react-native-community/blur', () => {
  const React = require('react');
  const {View} = require('react-native');
  return {
    BlurView: (props: any) => React.createElement(View, props, props.children),
  };
});

// Mock react-native-svg & lucide-react-native
jest.mock('react-native-svg', () => {
  const React = require('react');
  const {View} = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => React.createElement(View, props, props.children),
    Svg: (props: any) => React.createElement(View, props, props.children),
    Path: (props: any) => React.createElement(View, props),
    Circle: (props: any) => React.createElement(View, props),
    Rect: (props: any) => React.createElement(View, props),
    G: (props: any) => React.createElement(View, props, props.children),
  };
});

jest.mock('lucide-react-native', () => {
  const React = require('react');
  const {Text} = require('react-native');
  const createMockIcon = (name: string) => (props: any) =>
    React.createElement(Text, props, name);
  return new Proxy(
    {},
    {
      get: (_, prop) => createMockIcon(String(prop)),
    },
  );
});

// Mock react-native-keyboard-aware-scroll-view
jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const React = require('react');
  const {ScrollView} = require('react-native');
  return {
    KeyboardAwareScrollView: (props: any) =>
      React.createElement(ScrollView, props, props.children),
  };
});

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const {View, TouchableOpacity, ScrollView, FlatList} = require('react-native');
  return {
    GestureHandlerRootView: (props: any) =>
      React.createElement(View, props, props.children),
    TouchableOpacity: (props: any) =>
      React.createElement(TouchableOpacity, props, props.children),
    ScrollView: (props: any) =>
      React.createElement(ScrollView, props, props.children),
    FlatList: (props: any) => React.createElement(FlatList, props),
    PanGestureHandler: (props: any) =>
      React.createElement(View, props, props.children),
    State: {},
    Directions: {},
  };
});

// Mock @gorhom/bottom-sheet
jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const {View, FlatList, TextInput} = require('react-native');
  const BottomSheet = React.forwardRef((props: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({
      expand: jest.fn(),
      collapse: jest.fn(),
      close: jest.fn(),
      snapToIndex: jest.fn(),
    }));
    return React.createElement(
      View,
      {testID: props.testID || 'bottom-sheet'},
      typeof props.children === 'function' ? props.children({}) : props.children,
    );
  });
  return {
    __esModule: true,
    default: BottomSheet,
    BottomSheetModal: BottomSheet,
    BottomSheetModalProvider: ({children}: any) =>
      React.createElement(View, null, children),
    BottomSheetFlatList: (props: any) => React.createElement(FlatList, props),
    BottomSheetTextInput: (props: any) => React.createElement(TextInput, props),
    BottomSheetView: (props: any) =>
      React.createElement(View, props, props.children),
    BottomSheetBackdrop: (props: any) => React.createElement(View, props),
    useBottomSheet: () => ({
      expand: jest.fn(),
      collapse: jest.fn(),
      close: jest.fn(),
      snapToIndex: jest.fn(),
    }),
  };
});

// Mock react-native-device-info
jest.mock('react-native-device-info', () => ({
  getBatteryLevel: jest.fn().mockResolvedValue(0.85),
  getBatteryLevelSync: jest.fn().mockReturnValue(0.85),
  isBatteryCharging: jest.fn().mockResolvedValue(false),
  isBatteryChargingSync: jest.fn().mockReturnValue(false),
  getVersion: jest.fn().mockReturnValue('1.0.0'),
  getBuildNumber: jest.fn().mockReturnValue('1'),
}));

// Mock react-native-swiper
jest.mock('react-native-swiper', () => {
  const React = require('react');
  const {View} = require('react-native');
  return ({children, ...props}: any) =>
    React.createElement(View, props, children);
});

