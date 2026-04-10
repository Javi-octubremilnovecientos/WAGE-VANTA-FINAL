import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '@/core/store';

/**
 * Hooks personalizados tipados para Redux
 * 
 * Uso:
 * - useAppDispatch() → despachar acciones
 * - useAppSelector() → acceder al estado con tipado automático
 */

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
