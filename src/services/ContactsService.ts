import {Linking} from 'react-native';
import {
  ContactsNativeModule,
  DeviceContact,
} from '../native/ContactsNativeModule';

export type {DeviceContact};

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
   * Check if CALL_PHONE runtime permission is granted.
   */
  static async hasCallPermission(): Promise<boolean> {
    try {
      if (typeof ContactsNativeModule?.hasCallPermission === 'function') {
        return await ContactsNativeModule.hasCallPermission();
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Request CALL_PHONE runtime permission from user.
   */
  static async requestCallPermission(): Promise<boolean> {
    try {
      if (typeof ContactsNativeModule?.requestCallPermission === 'function') {
        return await ContactsNativeModule.requestCallPermission();
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Make a direct phone call immediately.
   * Prompts CALL_PHONE permission on first use so calls dial instantly without opening dialer!
   */
  static async makeDirectCall(phoneNumber: string): Promise<boolean> {
    try {
      const clean = this.sanitizePhoneNumber(phoneNumber);
      if (!clean) {
        return await this.openDialer();
      }

      // Check / request CALL_PHONE permission for instant one-tap calling
      const hasCallPerm = await this.hasCallPermission();
      if (!hasCallPerm) {
        await this.requestCallPermission();
      }

      if (typeof ContactsNativeModule?.makeDirectCall === 'function') {
        return await ContactsNativeModule.makeDirectCall(clean);
      }
      await Linking.openURL(`tel:${clean}`);
      return true;
    } catch (error) {
      console.warn('[ContactsService] Error initiating call:', error);
      try {
        const clean = this.sanitizePhoneNumber(phoneNumber);
        await Linking.openURL(clean ? `tel:${clean}` : 'tel:');
        return true;
      } catch (linkingErr) {
        throw error;
      }
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
      if (typeof ContactsNativeModule?.openWhatsApp === 'function') {
        return await ContactsNativeModule.openWhatsApp(clean, message || null);
      }
      const textParam = message ? `&text=${encodeURIComponent(message)}` : '';
      await Linking.openURL(`https://api.whatsapp.com/send?phone=${clean}${textParam}`);
      return true;
    } catch (error) {
      console.warn('[ContactsService] Error opening WhatsApp:', error);
      const clean = this.sanitizePhoneNumber(phoneNumber);
      if (clean) {
        await Linking.openURL(`https://api.whatsapp.com/send?phone=${clean}`);
        return true;
      }
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
      if (typeof ContactsNativeModule?.sendSMS === 'function') {
        return await ContactsNativeModule.sendSMS(clean, message || null);
      }
      await Linking.openURL(`sms:${clean}`);
      return true;
    } catch (error) {
      console.warn('[ContactsService] Error sending SMS:', error);
      const clean = this.sanitizePhoneNumber(phoneNumber);
      if (clean) {
        await Linking.openURL(`sms:${clean}`);
        return true;
      }
      throw error;
    }
  }

  /**
   * Open the default system Phone dialer.
   */
  static async openDialer(): Promise<boolean> {
    try {
      if (typeof ContactsNativeModule?.openDialer === 'function') {
        return await ContactsNativeModule.openDialer();
      }
      await Linking.openURL('tel:');
      return true;
    } catch (error) {
      try {
        await Linking.openURL('tel:');
        return true;
      } catch (linkingError) {
        console.warn('[ContactsService] Error opening dialer via Linking:', linkingError);
        throw linkingError;
      }
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
