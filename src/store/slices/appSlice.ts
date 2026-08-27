import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppStatus} from '../../types/models';

const initialState: AppStatus = {
  isLoading: true,
  isInitialized: false,
  error: null,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetAppStatus: state => {
      state.isLoading = false;
      state.isInitialized = false;
      state.error = null;
    },
  },
});

export const {setLoading, setInitialized, setError, resetAppStatus} =
  appSlice.actions;

export default appSlice.reducer;
