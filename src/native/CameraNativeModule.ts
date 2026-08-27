import {NativeModules} from 'react-native';

export interface CameraNativeModuleInterface {
  openCamera(): Promise<boolean>;
  openSelfie(): Promise<boolean>;
  openVideoCamera(): Promise<boolean>;
  openGallery(): Promise<boolean>;
}

export const CameraNativeModule: CameraNativeModuleInterface =
  NativeModules.CameraModule || {
    openCamera: async () => false,
    openSelfie: async () => false,
    openVideoCamera: async () => false,
    openGallery: async () => false,
  };
