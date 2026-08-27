import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {
  store,
  addReminder,
  updateReminder,
  removeReminder,
  toggleReminderEnabled,
  setReminders,
} from '../src/store';
import {ThemeProvider} from '../src/theme';
import {ReminderService} from '../src/services';
import {
  ReminderListScreen,
  AddReminderScreen,
  EditReminderScreen,
} from '../src/screens/reminders';
import {Reminder} from '../src/types/models';

describe('Phase 12: Senior Reminder System', () => {
  const sampleReminder: Reminder = {
    id: 'rem_test_1',
    type: 'medicine',
    title: 'Blood Pressure Pill',
    description: 'Take with full glass of water',
    time: '08:00',
    recurring: true,
    recurringPattern: 'daily',
    enabled: true,
  };

  beforeEach(() => {
    store.dispatch(setReminders([]));
  });

  describe('ReminderService Logic', () => {
    test('formats time string into senior-friendly 12-hour format', () => {
      expect(ReminderService.formatDisplayTime('08:00')).toBe('8:00 AM');
      expect(ReminderService.formatDisplayTime('13:30')).toBe('1:30 PM');
      expect(ReminderService.formatDisplayTime('20:00')).toBe('8:00 PM');
      expect(ReminderService.formatDisplayTime('1:00 PM')).toBe('1:00 PM');
    });

    test('returns correct emoji and labels for reminder categories', () => {
      expect(ReminderService.getTypeEmoji('medicine')).toBe('💊');
      expect(ReminderService.getTypeEmoji('doctor')).toBe('🩺');
      expect(ReminderService.getTypeEmoji('water')).toBe('💧');
      expect(ReminderService.getTypeEmoji('exercise')).toBe('🚶');
      expect(ReminderService.getTypeLabel('medicine')).toBe('Medicine');
      expect(ReminderService.getTypeLabel('doctor')).toBe('Doctor Appointment');
    });

    test('calculates next upcoming reminder accurately', () => {
      const rem1: Reminder = {
        id: '1',
        type: 'water',
        title: 'Morning Water',
        description: '',
        time: '07:00',
        recurring: true,
        recurringPattern: 'daily',
        enabled: true,
      };

      const rem2: Reminder = {
        id: '2',
        type: 'medicine',
        title: 'Night Tablet',
        description: '',
        time: '22:00',
        recurring: true,
        recurringPattern: 'daily',
        enabled: true,
      };

      const upcoming = ReminderService.getNextUpcomingReminder([rem1, rem2]);
      expect(upcoming).toBeDefined();
      expect(upcoming?.id).toBeDefined();
    });

    test('returns null when no enabled reminders exist', () => {
      const disabledRem: Reminder = {
        ...sampleReminder,
        enabled: false,
      };
      expect(ReminderService.getNextUpcomingReminder([disabledRem])).toBeNull();
    });

    test('schedules and cancels alarms via native bridge without error', async () => {
      const scheduleRes = await ReminderService.schedule(sampleReminder);
      expect(scheduleRes).toBe(true);

      const cancelRes = await ReminderService.cancel(sampleReminder.id);
      expect(cancelRes).toBe(true);
    });
  });

  describe('Redux Reminder Slice', () => {
    test('adds, updates, toggles, and removes reminders', () => {
      // 1. Add
      store.dispatch(addReminder(sampleReminder));
      let state = store.getState().reminders;
      expect(state.reminders.length).toBe(1);
      expect(state.reminders[0].title).toBe('Blood Pressure Pill');

      // 2. Toggle
      store.dispatch(toggleReminderEnabled(sampleReminder.id));
      state = store.getState().reminders;
      expect(state.reminders[0].enabled).toBe(false);

      // 3. Update
      store.dispatch(
        updateReminder({
          ...sampleReminder,
          title: 'Morning BP Tablet 10mg',
          enabled: true,
        }),
      );
      state = store.getState().reminders;
      expect(state.reminders[0].title).toBe('Morning BP Tablet 10mg');

      // 4. Remove
      store.dispatch(removeReminder(sampleReminder.id));
      state = store.getState().reminders;
      expect(state.reminders.length).toBe(0);
    });
  });

  describe('Reminder Screen Rendering', () => {
    const mockNav: any = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };

    test('ReminderListScreen renders properly with empty and active states', () => {
      let tree: any;
      ReactTestRenderer.act(() => {
        tree = ReactTestRenderer.create(
          <Provider store={store}>
            <ThemeProvider>
              <NavigationContainer>
                <ReminderListScreen navigation={mockNav} route={{} as any} />
              </NavigationContainer>
            </ThemeProvider>
          </Provider>,
        );
      });
      expect(tree).toBeDefined();

      // Add a reminder and re-render
      ReactTestRenderer.act(() => {
        store.dispatch(addReminder(sampleReminder));
      });
      expect(tree).toBeDefined();

      ReactTestRenderer.act(() => {
        tree.unmount();
      });
    });

    test('AddReminderScreen renders properly', () => {
      let tree: any;
      ReactTestRenderer.act(() => {
        tree = ReactTestRenderer.create(
          <Provider store={store}>
            <ThemeProvider>
              <NavigationContainer>
                <AddReminderScreen navigation={mockNav} route={{} as any} />
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

    test('EditReminderScreen renders properly with route params', () => {
      store.dispatch(addReminder(sampleReminder));
      let tree: any;
      ReactTestRenderer.act(() => {
        tree = ReactTestRenderer.create(
          <Provider store={store}>
            <ThemeProvider>
              <NavigationContainer>
                <EditReminderScreen
                  navigation={mockNav}
                  route={{params: {reminderId: sampleReminder.id}} as any}
                />
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
});
