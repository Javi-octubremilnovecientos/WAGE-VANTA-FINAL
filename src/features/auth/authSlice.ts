import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserData, Template, Comparison, PayData } from '@/lib/User';

export interface User extends UserData {
    id: string;
    email: string;
    newEmail?: string; // Email pendiente de confirmación
}

interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{
                user: User;
                token: string;
                refreshToken: string;
            }>,
        ) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        updateTemplates: (state, action: PayloadAction<Template[]>) => {
            if (state.user) {
                state.user.templates = action.payload;
            }
        },
        updatePremium: (state, action: PayloadAction<boolean>) => {
            if (state.user) {
                state.user.premium = action.payload;
            }
        },
        updateComparisons: (state, action: PayloadAction<Comparison[]>) => {
            if (state.user) {
                state.user.comparisons = action.payload;
            }
        },
        updatePayData: (state, action: PayloadAction<PayData>) => {
            if (state.user) {
                state.user.payData = action.payload;
            }
        },
        patchUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
    },
});

export const {
    setCredentials,
    loginFailure,
    logout,
    clearError,
    updateTemplates,
    updatePremium,
    updateComparisons,
    updatePayData,
    patchUser,
} = authSlice.actions;

// Selectores
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
    state.auth.isAuthenticated;
export const selectUserPremium = (state: { auth: AuthState }) =>
    state.auth.user?.premium ?? false;
export const selectUserTemplates = (state: { auth: AuthState }) =>
    state.auth.user?.templates ?? [];
export const selectUserComparisons = (state: { auth: AuthState }) =>
    state.auth.user?.comparisons ?? [];
export const selectUserPayData = (state: { auth: AuthState }) =>
    state.auth.user?.payData;

export default authSlice.reducer;
