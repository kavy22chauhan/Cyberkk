# CyberKK – Phishing URL Detection & Awareness Platform

CyberKK helps users identify phishing websites before visiting them, using defensive cybersecurity analysis with a professional dark SaaS UI.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/cyberkk run dev` — run the frontend (port 21436)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Recharts, Wouter
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/db/src/schema/scans.ts` — scans table schema
- `lib/db/src/schema/contacts.ts` — contact submissions schema
- `artifacts/cyberkk/src/` — React frontend (all pages)
- `artifacts/api-server/src/routes/scans.ts` — scan CRUD + pagination
- `artifacts/api-server/src/routes/stats.ts` — statistics aggregations
- `artifacts/api-server/src/routes/contact.ts` — contact form
- `artifacts/api-server/src/lib/phishingDetector.ts` — URL analysis engine

## Architecture decisions

- Phishing detection is fully client-side on the server (no external API calls) — 10 heuristic checks produce a 0–100 risk score
- All scan reasons/recommendations stored as JSON strings in PostgreSQL TEXT columns for simplicity
- Stats endpoints use raw SQL aggregations (not Drizzle ORM) for GROUP BY efficiency
- Dark mode is forced globally via `document.documentElement.classList.add("dark")` in the Navbar

## Product

- **URL Scanner**: Enter any URL → get a risk score (0-100), status badge (Safe/Suspicious/High Risk), threat gauge, detection reasons, recommendations, PDF download
- **Scan History**: Paginated table with search, sort, status filter, delete per row
- **Statistics Dashboard**: Pie chart, bar chart, trend line, top indicators
- **Cyber Awareness Center**: 7 educational sections on phishing defense
- **Contact Form**: Stored in DB with success notification

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After any schema change, run `pnpm --filter @workspace/db run push` then restart the API server workflow
- After any OpenAPI spec change, run `pnpm --filter @workspace/api-spec run codegen` before using updated types
- Run `pnpm run typecheck:libs` after lib changes before checking leaf artifact typechecks

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
