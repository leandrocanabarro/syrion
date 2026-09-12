---
name: backend-nodejs
description: >
  How to build Node.js services in this org, framework-agnostic (Express, Fastify,
  or Nest). Covers layering, configuration, error handling, logging, and boundary
  validation. Use when creating or changing Node.js server code or business logic.
license: MIT
---

# backend-nodejs

Server-side playbook for Node.js. Framework-agnostic — the same layering applies
whether the project uses Express, Fastify, or Nest.

## When to use

- Creating/changing services, business logic, or server wiring in Node.js.
- Deciding how to structure a handler → service → data flow.

Not for: the HTTP contract itself (`api-design`) or React (`frontend-*`).

## Layering

```
transport (route/controller)  → parse & validate input, map to/from DTOs
   → service (business logic)  → framework-agnostic, unit-testable, no req/res
      → data access            → repository / client, isolated I/O
```

- Keep **business logic free of framework types** (`req`/`res`, decorators). This
  keeps it portable and unit-testable.
- Controllers are thin: validate, call a service, map the result to a response.

## Configuration

- Read config from environment via a single typed config module; validate it at
  startup and fail fast on missing/invalid values.
- **Never** hardcode secrets or read them scattered across the code.

## Error handling

- Use a small set of typed domain errors; map them to HTTP status at the transport
  edge (see `api-design`). Do not leak stack traces or internal messages to clients.
- Centralize the error → response mapping in one place per app.

## Validation at boundaries

- Validate and coerce all external input (body, params, query, headers) with a
  schema validator (e.g. Zod) at the transport edge before it reaches services.
  See `security-best-practices`.

## Logging & observability (baseline)

- Structured logging (JSON) with a request/correlation id; never log secrets or PII.
- Log at boundaries and on errors; keep noisy debug logs out of hot paths.

## Async & resources

- Prefer `async/await`; always handle rejected promises. Do not leave unawaited
  promises. Clean up resources (connections, timers) deterministically.

## Dependencies

- `api-design`, `typescript-standards`, `testing-standards`, `code-quality`,
  `security-best-practices`.

## Validation

- [ ] Business logic has no framework/transport types and is unit-tested.
- [ ] All external input validated at the boundary.
- [ ] Config typed and validated at startup; no hardcoded secrets.
- [ ] Errors mapped centrally; no internal details leaked to clients.
