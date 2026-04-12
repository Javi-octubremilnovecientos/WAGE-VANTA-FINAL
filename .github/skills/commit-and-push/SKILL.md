---
name: commit-and-push
scope: workspace-or-global
summary: >
  Workflow para realizar un commit bien documentado y hacer push al repositorio remoto, verificando el estado del repo y siguiendo buenas prácticas.
description: |
  Esta skill guía al usuario para:
  1. Verificar el estado del repositorio (archivos modificados, nuevos y eliminados).
  2. Mostrar checklist de calidad antes de commitear (build, lint, docs, convenciones de mensaje).
  3. Sugerir mensaje de commit siguiendo Conventional Commits.
  4. Realizar el commit y push al remoto.
  5. Confirmar que el push fue exitoso.

steps:
  - title: Verificar estado del repositorio
    description: Ejecuta `git status` y muestra los archivos modificados, nuevos y eliminados.
  - title: Checklist de calidad
    description: Confirma que el build compila, no hay errores de lint, y la documentación está actualizada.
  - title: Redactar mensaje de commit
    description: Sugiere un mensaje de commit siguiendo Conventional Commits. Permite editarlo antes de continuar.
  - title: Realizar commit y push
    description: Ejecuta `git add`, `git commit` y `git push`.
  - title: Confirmar éxito
    description: Muestra confirmación y recomendaciones post-push.

quality_criteria:
  - El commit debe ser atómico y bien documentado.
  - El mensaje debe seguir Conventional Commits.
  - No debe haber archivos temporales ni logs olvidados.
  - El build debe compilar sin errores.
  - La rama debe estar actualizada con el remoto.

example_prompts:
  - "Haz un commit documentado y push de los cambios"
  - "commit-and-push: sube los cambios recientes con mensaje claro"
  - "Prepara y sube un commit siguiendo buenas prácticas"

how_to_invoke: |
  Puedes invocar esta skill con prompts como:
  - "commit-and-push: haz commit y push de los cambios"
  - "Haz un commit bien documentado y súbelo al repo remoto"

related_skills:
  - agent-customization
  - conventional-commits
---

# Commit & Push Skill

Este workflow te guía paso a paso para asegurar commits de calidad y pushes seguros en cualquier proyecto Git.

## Flujo resumido
1. Verifica el estado del repo (`git status`).
2. Checklist de calidad (build, lint, docs, sin archivos temporales).
3. Sugiere mensaje de commit (Conventional Commits).
4. Commit y push.
5. Confirmación y recomendaciones.

## Ejemplo de mensaje de commit

```
feat(ui): mejora en el ComboBox y estilos globales

- Refactor en StandardComboBox para accesibilidad
- Ajustes en index.css para mejor experiencia visual
- Documentación actualizada
```

---

¿Quieres extender este workflow con validaciones automáticas, hooks o integración CI/CD? ¡Solicítalo!
