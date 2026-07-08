# Job Application Tracker — Full-Stack Architecture Demo

This repository is a focused technical demo, not a complete SaaS product.

It is intentionally scoped to showcase production-style full-stack patterns—authentication flows, API boundaries, relational modelling, seed workflows, and shared contracts—while staying compact and easy to inspect.

## Current status

Completed and reviewable today:

- Monorepo structure with shared contracts and package boundaries.
- PostgreSQL + Drizzle schema, repositories, migrations, and seed data.
- API service with centralized error handling, structured logging, CORS, and Swagger docs.
- Redis-backed staged registration and session lifecycle management.
- Auth endpoints for register, verify-email, complete-registration, login, and logout.
- Protected user CRUD routes.
- Protected application routes (`list`, `read`, `create`, `update`).
- Qwik UI with animated register/login page and a protected `/app` shell scaffold.
- API test suite under `services/api/test`, executed in CI.

In progress by design:

- Full authenticated application-management UX in the frontend.
- Enforced `/app` route-guard redirect behavior in the Qwik layout.
- UI/integration/e2e coverage beyond the current API-focused test suite.

## Why this exists

Most of my recent work has been in proprietary repositories. This project is a public sample of how I structure a full-stack TypeScript system with API-first architecture and clear service boundaries.

## What to review first

For a quick technical pass:

- API composition and boundaries: `services/api/src/app.ts`
- Auth module: `services/api/src/modules/auth/*`
- Redis-backed staged registration + session store: `packages/redis/src/*`
- User module: `services/api/src/modules/user/*`
- Application module: `services/api/src/modules/application/*`
- Session auth guard: `services/api/src/plugins/session-guard.plugin.ts`
- Error + observability plugins: `services/api/src/plugins/*`
- Database schema + repositories: `packages/db/src/schema.ts`, `packages/db/src/repos/*`
- Seed workflow: `packages/db/src/seed/*`
- Shared runtime contracts: `packages/schemas/src/*`, `packages/types/src/*`
- UI auth and protected route scaffold: `apps/ui/src/routes/index.tsx`, `apps/ui/src/routes/app/*`, `apps/ui/src/lib/actions/*`

## Monorepo layout

```text
.
├── apps/
│   └── ui/                # Qwik + Vite frontend
├── services/
│   └── api/               # Elysia API service
├── packages/
│   ├── db/                # Drizzle schema, repos, migrations, seed
│   ├── redis/             # Redis client + staged registration/session helpers
│   ├── schemas/           # Runtime validation schemas (Valibot)
│   ├── types/             # TS types derived from shared schemas
│   ├── constants/         # Shared domain constants (JobStatus, UserTier)
│   └── utils/             # Shared utilities
└── docker/
    ├── docker-compose-db.dev.yml
    └── docker-compose-redis.dev.yml
```

## Tech stack

- Runtime/tooling: Bun, TypeScript
- API: Elysia, Swagger, CORS
- Validation/contracts: Valibot + shared schema/type packages
- Database: PostgreSQL, Drizzle ORM, drizzle-kit
- Cache/store: Redis (registration + session lifecycle)
- Auth/security primitives: argon2, jsonwebtoken
- Logging/observability: pino
- Frontend: Qwik + Qwik City + Vite + Tailwind

## Prerequisites

- Bun
- Docker (or colima running Docker on Mac)

## Quick start (local development)

1. Install dependencies:

```bash
bun install
```

2. Create local environment file:

```bash
cp .env.example .env
```

3. Start local infrastructure (Postgres + Redis), then run DB migrations + seed:

```bash
bun run dev:infra:up
```

4. Start the API:

```bash
bun run dev:api
```

5. Start the UI:

```bash
bun run dev:ui
```

6. Open local endpoints:

- API docs: `http://localhost:3000/docs`
- API health: `http://localhost:3000/health/`
- UI: `http://localhost:5173`

One-command option to bring up infra + API + UI:

```bash
bun run start
```

## API routes currently available

API service endpoints (served directly by `services/api`):

Public routes:

- `GET /health/`
- `PUT /auth/` (start registration)
- `GET /auth/:id` (verify email link id)
- `PATCH /auth/` (complete registration)
- `POST /auth/` (login)
- `POST /auth/logout`
- `GET /docs`

Protected routes (require `sid` session cookie):

- `GET /users?email=<email>`
- `GET /users/:id`
- `POST /users/`
- `PATCH /users/:id`
- `DELETE /users/:id` (soft delete)
- `GET /applications/`
- `GET /applications/:id`
- `POST /applications/`
- `PATCH /applications/:id`

When calling API endpoints from the UI dev server, requests use a `/api` proxy prefix in the browser and are rewritten to the direct API paths above.

## Database model currently available

Defined in `packages/db/src/schema.ts`:

- `user`
- `credential`
- `session`
- `company`
- `application`

Shared audit columns include timestamps, soft-delete metadata, and optimistic versioning.

## Environment variables

Use `.env.example` as the baseline.

Core values used by application code:

- `DATABASE_URL`: required for DB package and API data access.
- `REDIS_URL`: required for registration/session storage.
- `API_URL`: used by verification-link generation and UI API proxy targeting.
- `EMAIL_PASSWORD`: required for Gmail-backed email transport.
- `JWT_SECRET`: required by JWT signing/verification helpers.

Common runtime configuration:

- `API_HOST`, `PORT`: API listener host/port.
- `CORS_ORIGIN`: allowed CORS origin(s), comma-separated.
- `LOG_LEVEL`: API logging level.
- `NODE_ENV`: affects secure-cookie behavior and logger transport mode.

All workspaces load environment variables from the repository root `.env` file.

## Useful development commands

Run from repository root:

```bash
bun run start
bun run stop
bun run dev:infra:up
bun run dev:api
bun run dev:ui
bun run dev:db
```

`bun run dev:db` performs a local DB reset (`infra:reset`), then migrates and reseeds.

Workspace-level infra/data commands:

```bash
bun run --filter '@app/db' infra:up
bun run --filter '@app/db' infra:down
bun run --filter '@app/db' infra:reset
bun run --filter '@app/db' db:migrate
bun run --filter '@app/db' db:seed
bun run --filter '@app/db' db:studio
bun run --filter '@app/redis' infra:up
bun run --filter '@app/redis' infra:down
bun run --filter '@app/redis' infra:reset
```

Quality checks:

```bash
bun run format
bun run format:check
bun run typecheck
bun run lint
bun run --filter '@app/api' test
```

## Testing and CI status

- API tests live under `services/api/test`.
- UI workspace has test scripts configured, but there are currently no committed UI test files.
- CI runs format check, typecheck, lint, and API tests via `.github/workflows/ci.yml`.
- Dependency review runs on pull requests via `.github/workflows/dependency-review.yml`.

## Roadmap (intentional next scope)

- Expand the authenticated `/app` area beyond scaffold-level placeholder content.
- Add UI tests and end-to-end coverage for auth and protected resource flows.
- Extend frontend application management features and associated validation states.
- Continue hardening auth follow-up flows (for example, password reset/recovery).

## License

This project is licensed under `LICENSE`.
