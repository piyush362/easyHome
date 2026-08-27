import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {InstalledApp} from '../../types/models';
import {AppsService} from '../../services/AppsService';

export interface AppsState {
  installedApps: InstalledApp[];
  importantApps: string[]; // packageNames of important apps
  searchQuery: string;
  isLoading: boolean;
}

const initialState: AppsState = {
  installedApps: [],
  importantApps: [],
  searchQuery: '',
  isLoading: false,
};

/**
 * Async thunk to fetch installed applications from Android device.
 */
export const fetchInstalledApps = createAsyncThunk(
  'apps/fetchInstalledApps',
  async (forceRefresh: boolean = false) => {
    return await AppsService.getInstalledApps(forceRefresh);
  },
);

export const appsSlice = createSlice({
  name: 'apps',
  initialState,
  reducers: {
    setInstalledApps: (state, action: PayloadAction<InstalledApp[]>) => {
      state.installedApps = action.payload;
    },
    setImportantApps: (state, action: PayloadAction<string[]>) => {
      state.importantApps = action.payload;
    },
    toggleImportantApp: (state, action: PayloadAction<string>) => {
      const pkg = action.payload;
      if (state.importantApps.includes(pkg)) {
        state.importantApps = state.importantApps.filter(p => p !== pkg);
      } else {
        state.importantApps.push(pkg);
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setAppsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchInstalledApps.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchInstalledApps.fulfilled, (state, action) => {
        state.installedApps = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchInstalledApps.rejected, state => {
        state.isLoading = false;
      });
  },
});

export const {
  setInstalledApps,
  setImportantApps,
  toggleImportantApp,
  setSearchQuery,
  setAppsLoading,
} = appsSlice.actions;

export default appsSlice.reducer;
