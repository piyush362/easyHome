import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {HomeAction} from '../../types/models';
import {saveHomeActions} from '../../database/repository';

export const DEFAULT_HOME_ACTIONS: HomeAction[] = [
  {id: 'action-call', type: 'call', label: 'Call', enabled: true, order: 0},
  {id: 'action-whatsapp', type: 'whatsapp', label: 'WhatsApp', enabled: true, order: 1},
  {id: 'action-camera', type: 'camera', label: 'Photo', enabled: true, order: 2},
  {id: 'action-selfie', type: 'selfie', label: 'Selfie', enabled: true, order: 3},
  {id: 'action-video', type: 'video', label: 'Video', enabled: true, order: 4},
  {id: 'action-youtube', type: 'youtube', label: 'YouTube', enabled: true, order: 5},
  {id: 'action-instagram', type: 'instagram', label: 'Instagram', enabled: true, order: 6},
  {id: 'action-photos', type: 'photos', label: 'Photos', enabled: true, order: 7},
  {id: 'action-torch', type: 'torch', label: 'Torch', enabled: true, order: 8},
  {id: 'action-reminder', type: 'reminder', label: 'Reminders', enabled: true, order: 9},
  {id: 'action-help', type: 'help', label: 'Help', enabled: true, order: 10},
];

export interface HomeState {
  actions: HomeAction[];
}

const initialState: HomeState = {
  actions: DEFAULT_HOME_ACTIONS,
};

export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setActions: (state, action: PayloadAction<HomeAction[]>) => {
      state.actions = action.payload;
      saveHomeActions(state.actions);
    },
    updateAction: (state, action: PayloadAction<HomeAction>) => {
      const index = state.actions.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.actions[index] = action.payload;
        saveHomeActions(state.actions);
      }
    },
    toggleActionEnabled: (state, action: PayloadAction<string>) => {
      const target = state.actions.find(a => a.id === action.payload);
      if (target) {
        target.enabled = !target.enabled;
        saveHomeActions(state.actions);
      }
    },
    reorderActions: (state, action: PayloadAction<HomeAction[]>) => {
      state.actions = action.payload.map((item, index) => ({
        ...item,
        order: index,
      }));
      saveHomeActions(state.actions);
    },
    resetDefaultActions: state => {
      state.actions = DEFAULT_HOME_ACTIONS;
      saveHomeActions(state.actions);
    },
  },
});

export const {
  setActions,
  updateAction,
  toggleActionEnabled,
  reorderActions,
  resetDefaultActions,
} = homeSlice.actions;

export default homeSlice.reducer;
