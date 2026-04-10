# Wage Vantage — Custom Agents Guide

Este documento describe los agentes especializados disponibles en el proyecto Wage Vantage y cómo utilizarlos para maximizar la productividad.

---

## 🎯 Qué son los Agentes Especializados

Los agentes son asistentes de IA personalizados con expertise específica, herramientas limitadas y un conjunto de reglas estrictas. Cada agente se enfoca en una única responsabilidad del proyecto.

### Ventajas de usar agentes especializados:

- ✅ **Mayor precisión** en tareas específicas
- ✅ **Código consistente** siguiendo las mismas convenciones
- ✅ **Respuestas más rápidas** al tener contexto reducido
- ✅ **Menos errores** por limitaciones de herramientas apropiadas

---

## 📚 Agentes Disponibles

### 1. Redux Architect 🏗️

**Archivo**: `.github/agents/redux-architect.agent.md`  
**Comando**: `@redux-architect`

#### Especialización

- Redux Toolkit (slices, reducers, actions)
- RTK Query (endpoints, caching, tags)
- Selectores optimizados con Reselect
- Gestión de estado global

#### Herramientas

- ✅ Lectura de archivos
- ✅ Edición de archivos
- ✅ Búsqueda en código
- ❌ Sin acceso a terminal

#### Cuándo usarlo

```
✅ Crear un nuevo slice para una feature
✅ Implementar RTK Query endpoints
✅ Crear selectores memoizados
✅ Optimizar el flujo de datos en Redux
✅ Revisar o refactorizar state management
```

#### Ejemplos de uso

```
@redux-architect Crea un slice para gestionar las comparaciones guardadas

@redux-architect Necesito un selector optimizado para calcular percentiles de salarios

@redux-architect Implementa RTK Query para el endpoint de países disponibles

@redux-architect Refactoriza el salarySlice para mejorar performance
```

#### Output esperado

- Archivos de slice con tipado estricto
- Selectores memoizados documentados
- Hooks de RTK Query configurados
- Integración con rootReducer
- Ejemplos de uso en componentes

---

### 2. Recharts Expert 📊

**Archivo**: `.github/agents/recharts-expert.agent.md`  
**Comando**: `@recharts-expert`

#### Especialización

- Recharts (todos los tipos de gráficas)
- BoxPlots y gráficas estadísticas
- Tooltips personalizados
- Transformación de datos para visualización
- Optimización de performance en charts

#### Herramientas

- ✅ Lectura de archivos
- ✅ Edición de archivos
- ✅ Búsqueda en código
- ❌ Sin acceso a terminal

#### Cuándo usarlo

```
✅ Crear cualquier tipo de gráfica con Recharts
✅ Implementar tooltips personalizados
✅ Optimizar re-renders de charts
✅ Transformar datos de API para visualización
✅ Hacer gráficas responsivas
```

#### Ejemplos de uso

```
@data-viz-expert Crea un BoxPlot para comparar salarios entre países

@data-viz-expert Necesito un tooltip que muestre P25, P50 y P75

@data-viz-expert Implementa un BarChart responsivo agrupado por experiencia

@data-viz-expert Optimiza el MainChart para evitar re-renders
```

#### Output esperado

- Componentes de gráficas con React.memo
- Tooltips personalizados estilizados
- Funciones de transformación de datos
- ResponsiveContainer configurado
- Estilos con Tailwind CSS v4

---

### 3. Git & GitHub Expert 🚀

**Archivo**: `.github/agents/git-github-expert.agent.md`  
**Comando**: `@git-github-expert`

#### Especialización

- Conventional Commits
- Git workflow y branching strategy
- GitHub Actions y CI/CD
- Documentación técnica (README, docs)
- Gestión de releases

#### Herramientas

- ✅ Lectura de archivos
- ✅ Edición de archivos
- ✅ Búsqueda en código
- ✅ Ejecución de comandos (terminal)

#### Cuándo usarlo

```
✅ Preparar mensajes de commit
✅ Crear workflows de GitHub Actions
✅ Actualizar README o documentación
✅ Gestionar branching strategy
✅ Configurar pre-commit hooks
```

#### Ejemplos de uso

```
@release-engineer Prepara el commit para los cambios de comparación

@release-engineer Crea un workflow de CI para validar builds

@release-engineer Actualiza el README con la nueva feature de charts

@release-engineer Sugiere una estrategia de branching para el equipo
```

#### Output esperado

- Mensajes de commit perfectamente formateados
- Comandos Git listos para ejecutar
- Workflows de GitHub Actions configurados
- Documentación actualizada
- Checklist de validación pre-commit

---

### 4. UI/UX Master 🎨

**Archivo**: `.github/agents/ui-ux-master.agent.md`  
**Comando**: `@ui-ux-master`

#### Especialización

- Tailwind CSS v4 (zero-config, variables CSS)
- Atomic Design (atoms, molecules, organisms)
- Componentes de UI (botones, modals, forms, cards)
- Adaptación de Tailwind UI kits
- Accesibilidad (ARIA, keyboard navigation)
- Diseño responsive mobile-first

#### Herramientas

- ✅ Lectura de archivos
- ✅ Edición de archivos
- ✅ Búsqueda en código
- ✅ Acceso web (Tailwind UI)
- ❌ Sin acceso a terminal

#### Cuándo usarlo

```
✅ Crear componentes UI con Tailwind v4
✅ Implementar formularios con React Hook Form + Zod
✅ Adaptar componentes de Tailwind UI
✅ Diseñar layouts responsive
✅ Asegurar accesibilidad en componentes
```

#### Ejemplos de uso

```
@ui-ux-master Crea un botón con variantes primary, secondary y outline

@ui-ux-master Implementa un modal de exportación con animaciones

@ui-ux-master Adapta el ComboBox de Tailwind UI para selección de países

@ui-ux-master Crea un formulario de comparación con validación Zod
```

#### Output esperado

- Componentes React con TypeScript estricto
- Estilos con Tailwind CSS v4
- Props interface documentada
- Accesibilidad implementada (ARIA)
- Responsive mobile-first
- Ejemplos de uso

---

### 5. Navigation Architect 🧭

**Archivo**: `.github/agents/navigation-architect.agent.md`  
**Comando**: `@navigation-architect`

#### Especialización

- React Router v6.4+ / v7 (Data Routers)
- createBrowserRouter y route objects
- Loaders y Actions para data fetching
- Protección de rutas (RequireAuth, RequirePremium)
- Lazy loading de páginas
- Navegación tipada y type-safe

#### Herramientas

- ✅ Lectura de archivos
- ✅ Edición de archivos
- ✅ Búsqueda en código
- ❌ Sin acceso a terminal

#### Cuándo usarlo

```
✅ Crear nuevas rutas o páginas
✅ Implementar loaders para data fetching
✅ Configurar protección de rutas
✅ Implementar lazy loading
✅ Crear actions para formularios
✅ Optimizar navegación y performance
```

#### Ejemplos de uso

```
@navigation-architect Crea la ruta de recuperación de contraseña con loader

@navigation-architect Implementa protección premium para rutas avanzadas

@navigation-architect Añade lazy loading a todas las páginas del dashboard

@navigation-architect Crea un loader para pre-cargar datos de comparación
```

#### Output esperado

- Rutas configuradas con Data Router
- Loaders/Actions tipados
- Guards aplicados (RequireAuth, RequirePremium)
- Lazy loading implementado
- Constantes de paths actualizadas
- Error boundaries configurados

---

## 🎭 Cómo Usar los Agentes

### Sintaxis básica

```
@nombre-agente [tu solicitud]
```

### Ejemplos reales

#### Scenario 1: Implementar nueva feature completa

```
1. @navigation-architect Define las rutas para la nueva feature
2. @redux-architect Crea un slice para gestionar templates de comparación
3. @ui-ux-master Crea el formulario de configuración de templates
4. @recharts-expert Implementa un chart selector para cambiar entre vistas
5. @git-github-expert Prepara el commit: feat(templates)
```

#### Scenario 2: Optimizar feature existente

```
1. @redux-architect Revisa el comparisonSlice y optimiza los selectores
2. @recharts-expert Optimiza el BoxPlot para evitar re-renders
3. @git-github-expert Prepara el commit: perf(comparison)
```

#### Scenario 3: Debugging y refactorización

```
1. @redux-architect ¿Por qué el selector selectSalaryData se ejecuta múltiples veces?
2. @recharts-expert El tooltip del BoxPlot no muestra correctamente en mobile
3. @ui-ux-master El modal de exportación no es responsive en iPhone
```

---

## 🔄 Workflow Recomendado

### Para nuevas features:

```mermaid
graph LR
  A[Planificar] --> B[@navigation-architect<br/>Definir rutas]
  B --> C[@redux-architect<br/>Crear state]
  C --> D[@ui-ux-master<br/>Crear UI]
  D --> E[@recharts-expert<br/>Crear charts]
  E --> F[Integrar y probar]
  F --> G[@git-github-expert<br/>Commit + Docs]
```

### Para fixes y optimizaciones:

```mermaid
graph LR
  A[Identificar problema] --> B[Invocar agente especialista]
  B --> C[Aplicar solución]
  C --> D[@git-github-expert<br/>Commit]
```

---

## 📋 Quick Reference

| Necesito...           | Agente               | Ejemplo                                         |
| --------------------- | -------------------- | ----------------------------------------------- |
| Crear un slice        | `@redux-architect`   | `@redux-architect Slice para auth`              |
| Crear una gráfica     | `@recharts-expert`   | `@recharts-expert BoxPlot responsivo`           |
| Crear componente UI   | `@ui-ux-master`      | `@ui-ux-master Botón con variantes`             |
| Preparar commit       | `@git-github-expert` | `@git-github-expert Prepara el commit`          |
| Optimizar selector    | `@redux-architect`   | `@redux-architect Optimiza selectSalaryData`    |
| Tooltip personalizado | `@recharts-expert`   | `@recharts-expert Tooltip con percentiles`      |
| Modal o formulario    | `@ui-ux-master`      | `@ui-ux-master Modal de exportación`            |
| Workflow de CI        | `@git-github-expert` | `@git-github-expert GitHub Actions para tests`  |
| RTK Query endpoint    | `@redux-architect`   | `@redux-architect Endpoint de países`           |
| Chart transformation  | `@recharts-expert`   | `@recharts-expert Transform API data for chart` |
| Adaptar Tailwind UI   | `@ui-ux-master`      | `@ui-ux-master Adapta ComboBox de Tailwind UI`  |
| Actualizar README     | `@git-github-expert` | `@git-github-expert Update README`              |

---

## 🎓 Best Practices

### ✅ DO

- Usa el agente más específico para tu tarea
- Sé claro y detallado en tu solicitud
- Revisa el output antes de aplicarlo
- Combina agentes para workflows complejos
- Consulta este documento si tienes dudas

### ❌ DON'T

- No uses múltiples agentes simultáneamente en una sola línea
- No pidas a un agente que haga tareas fuera de su especialización
- No asumas que el agente tiene contexto de conversaciones previas
- No ignores las advertencias o checklists que proporcionen

---

## 🔧 Troubleshooting

### "El agente no responde"

- Verifica que estás usando el comando correcto: `@nombre-agente`
- Asegúrate de que el archivo `.agent.md` existe en `.github/agents/`

### "El agente genera código incorrecto"

- Proporciona más contexto en tu solicitud
- Muéstrele archivos relacionados antes de pedir cambios
- Revisa si la tarea está dentro de su especialización

### "Necesito una tarea que ningún agente cubre"

- Usa el agente general (sin @)
- O sugiere la creación de un nuevo agente especializado

---

## 📝 Notas

- Los agentes siguen estrictamente las convenciones definidas en `copilot-instructions.md`
- Todos los agentes respetan el tech stack del proyecto
- Los agentes utilizan TypeScript estricto y Tailwind CSS v4
- Para tareas generales, simplemente no uses el prefijo `@`

---

## 🚀 Repository

**GitHub**: https://github.com/Javi-octubremilnovecientos/WAGE-VANTA-FINAL.git

---

_Última actualización: 10 de abril de 2026_
