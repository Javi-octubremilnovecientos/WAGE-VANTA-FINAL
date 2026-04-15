import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import salaryReducer from '../../features/salaries/salarySlice';
import themeReducer from '../../features/theme/themeSlice';
import { apiSlice } from '../../services/api';

export const rootReducer = combineReducers({
    auth: authReducer,
    salary: salaryReducer,
    theme: themeReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
