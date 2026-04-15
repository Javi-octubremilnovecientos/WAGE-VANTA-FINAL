# Auth Feature - Diagramas de Arquitectura

Esta carpeta contiene los diagramas visuales que documentan el flujo de autenticación (SignIn) del proyecto WageVantage.

## 📊 Diagramas Disponibles

### 1. [Sequence Diagram](./01-signin-sequence.md)

**Tipo:** Diagrama de secuencia  
**Propósito:** Mostrar la interacción temporal entre componentes  
**Mejor para:** Entender el orden de ejecución y las llamadas asíncronas  
**Vista previa:** Interacción paso a paso desde el usuario hasta el Redux Store

### 2. [Architecture Diagram](./02-signin-architecture.md)

**Tipo:** Wireframe arquitectónico por capas  
**Propósito:** Visualizar las 7 capas de la arquitectura  
**Mejor para:** Comprender la separación de responsabilidades  
**Vista previa:** Flujo numerado (13 pasos) a través de las capas

### 3. [Data Flow Diagram](./03-signin-dataflow.md)

**Tipo:** Flowchart de flujo de datos  
**Propósito:** Seguir el recorrido completo de los datos con bifurcaciones  
**Mejor para:** Debugging y entender manejo de errores  
**Vista previa:** Path completo desde input hasta navegación, incluyendo errores

## 🎨 Código de Colores

Todos los diagramas usan el mismo código de colores consistente:

| Color              | Capa/Componente   | Archivos                              |
| ------------------ | ----------------- | ------------------------------------- |
| 🔵 **Azul**        | UI Layer          | `AuthModal.tsx`, inputs, botones      |
| 🟣 **Púrpura**     | Hooks Layer       | `useSignInMutation`, `useAppDispatch` |
| 🟢 **Verde**       | API Layer         | `authApi.ts`, endpoints               |
| 🟠 **Naranja**     | Configuration     | `api.ts`, `baseQuery`, headers        |
| 🔴 **Rojo**        | External Services | Supabase Auth API                     |
| 🌸 **Rosa**        | Redux State       | `authSlice.ts`, reducers              |
| 🔷 **Índigo**      | Global Store      | Redux Store, selectores               |
| ✅ **Verde claro** | Success           | Estados positivos, navegación         |
| ⚠️ **Rojo claro**  | Errors            | Manejo de errores                     |

## 🛠️ Cómo usar estos diagramas

### Para desarrollo

1. **Antes de implementar cambios:** Revisa el diagrama arquitectónico para entender dónde impacta tu cambio
2. **Durante debugging:** Usa el diagrama de flujo de datos para seguir el path de ejecución
3. **Para onboarding:** Comienza con el diagrama de secuencia para una vista general

### Para documentación

- Incluye referencias a estos diagramas en PRs que modifiquen la feature auth
- Actualiza los diagramas si cambias el flujo de autenticación
- Usa como base para crear diagramas de otras features

### Para presentaciones

- Los diagramas están en formato Mermaid, renderizables en GitHub, GitLab, y VS Code
- Se pueden exportar a PNG/SVG usando herramientas como [Mermaid Live Editor](https://mermaid.live/)

## 📁 Estructura de archivos relacionados

```
src/
├── features/
│   └── auth/
│       ├── authApi.ts          # ← Endpoints RTK Query
│       └── authSlice.ts        # ← Estado global Redux
├── components/
│   └── ui/
│       └── modals/
│           └── AuthModal.tsx   # ← UI del formulario
├── services/
│   └── api.ts                  # ← Configuración base RTK Query
├── hooks/
│   └── useRedux.ts             # ← Hooks tipados
└── core/
    └── store/
        └── rootReducer.ts      # ← Combinación de reducers
```

## 🔄 Flujo resumido (13 pasos)

1. Usuario introduce credenciales
2. Submit ejecuta `useSignInMutation`
3. RTK Query configura request
4. `prepareHeaders` agrega apikey
5. HTTP POST a Supabase
6. Supabase valida y responde
7. `.unwrap()` extrae datos
8. Response llega al modal
9. `mapSupabaseResponseToUser()` transforma
10. `dispatch(setCredentials())`
11. Redux actualiza estado global
12. Selectores notifican cambios
13. Componentes se re-renderizan

## 📝 Notas técnicas

### RTK Query

- **Auto-generación:** Los hooks `useSignInMutation` se generan automáticamente
- **Cache:** RTK Query maneja cache y invalidación con tags
- **Tipado:** TypeScript end-to-end desde UI hasta API

### Redux Toolkit

- **Inmutabilidad:** Usa Immer internamente, escribe código "mutable"
- **DevTools:** Compatible con Redux DevTools para debugging
- **Slices:** Cada feature tiene su propio slice aislado

### Supabase

- **Endpoint:** `POST /auth/v1/token?grant_type=password`
- **Headers:** Requiere `apikey` en todas las peticiones
- **JWT:** Los access tokens son JWT con expiración

## ✅ Checklist de mantenimiento

Al modificar el flujo de autenticación, asegúrate de:

- [ ] Actualizar el diagrama de secuencia si cambias el orden de llamadas
- [ ] Actualizar el diagrama arquitectónico si agregas/eliminas capas
- [ ] Actualizar el diagrama de flujo si cambias el manejo de errores
- [ ] Revisar que los colores sean consistentes
- [ ] Validar que los enlaces a archivos sean correctos
- [ ] Probar que Mermaid renderiza correctamente

## 🔗 Links útiles

- [Mermaid Documentation](https://mermaid.js.org/)
- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)

---

**Última actualización:** 15 de abril de 2026  
**Autor:** WageVantage Team  
**Versión:** 1.0.0
