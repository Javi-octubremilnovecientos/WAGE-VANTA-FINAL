# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Wage Vantage** — international salary comparison SaaS. Users compare salaries across countries, roles and experience levels via statistical charts (BoxPlots, BarCharts, etc.).

## Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run lint     # ESLint
npm run test     # Vitest test suite
```

## Tech Stack

- **React + TypeScript** (strict mode)
- **Redux Toolkit + RTK Query** — all global state and data fetching
- **Recharts** — all data visualizations
- **Tailwind CSS v4** — zero-config, CSS-first, `@theme` directive
- **React Router v7** — Data Routers (`createBrowserRouter`)
- **React Hook Form + Zod** — form validation
- **Vite** — build tool
- **Supabase** (via REST API only, no SDK) — backend, auth, storage, edge functions

## Architecture

### Feature-based structure

```
src/
  features/       # Redux slices, RTK Query APIs, selectors per feature
  components/
    ui/           # Atoms: Button, Input, Badge, Modal
    form/         # Molecules: FormField, ComboBox, Slider
    charts/       # Organisms: MainChart, BoxPlot
  core/
    store/        # rootReducer.ts, store/index.ts, typed hooks
    routing/      # createBrowserRouter config, guards, loaders, paths.ts
    layout/       # MainLayout
  pages/          # Page components (lazy-loaded per route)
  services/       # supabaseApi.ts (RTK Query baseQuery)
```

### State management

- One slice per feature: `src/features/[feature]/[feature]Slice.ts`
- Complex selectors in a separate `[feature]Selectors.ts` — always use `createSelector` for derived/calculated data
- RTK Query APIs via `apiSlice.injectEndpoints` (modular, not one `createApi` per feature)
- Typed hooks `useAppSelector` / `useAppDispatch` — never access store directly from components
- No manual thunks when RTK Query can handle the fetch

### Supabase integration

All Supabase calls go through RTK Query, never raw `fetch` in components. The `@supabase/supabase-js` SDK is **prohibited**; use REST API endpoints directly:

- Auth: `POST /auth/v1/token?grant_type=password`, `/auth/v1/signup`, etc.
- Database: `GET|POST|PATCH|DELETE /rest/v1/[table]?<postgrest-filters>`
- Storage: `/storage/v1/object/[bucket]/[path]`
- Edge Functions: `POST /functions/v1/[function-name]`

`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are read from environment variables. Tokens are stored in Redux (not localStorage). The `service_role_key` must never appear in frontend code.

### AI Data Enrichment (Gemini fallback)

When `get-salary-data` returns fewer than 8 records (scarce sample), the app automatically calls the `enrich-salary-data` edge function which proxies a Gemini API request and returns a `BoxPlotData` directly (not raw records).

**Flow:**
1. `useGetSalaryDataQuery` fetches records from Supabase
2. `useEnrichedSalaryStats` hook checks `records.length < 8`
3. If scarce, fires `useEnrichSalaryDataMutation` → `POST /functions/v1/enrich-salary-data`
4. Edge function calls Gemini REST API with structured output (`responseSchema`) and prompt engineering
5. Returns `{ category, min, q1, median, q3, max }` — a `BoxPlotData` directly
6. `mergeBoxPlots` fuses Supabase stats and AI stats (min/max = absolute extremes, q1/median/q3 = averages)
7. Fused stats passed to `MainChart`

**Key files:**
- `supabase/functions/enrich-salary-data/index.ts` — Deno edge function (deployed, verify_jwt: false)
- `src/hooks/useEnrichedSalaryStats.ts` — fallback hook with infinite-loop guard
- `src/features/salaries/salaryApi.ts` — `enrichSalaryData` mutation endpoint
- `src/features/salaries/salaryUtils.ts` — `mergeBoxPlots` utility

**Infinite loop guard:** RTK Query recreates `enrich`/`reset` function refs on every render. Always store them in `useRef` and exclude from `useEffect` deps. Use a `lastEnrichKeyRef` string (`country|JSON(formValues)`) to prevent re-calling Gemini with the same params. Use `records?.length` (primitive) instead of `records` (object ref) in deps.

**Gemini secret:** `WAGE_VANTAGE_GEMINI_API_KEY` is stored as a Supabase project secret (never in frontend env). Supabase injects it as `Deno.env.get('WAGE_VANTAGE_GEMINI_API_KEY')` at runtime.

**MCP deploy note:** The MCP bundler flattens files into `/source/` — `../` relative imports to `_shared/` do not resolve. When deploying via MCP, include `cors.ts` as a flat sibling file and import as `'./cors.ts'`. CLI deploys (`supabase functions deploy`) can use `'../_shared/cors.ts'` normally.

**UI states:** `MainChart` accepts both `isLoading` (Supabase fetching) and `isEnriching` (Gemini processing). Shows "Loading chart..." during Supabase fetch, "Enhancing data accuracy with AI..." during Gemini enrichment.

### Routing

Uses `createBrowserRouter` (Data Router pattern). Never use declarative `<Routes>/<Route>`. Route hierarchy lives in `src/core/routing/routes.ts`. All pages are lazy-loaded. Route paths are typed constants in `src/core/routing/paths.ts` — never hardcode strings in `navigate()` or `<Link>`.

Route guards are reusable components (`RequireAuth`, `RequirePremium`) that wrap `<Outlet>`.

### Charts

Each chart lives in its own folder: `src/components/charts/[ChartName]/` with `index.tsx`, `[ChartName].types.ts`, `[ChartName].utils.ts`, and optionally `CustomTooltip.tsx`. Chart components are always wrapped in `ResponsiveContainer` and `React.memo`. Data transformations happen in selectors or `.utils.ts` — never inside JSX.

### UI Components

Follow Atomic Design: atoms in `src/components/ui/`, molecules in `src/components/form/`, organisms in `src/components/charts/`. Use `cn()` (clsx + tailwind-merge) for class merging. No inline styles. All interactive elements must have ARIA labels and keyboard navigation.

## Key Conventions

**TypeScript** — strict, no `any`. Export `[Feature]State` from every slice. Props interfaces named `ComponentNameProps`.

**Tailwind CSS v4** — use `@theme` CSS variables; prefer standard utilities over arbitrary values. Mobile-first breakpoints.

**Commits** — Conventional Commits format: `<type>(<scope>): <description>`. Types: `feat`, `fix`, `refactor`, `perf`, `docs`, `style`, `test`, `build`, `ci`, `chore`. Scopes: `auth`, `comparison`, `charts`, `ui`, `store`, `api`, `theme`, `config`, `deps`. Commits must be atomic (single responsibility). Descriptions in lowercase imperative, ≤72 characters.

**Branching** — `main` (production), `develop` (active dev), `feature/<name>`, `fix/<name>`, `hotfix/<name>`.

## Specialized Agents

This project has custom agents in `.github/agents/` (see `.github/AGENTS.md` for full usage guide):

| Task | Agent |
|---|---|
| Redux slices, selectors, RTK Query | `@redux-architect` |
| Recharts, BoxPlots, tooltips | `@recharts-expert` |
| Tailwind UI components, forms, modals | `@ui-ux-master` |
| React Router routes, loaders, guards | `@navigation-architect` |
| Supabase REST API, auth, storage | `@supabase-expert` |
| Git commits, CI/CD, documentation | `@git-github-expert` |
