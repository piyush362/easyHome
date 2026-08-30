import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  AppearanceSettings,
  ColorTheme,
  SizeScale,
  DrawerColumns,
  IconShape,
  ClockStyle,
  AppListLayout,
  DrawerGrid,
} from '../../types/models';
import {saveAppearance} from '../../database/repository';

export const DEFAULT_APPEARANCE: AppearanceSettings = {
  theme: 'warm',
  textSize: 'large',
  iconSize: 'large',
  buttonSize: 'large',
  appearance: 'light',
  drawerColumns: 4,
  drawerIconShape: 'circle',
  clockStyle: 'frosted',
  appListLayout: 'vertical',
  drawerGrid: '4x5',
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
    setDrawerColumns: (state, action: PayloadAction<DrawerColumns>) => {
      state.appearance.drawerColumns = action.payload;
      saveAppearance(state.appearance);
    },
    setDrawerGrid: (state, action: PayloadAction<DrawerGrid>) => {
      state.appearance.drawerGrid = action.payload;
      const cols = parseInt(action.payload.split('x')[0], 10) as DrawerColumns;
      if (cols === 3 || cols === 4 || cols === 5) {
        state.appearance.drawerColumns = cols;
      }
      saveAppearance(state.appearance);
    },
    setDrawerIconShape: (state, action: PayloadAction<IconShape>) => {
      state.appearance.drawerIconShape = action.payload;
      saveAppearance(state.appearance);
    },
    setClockStyle: (state, action: PayloadAction<ClockStyle>) => {
      state.appearance.clockStyle = action.payload;
      saveAppearance(state.appearance);
    },
    setAppListLayout: (state, action: PayloadAction<AppListLayout>) => {
      state.appearance.appListLayout = action.payload;
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
  setDrawerColumns,
  setDrawerGrid,
  setDrawerIconShape,
  setClockStyle,
  setAppListLayout,
  resetAppearance,
} = settingsSlice.actions;

export default settingsSlice.reducer;
