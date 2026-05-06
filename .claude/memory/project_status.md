---
name: Project status and roadmap
description: Current state of development and known issues
type: project
---

**Status**: Active development

**Key features**:
- Multi-country salary comparison
- Statistical visualizations (BoxPlots, BarCharts)
- User authentication (Supabase Auth)
- Premium plans for advanced features
- Data stored in Supabase with Row Level Security

**Recent work** (from git history):
- Migration to Supabase Edge Functions
- Improvements to forms and user logic
- UI refinements (warm palette, badges, modals)

**Known constraints**:
- NO `@supabase/supabase-js` SDK — REST API only
- NO Redux thunks for fetching — RTK Query only
- NO inline styles — Tailwind CSS v4 only
- NO hardcoded paths — use constants from paths.ts
