import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
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
    rememberMe: boolean;
    savedEmail: string | null; // Email guardado cuando rememberMe está activo
}

const initialState: AuthState = {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    rememberMe: false,
    savedEmail: null,
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
            // Mantener rememberMe y savedEmail para pre-cargar email en el modal
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
        setRememberMe: (state, action: PayloadAction<{ rememberMe: boolean; email?: string | null }>) => {
            state.rememberMe = action.payload.rememberMe;
            state.savedEmail = action.payload.rememberMe ? (action.payload.email ?? null) : null;
        },
    },
    extraReducers: (builder) => {
        /**
         * Validar expiración de tokens al rehidratar desde localStorage
         * Si el token JWT está expirado, hacer logout automático transparente
         */
        builder.addCase(REHYDRATE, (state, action) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const persistedAuth = (action as any).payload?.auth;

            // Si no hay estado persistido o no hay token, no hacer nada
            if (!persistedAuth?.token) {
                return;
            }

            try {
                // Decodificar JWT: token = header.payload.signature
                const parts = persistedAuth.token.split('.');
                if (parts.length !== 3) {
                    // Token inválido, hacer logout
                    return initialState;
                }

                // Decodificar payload (agregar padding si es necesario)
                const payload = parts[1];
                const paddedPayload = payload + '='.repeat((4 - (payload.length % 4)) % 4);
                const decoded = JSON.parse(atob(paddedPayload)) as { exp?: number };

                // Verificar si está expirado (exp está en segundos, Date.now() en milisegundos)
                if (decoded.exp && decoded.exp * 1000 < Date.now()) {
                    console.warn('[Auth] Token JWT expirado durante rehidratación, logout automático');
                    // Resetear a estado inicial pero mantener rememberMe y savedEmail
                    Object.assign(state, {
                        user: null,
                        token: null,
                        refreshToken: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null,
                        rememberMe: persistedAuth.rememberMe ?? false,
                        savedEmail: persistedAuth.savedEmail ?? null,
                    });
                }
            } catch (error) {
                console.warn('[Auth] Error al decodificar JWT durante rehidratación:', error);
                // Si hay error decodificando, hacer logout por seguridad
                Object.assign(state, {
                    user: null,
                    token: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null,
                    rememberMe: persistedAuth?.rememberMe ?? false,
                    savedEmail: persistedAuth?.savedEmail ?? null,
                });
            }
        });
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
    setRememberMe,
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
export const selectRememberMe = (state: { auth: AuthState }) => state.auth.rememberMe;
export const selectSavedEmail = (state: { auth: AuthState }) => state.auth.savedEmail;

export default authSlice.reducer;
