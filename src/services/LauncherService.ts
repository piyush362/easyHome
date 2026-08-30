import { NativeModules, DeviceEventEmitter, EmitterSubscription } from 'react-native';

const { LauncherModule } = NativeModules;

export const EVENT_HOME_PRESSED = 'EasyHome_onHomeButtonPressed';

class LauncherServiceClass {
  /**
   * Checks whether EasyHome is currently the device's default launcher/home app.
   */
  async isDefaultLauncher(): Promise<boolean> {
    try {
      if (!LauncherModule?.isDefaultLauncher) {
        return false;
      }
      return await LauncherModule.isDefaultLauncher();
    } catch (error) {
      console.warn('[LauncherService] Failed to check default launcher:', error);
      return false;
    }
  }

  /**
   * Requests Android to set EasyHome as the default launcher.
   */
  async requestSetDefaultLauncher(): Promise<boolean> {
    try {
      if (!LauncherModule?.requestSetDefaultLauncher) {
        return false;
      }
      return await LauncherModule.requestSetDefaultLauncher();
    } catch (error) {
      console.warn('[LauncherService] Failed to request set default launcher:', error);
      return false;
    }
  }

  /**
   * Opens the Android system Home/Launcher settings screen directly.
   */
  async openHomeSettings(): Promise<boolean> {
    try {
      if (!LauncherModule?.openHomeSettings) {
        return false;
      }
      return await LauncherModule.openHomeSettings();
    } catch (error) {
      console.warn('[LauncherService] Failed to open home settings:', error);
      return false;
    }
  }

  /**
   * Subscribes to the Android Home button / navigation gesture press event.
   * Triggered whenever the user taps the hardware/software Home button or uses the Home gesture.
   *
   * @param listener Callback function invoked on Home button press.
   * @returns Unsubscribe function to clean up the listener.
   */
  addHomeButtonPressedListener(listener: () => void): () => void {
    const subscription: EmitterSubscription = DeviceEventEmitter.addListener(
      EVENT_HOME_PRESSED,
      listener,
    );
    return () => {
      subscription.remove();
    };
  }
}

export const LauncherService = new LauncherServiceClass();
