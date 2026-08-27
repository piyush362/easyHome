module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?(@react-native|react-native|@react-navigation|immer|@reduxjs/toolkit|react-redux|react-native-mmkv)/)',
  ],
};
