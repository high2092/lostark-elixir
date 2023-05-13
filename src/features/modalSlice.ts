import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ModalType } from '../type/common';

interface ModalMetadata {
  type: ModalType;
  props?: Record<string, any>;
}

interface ModalState {
  modals: ModalMetadata[];
}

const initialState: ModalState = {
  modals: [],
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<ModalMetadata>) {
      const type = action.payload;
      state.modals.push(type);
    },

    closeModal(state) {
      state.modals.pop();
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
