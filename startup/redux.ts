import { configureStore } from '@reduxjs/toolkit';

import chatReducer from 'ducks/chat/chatSlice';
import modalReducer from 'ducks/modal/modalSlice';

const store = configureStore({
  reducer: {
    chat: chatReducer,
    modal: modalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
