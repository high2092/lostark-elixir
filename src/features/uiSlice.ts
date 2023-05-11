import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUTORIALS, TutorialStatus } from '../constants';

interface UIState {
  selectedAdviceIndex: number;
  selectedOptionIndex: number;
  tutorialIndex: number;
  hideBackgroundImage: boolean;
  resetCount: number;
}

const initialState: UIState = {
  selectedAdviceIndex: null,
  selectedOptionIndex: null,
  tutorialIndex: TUTORIALS.length,
  hideBackgroundImage: false,
  resetCount: 0,
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
      state.selectedAdviceIndex = initialState.selectedAdviceIndex;
      state.selectedOptionIndex = initialState.selectedOptionIndex;
      state.tutorialIndex = initialState.tutorialIndex;
      state.resetCount = state.resetCount + 1;
    },
    setHideBackgroundImage(state, action: PayloadAction<boolean>) {
      state.hideBackgroundImage = action.payload;
    },
  },
});

export const { setSelectedAdviceIndex, setSelectedOptionIndex, initTutorial, getNextTutorial, resetUI, setHideBackgroundImage } = uiSlice.actions;
