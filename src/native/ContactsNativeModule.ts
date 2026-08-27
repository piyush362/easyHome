import {NativeModules} from 'react-native';

export interface DeviceContact {
  id: string;
  name: string;
  phoneNumber: string;
  photoUri: string | null;
}

export interface ContactsNativeModuleInterface {
  hasContactsPermission(): Promise<boolean>;
  hasCallPermission(): Promise<boolean>;
  requestContactsPermission(): Promise<boolean>;
  getDeviceContacts(): Promise<DeviceContact[]>;
  makeDirectCall(phoneNumber: string): Promise<boolean>;
  openWhatsApp(phoneNumber: string, message?: string | null): Promise<boolean>;
  sendSMS(phoneNumber: string, message?: string | null): Promise<boolean>;
}

export const ContactsNativeModule: ContactsNativeModuleInterface =
  NativeModules.ContactsModule || {
    hasContactsPermission: async () => false,
    hasCallPermission: async () => false,
    requestContactsPermission: async () => false,
    getDeviceContacts: async () => [],
    makeDirectCall: async () => false,
    openWhatsApp: async () => false,
    sendSMS: async () => false,
  };
