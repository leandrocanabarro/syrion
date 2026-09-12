---
name: laravel-testing
description: >
  How to test PHP/Laravel code in this org with Pest. Covers feature vs. unit
  tests, factories, database assertions, and mocking discipline. Use when adding
  or reviewing tests for Laravel controllers, actions, models, or Livewire/
  Filament components.
license: MIT
---

# laravel-testing

Our stack-specific testing conventions for Laravel. This layers on top of the
Superpowers `test-driven-development` methodology (RED-GREEN-REFACTOR); this
skill defines *how* we write the tests, with **Pest**.

## When to use

- Adding tests for controllers, actions/services, Eloquent models, jobs,
  Livewire components, or Filament resources.
- Reviewing whether a Laravel change is adequately and correctly tested.

## Tooling

- **Pest** (`./vendor/bin/pest`) as the runner; SQLite in-memory for the test
  database (see `phpunit.xml`) unless the project configures otherwise.
- Factories (`database/factories`) for building model state; avoid manual
  `Model::create()` calls duplicated across tests.

## What to test

- **Behavior, not implementation.** Assert HTTP responses, database state, or
  return values — not private method calls or internal structure.
- **Feature tests** for HTTP endpoints, Livewire/Filament flows: assert status
  codes, redirects, validation errors, and database side effects.
- **Unit tests** for actions/services/DTOs with no framework types — test them
  directly, in isolation.
- Cover success, validation failure, authorization failure (403/redirect), and
  not-found cases — not just the happy path.

## Structure

- Co-locate by mirroring `app/` structure under `tests/Feature` or
  `tests/Unit`. One behavior per test; descriptive `it('does X when Y')` names.
- Arrange–Act–Assert: build state with factories, perform the action, assert
  outcome.

## Database & assertions

- Use `RefreshDatabase` (or the project's configured trait) per test class.
- Assert persisted state with `assertDatabaseHas`/`assertDatabaseMissing` rather
  than re-querying and asserting equality manually.
- For tenant-scoped models, assert queries are scoped (no cross-tenant leakage)
  when the change touches tenancy.

## Livewire & Filament

- Use `Livewire::test(...)` to assert component state, emitted events, and
  validation errors without a full HTTP round trip.
- For Filament resources, test via the panel's Livewire components (list/create/
  edit pages) rather than hitting internal Filament classes directly.

## Mocking discipline

- Mock at real boundaries only (mail, queue, external HTTP/webhooks, clock).
  Use Laravel fakes (`Mail::fake()`, `Queue::fake()`, `Http::fake()`) over
  hand-rolled mocks.
- Do not mock the Eloquent model/action under test; use the real DB
  (in-memory SQLite) and factories instead.

## Coverage

- Coverage is a signal, not a goal. Meet the threshold in
  `policies/quality-gates.md` without writing assertion-free tests.

## Dependencies

- `backend-laravel`, `filament-livewire`, `code-quality`; external Superpowers TDD.

## Validation

- [ ] Feature tests cover success, validation, and authorization failure paths.
- [ ] Unit tests isolate framework-free actions/services.
- [ ] Fakes used for mail/queue/HTTP; no mocking of the unit under test.
- [ ] Database assertions via `assertDatabaseHas`/`assertDatabaseMissing`.
