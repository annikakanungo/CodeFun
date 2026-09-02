# code.fun — Free Coding Program

A free coding education platform for students in Grades 4–12. Offers grade-based courses, weekly lessons with videos and exercises, quizzes, teacher lesson plans, and Ontario curriculum expectation mappings.

## Run & Operate

- `pnpm --filter @workspace/coding-program run dev` — run the frontend (port assigned by Replit)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `node scripts/seed-full-curriculum.mjs` — populate or refresh the complete Grades 4–12 curriculum
- Required env: `DATABASE_URL` — Postgres connection string (auto-provided by Replit)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + shadcn/ui + Wouter router
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Fonts: Outfit (display), Plus Jakarta Sans (body), Space Mono (code)

## Where things live

- `lib/api-spec/openapi.yaml` — single source of truth for all API contracts
- `lib/db/src/schema/` — Drizzle table definitions (courses, lessons, exercises, quizzes, resources, teacher_plans, curriculum_mappings, progress_records)
- `artifacts/api-server/src/routes/` — Express route handlers (courses, lessons, resources, teacher_plans, progress, stats)
- `artifacts/coding-program/src/` — React frontend (pages: Home, Courses, Course Detail, Lesson Detail, Resources, Teacher Hub, Student Progress)
- `lib/api-client-react/src/generated/` — generated React Query hooks (do not edit)
- `lib/api-zod/src/generated/` — generated Zod schemas (do not edit)

## Architecture decisions

- OpenAPI-first: all API contracts are defined in `openapi.yaml`, then code-generated. Never hand-write what codegen produces.
- Grade bands: elementary (4–5), middle (6–8), secondary (9–12) — used throughout the UI for color-coding and filtering.
- Progress tracking uses a `studentId` string (no auth in v1) — demo uses `"demo-student"`.
- After any `lib/*` change, run `pnpm run typecheck:libs` before checking artifact packages (stale declarations cause TS2305 errors in routes).

## Product

- **Home**: Hero, grade journey progression, program stats, recent student activity feed
- **Courses**: Browse by grade band; each card color-coded per course
- **Course Detail**: Objectives, weekly topics, full lesson list with indicators
- **Lesson Detail**: Video, written content, exercises, quiz, curriculum mappings, teacher plan
- **Resources**: Filterable library of free coding tools and tutorials
- **Teacher Hub**: Lesson plans per grade with objectives, materials, activities, assessment ideas
- **Student Progress**: Completion tracker with badges

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After adding new schema files to `lib/db/src/schema/`, always update `lib/db/src/schema/index.ts` and run `pnpm run typecheck:libs` before running the API server typecheck.
- DB push command: `pnpm --filter @workspace/db run push`
- Codegen command: `pnpm --filter @workspace/api-spec run codegen`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
