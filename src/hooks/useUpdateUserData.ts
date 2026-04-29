import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { selectUser, patchUser } from '@/features/auth/authSlice';
import { useUpdateUserMutation, mapSupabaseResponseToUser } from '@/features/auth/authApi';
import type { UserData } from '@/lib/User';

/**
 * Hook para actualizar user_metadata en Supabase de forma segura.
 * 
 * **Problema que resuelve:**
 * El endpoint PUT /auth/v1/user de Supabase **reemplaza completamente** el objeto
 * user_metadata cuando se envía { data: { field: value } }. Esto causa que se pierdan
 * todos los demás campos del user_metadata que no se incluyan en el payload.
 * 
 * **Solución:**
 * Este hook construye automáticamente un payload completo que incluye TODOS los campos
 * del user actual más los campos que se quieren actualizar, asegurando que nada se pierda.
 * 
 * **Uso:**
 * ```tsx
 * const updateUserData = useUpdateUserData();
 * 
 * // Solo actualizar templates (preserva name, premium, comparisons, payData, avatarUrl)
 * await updateUserData({ templates: newTemplates });
 * 
 * // Actualizar múltiples campos
 * await updateUserData({ 
 *   templates: newTemplates, 
 *   premium: true 
 * });
 * ```
 * 
 * **Ventajas:**
 * - ✅ Previene pérdida de datos en Supabase
 * - ✅ Mantiene Redux sincronizado con Supabase
 * - ✅ Código DRY (no repetir lógica en cada componente)
 * - ✅ TypeScript seguro (valida tipos de UserData)
 * 
 * @returns Función async que actualiza user_metadata en Supabase y Redux
 */
export function useUpdateUserData() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const [updateUser] = useUpdateUserMutation();

    return useCallback(
        async (partialData: Partial<UserData>) => {
            if (!user) {
                throw new Error('User not authenticated');
            }

            // Construir payload completo: todos los campos actuales + los nuevos
            const fullUserData: UserData = {
                name: user.name,
                premium: user.premium,
                templates: user.templates,
                comparisons: user.comparisons,
                payData: user.payData,
                avatarUrl: user.avatarUrl ?? null,
                // Sobrescribir con los campos actualizados
                ...partialData,
            };

            // Enviar a Supabase con todos los campos
            const updatedSupabaseUser = await updateUser({
                data: fullUserData,
            }).unwrap();

            // Actualizar Redux con la respuesta de Supabase para mantener sincronización
            const mappedUser = mapSupabaseResponseToUser(updatedSupabaseUser);
            dispatch(patchUser(mappedUser));

            return mappedUser;
        },
        [user, updateUser, dispatch],
    );
}
