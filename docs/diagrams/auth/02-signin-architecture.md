# SignIn Feature - Architectural Wireframe

Este diagrama muestra la arquitectura en capas del sistema de autenticación y cómo fluyen los datos a través de cada capa.

## Arquitectura por Capas

```mermaid
graph TB
    subgraph UI["🎨 UI LAYER - Presentación"]
        A[AuthModal.tsx - Login Mode]
        A1[Input: email/password]
        A2[Button: Sign In]
        A3[Estado local: useState]
    end

    subgraph HOOKS["🪝 RTK QUERY HOOKS"]
        B1[useSignInMutation]
        B3[useAppDispatch]
    end

    subgraph API["🌐 API LAYER - RTK Query"]
        C1[authApi.ts]
        C2[signIn endpoint]
        C4[prepareHeaders interceptor]
    end

    subgraph BASE["⚙️ BASE CONFIGURATION"]
        D1[api.ts - apiSlice]
        D2[baseQuery: fetchBaseQuery]
        D3[Headers: apikey + authorization]
    end

    subgraph EXTERNAL["🔒 EXTERNAL SERVICE"]
        E1[Supabase Auth API]
        E2[POST /auth/v1/token]
    end

    subgraph REDUX["💾 REDUX STATE LAYER"]
        F1[authSlice.ts]
        F2[setCredentials reducer]
        F3[logout reducer]
        F4[patchUser reducer]
    end

    subgraph STORE["🏪 GLOBAL STORE"]
        G1[Redux Store]
        G2["State: { auth, salary, theme, api }"]
        G3[Selectors: selectUser, selectIsAuthenticated]
    end

    %% Flujo de datos - SignIn
    A1 --> A
    A2 --> A
    A3 --> A
    A -->|"1. Usuario hace submit"| B1
    A --> B3

    B1 -->|"2. Ejecuta mutación signIn"| C2
    C2 --> C1

    C1 -->|"3. Configura request"| D1
    D1 --> D2
    D2 -->|"4. Agrega headers"| D3

    D3 -->|"5. HTTP POST"| E1
    E1 --> E2

    E2 -.->|"6. Response: user + tokens"| C2

    C2 -.->|"7. unwrap()"| B1

    B1 -.->|"8. response"| A

    A -->|"9. mapSupabaseResponseToUser()"| B3
    B3 -->|"10. dispatch(setCredentials())"| F2

    F2 --> F1
    F1 -->|"11. Actualiza estado"| G1
    G1 --> G2
    G2 -.->|"12. Notifica cambios"| G3
    G3 -.->|"13. Re-render componentes"| A

    %% Estilos
    classDef uiStyle fill:#3b82f6,stroke:#1e40af,color:#fff,stroke-width:3px
    classDef hookStyle fill:#8b5cf6,stroke:#6d28d9,color:#fff,stroke-width:3px
    classDef apiStyle fill:#10b981,stroke:#059669,color:#fff,stroke-width:3px
    classDef baseStyle fill:#f59e0b,stroke:#d97706,color:#fff,stroke-width:3px
    classDef externalStyle fill:#ef4444,stroke:#dc2626,color:#fff,stroke-width:3px
    classDef reduxStyle fill:#ec4899,stroke:#db2777,color:#fff,stroke-width:3px
    classDef storeStyle fill:#6366f1,stroke:#4f46e5,color:#fff,stroke-width:3px

    class A,A1,A2,A3 uiStyle
    class B1,B3 hookStyle
    class C1,C2,C4 apiStyle
    class D1,D2,D3 baseStyle
    class E1,E2 externalStyle
    class F1,F2,F3,F4 reduxStyle
    class G1,G2,G3 storeStyle
```

## Capas de la Arquitectura

### 🎨 Layer 1: UI - Presentación (Azul)

**Componentes:** `AuthModal.tsx`, inputs, botones

- **Responsabilidad:** Capturar input del usuario
- **Estado:** Local con `useState` para email/password
- **Sin lógica de negocio:** Solo presenta UI y delega acciones

### 🪝 Layer 2: Hooks (Púrpura)

**Hooks:** `useSignInMutation`, `useAppDispatch`

- **Responsabilidad:** Conectar UI con lógica de datos
- **Auto-generados:** RTK Query genera los mutation hooks
- **Tipado:** Proveen tipado completo TypeScript

### 🌐 Layer 3: API Layer (Verde)

**Archivos:** `authApi.ts`, endpoints

- **Responsabilidad:** Definir operaciones de API
- **Endpoints:** `signIn` mutation con configuración
- **Cache:** Maneja invalidación de tags automáticamente

### ⚙️ Layer 4: Base Configuration (Naranja)

**Archivos:** `api.ts`, `baseQuery`

- **Responsabilidad:** Configuración global de RTK Query
- **Headers:** Intercepta todas las peticiones para agregar headers
- **Token injection:** Agrega automáticamente el token de autenticación

### 🔒 Layer 5: External Services (Rojo)

**Servicio:** Supabase Auth API

- **Endpoint:** `POST /auth/v1/token?grant_type=password`
- **Autenticación:** Valida credenciales y genera tokens
- **Response:** `{ user, access_token, refresh_token }`

### 💾 Layer 6: Redux State (Rosa)

**Archivos:** `authSlice.ts`, reducers

- **Responsabilidad:** Gestionar estado de autenticación
- **Reducers:** `setCredentials`, `logout`, `patchUser`
- **Inmutabilidad:** Redux Toolkit usa Immer internamente

### 🏪 Layer 7: Global Store (Índigo)

**Store:** Redux Store

- **Estado global:** `{ auth, salary, theme, api }`
- **Selectores:** `selectUser`, `selectIsAuthenticated`
- **Re-render:** Notifica automáticamente a componentes suscritos

## Flujo de Datos (13 pasos)

1. **UI → Hooks:** Usuario hace submit
2. **Hooks → API:** Ejecuta mutación `signIn`
3. **API → Base:** Configura request HTTP
4. **Base → Headers:** Agrega `apikey` y `authorization`
5. **Base → External:** Envía HTTP POST a Supabase
6. **External → API:** Response con user + tokens (línea punteada)
7. **API → Hooks:** `.unwrap()` extrae datos
8. **Hooks → UI:** Response llega al modal
9. **UI → Hooks:** `mapSupabaseResponseToUser()` transforma datos
10. **Hooks → Redux:** `dispatch(setCredentials())`
11. **Redux → Store:** Actualiza estado global
12. **Store → Selectores:** Notifica cambios
13. **Selectores → UI:** Re-render de componentes

## Separación de Responsabilidades

✅ **UI:** Solo presenta y captura input  
✅ **Hooks:** Conectan UI con datos  
✅ **API:** Define operaciones de red  
✅ **Base:** Configuración global y headers  
✅ **External:** Servicio de autenticación  
✅ **Redux:** Estado global inmutable  
✅ **Store:** Fuente única de verdad

## Archivos Relacionados

- [AuthModal.tsx](../../../src/components/ui/modals/AuthModal.tsx)
- [authApi.ts](../../../src/features/auth/authApi.ts)
- [authSlice.ts](../../../src/features/auth/authSlice.ts)
- [api.ts](../../../src/services/api.ts)
- [useRedux.ts](../../../src/hooks/useRedux.ts)
