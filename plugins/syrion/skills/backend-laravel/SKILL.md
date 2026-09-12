---
name: backend-laravel
description: >
  How to build backend logic in this org's Laravel apps: controllers/Livewire →
  actions/services → Eloquent, Form Requests, DTOs, jobs/events, and
  authorization. Use when creating or changing PHP server code or business logic
  in a Laravel project.
license: MIT
---

# backend-laravel

Server-side playbook for Laravel. The PHP analog of `backend-nodejs` — same
layering discipline, Laravel idioms.

## When to use

- Creating/changing controllers, Livewire components, actions/services, Eloquent
  models, jobs, or business logic in a Laravel app.
- Deciding how to structure a request → action → data flow.

Not for: the HTTP contract itself (`laravel-api-design`), Filament/Livewire UI
(`filament-livewire`), or PHP typing conventions (`php-standards`).

## Layering

```
transport (controller / Livewire component)  → validate input (Form Request), map to DTOs
   → action / service (business logic)        → framework-light, unit-testable
      → Eloquent model / query                 → isolated data access
```

- Keep business logic out of controllers and Blade/Livewire templates. Extract to
  single-purpose action classes (`app/Actions`) or services (`app/Services`) — see
  `.github/policies` for org layout when set.
- Controllers/Livewire components are thin: validate, call an action/service, map
  the result to a response or view.

## Validation at boundaries

- Validate all external input with a **Form Request** (`$request->validated()`)
  or Livewire property validation — never trust raw `$request->input()`/public
  properties. Reject unexpected fields via `prohibited`/rule sets as needed. See
  `security-best-practices`.

## Data access

- Use Eloquent's query builder / relationships; never concatenate raw SQL with
  user input. Use `DB::raw()` only with bound parameters.
- Multi-tenant/scoped data: apply scoping via a model trait or global scope, not
  ad-hoc `where()` calls repeated across controllers.
- Authorization via **Policies** (`Gate`/`$this->authorize()`), not inline role
  checks scattered through controllers.

## DTOs & typing

- Pass typed DTOs (plain PHP classes or readonly value objects) between layers
  instead of raw arrays/request objects, especially across action boundaries.
- Follow `php-standards` for typing, enums, and PHPDoc conventions.

## Jobs, events & queues

- Long-running or non-critical-path work (emails, exports, webhooks) goes to a
  queued Job, not inline in the request cycle.
- Use Events/Listeners for side effects that are logically separate from the
  triggering action (e.g. "on user invited, send invite email").

## Config & secrets

- Read config via `config('...')`, never `env()` outside `config/*.php`. Never
  hardcode or log secrets.

## Errors

- Throw typed/domain exceptions; let the exception handler map them to responses
  (see `laravel-api-design` for the API error shape). Don't leak stack traces or
  internal messages to clients.

## Dependencies

- `laravel-api-design`, `php-standards`, `laravel-testing`, `code-quality`,
  `security-best-practices`.

## Validation

- [ ] Business logic lives in actions/services, not controllers or templates.
- [ ] All external input validated via Form Request/Livewire rules.
- [ ] Data access via Eloquent/bound queries; authorization via Policies.
- [ ] Config via `config()`; no hardcoded secrets.
- [ ] Errors mapped centrally; no internal details leaked to clients.
