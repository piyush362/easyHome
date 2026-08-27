import {TorchNativeModule} from '../native/TorchNativeModule';

export class TorchService {
  /**
   * Check if flashlight / torch hardware is supported and available.
   */
  static async isAvailable(): Promise<boolean> {
    try {
      return await TorchNativeModule.isAvailable();
    } catch (error) {
      console.warn('[TorchService] Error checking availability:', error);
      return false;
    }
  }

  /**
   * Check current active state of the torch.
   */
  static async isTorchActive(): Promise<boolean> {
    try {
      return await TorchNativeModule.isTorchActive();
    } catch (error) {
      console.warn('[TorchService] Error checking torch state:', error);
      return false;
    }
  }

  /**
   * Turn the physical torch on.
   */
  static async turnOn(): Promise<boolean> {
    try {
      return await TorchNativeModule.turnOn();
    } catch (error) {
      console.warn('[TorchService] Error turning on torch:', error);
      throw error;
    }
  }

  /**
   * Turn the physical torch off.
   */
  static async turnOff(): Promise<boolean> {
    try {
      return await TorchNativeModule.turnOff();
    } catch (error) {
      console.warn('[TorchService] Error turning off torch:', error);
      return false;
    }
  }

  /**
   * Toggle the torch on/off and return the resulting boolean state.
   */
  static async toggle(): Promise<boolean> {
    try {
      return await TorchNativeModule.toggle();
    } catch (error) {
      console.warn('[TorchService] Error toggling torch:', error);
      throw error;
    }
  }
}
