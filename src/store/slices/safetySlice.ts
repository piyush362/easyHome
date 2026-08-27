import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {SafetySettings} from '../../types/models';
import {saveSafetySettings} from '../../database/repository';

export const DEFAULT_SAFETY_SETTINGS: SafetySettings = {
  emergencyContactId: null,
  emergencyNumber: '112',
  locationSharingEnabled: false,
  familyPIN: null,
  settingsProtected: false,
};

export interface SafetyState {
  settings: SafetySettings;
}

const initialState: SafetyState = {
  settings: DEFAULT_SAFETY_SETTINGS,
};

export const safetySlice = createSlice({
  name: 'safety',
  initialState,
  reducers: {
    setSafetySettings: (state, action: PayloadAction<SafetySettings>) => {
      state.settings = action.payload;
      saveSafetySettings(state.settings);
    },
    setEmergencyContactId: (state, action: PayloadAction<string | null>) => {
      state.settings.emergencyContactId = action.payload;
      saveSafetySettings(state.settings);
    },
    setEmergencyNumber: (state, action: PayloadAction<string>) => {
      state.settings.emergencyNumber = action.payload;
      saveSafetySettings(state.settings);
    },
    setLocationSharingEnabled: (state, action: PayloadAction<boolean>) => {
      state.settings.locationSharingEnabled = action.payload;
      saveSafetySettings(state.settings);
    },
    setFamilyPIN: (state, action: PayloadAction<string | null>) => {
      state.settings.familyPIN = action.payload;
      saveSafetySettings(state.settings);
    },
    setSettingsProtected: (state, action: PayloadAction<boolean>) => {
      state.settings.settingsProtected = action.payload;
      saveSafetySettings(state.settings);
    },
    resetSafetySettings: state => {
      state.settings = DEFAULT_SAFETY_SETTINGS;
      saveSafetySettings(state.settings);
    },
  },
});

export const {
  setSafetySettings,
  setEmergencyContactId,
  setEmergencyNumber,
  setLocationSharingEnabled,
  setFamilyPIN,
  setSettingsProtected,
  resetSafetySettings,
} = safetySlice.actions;

export default safetySlice.reducer;
