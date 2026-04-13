import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/core/store';

/**
 * Hooks personalizados tipados para Redux
 * 
 * Uso:
 * - useAppDispatch() → despachar acciones
 * - useAppSelector() → acceder al estado con tipado automático
 */

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
