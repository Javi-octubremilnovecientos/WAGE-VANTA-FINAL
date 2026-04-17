---
name: conventional-commits
scope: workspace
summary: >
  Guía de Conventional Commits para WageVantage. Estandariza la clasificación de cambios, tipos de commits y formato de mensajes para mantener un historial limpio y profesional.
description: |
  Esta skill proporciona:
  1. Clasificación estándar de tipos de commit (feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert).
  2. Estructura de mensaje de commit (tipo, scope, descripción, cuerpo, footer).
  3. Scopes comunes del proyecto (auth, comparison, charts, ui, store, etc).
  4. Ejemplos reales de commits para WageVantage.
  5. Checklist de calidad antes de commitear.

steps:
  - title: Identificar el tipo de cambio
    description: Determina si es una feature (feat), fix, refactor, docs, etc.
  - title: Seleccionar el scope
    description: Elige el módulo afectado (auth, comparison, charts, ui, store, theme, api, deps, config, etc).
  - title: Redactar descripción corta
    description: Máximo 72 caracteres, imperativo presente, sin punto final.
  - title: Añadir cuerpo y footer (opcional)
    description: Explicar por qué se hace el cambio, mencionar alternativas, referencias a issues.
  - title: Validar checklist de calidad
    description: Verificar que el código compila, tests pasan, documentación está actualizada.

commit_types:
  - type: feat
    description: Nueva funcionalidad
    example: "feat(comparison): add multi-country salary comparison"
  - type: fix
    description: Corrección de bug
    example: "fix(charts): resolve BoxPlot tooltip positioning"
  - type: docs
    description: Solo cambios en documentación
    example: "docs(readme): update installation instructions"
  - type: style
    description: Cambios de formato (espacios, comas) sin afectar lógica
    example: "style(eslint): fix indentation issues"
  - type: refactor
    description: Refactorización sin cambiar funcionalidad
    example: "refactor(store): extract salary selectors"
  - type: perf
    description: Mejora de rendimiento
    example: "perf(charts): memoize chart data transformations"
  - type: test
    description: Añadir o corregir tests
    example: "test(auth): add login unit tests"
  - type: build
    description: Cambios en build system o dependencias
    example: "build(deps): upgrade recharts to v2.6.0"
  - type: ci
    description: Cambios en CI/CD
    example: "ci(github): add lint workflow"
  - type: chore
    description: Tareas de mantenimiento
    example: "chore(deps): update node-gyp"
  - type: revert
    description: Revertir un commit anterior
    example: "revert: feat(ui): remove old component"

scopes_comunes:
  - auth
  - comparison
  - charts
  - ui
  - store
  - theme
  - api
  - services
  - hooks
  - utils
  - config
  - deps
  - repo

formato_mensaje: |
  <tipo>(<scope>): <descripción corta en minúsculas>

  [Cuerpo opcional: explicación del por qué, no del qué]

  [Footer: referencias a issues o BREAKING CHANGE]

estructura_detallada: |
  ## Línea 1: Tipo, Scope y Descripción
  - **Tipo**: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
  - **Scope**: módulo afectado (auth, comparison, charts, etc)
  - **Descripción**: máximo 72 caracteres, imperativo, sin punto

  ## Línea 2: Vacía (separador)

  ## Línea 3+: Cuerpo (opcional)
  - Explica POR QUÉ se hizo el cambio, no QUÉ se hizo
  - Menciona alternativas consideradas
  - Máximo 100 caracteres por línea
  - Separado por líneas en blanco

  ## Última línea: Footer (opcional)
  - `Closes #123` para cerrar issues
  - `Fixes #456` para referencias
  - `BREAKING CHANGE:` si hay cambios incompatibles

ejemplos:
  - |
    feat(comparison): add multi-country salary comparison
    
    Users can now compare salaries across 3 countries simultaneously.
    Includes validation for FREE plan limits (max 2 countries).
    
    Closes #45
  
  - |
    fix(charts): resolve BoxPlot tooltip positioning issue
    
    The tooltip was appearing off-screen on mobile devices.
    Adjusted positioning logic to account for viewport size.
  
  - |
    refactor(store): extract salary selectors to separate file
    
    Improves maintainability and enables reusability.
    No change in functionality.
  
  - |
    docs(readme): update installation and configuration steps
    
    Added Tailwind CSS v3 setup and environment variables.
    Removed deprecated Node version requirements.

quality_criteria:
  - El código debe compilar sin errores
  - Tests deben pasar (si aplica)
  - No debe haber console.logs ni comentarios de debug
  - La documentación debe estar actualizada
  - No debe haber archivos temporales ni .env en el commit
  - El mensaje debe ser claro y autoexplicativo
  - El commit debe ser atómico (una responsabilidad)

how_to_invoke: |
  Puedes usar esta skill junto a **commit-and-push** para asegurar commits de calidad:
  
  1. Haz los cambios en tu código
  2. Invoca: "commit-and-push" seguido de confirmación
  3. El workflow te pedirá confirmación y sugerirá mensaje
  4. Usa tipos y scopes de esta skill para redactar

antipatrones:
  - ❌ Mensajes vagos: "fix", "update", "changes"
  - ❌ Commits gigantes: múltiples features en uno
  - ❌ Mezclar refactor + feature en un commit
  - ❌ Olvidar scope: "feat: add button" (falta scope)
  - ❌ Mayúsculas innecesarias: "feat(Auth): Add Login"

related_skills:
  - commit-and-push
  - agent-customization

---

# Conventional Commits para WageVantage

Esta skill estandariza cómo documentamos cambios en el repositorio Git.

## Flujo Rápido

1. **Identifica el tipo**: ¿Es feat, fix, refactor, docs, etc?
2. **Elige el scope**: ¿Qué módulo: auth, charts, comparison, ui?
3. **Redacta la descripción**: Máximo 72 caracteres, imperativo.
4. **Añade cuerpo** (opcional): Explica el por qué.
5. **Cierra issues** en footer: `Closes #45`

## Ejemplo Completo

```
feat(comparison): add salary percentile visualization

Implement new percentile distribution display using Recharts.
Users can now see salary ranges (10th, 25th, 50th, 75th, 90th).
Includes tooltip with percentile labels.

Closes #78
```

## Referencias

- [Conventional Commits Oficiales](https://www.conventionalcommits.org/)
- [Git Best Practices](https://git-scm.com/book/en/v2)

---

**¿Necesitas agregar scopes específicos o reglas adicionales para el equipo?**
