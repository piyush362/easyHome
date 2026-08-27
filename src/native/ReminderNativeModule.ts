import {NativeModules} from 'react-native';

export interface ReminderNativeModuleInterface {
  scheduleReminder(
    id: string,
    title: string,
    message: string,
    type: string,
    timeMillis: number,
    recurring: boolean,
    pattern: string | null,
  ): Promise<boolean>;
  cancelReminder(id: string): Promise<boolean>;
  createNotificationChannel(): Promise<boolean>;
  canScheduleExactAlarms(): Promise<boolean>;
}

export const ReminderNativeModule: ReminderNativeModuleInterface =
  NativeModules.ReminderModule || {
    scheduleReminder: async () => true,
    cancelReminder: async () => true,
    createNotificationChannel: async () => true,
    canScheduleExactAlarms: async () => true,
  };
