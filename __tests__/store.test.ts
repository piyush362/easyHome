import {store} from '../src/store/store';
import {setParent, updateParent} from '../src/store/slices/parentSlice';
import {addMember, removeMember} from '../src/store/slices/familySlice';
import {
  setTheme,
  setTextSize,
  setDrawerColumns,
  setDrawerIconShape,
} from '../src/store/slices/settingsSlice';
import {addReminder, toggleReminderEnabled} from '../src/store/slices/reminderSlice';
import {setEmergencyContactId, setSettingsProtected} from '../src/store/slices/safetySlice';
import {setIsDefault, setSetupStep} from '../src/store/slices/launcherSlice';
import {toggleActionEnabled} from '../src/store/slices/homeSlice';

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

describe('Redux Store & Slices', () => {
  test('Parent Slice updates correctly', () => {
    store.dispatch(setParent({id: '1', name: 'John Doe', photo: null}));
    expect(store.getState().parent.profile?.name).toBe('John Doe');

    store.dispatch(updateParent({name: 'Jane Doe'}));
    expect(store.getState().parent.profile?.name).toBe('Jane Doe');
  });

  test('Family Slice updates correctly', () => {
    store.dispatch(
      addMember({
        id: 'f1',
        name: 'Daughter Alice',
        relationship: 'Daughter',
        phoneNumber: '+1234567890',
        photo: null,
        preferredCommunication: 'call',
      }),
    );
    expect(store.getState().family.members.length).toBe(1);
    expect(store.getState().family.members[0].name).toBe('Daughter Alice');

    store.dispatch(removeMember('f1'));
    expect(store.getState().family.members.length).toBe(0);
  });

  test('Settings Slice updates correctly for solid and wallpaper themes', () => {
    store.dispatch(setTheme('ocean'));
    expect(store.getState().settings.appearance.theme).toBe('ocean');

    store.dispatch(setTheme('midnightBloom'));
    expect(store.getState().settings.appearance.theme).toBe('midnightBloom');

    store.dispatch(setTheme('sunsetWave'));
    expect(store.getState().settings.appearance.theme).toBe('sunsetWave');

    store.dispatch(setTheme('auroraCyan'));
    expect(store.getState().settings.appearance.theme).toBe('auroraCyan');

    store.dispatch(setTextSize('extraLarge'));
    expect(store.getState().settings.appearance.textSize).toBe('extraLarge');

    store.dispatch(setDrawerColumns(4));
    expect(store.getState().settings.appearance.drawerColumns).toBe(4);

    store.dispatch(setDrawerIconShape('rounded'));
    expect(store.getState().settings.appearance.drawerIconShape).toBe('rounded');
  });

  test('Home Slice toggles actions', () => {
    const callAction = store.getState().home.actions.find(a => a.type === 'call');
    expect(callAction?.enabled).toBe(true);

    if (callAction) {
      store.dispatch(toggleActionEnabled(callAction.id));
      const updated = store.getState().home.actions.find(a => a.id === callAction.id);
      expect(updated?.enabled).toBe(false);
    }
  });

  test('Reminder Slice handles reminders', () => {
    store.dispatch(
      addReminder({
        id: 'r1',
        type: 'medicine',
        title: 'Morning pill',
        description: 'Take with water',
        time: '08:00',
        recurring: true,
        recurringPattern: 'daily',
        enabled: true,
      }),
    );
    expect(store.getState().reminders.reminders.length).toBe(1);

    store.dispatch(toggleReminderEnabled('r1'));
    expect(store.getState().reminders.reminders[0].enabled).toBe(false);
  });

  test('Safety and Launcher slices update correctly', () => {
    store.dispatch(setEmergencyContactId('f1'));
    expect(store.getState().safety.settings.emergencyContactId).toBe('f1');

    store.dispatch(setSettingsProtected(true));
    expect(store.getState().safety.settings.settingsProtected).toBe(true);

    store.dispatch(setIsDefault(true));
    expect(store.getState().launcher.settings.isDefaultLauncher).toBe(true);

    store.dispatch(setSetupStep(3));
    expect(store.getState().launcher.settings.setupStep).toBe(3);
  });
});
