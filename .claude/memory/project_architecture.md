---
name: Architecture decisions
description: Key architectural patterns and rationale
type: project
---

**Why RTK Query?** — Automatic caching, tag invalidation, and loading states. No need to manually manage async state.

**Why REST API over SDK?** — More control, lighter bundle, explicit header management for tokens and api-key.

**Why Data Router?** — Type-safe route params, loaders for data-fetching before render, actions for form submissions.

**Why feature-based slices?** — Cohesion. Everything for a feature (reducer, selectors, API endpoints) lives in one place, scaling better than action/reducer/selector folders.

**Why createSelector?** — Memoization prevents unnecessary re-renders of connected components when derived data hasn't changed.

**Why Tailwind v4?** — Zero-config, CSS variables via `@theme`, better performance, mobile-first by default.

**Why Recharts?** — Rich charting library, good TypeScript support, responsive containers, tooltip customization.
