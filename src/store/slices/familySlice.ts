import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {FamilyMember} from '../../types/models';
import {saveFamily} from '../../database/repository';

export interface FamilyState {
  members: FamilyMember[];
}

const initialState: FamilyState = {
  members: [],
};

export const familySlice = createSlice({
  name: 'family',
  initialState,
  reducers: {
    setMembers: (state, action: PayloadAction<FamilyMember[]>) => {
      state.members = action.payload;
      saveFamily(state.members);
    },
    addMember: (state, action: PayloadAction<FamilyMember>) => {
      state.members.push(action.payload);
      saveFamily(state.members);
    },
    updateMember: (state, action: PayloadAction<FamilyMember>) => {
      const index = state.members.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.members[index] = action.payload;
        saveFamily(state.members);
      }
    },
    removeMember: (state, action: PayloadAction<string>) => {
      state.members = state.members.filter(m => m.id !== action.payload);
      saveFamily(state.members);
    },
  },
});

export const {setMembers, addMember, updateMember, removeMember} =
  familySlice.actions;

export default familySlice.reducer;
