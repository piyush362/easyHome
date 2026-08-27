import {NativeModules} from 'react-native';

export interface CompressedImageResult {
  uri: string;
  width: number;
  height: number;
  sizeBytes: number;
}

export interface ImageCompressorNativeInterface {
  compressImage(
    imageUri: string,
    maxWidth: number,
    maxHeight: number,
    quality: number,
  ): Promise<CompressedImageResult>;
}

export const ImageCompressorNativeModule: ImageCompressorNativeInterface =
  NativeModules.ImageCompressorModule || {
    compressImage: async (imageUri: string) => ({
      uri: imageUri,
      width: 512,
      height: 512,
      sizeBytes: 50000,
    }),
  };
