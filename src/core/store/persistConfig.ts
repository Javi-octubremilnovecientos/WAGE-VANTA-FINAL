import { persistReducer } from 'redux-persist';
import { rootReducer } from './rootReducer';
import { customStorage } from './authPersistConfig';

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
 * Configuración de persistencia para el root reducer.
 * La clave 'auth' aquí activa el persistReducer anidado definido en rootReducer.
 */
export const persistConfig = {
    key: 'root',
    storage: customStorage,
    whitelist: ['auth', 'theme'],
};

/**
 * Root reducer con persistencia aplicada
 */
export const persistedReducer = persistReducer(persistConfig, rootReducer);
