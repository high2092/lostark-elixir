import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUTORIALS, TutorialStatus } from '../constants';

interface UIState {
  selectedAdviceIndex: number;
  selectedOptionIndex: number;
  tutorialIndex: number;
}

const initialState: UIState = {
  selectedAdviceIndex: null,
  selectedOptionIndex: null,
  tutorialIndex: TUTORIALS.length,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSelectedAdviceIndex(state, action: PayloadAction<number>) {
      state.selectedAdviceIndex = action.payload;
    },
    setSelectedOptionIndex(state, action: PayloadAction<number>) {
      state.selectedOptionIndex = action.payload;
    },
    initTutorial(state) {
      state.tutorialIndex = 0;
    },
    getNextTutorial(state) {
      if (state.tutorialIndex >= TUTORIALS.length) return;
      state.tutorialIndex++;
    },
    resetUI(state) {
      Object.entries(initialState).forEach(([key, value]) => {
        state[key] = value;
      });
    },
  },
});

export const { setSelectedAdviceIndex, setSelectedOptionIndex, initTutorial, getNextTutorial, resetUI } = uiSlice.actions;
