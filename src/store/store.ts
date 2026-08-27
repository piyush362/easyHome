import {configureStore, createAsyncThunk} from '@reduxjs/toolkit';
import appReducer, {setInitialized, setLoading} from './slices/appSlice';
import parentReducer, {setParent} from './slices/parentSlice';
import familyReducer, {setMembers} from './slices/familySlice';
import homeReducer, {setActions} from './slices/homeSlice';
import settingsReducer, {setAppearanceSettings} from './slices/settingsSlice';
import reminderReducer, {setReminders} from './slices/reminderSlice';
import launcherReducer, {setLauncherSettings} from './slices/launcherSlice';
import safetyReducer, {setSafetySettings} from './slices/safetySlice';
import appsReducer from './slices/appsSlice';
import {loadAllPersistedData} from '../database/repository';

export const store = configureStore({
  reducer: {
    app: appReducer,
    parent: parentReducer,
    family: familyReducer,
    home: homeReducer,
    settings: settingsReducer,
    reminders: reminderReducer,
    launcher: launcherReducer,
    safety: safetyReducer,
    apps: appsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

/**
 * Thunk to restore all persisted configuration from MMKV into Redux state on app startup.
 */
export const restoreAppState = createAsyncThunk(
  'app/restoreState',
  async (_, {dispatch}) => {
    try {
      dispatch(setLoading(true));
      const persisted = loadAllPersistedData();

      if (persisted.parent) {
        dispatch(setParent(persisted.parent));
      }
      if (persisted.family && persisted.family.length > 0) {
        dispatch(setMembers(persisted.family));
      }
      if (persisted.homeActions && persisted.homeActions.length > 0) {
        dispatch(setActions(persisted.homeActions));
      }
      if (persisted.appearance) {
        dispatch(setAppearanceSettings(persisted.appearance));
      }
      if (persisted.reminders && persisted.reminders.length > 0) {
        dispatch(setReminders(persisted.reminders));
      }
      if (persisted.launcher) {
        dispatch(setLauncherSettings(persisted.launcher));
      }
      if (persisted.safety) {
        dispatch(setSafetySettings(persisted.safety));
      }

      dispatch(setInitialized(true));
    } catch (error) {
      console.error('[Store] Failed to restore app state from storage:', error);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
