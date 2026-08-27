import {
  ContactsNativeModule,
  DeviceContact,
} from '../native/ContactsNativeModule';

export class ContactsService {
  /**
   * Check if READ_CONTACTS permission is granted.
   */
  static async hasPermission(): Promise<boolean> {
    try {
      return await ContactsNativeModule.hasContactsPermission();
    } catch (error) {
      console.warn('[ContactsService] Error checking contacts permission:', error);
      return false;
    }
  }

  /**
   * Request READ_CONTACTS permission from user.
   */
  static async requestPermission(): Promise<boolean> {
    try {
      return await ContactsNativeModule.requestContactsPermission();
    } catch (error) {
      console.warn('[ContactsService] Error requesting contacts permission:', error);
      return false;
    }
  }

  /**
   * Query all contacts from Android device.
   */
  static async getDeviceContacts(): Promise<DeviceContact[]> {
    try {
      const hasPerm = await this.hasPermission();
      if (!hasPerm) {
        const granted = await this.requestPermission();
        if (!granted) {
          return [];
        }
      }
      return await ContactsNativeModule.getDeviceContacts();
    } catch (error) {
      console.warn('[ContactsService] Error fetching device contacts:', error);
      return [];
    }
  }

  /**
   * Make a direct phone call to the contact.
   */
  static async makeDirectCall(phoneNumber: string): Promise<boolean> {
    try {
      const clean = this.sanitizePhoneNumber(phoneNumber);
      if (!clean) {
        throw new Error('Invalid phone number');
      }
      return await ContactsNativeModule.makeDirectCall(clean);
    } catch (error) {
      console.warn('[ContactsService] Error initiating call:', error);
      throw error;
    }
  }

  /**
   * Open WhatsApp conversation with the contact.
   */
  static async openWhatsApp(
    phoneNumber: string,
    message?: string,
  ): Promise<boolean> {
    try {
      const clean = this.sanitizePhoneNumber(phoneNumber);
      if (!clean) {
        throw new Error('Invalid phone number');
      }
      return await ContactsNativeModule.openWhatsApp(clean, message || null);
    } catch (error) {
      console.warn('[ContactsService] Error opening WhatsApp:', error);
      throw error;
    }
  }

  /**
   * Send an SMS text message to the contact.
   */
  static async sendSMS(
    phoneNumber: string,
    message?: string,
  ): Promise<boolean> {
    try {
      const clean = this.sanitizePhoneNumber(phoneNumber);
      if (!clean) {
        throw new Error('Invalid phone number');
      }
      return await ContactsNativeModule.sendSMS(clean, message || null);
    } catch (error) {
      console.warn('[ContactsService] Error sending SMS:', error);
      throw error;
    }
  }

  /**
   * Remove invalid non-phone characters while keeping international + prefix.
   */
  static sanitizePhoneNumber(phoneNumber: string): string {
    if (!phoneNumber) return '';
    return phoneNumber.replace(/[^0-9+]/g, '').trim();
  }

  /**
   * Display friendly formatted phone number.
   */
  static formatPhoneNumber(phoneNumber: string): string {
    const clean = this.sanitizePhoneNumber(phoneNumber);
    if (!clean) return '';
    return clean;
  }
}
