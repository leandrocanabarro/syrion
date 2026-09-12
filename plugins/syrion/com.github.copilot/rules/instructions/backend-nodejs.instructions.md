---
description: Backend rules for Node.js server and API code.
applyTo: '**/{server,src,api,services,routes,controllers}/**/*.{ts,js}'
---

# Backend (Node.js)

Framework-agnostic (Express / Fastify / Nest). See
`skills/backend-nodejs/SKILL.md` and `api-design`.

- **Layering:** thin transport (controllers/routes) → framework-agnostic services
  → isolated data access. Keep business logic free of `req`/`res`/decorators so it
  is portable and unit-testable.
- **Validation:** validate and coerce all external input (body, params, query,
  headers) with a schema at the boundary before it reaches services.
- **Config & secrets:** read config from environment via a single typed module
  validated at startup; never hardcode or log secrets.
- **Errors:** map typed domain errors to HTTP status centrally; return the
  consistent error shape from `api-design`; never leak stack traces to clients.
- **API contracts:** follow `api-design` for paths, methods, status codes,
  pagination, and versioning.
- **Async:** always `await`/handle promises; clean up resources deterministically.
