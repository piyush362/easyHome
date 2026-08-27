import {NativeModules} from 'react-native';
import {InstalledApp} from '../types/models';

export interface AppDiscoveryNativeModuleSpec {
  getInstalledApps(): Promise<InstalledApp[]>;
  launchApp(packageName: string): Promise<boolean>;
  isAppInstalled(packageName: string): Promise<boolean>;
}

export const AppDiscoveryNativeModule: AppDiscoveryNativeModuleSpec =
  NativeModules.AppDiscoveryModule;
