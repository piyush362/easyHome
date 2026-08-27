import {createMMKV, type MMKV} from 'react-native-mmkv';

export const mmkvInstance: MMKV = createMMKV({
  id: 'easyhome-storage',
});

/**
 * Persist an arbitrary JSON-serializable object by key.
 */
export function setItem<T>(key: string, value: T): void {
  try {
    const jsonValue = JSON.stringify(value);
    mmkvInstance.set(key, jsonValue);
  } catch (error) {
    console.error(`[MMKV] Error saving key "${key}":`, error);
  }
}

/**
 * Retrieve and parse a JSON object from MMKV by key.
 */
export function getItem<T>(key: string): T | null {
  try {
    const raw = mmkvInstance.getString(key);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`[MMKV] Error reading key "${key}":`, error);
    return null;
  }
}

/**
 * Remove an item by key from MMKV.
 */
export function removeItem(key: string): boolean {
  try {
    return mmkvInstance.remove(key);
  } catch (error) {
    console.error(`[MMKV] Error removing key "${key}":`, error);
    return false;
  }
}

/**
 * Clear all data from the EasyHome storage instance.
 */
export function clearAll(): void {
  try {
    mmkvInstance.clearAll();
  } catch (error) {
    console.error('[MMKV] Error clearing storage:', error);
  }
}
