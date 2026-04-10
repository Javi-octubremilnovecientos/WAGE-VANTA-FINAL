import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import premiumReducer from '../../features/premium/premiumSlice';
import themeReducer from '../../features/theme/themeSlice';
import { apiSlice } from '../../services/api';

export const rootReducer = combineReducers({
    auth: authReducer,
    premium: premiumReducer,
    theme: themeReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
