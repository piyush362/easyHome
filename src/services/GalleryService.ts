import {CameraNativeModule} from '../native/CameraNativeModule';

export class GalleryService {
  /**
   * Open the phone's native default gallery / photos app.
   */
  static async openGallery(): Promise<boolean> {
    try {
      return await CameraNativeModule.openGallery();
    } catch (error) {
      console.warn('[GalleryService] Error opening gallery:', error);
      throw error;
    }
  }
}
