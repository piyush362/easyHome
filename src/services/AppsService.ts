import {AppDiscoveryNativeModule} from '../native';
import {InstalledApp} from '../types/models';

class AppsServiceClass {
  private cachedApps: InstalledApp[] | null = null;

  /**
   * Fetch all installed launchable applications from Android.
   * Uses in-memory caching to ensure instant opening after first load.
   */
  async getInstalledApps(forceRefresh = false): Promise<InstalledApp[]> {
    if (this.cachedApps && !forceRefresh) {
      return this.cachedApps;
    }

    try {
      if (!AppDiscoveryNativeModule?.getInstalledApps) {
        console.warn(
          '[AppsService] AppDiscoveryModule is not linked in this environment.',
        );
        return [];
      }

      const apps = await AppDiscoveryNativeModule.getInstalledApps();
      this.cachedApps = apps || [];
      return this.cachedApps;
    } catch (error) {
      console.error('[AppsService] Failed to get installed apps:', error);
      return this.cachedApps || [];
    }
  }

  /**
   * Launch an app by its Android package name.
   */
  async launchApp(packageName: string): Promise<boolean> {
    try {
      if (!AppDiscoveryNativeModule?.launchApp) {
        throw new Error('AppDiscoveryModule is not linked.');
      }
      return await AppDiscoveryNativeModule.launchApp(packageName);
    } catch (error) {
      console.error(`[AppsService] Failed to launch ${packageName}:`, error);
      throw error;
    }
  }

  /**
   * Check whether an application package is installed on the device.
   */
  async isAppInstalled(packageName: string): Promise<boolean> {
    try {
      if (!AppDiscoveryNativeModule?.isAppInstalled) {
        return false;
      }
      return await AppDiscoveryNativeModule.isAppInstalled(packageName);
    } catch (error) {
      console.error(`[AppsService] Error checking package ${packageName}:`, error);
      return false;
    }
  }

  /**
   * Invalidate in-memory cache.
   */
  clearCache(): void {
    this.cachedApps = null;
  }
}

export const AppsService = new AppsServiceClass();
