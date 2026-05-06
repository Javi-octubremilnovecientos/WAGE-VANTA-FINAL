---
name: Development approach preferences
description: How to work effectively in this codebase
type: feedback
---

**Feature-based architecture** — Code is organized by features. Redux slices, components, and logic for each feature live together.

**RTK Query everywhere** — All data fetching goes through RTK Query endpoints, never raw fetch calls in components.

**Supabase REST API only** — Use REST endpoints directly. The `@supabase/supabase-js` SDK is prohibited.

**Lazy-loaded routes** — All pages except landing should be lazy-loaded via React Router's Data Router pattern.

**Typed Redux selectors** — Use `createSelector` for derived/calculated data to avoid re-renders.

**Atomic Design for UI** — Atoms in `ui/`, molecules in `form/`, organisms in `charts/`.

**Tailwind v4 CSS-first** — Use `@theme` variables, no inline styles, mobile-first breakpoints.

**Conventional Commits** — Every commit must follow `<type>(<scope>): <description>` format.
