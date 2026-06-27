# Job Application Tracker — Full-Stack Architecture Demo

This repository is a focused technical demo, not a complete SaaS product.

It is intentionally scoped to showcase production-style full-stack patterns—authentication flows, API boundaries, relational modelling, seed workflows, and shared contracts—while staying compact and easy to inspect.

## Current status

Completed and reviewable today:

- Monorepo structure with shared contracts and package boundaries.
- PostgreSQL + Drizzle schema, repositories, migrations, and seed data.
- API service with centralized error handling, structured logging, CORS, and Swagger docs.
- Auth routes (`register`, `login`, `logout`) and session-based route guarding.
- Protected user CRUD routes.
- Protected application routes (`list`, `read`, `create`, `update`).
- Minimal Qwik frontend scaffold with shared API client wiring.

In progress by design:

- Auth completion flows beyond register/login/logout.
- CI and automated test depth beyond current baseline.
- Frontend completeness for authenticated application management.

## Why this exists

Most of my recent work has been in proprietary repositories. This project is a public sample of how I structure a full-stack TypeScript system with API-first architecture and clear service boundaries.

## What to review first

For a quick technical pass:

- API composition and boundaries: `services/api/src/app.ts`
- Auth module: `services/api/src/modules/auth/*`
- User module: `services/api/src/modules/user/*`
- Application module: `services/api/src/modules/application/*`
- Session auth guard: `services/api/src/plugins/session-guard.plugin.ts`
- Error + observability plugins: `services/api/src/plugins/*`
- Database schema + repositories: `packages/db/src/schema.ts`, `packages/db/src/repos/*`
- Seed workflow: `packages/db/src/seed/*`
- Shared runtime contracts: `packages/schemas/src/typebox/*`

## Monorepo layout

```text
.
├── apps/
│   └── ui/                # Qwik + Vite frontend (minimal scaffold)
├── services/
│   └── api/               # Elysia API service
├── packages/
│   ├── db/                # Drizzle schema, repos, migrations, seed
│   ├── schemas/           # Runtime validation schemas (TypeBox)
│   ├── types/             # TS types derived from shared schemas
│   ├── constants/         # Shared domain constants (JobStatus)
│   └── utils/             # Shared utilities
└── docker/
    └── docker-compose-db.dev.yml
```

## Tech stack

- Runtime/tooling: Bun, TypeScript
- API: Elysia, Swagger, CORS
- Database: PostgreSQL, Drizzle ORM, drizzle-kit
- Auth/security primitives: argon2, jsonwebtoken
- Logging/observability: pino
- Frontend: Qwik + Qwik City + Vite

## Prerequisites

- Bun
- Docker (or colima running docker for Mac)

## Quick start (API-focused path)

1. Install dependencies:

```bash
bun install
```

2. Create local environment file:

```bash
cp .env.example .env
```

3. Bootstrap the local database (starts Postgres, applies migrations, and seeds development data):

```bash
bun run dev:db:init
```

4. For manual DB control, run:

```bash
bun run --filter '@app/db' infra:up
bun run --filter '@app/db' db:migrate
bun run --filter '@app/db' db:seed
```

5. Start the API:

```bash
bun run dev:api
```

6. Open docs and health endpoints:

- `http://localhost:3000/docs`
- `http://localhost:3000/health`

Optional UI run:

```bash
bun run dev:ui
```

## API routes currently available

Mounted in `services/api/src/app.ts`:

Public routes:

- `GET /health/`
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/logout/:id`
- `GET /docs`

Protected routes (require `Authorization: Bearer <session-id>`, where `<session-id>` comes from `POST /auth/login`):

- `GET /users?email=<email>`
- `GET /users/:id`
- `POST /users/new`
- `PATCH /users/:id`
- `DELETE /users/:id` (soft delete)
- `GET /applications/`
- `GET /applications/:id`
- `POST /applications/`
- `PATCH /applications/:id`

## Database model currently available

Defined in `packages/db/src/schema.ts`:

- `user`
- `credential`
- `session`
- `company`
- `application`

Shared audit columns include timestamps, soft-delete metadata, and optimistic versioning.

## Environment variables

Use `.env.example` as the baseline. Key values:

- `DATABASE_URL`: required for DB package and API data access.
- `API_URL` and `JWT_SECRET`: required by auth token link generation.
- `EMAIL_PASSWORD`: required for current Gmail-backed email transport.
- `API_HOST`, `PORT`, `CORS_ORIGIN`, `LOG_LEVEL`: API runtime behavior.
- All workspaces load environment variables from the repository root `.env` file.
- Workspace scripts in `apps/ui`, `services/api`, and `packages/db` load `../../.env` via `bun --env-file`.
- Avoid creating workspace-level `.env` files under `apps/`, `services/`, or `packages/`.

## Useful development commands

Run from repository root:

```bash
bun run dev:api
bun run dev:ui
bun run dev:db:init
bun run dev:db
```

`bun run dev:db` performs a local DB reset (`infra:reset`), then migrates and reseeds. Use it when you want a clean local DB state.

Database-focused commands:

```bash
bun run --filter '@app/db' infra:up
bun run --filter '@app/db' infra:down
bun run --filter '@app/db' infra:reset
bun run --filter '@app/db' db:migrate
bun run --filter '@app/db' db:seed
bun run --filter '@app/db' db:studio
```

Quality checks:

```bash
bun run format
bun run format:check
bun run --filter '@app/*' lint
bun run --filter '@app/*' typecheck
```

## Testing and CI status

- Test commands exist in API and UI workspaces, but there are currently no committed test files.
- CI currently runs format check, lint, and typecheck via `.github/workflows/ci.yml`.
- Dependency review also runs on pull requests via `.github/workflows/dependency-review.yml`.
- Expanding automated tests and adding test execution to CI is still planned.

## Roadmap (intentional next scope)

- Complete auth follow-up flows (for example, email verification and password reset).
- Add focused API and UI tests for auth + protected resource flows.
- Extend CI to include automated test execution once suites are in place.
- Expand UI beyond scaffold-level pages for authenticated application management.

## License

This project is licensed under `LICENSE`.
