import {CameraNativeModule} from '../native/CameraNativeModule';

export class CameraService {
  /**
   * Open the phone's native default camera app for photo capture.
   */
  static async takePhoto(): Promise<boolean> {
    try {
      return await CameraNativeModule.openCamera();
    } catch (error) {
      console.warn('[CameraService] Error opening camera:', error);
      throw error;
    }
  }

  /**
   * Open the phone's native default camera app in selfie (front camera) mode.
   */
  static async takeSelfie(): Promise<boolean> {
    try {
      return await CameraNativeModule.openSelfie();
    } catch (error) {
      console.warn('[CameraService] Error opening selfie camera:', error);
      throw error;
    }
  }

  /**
   * Open the phone's native default camera app in video recording mode.
   */
  static async recordVideo(): Promise<boolean> {
    try {
      return await CameraNativeModule.openVideoCamera();
    } catch (error) {
      console.warn('[CameraService] Error opening video camera:', error);
      throw error;
    }
  }
}
