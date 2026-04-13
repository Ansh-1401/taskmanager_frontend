import { configureStore } from '@reduxjs/toolkit';
import { default as authReducer } from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});