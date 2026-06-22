# Job Application Tracker — Full-Stack Architecture Demo

This repository is a focused technical demo, not a complete SaaS product.

It is intentionally scoped to demonstrate production-style full-stack patterns, including authentication flows, API boundaries, relational modelling, seed workflows, and shared contracts, while keeping the implementation original, focused, and easy to inspect.

## Current status

Completed and reviewable today:

- Monorepo structure with shared contracts and package boundaries.
- PostgreSQL + Drizzle schema, repositories, migrations, and seed data.
- API service with centralized error handling, structured logging, CORS, and Swagger docs.
- Auth routes (`register`, `login`, `logout`) and user CRUD routes.

In progress by design:

- Protected applications API slice (planned next).
- CI and automated test depth beyond current baseline.
- Frontend completeness (UI remains minimal and non-goal for this stage).

## Why this exists

Most of my recent work has been in proprietary repositories. This project provides a public, inspectable sample of how I structure a full-stack TypeScript system with API-first architecture and clear service boundaries.

## What to review first

For a quick technical review:

- API composition and boundaries: `services/api/src/app.ts`
- Auth module: `services/api/src/modules/auth/*`
- User module: `services/api/src/modules/user/*`
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
- Docker

## Quick start (API-focused path)

1. Install dependencies:

```bash
bun install
```

2. Create local environment file:

```bash
cp .env.example .env
```

3. Start local Postgres:

```bash
bun run --filter '@app/db' infra:up
```

4. Apply migrations and seed development data:

```bash
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

- `GET /health/`
- `GET /users?email=<email>`
- `GET /users/:id`
- `POST /users/new`
- `PATCH /users/:id`
- `DELETE /users/:id` (soft delete)
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/logout/:id`
- `GET /docs`

## Database model currently available

Defined in `packages/db/src/schema.ts`:

- `user`
- `credential`
- `session`
- `company`
- `application`

Shared audit columns include timestamps, soft-delete metadata, and optimistic versioning.

## Environment variables

Use `.env.example` as baseline. Important values:

- `DATABASE_URL`: required for DB package and API data access.
- `API_URL` and `JWT_SECRET`: required by auth token link generation.
- `EMAIL_PASSWORD`: required for current Gmail-backed email transport.
- `API_HOST`, `PORT`, `CORS_ORIGIN`, `LOG_LEVEL`: API runtime behavior.

## Useful development commands

Run from repository root:

```bash
bun run dev:api
bun run dev:ui
bun run dev:db
```

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

- API test command currently references Vitest, but Vitest is not yet installed in `services/api`.
- Existing CI workflow currently runs dependency review only.
- Expanding automated tests and CI gates is part of the planned production-pattern slice.

## Roadmap (intentional next scope)

- Add one protected vertical slice for applications (`login/register -> protected CRUD flow`).
- Add focused API tests for auth + protected resource flow.
- Add CI checks for lint, typecheck, and tests.
- Keep UI intentionally lightweight for this demo phase.

## License

This project is licensed under `LICENSE`.
