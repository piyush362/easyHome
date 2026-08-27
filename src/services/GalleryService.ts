import {
  launchImageLibrary,
  ImageLibraryOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';
import {AppsService} from './AppsService';

export interface GalleryResult {
  success: boolean;
  uri?: string;
  cancelled?: boolean;
  error?: string;
}

export class GalleryService {
  /**
   * Open the device's photo gallery app or image library.
   */
  static async openGallery(): Promise<GalleryResult> {
    // Known Android gallery package names
    const galleryPackages = [
      'com.google.android.apps.photos',
      'com.sec.android.gallery3d',
      'com.android.gallery3d',
      'com.miui.gallery',
      'com.coloros.gallery3d',
      'com.huawei.photos',
    ];

    for (const pkg of galleryPackages) {
      try {
        const isInstalled = await AppsService.isAppInstalled(pkg);
        if (isInstalled) {
          await AppsService.launchApp(pkg);
          return {success: true};
        }
      } catch (e) {
        // Continue to fallback
      }
    }

    // Fallback: Launch image library picker
    return this.pickPhoto();
  }

  /**
   * Pick a photo from the gallery (used for profile/contact photo selection).
   */
  static async pickPhoto(): Promise<GalleryResult> {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.8,
    };

    try {
      const response: ImagePickerResponse = await launchImageLibrary(options);

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
      console.warn('[GalleryService] Error launching image library:', error);
      return {
        success: false,
        error: error?.message || 'Failed to open gallery',
      };
    }
  }
}
