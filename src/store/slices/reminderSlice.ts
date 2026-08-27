import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Reminder} from '../../types/models';
import {saveReminders} from '../../database/repository';

export interface ReminderState {
  reminders: Reminder[];
}

const initialState: ReminderState = {
  reminders: [],
};

export const reminderSlice = createSlice({
  name: 'reminders',
  initialState,
  reducers: {
    setReminders: (state, action: PayloadAction<Reminder[]>) => {
      state.reminders = action.payload;
      saveReminders(state.reminders);
    },
    addReminder: (state, action: PayloadAction<Reminder>) => {
      state.reminders.push(action.payload);
      saveReminders(state.reminders);
    },
    updateReminder: (state, action: PayloadAction<Reminder>) => {
      const index = state.reminders.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.reminders[index] = action.payload;
        saveReminders(state.reminders);
      }
    },
    removeReminder: (state, action: PayloadAction<string>) => {
      state.reminders = state.reminders.filter(r => r.id !== action.payload);
      saveReminders(state.reminders);
    },
    toggleReminderEnabled: (state, action: PayloadAction<string>) => {
      const target = state.reminders.find(r => r.id === action.payload);
      if (target) {
        target.enabled = !target.enabled;
        saveReminders(state.reminders);
      }
    },
    clearAllReminders: state => {
      state.reminders = [];
      saveReminders([]);
    },
  },
});

export const {
  setReminders,
  addReminder,
  updateReminder,
  removeReminder,
  toggleReminderEnabled,
  clearAllReminders,
} = reminderSlice.actions;

export default reminderSlice.reducer;
