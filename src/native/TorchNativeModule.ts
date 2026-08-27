import {NativeModules} from 'react-native';

export interface TorchNativeModuleInterface {
  isAvailable(): Promise<boolean>;
  isTorchActive(): Promise<boolean>;
  turnOn(): Promise<boolean>;
  turnOff(): Promise<boolean>;
  toggle(): Promise<boolean>;
}

export const TorchNativeModule: TorchNativeModuleInterface =
  NativeModules.TorchModule || {
    isAvailable: async () => false,
    isTorchActive: async () => false,
    turnOn: async () => false,
    turnOff: async () => false,
    toggle: async () => false,
  };
