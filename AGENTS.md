# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project summary
Node.js (ESM) Express API for user acquisition/auth flows, using Drizzle ORM with Neon Postgres and Arcjet request protection.

## Core development commands
- Install dependencies:
  - `npm ci`
- Run locally without Docker (expects env vars and reachable DB):
  - `npm run dev` (watch mode)
  - `npm start` (non-watch mode)
- Run with Docker (recommended in README):
  - Dev stack (API + Neon Local proxy): `docker compose -f docker-compose.dev.yml up --build`
  - Stop dev stack: `docker compose -f docker-compose.dev.yml down`
  - Prod-like stack: `docker compose -f docker-compose.prod.yml up --build -d`
  - Stop prod-like stack: `docker compose -f docker-compose.prod.yml down`
- Lint/format:
  - `npm run lint`
  - `npm run lint:fix`
  - `npm run format:check`
  - `npm run format`
- Database (Drizzle):
  - `npm run db:generate`
  - `npm run db:migrate`
  - `npm run db:studio`

## Tests
No test runner script is currently defined in `package.json`, and no test files are present in the repository at this time.  
If tests are introduced later, add the canonical commands here (including single-test invocation).

## Environment and runtime model
- Entry point: `src/index.js` loads dotenv and boots `src/server.js`.
- Server binds on `0.0.0.0:${PORT}` (default `3000`).
- Development is designed around `.env.development` + Neon Local proxy (`neon-local` host).
- Production is designed around `.env.production` + direct Neon Cloud `DATABASE_URL`.
- Required env vars used by code/config:
  - `PORT`
  - `DATABASE_URL`
  - `ARCJET_KEY`
  - `JWT_SECRET` (falls back to insecure default if missing; set explicitly in real environments)
  - `NODE_ENV`

## High-level architecture
- `src/app.js` composes middleware and routes:
  - Global middleware first: `helmet`, `cors`, JSON/urlencoded parsing, `cookie-parser`, `morgan` wired to Winston.
  - Health/public routes: `/`, `/health`, `/api`.
  - Security gate: `securityMiddleware` (Arcjet-based) is applied before API route modules.
  - Feature routes mounted under:
    - `/api/auth` (`src/routes/auth.routes.js`)
    - `/api/users` (`src/routes/users.routes.js`)
- Layering pattern per feature:
  - `routes` → `controller` → `services` → `models`/DB
  - Validation is performed in controllers via Zod schemas (`src/validations`).
  - Persistence is done in services via Drizzle using `db` from `src/config/database.js`.

## Data and security flow
- Auth flow:
  - `signup` validates request, creates user via `createUser`, hashes password with bcrypt, signs JWT, sets HTTP-only cookie.
  - `signin` validates request, authenticates via bcrypt compare, signs JWT, sets cookie.
  - `signout` clears token cookie.
- JWT and cookie helpers:
  - `src/utils/jwt.js` centralizes sign/verify.
  - `src/utils/cookie.js` enforces secure cookie defaults (`httpOnly`, `sameSite=strict`, conditional `secure`).
- Arcjet policy:
  - Base rules in `src/config/arcjet.js` (`shield`, bot detection, short sliding window).
  - `src/middlewares/security.middleware.js` adds role-based sliding-window limits (`admin/user/guest`) and denies bot/shield/rate-limited traffic.

## Database and schema
- Drizzle config: `drizzle.config.js`
  - Schema source: `./src/models/*.js`
  - Migrations output: `./drizzle`
- Current model set is centered on `user` (`src/models/user.model.js`), used by auth and user services.

## Logging
- Winston logger in `src/config/logger.js`:
  - JSON logs to `logs/error.log` and `logs/combined.log`
  - Console transport enabled when `NODE_ENV !== 'production'`
- HTTP access logs are emitted via Morgan into the same logger stream.

## Repository conventions relevant to edits
- Uses package import aliases in `package.json` (`#config/*`, `#services/*`, etc.); follow this style instead of deep relative paths.
- ESM project (`"type": "module"`), so prefer `import`/`export` syntax across changes.
