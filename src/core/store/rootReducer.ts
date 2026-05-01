import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import authReducer from '../../features/auth/authSlice';
import salaryReducer from '../../features/salaries/salarySlice';
import themeReducer from '../../features/theme/themeSlice';
import { apiSlice } from '../../services/api';
import { authPersistConfig } from './authPersistConfig';

// authReducer con persistencia anidada — solo persiste los campos del whitelist
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const rootReducer = combineReducers({
    auth: persistedAuthReducer,
    salary: salaryReducer,
    theme: themeReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
