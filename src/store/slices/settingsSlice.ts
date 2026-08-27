import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  AppearanceSettings,
  ColorTheme,
  SizeScale,
} from '../../types/models';
import {saveAppearance} from '../../database/repository';

export const DEFAULT_APPEARANCE: AppearanceSettings = {
  theme: 'warm',
  textSize: 'large',
  iconSize: 'large',
  buttonSize: 'large',
  appearance: 'light',
};

export interface SettingsState {
  appearance: AppearanceSettings;
}

const initialState: SettingsState = {
  appearance: DEFAULT_APPEARANCE,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setAppearanceSettings: (
      state,
      action: PayloadAction<AppearanceSettings>,
    ) => {
      state.appearance = action.payload;
      saveAppearance(state.appearance);
    },
    setTheme: (state, action: PayloadAction<ColorTheme>) => {
      state.appearance.theme = action.payload;
      saveAppearance(state.appearance);
    },
    setTextSize: (state, action: PayloadAction<SizeScale>) => {
      state.appearance.textSize = action.payload;
      saveAppearance(state.appearance);
    },
    setIconSize: (state, action: PayloadAction<SizeScale>) => {
      state.appearance.iconSize = action.payload;
      saveAppearance(state.appearance);
    },
    setButtonSize: (state, action: PayloadAction<SizeScale>) => {
      state.appearance.buttonSize = action.payload;
      saveAppearance(state.appearance);
    },
    setAppearanceMode: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.appearance.appearance = action.payload;
      saveAppearance(state.appearance);
    },
    resetAppearance: state => {
      state.appearance = DEFAULT_APPEARANCE;
      saveAppearance(state.appearance);
    },
  },
});

export const {
  setAppearanceSettings,
  setTheme,
  setTextSize,
  setIconSize,
  setButtonSize,
  setAppearanceMode,
  resetAppearance,
} = settingsSlice.actions;

export default settingsSlice.reducer;
