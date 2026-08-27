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
