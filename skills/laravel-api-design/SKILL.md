---
name: laravel-api-design
description: >
  Laravel-specific conventions for HTTP APIs: routes, Form Request validation,
  API Resources, exception-handler error shape, and versioning. Use when
  designing or changing an HTTP endpoint's request/response contract in a
  Laravel project. Layers on top of api-design.
license: MIT
---

# laravel-api-design

Laravel implementation of the org's `api-design` conventions — same REST rules,
status codes, error shape, pagination, and versioning; this skill covers the
Laravel-specific mechanics.

## When to use

- Adding/changing a Laravel route, controller action, Form Request, or API
  Resource that other clients (SPA, mobile, third parties) consume.

Not for: Filament/Livewire server-rendered views (`filament-livewire`) — those
render HTML/Livewire wire payloads, not a versioned JSON contract.

## Routes & controllers

- Define resourceful routes with `Route::apiResource(...)` where the endpoint
  maps to CRUD; use explicit routes for non-CRUD actions, named clearly
  (`POST /orders/{order}/cancel`).
- Controllers stay thin: validate via a **Form Request**, delegate to an
  action/service (`backend-laravel`), return an API Resource.

## Validation

- One **Form Request** class per endpoint (or a shared one for closely related
  create/update). Reject unexpected fields; type-hint and validate every input,
  never read `$request->all()` directly into a model.

## Responses — API Resources

- Every response goes through a `JsonResource`/`ResourceCollection` — never
  return an Eloquent model or collection directly. This keeps the wire contract
  decoupled from the DB schema.
- Follow `api-design`'s error shape (stable `code`, human `message`,
  field-level `details`) via a custom exception handler (`render()` in
  `bootstrap/app.php` or `app/Exceptions`), not ad-hoc `response()->json(...)`
  calls scattered through controllers.

## Status codes & pagination

- Use the same table as `api-design` (`200`/`201`/`202`/`204`/`400`/`401`/`403`/
  `404`/`409`/`422`/`500`).
- Use Laravel's paginator (`->paginate()`/`->cursorPaginate()`) and let the
  Resource collection carry `links`/`meta` — don't hand-roll pagination
  metadata.

## Versioning

- Prefix routes (`/api/v1/...`) in `routes/`. Additive changes (new optional
  field) are non-breaking; changing/removing a field on an existing Resource is
  breaking — introduce a new version instead of mutating the contract in place.

## Dependencies

- `api-design`, `backend-laravel`, `php-standards`, `security-best-practices`.

## Validation

- [ ] Every response wrapped in an API Resource; no raw Eloquent models returned.
- [ ] Every request validated by a Form Request; no direct `$request->all()` fill.
- [ ] Errors flow through the central exception handler with the shared error shape.
- [ ] Breaking changes get a new version prefix, not an in-place contract change.
