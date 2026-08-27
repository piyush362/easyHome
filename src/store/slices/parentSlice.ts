import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Parent} from '../../types/models';
import {saveParent} from '../../database/repository';

export interface ParentState {
  profile: Parent | null;
}

const initialState: ParentState = {
  profile: null,
};

export const parentSlice = createSlice({
  name: 'parent',
  initialState,
  reducers: {
    setParent: (state, action: PayloadAction<Parent | null>) => {
      state.profile = action.payload;
      saveParent(action.payload);
    },
    updateParent: (state, action: PayloadAction<Partial<Parent>>) => {
      if (state.profile) {
        state.profile = {...state.profile, ...action.payload};
        saveParent(state.profile);
      }
    },
    clearParent: state => {
      state.profile = null;
      saveParent(null);
    },
  },
});

export const {setParent, updateParent, clearParent} = parentSlice.actions;

export default parentSlice.reducer;
