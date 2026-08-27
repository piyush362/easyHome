import {
  ImageCompressorNativeModule,
  CompressedImageResult,
} from '../native/ImageCompressorNativeModule';

export class ImageCompressorService {
  /**
   * Compresses an image to a lightweight JPEG (default 512x512, 80% quality)
   * Prevents memory bloat and optimizes app performance.
   */
  static async compress(
    uri: string,
    maxWidth = 512,
    maxHeight = 512,
    quality = 80,
  ): Promise<CompressedImageResult> {
    try {
      if (!uri) {
        throw new Error('Image URI is required for compression');
      }
      return await ImageCompressorNativeModule.compressImage(
        uri,
        maxWidth,
        maxHeight,
        quality,
      );
    } catch (error) {
      console.warn('[ImageCompressorService] Error compressing image:', error);
      // Fallback: return original URI if compression fails
      return {
        uri,
        width: maxWidth,
        height: maxHeight,
        sizeBytes: 0,
      };
    }
  }
}
