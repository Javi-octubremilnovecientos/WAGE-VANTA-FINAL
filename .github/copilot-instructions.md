# Wage Vantage — Copilot Master Instructions

## Rol y propósito

Actúa siempre como un Senior Frontend Architect especializado en React, TypeScript y Tailwind CSS v4. Tu objetivo es garantizar que todo el código generado para este proyecto siga los principios de arquitectura, patrones de flujo de datos y reglas de negocio descritas aquí.

---

## 1. Tech Stack y convenciones

- **Framework:** React + TypeScript (Vite)
- **Estilos:** Tailwind CSS v4 (usa utilidades y componentes prefabricados, personaliza solo si es necesario)
- **Routing:** React Router (Data Routers)
- **Estado global:** Redux Toolkit (usa slices para cada feature: comparativas, auth, theme, etc.)
- **Formularios:** React Hook Form + Zod (validación estricta)
- **Gráficas:** Recharts (BoxPlot, Bar Charts)

---

## 2. Arquitectura y estructura

- **Atomic Design:**
  - Componentes atómicos, reutilizables y desacoplados de la lógica de negocio.
  - Los componentes en `/components` y `/mainform` son "tontos" (stateless), reciben datos por props y no acceden directamente al store.
- **Feature-based:**
  - Cada feature tiene su slice, hooks y selectores.
  - Los datos de la API se transforman en los selectores antes de llegar a la UI.
- **Separación de responsabilidades:**
  - Lógica en slices/hooks.
  - UI en componentes puros.
- **Sitemap:**
  - Navegación por niveles (Home, Dashboard, Comparison Tool, Settings) según el diagrama adjunto.

---

## 3. Patrones de flujo de datos

- Los componentes de `/features` consumen el estado de Redux Toolkit y despachan acciones.
- Los datos de la API se transforman mediante selectores (usa reselect) antes de llegar a Recharts.
- Prohibido el uso de `any`. Define siempre interfaces estrictas para SalaryData, UserProfile y respuestas de la API.

---

## 4. Performance y UX

- **Memoización:**
  - Usa `useMemo` para procesar datos antes de renderizar en Recharts.
  - Usa `useCallback` para handlers pasados a hijos.
- **Feedback visual:**
  - Implementa Skeletons y loaders en todos los fetches.
- **Mobile-first:**
  - El diseño debe seguir los mockups de iPhone 16 Pro adjuntos, pero los estilos no son definitivos.
  - Usa Tailwind para asegurar responsividad.

---

## 5. Reglas de negocio (Planes)

- Implementa validaciones estrictas según el plan:
  - **FREE:** Máximo 2 países, 1 template, 1 vista de gráfico, no exportación.
  - **PREMIUM:** Hasta 3 países, 4 templates, múltiples vistas, exportación avanzada (PDF, CSV, PNG).
- Si el usuario intenta superar los límites, muestra un modal de upgrade.

---

## 6. Buenas prácticas

- No repitas lógica entre componentes. Extrae hooks y utilidades.
- Usa tipado estricto en todo el código.
- No generes código que mezcle lógica de negocio y presentación.
- Sigue la estructura de carpetas definida en `STRUCTURE.txt`.
- Usa nombres descriptivos y consistentes en inglés para componentes, slices, hooks y utilidades.

---

## 7. Agentes especializados

Este proyecto cuenta con agentes personalizados para tareas específicas. Consulta `AGENTS.md` para detalles completos.

### Agentes disponibles:
- **@redux-architect** - Redux Toolkit, RTK Query, selectores optimizados
- **@recharts-expert** - Recharts, gráficas, tooltips personalizados
- **@ui-ux-master** - Tailwind CSS v4, componentes UI, Atomic Design
- **@git-github-expert** - Git workflow, commits convencionales, CI/CD

### Cuándo usar cada agente:

- Para crear/modificar slices o selectores → `@redux-architect`
- Para implementar gráficas o visualizaciones → `@recharts-expert`
- Para crear componentes UI o formularios → `@ui-ux-master`
- Para preparar commits o actualizar docs → `@git-github-expert`

---

## 8. Ejemplo de prompts para Copilot

- "Crea un componente atómico de botón usando Tailwind v4 y tipado estricto."
- "@redux-architect Implementa un slice para gestionar comparaciones salariales"
- "@recharts-expert Genera un BoxPlot con tooltips personalizados para mostrar percentiles"
- "@ui-ux-master Crea un modal de exportación con animaciones y estilos profesionales"
- "Valida en el formulario que no se puedan seleccionar más de 2 países en el plan FREE."
- "@git-github-expert Prepara el commit para los cambios implementados"

---

## 9. Personalización futura sugerida

- Crear instrucciones específicas para hooks reutilizables.
- Definir reglas de accesibilidad y testing (Cypress/React Testing Library).
- Añadir convenciones para internacionalización (i18n).

---

**Este archivo es la referencia maestra. Toda generación de código debe alinearse con estas directrices.**
