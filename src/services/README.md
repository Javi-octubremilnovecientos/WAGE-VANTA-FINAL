# RTK Query Services

Esta carpeta contiene la configuración centralizada de RTK Query para el proyecto Wage Vantage.

## Estructura

- **`api.ts`** - Configuración principal del `apiSlice` con baseQuery centralizado

## Cómo usar

### 1. Inyectar endpoints desde un feature

Cada feature debe crear su archivo de API (ej: `salaryApi.ts`) e inyectar endpoints:

```typescript
// src/features/salaries/salaryApi.ts
import { apiSlice } from "@/services/api";

export const salaryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSalaries: builder.query<SalaryStats, Partial<SalaryData>>({
      query: (params) => ({
        url: "/salaries",
        params,
      }),
      providesTags: ["Salaries"],
    }),
  }),
});

export const { useGetSalariesQuery } = salaryApi;
```

### 2. Usar los hooks en componentes

```typescript
import { useGetSalariesQuery } from '@/features/salaries/salaryApi';

export function SalaryComponent() {
  const { data, isLoading, error } = useGetSalariesQuery({ country: 'ES' });

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* renderizar data */}</div>;
}
```

### 3. Tag Types (Invalidación de caché)

Los tags definidos en `api.ts` permiten invalidar el caché automáticamente:

```typescript
endpoints: (builder) => ({
  getSalaries: builder.query({
    // ...
    providesTags: ['Salaries'], // Proporciona este tag
  }),
  updateSalary: builder.mutation({
    // ...
    invalidatesTags: ['Salaries'], // Invalida cuando se updatea
  }),
}),
```

## Configuración de variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=https://api.example.com
```

## Mejores prácticas

- ✅ Centraliza todos los endpoints de un feature en su archivo de API
- ✅ Usa `providesTags` y `invalidatesTags` para el caching inteligente
- ✅ Define tipos estrictos para cada endpoint
- ✅ Exporta solo los hooks tipados, no los endpoints directos
- ❌ No hagas transformaciones de datos en los componentes
- ❌ No crees múltiples instancias de `createApi`
- ❌ No accedas al `apiSlice` directamente desde componentes

## Ejemplo completo: Todo un feature

Ver `src/features/salaries/salaryApi.ts` para un ejemplo completo con:

- Query (GET)
- Mutation (POST, PATCH)
- Tags para invalidación
