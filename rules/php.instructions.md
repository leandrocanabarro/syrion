---
description: PHP/Laravel rules for server code, Eloquent models, and Blade/Livewire views.
applyTo: '**/*.php'
---

# Backend & UI (PHP / Laravel)

See `skills/backend-laravel/SKILL.md`, `php-standards`, and
`filament-livewire`.

- **Layering:** thin controllers/Livewire components → actions/services →
  Eloquent. Keep business logic out of controllers and Blade templates.
- **Typing:** `declare(strict_types=1)`; type every method signature. No
  untyped params or return types.
- **Validation:** validate all external input (request body, route params,
  Livewire public properties) via a Form Request or Livewire rules before it
  reaches business logic.
- **Data access:** Eloquent/query builder only — never concatenate raw SQL with
  user input. Enforce authorization via Policies, not inline role checks.
- **Config & secrets:** read via `config('...')`, never `env()` outside
  `config/*.php`; never hardcode or log secrets.
- **Style & analysis:** format with Pint; keep PHPStan/Larastan passing at the
  project's configured level with no new baseline entries.
- **Errors:** throw typed/domain exceptions; let the central exception handler
  map them to responses — never leak stack traces to clients.
