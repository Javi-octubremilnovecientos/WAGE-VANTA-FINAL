import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';
import type { RootState } from './rootReducer';
import { apiSlice } from '../../services/api';

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(apiSlice.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type { RootState };
