import { persistReducer } from 'redux-persist';
import type { WebStorage } from 'redux-persist/es/types';
import { rootReducer } from './rootReducer';

/**
 * Configuración de persistencia para Redux
 * 
 * ESTRATEGIA:
 * - Storage adapter personalizado para evitar problemas con Vite
 * - Solo persiste el slice 'auth' con campos específicos
 * - El "Remember me" se maneja a nivel de negocio (logout limpia el storage)
 * - Excluye estados temporales (isLoading, error) para evitar bugs
 */

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

const customStorage: WebStorage = typeof window !== 'undefined' && window.localStorage
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
 * Configuración de persistencia para el root reducer
 * Solo persiste auth con campos específicos
 */
export const persistConfig = {
    key: 'root',
    storage: customStorage,
    whitelist: ['auth', 'theme'], // Persiste auth y preferencia de tema
    // Debugging opcional
    debug: false,
};

/**
 * Configuración específica para auth (campos a persistir)
 * Se aplica mediante blacklist en authSlice
 */
export const authPersistFields = {
    whitelist: ['user', 'token', 'refreshToken', 'isAuthenticated', 'rememberMe'],
    blacklist: ['isLoading', 'error'], // No persiste estados temporales
};

/**
 * Root reducer con persistencia aplicada
 */
export const persistedReducer = persistReducer(persistConfig, rootReducer);
