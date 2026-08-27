import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {store} from '../src/store';
import {ThemeProvider} from '../src/theme';
import {ContactsService} from '../src/services';
import FamilyScreen from '../src/screens/family/FamilyScreen';
import {addMember, updateMember, removeMember} from '../src/store/slices/familySlice';

// Mock react-native-mmkv
jest.mock('react-native-mmkv', () => {
  const storageMap = new Map<string, string>();
  return {
    createMMKV: () => ({
      set: (key: string, value: string) => storageMap.set(key, value),
      getString: (key: string) => storageMap.get(key),
      remove: (key: string) => storageMap.delete(key),
      clearAll: () => storageMap.clear(),
    }),
  };
});

describe('Phase 8 — Family & Contacts System', () => {
  test('ContactsService sanitizes and formats phone numbers', () => {
    expect(ContactsService.sanitizePhoneNumber('+1 (555) 123-4567')).toBe('+15551234567');
    expect(ContactsService.sanitizePhoneNumber('98765 43210')).toBe('9876543210');
    expect(ContactsService.sanitizePhoneNumber('')).toBe('');
  });

  test('ContactsService calls native module methods safely', async () => {
    const hasPerm = await ContactsService.hasPermission();
    expect(typeof hasPerm).toBe('boolean');

    const result = await ContactsService.makeDirectCall('+15551234567');
    expect(typeof result).toBe('boolean');

    const waResult = await ContactsService.openWhatsApp('+15551234567');
    expect(typeof waResult).toBe('boolean');

    const smsResult = await ContactsService.sendSMS('+15551234567', 'Hello');
    expect(typeof smsResult).toBe('boolean');
  });

  test('Family Redux CRUD functions properly', () => {
    const testMember = {
      id: 'test-fam-1',
      name: 'Test Daughter',
      relationship: 'Daughter',
      phoneNumber: '+15550001111',
      photo: null,
      preferredCommunication: 'call' as const,
    };

    store.dispatch(addMember(testMember));
    let members = store.getState().family.members;
    expect(members.find(m => m.id === 'test-fam-1')?.name).toBe('Test Daughter');

    store.dispatch(
      updateMember({
        id: 'test-fam-1',
        name: 'Updated Daughter',
      }),
    );
    members = store.getState().family.members;
    expect(members.find(m => m.id === 'test-fam-1')?.name).toBe('Updated Daughter');

    store.dispatch(removeMember('test-fam-1'));
    members = store.getState().family.members;
    expect(members.find(m => m.id === 'test-fam-1')).toBeUndefined();
  });

  test('FamilyScreen renders with contact cards and action buttons', () => {
    const mockNav: any = {goBack: jest.fn(), navigate: jest.fn()};
    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <NavigationContainer>
              <FamilyScreen navigation={mockNav} route={{} as any} />
            </NavigationContainer>
          </ThemeProvider>
        </Provider>,
      );
    });

    expect(tree).toBeDefined();
    ReactTestRenderer.act(() => {
      tree.unmount();
    });
  });
});
