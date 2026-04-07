import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const rootReducer = combineReducers({
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;