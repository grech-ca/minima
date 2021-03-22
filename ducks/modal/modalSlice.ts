import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';

const modalNames = ['CREATE_CHAT', 'EDIT_USER', 'MOBILE_CHATS'] as const;

export type ModalName = typeof modalNames[number];

interface InitialState {
  modal: ModalName | null;
}

export const modalSlice = createSlice<InitialState, SliceCaseReducers<InitialState>, 'modal'>({
  name: 'modal',
  initialState: {
    modal: null,
  },
  reducers: {
    setModal: (state, { payload }) => {
      state.modal = payload;
    },
  },
});

export const { setModal } = modalSlice.actions;

export default modalSlice.reducer;
