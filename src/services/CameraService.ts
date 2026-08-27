import {
  launchCamera,
  CameraOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';

export interface CameraResult {
  success: boolean;
  uri?: string;
  cancelled?: boolean;
  error?: string;
}

export class CameraService {
  /**
   * Take a standard photo using the rear camera.
   */
  static async takePhoto(): Promise<CameraResult> {
    const options: CameraOptions = {
      mediaType: 'photo',
      cameraType: 'back',
      saveToPhotos: true,
      quality: 0.9,
      includeBase64: false,
    };

    return this.executeCamera(options);
  }

  /**
   * Take a front-camera selfie.
   */
  static async takeSelfie(): Promise<CameraResult> {
    const options: CameraOptions = {
      mediaType: 'photo',
      cameraType: 'front',
      saveToPhotos: true,
      quality: 0.9,
      includeBase64: false,
    };

    return this.executeCamera(options);
  }

  /**
   * Launch camera in video recording mode.
   */
  static async recordVideo(): Promise<CameraResult> {
    const options: CameraOptions = {
      mediaType: 'video',
      cameraType: 'back',
      saveToPhotos: true,
      videoQuality: 'high',
    };

    return this.executeCamera(options);
  }

  private static async executeCamera(
    options: CameraOptions,
  ): Promise<CameraResult> {
    try {
      const response: ImagePickerResponse = await launchCamera(options);

      if (response.didCancel) {
        return {success: false, cancelled: true};
      }

      if (response.errorCode || response.errorMessage) {
        return {
          success: false,
          error: response.errorMessage || response.errorCode,
        };
      }

      const asset = response.assets?.[0];
      return {
        success: true,
        uri: asset?.uri,
      };
    } catch (error: any) {
      console.warn('[CameraService] Error launching camera:', error);
      return {
        success: false,
        error: error?.message || 'Failed to open camera',
      };
    }
  }
}
