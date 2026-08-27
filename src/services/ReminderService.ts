import {Reminder, ReminderType} from '../types/models';
import {ReminderNativeModule} from '../native/ReminderNativeModule';

class ReminderServiceClass {
  /**
   * Initializes notification channels on startup.
   */
  async init(): Promise<void> {
    try {
      await ReminderNativeModule.createNotificationChannel();
    } catch (e) {
      console.warn('Failed to initialize reminder notification channel:', e);
    }
  }

  /**
   * Converts a time string (e.g., "08:00", "13:30", "1:00 PM") into epoch milliseconds for the next occurrence.
   */
  parseTimeToMillis(timeStr: string): number {
    const now = new Date();
    let hours = 8;
    let minutes = 0;

    const trimmed = timeStr.trim().toLowerCase();

    // Check for 12-hour format e.g. "1:30 pm"
    if (trimmed.includes('am') || trimmed.includes('pm')) {
      const isPm = trimmed.includes('pm');
      const cleanStr = trimmed.replace('am', '').replace('pm', '').trim();
      const parts = cleanStr.split(':');
      hours = parseInt(parts[0], 10) || 0;
      minutes = parts.length > 1 ? parseInt(parts[1], 10) || 0 : 0;
      if (isPm && hours < 12) {
        hours += 12;
      } else if (!isPm && hours === 12) {
        hours = 0;
      }
    } else if (trimmed.includes(':')) {
      // 24-hour format e.g. "14:30"
      const parts = trimmed.split(':');
      hours = parseInt(parts[0], 10) || 0;
      minutes = parseInt(parts[1], 10) || 0;
    }

    const scheduledDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
      0,
      0,
    );

    // If the scheduled time today has already passed, schedule for tomorrow
    if (scheduledDate.getTime() <= now.getTime()) {
      scheduledDate.setDate(scheduledDate.getDate() + 1);
    }

    return scheduledDate.getTime();
  }

  /**
   * Formats a time string into senior-friendly 12-hour format (e.g. "8:00 AM", "1:30 PM").
   */
  formatDisplayTime(timeStr: string): string {
    if (!timeStr) return '';
    const trimmed = timeStr.trim().toLowerCase();

    if (trimmed.includes('am') || trimmed.includes('pm')) {
      return timeStr.toUpperCase();
    }

    if (trimmed.includes(':')) {
      const parts = trimmed.split(':');
      let hours = parseInt(parts[0], 10) || 0;
      const minutes = parts[1] || '00';
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const cleanMin = minutes.length === 1 ? `0${minutes}` : minutes;
      return `${hours}:${cleanMin} ${ampm}`;
    }

    return timeStr;
  }

  /**
   * Returns emoji symbol for reminder category.
   */
  getTypeEmoji(type: ReminderType): string {
    switch (type) {
      case 'medicine':
        return '💊';
      case 'doctor':
        return '🩺';
      case 'water':
        return '💧';
      case 'exercise':
        return '🚶';
      case 'family':
        return '❤️';
      case 'event':
      default:
        return '⏰';
    }
  }

  /**
   * Returns readable category name.
   */
  getTypeLabel(type: ReminderType): string {
    switch (type) {
      case 'medicine':
        return 'Medicine';
      case 'doctor':
        return 'Doctor Appointment';
      case 'water':
        return 'Drink Water';
      case 'exercise':
        return 'Walk / Exercise';
      case 'family':
        return 'Family Call';
      case 'event':
      default:
        return 'Reminder';
    }
  }

  /**
   * Schedules an Android alarm notification for a reminder.
   */
  async schedule(reminder: Reminder): Promise<boolean> {
    if (!reminder.enabled) {
      return this.cancel(reminder.id);
    }

    const timeMillis = this.parseTimeToMillis(reminder.time);
    const emoji = this.getTypeEmoji(reminder.type);
    const message =
      reminder.description ||
      `It is time for your scheduled ${reminder.title.toLowerCase()}.`;

    return ReminderNativeModule.scheduleReminder(
      reminder.id,
      `${emoji} ${reminder.title}`,
      message,
      reminder.type,
      timeMillis,
      reminder.recurring,
      reminder.recurringPattern,
    );
  }

  /**
   * Cancels a scheduled Android alarm.
   */
  async cancel(reminderId: string): Promise<boolean> {
    return ReminderNativeModule.cancelReminder(reminderId);
  }

  /**
   * Finds the closest upcoming enabled reminder for display on Home Screen.
   */
  getNextUpcomingReminder(reminders: Reminder[]): Reminder | null {
    const enabledReminders = reminders.filter(r => r.enabled);
    if (enabledReminders.length === 0) {
      return null;
    }

    const now = Date.now();
    let closestReminder: Reminder | null = null;
    let closestTimeDiff = Number.MAX_SAFE_INTEGER;

    for (const reminder of enabledReminders) {
      const scheduledMillis = this.parseTimeToMillis(reminder.time);
      const diff = scheduledMillis - now;

      if (diff >= 0 && diff < closestTimeDiff) {
        closestTimeDiff = diff;
        closestReminder = reminder;
      }
    }

    return closestReminder || enabledReminders[0];
  }
}

export const ReminderService = new ReminderServiceClass();
