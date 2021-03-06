import { createSlice } from '@reduxjs/toolkit';

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    activeChat: null,
  },
  reducers: {
    setActiveChat: (state, { payload }) => {
      state.activeChat = payload;
    },
  },
});

export const { setActiveChat } = chatSlice.actions;

export default chatSlice.reducer;
