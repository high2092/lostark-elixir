import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  selectedAdviceIndex: number;
  selectedOptionIndex: number;
}

const initialState: UIState = {
  selectedAdviceIndex: null,
  selectedOptionIndex: null,
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
    resetUI(state) {
      Object.entries(initialState).forEach(([key, value]) => {
        state[key] = value;
      });
    },
  },
});

export const { setSelectedAdviceIndex, setSelectedOptionIndex, resetUI } = uiSlice.actions;
