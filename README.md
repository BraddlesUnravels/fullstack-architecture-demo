# Job Application Tracker
A Bun + TypeScript monorepo for tracking job applications, with:
- A Qwik frontend (`apps/ui`)
- An Elysia API (`services/api`)
- Shared schema/type/constants packages (`packages/*`)
- A Drizzle + Postgres data layer (`packages/db`)

This README reflects the repository as it exists today, including current gaps and rough edges.

## Monorepo layout
```text
.
├── apps/
│   └── ui/                # Qwik + Vite frontend
├── services/
│   └── api/               # Elysia API service
├── packages/
│   ├── db/                # Drizzle schema, repos, migrations, seed
│   ├── schemas/           # Runtime validation schemas (TypeBox)
│   ├── types/             # TS types derived from shared schemas
│   ├── constants/         # Shared domain constants (JobStatus)
│   └── utils/             # Shared utilities (currently minimal)
├── docker/
│   ├── docker-compose-db.dev.yml
│   └── scripts/db-setup.sql
└── package.json           # Workspace scripts
```

## Tech stack
- Runtime/tooling: Bun, TypeScript
- Frontend: Qwik + Qwik City + Vite
- API: Elysia + Swagger + CORS
- Database: PostgreSQL + Drizzle ORM + drizzle-kit
- Logging: pino (+ pino-pretty in development)
- Auth/security primitives: argon2, jsonwebtoken
- Email transport: nodemailer (Gmail service)

## Current implementation status
- API is the most complete part of the system.
- Frontend is scaffolded and currently minimal.
- Shared schema/type packages are in place and consumed by API/UI.
- Database schema, repositories, migrations, and seeding are implemented.
- Auth flows exist (`register`, `login`, `logout`) and include email integration.

## Features currently available
### API routes
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
- Swagger docs at `GET /docs`

### Database domain model
Defined in `packages/db/src/schema.ts`:
- `user`
- `credential`
- `session`
- `company`
- `application`

Shared audit columns are applied across tables (`createdAt`, `updatedAt`, soft-delete fields, and optimistic `version`).

### Frontend status
Current UI route (`apps/ui/src/routes/index.tsx`) loads and renders a user record via Eden client.

`apps/ui/src/lib/home-loader.ts` currently calls a hard-coded user id:
- `2ce7a38e-e947-482a-baa6-31b214f7834a`

## Prerequisites
- Bun (current repo scripts assume Bun workspace execution)
- Docker (for local Postgres)

## Quick start
1. Install dependencies:
```bash
bun install
```

2. Create environment file (root):
```bash
cp .env.example .env
```

3. Update `.env` for local Docker defaults and auth/email:
```env
# Required for DB + API
DATABASE_URL=postgresql://admin:password@localhost:5432/app_db

# Required for auth token links
API_URL=http://localhost:3000
JWT_SECRET=replace-with-a-long-random-secret

# Required for Gmail transport used by email service
EMAIL_PASSWORD=replace-with-app-password

# Optional API runtime config
API_HOST=localhost
PORT=3000
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=info
```

Notes:
- `.env.example` currently includes only `DATABASE_URL`.
- If you use `docker/docker-compose-db.dev.yml` defaults, `admin/password/app_db` is the correct local connection tuple.

4. Start database (destructive reset + migrate + seed):
```bash
bun run dev:db
```

5. Start API:
```bash
bun run dev:api
```

6. Start UI (in another terminal):
```bash
bun run dev:ui
```

Default local URLs:
- API: `http://localhost:3000`
- API docs: `http://localhost:3000/docs`
- UI: Vite default port (typically `http://localhost:5173`)

## Database workflows
Run from repo root:

Start/stop/reset local Postgres:
```bash
bun run --filter @app/db infra:up
bun run --filter @app/db infra:down
bun run --filter @app/db infra:reset
```

Schema and migration workflows:
```bash
bun run --filter @app/db db:generate
bun run --filter @app/db db:migrate
bun run --filter @app/db db:studio
```

Seed:
```bash
bun run --filter @app/db db:seed
```

## Development commands
### Root
```bash
bun run format
bun run format:check
bun run dev:ui
bun run dev:api
bun run dev:db
```

### Lint and typecheck by workspace
```bash
bun run --filter @app/* lint
bun run --filter @app/* typecheck
```

### API build
```bash
bun run --filter @app/api build
```

## Testing status
Current test commands are partially configured:

- API:
```bash
bun run --filter @app/api test
```
At the moment this fails because `vitest` is referenced in scripts but not available in the API workspace dependencies.

- UI:
```bash
bun run --filter @app/ui test
```
Currently errors in the SSR test runner path under this setup.

- DB connectivity check:
```bash
bun run --filter @app/db db:test
```
Requires Postgres running and a valid `DATABASE_URL`.

## API architecture notes
- `services/api/src/index.ts` boots the server with env-driven host/port.
- `services/api/src/app.ts` wires plugins (observability, error handling, CORS, Swagger) and mounts modules.
- Route modules follow `models + service + response` split (e.g. `services/api/src/modules/user/*`).
- Error handling is centralized in `services/api/src/plugins/error-handler.plugin.ts`.
- Request logging and per-request correlation are in `services/api/src/plugins/observability.plugin.ts`.

## Shared contract architecture
- `@app/schemas` exports TypeBox runtime schemas.
- `@app/types` derives TS types from those schemas.
- `@app/db` exports schema and repository functions.
- `@app/constants` centralizes domain constants (for example `JobStatus`).

## Known gaps / in-progress areas
- Frontend is still a minimal scaffold and not feature-complete.
- API currently exposes user/auth/health routes only; company/application endpoints are not yet wired as route modules.
- `.env.example` is minimal and does not yet document all auth/email variables.
- Some workspace scripts and tooling are still being normalized.

## Contributing
- Formatting is enforced via Prettier.
- A pre-commit hook runs `lint-staged` (`.husky/pre-commit`).
- Keep changes consistent with shared schema/type package contracts to avoid drift between API/UI/DB.

## License
This project is licensed under the terms in `LICENSE`.
