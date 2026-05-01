import type { WebStorage } from 'redux-persist/es/types';

/**
 * Storage adapter personalizado para localStorage
 * Soluciona problemas de compatibilidad con Vite y redux-persist
 */
const createNoopStorage = (): WebStorage => {
    return {
        getItem: () => Promise.resolve(null),
        setItem: () => Promise.resolve(),
        removeItem: () => Promise.resolve(),
    };
};

export const customStorage: WebStorage = typeof window !== 'undefined' && window.localStorage
    ? {
        getItem: (key: string) => {
            return Promise.resolve(window.localStorage.getItem(key));
        },
        setItem: (key: string, value: string) => {
            return Promise.resolve(window.localStorage.setItem(key, value));
        },
        removeItem: (key: string) => {
            return Promise.resolve(window.localStorage.removeItem(key));
        },
    }
    : createNoopStorage();

/**
 * Configuración de persistencia para el slice auth (anidada).
 * Solo persiste los campos necesarios para restaurar la sesión.
 * Excluye isLoading y error (estados temporales que no deben persistir).
 */
export const authPersistConfig = {
    key: 'auth',
    storage: customStorage,
    whitelist: ['user', 'token', 'refreshToken', 'isAuthenticated', 'rememberMe', 'savedEmail'],
};
