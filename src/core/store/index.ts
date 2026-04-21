import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import {
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import { persistedReducer } from './persistConfig';
import type { RootState } from './rootReducer';
import { apiSlice } from '../../services/api';

/**
 * Store configurado con Redux Persist
 * 
 * - Usa persistedReducer para mantener auth en storage
 * - Ignora acciones de redux-persist en serializableCheck
 * - Exporta persistor para envolver la app con PersistGate
 */

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type { RootState };
