import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {LauncherSettings} from '../../types/models';
import {saveLauncherSettings} from '../../database/repository';

export const DEFAULT_LAUNCHER_SETTINGS: LauncherSettings = {
  isDefaultLauncher: false,
  setupCompleted: false,
  setupStep: 0,
};

export interface LauncherState {
  settings: LauncherSettings;
}

const initialState: LauncherState = {
  settings: DEFAULT_LAUNCHER_SETTINGS,
};

export const launcherSlice = createSlice({
  name: 'launcher',
  initialState,
  reducers: {
    setLauncherSettings: (state, action: PayloadAction<LauncherSettings>) => {
      state.settings = action.payload;
      saveLauncherSettings(state.settings);
    },
    setIsDefault: (state, action: PayloadAction<boolean>) => {
      state.settings.isDefaultLauncher = action.payload;
      saveLauncherSettings(state.settings);
    },
    setSetupCompleted: (state, action: PayloadAction<boolean>) => {
      state.settings.setupCompleted = action.payload;
      saveLauncherSettings(state.settings);
    },
    setSetupStep: (state, action: PayloadAction<number>) => {
      state.settings.setupStep = action.payload;
      saveLauncherSettings(state.settings);
    },
    resetLauncherSettings: state => {
      state.settings = DEFAULT_LAUNCHER_SETTINGS;
      saveLauncherSettings(state.settings);
    },
  },
});

export const {
  setLauncherSettings,
  setIsDefault,
  setSetupCompleted,
  setSetupStep,
  resetLauncherSettings,
} = launcherSlice.actions;

export default launcherSlice.reducer;
