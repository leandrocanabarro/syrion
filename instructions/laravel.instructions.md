---
description: >
  Project-specific domain context for this Laravel SaaS app: the three surfaces
  (site/app/backoffice), identity/auth model, and tenancy. Reconciles this
  repo's real architecture into the harness.
applyTo: 'app/**,config/**,routes/**,database/**,resources/**'
---

# This project: multi-tenant Laravel SaaS starter

Three surfaces on one Laravel 13 / PHP 8.4 app. See `backend-laravel`,
`filament-livewire`, `php-standards`, `laravel-testing` for how to build; this
file states what already exists so agents don't re-derive or contradict it.

## Surfaces

- **Site** (`config('domains.site')`, main domain): public marketing, plain
  Blade + Tailwind (`resources/views/site/*`), plus a Livewire contact form
  (`App\Livewire\Site\ContactForm`) that creates a `Lead`. No auth guard.
- **App** (`config('domains.app')`, `app.<host>`): customer product. Filament
  panel `app` (`App\Providers\Filament\AppPanelProvider`), guard `app`
  (`Customer` model). Tenant-scoped, gated by an active subscription. Resources
  under `app/Filament/App`.
- **Backoffice** (`config('domains.backoffice')`, `backoffice.<host>`): staff
  admin. Filament panel `backoffice`, guard `backoffice` (`User` model).
  Resources under `app/Filament/Backoffice`.

## Identity & auth

- `User` = staff (backoffice guard). `Customer` = tenant customer (app guard).
  Separate models — never conflate them or share a table/guard.
- Both panels: login + password reset only, **no self-registration**
  (invite-only). Customers are provisioned in the backoffice and invited via
  the `customers` password broker (set-password link).
- Cookies are isolated per host; each panel has its own guard.

## Tenancy (single-DB)

- Tenant-owned models use the `App\Models\Concerns\BelongsToTenant` trait: a
  global scope filtering to `App\Support\CurrentTenant` when a tenant is set,
  and auto-assigns `tenant_id` on create. New tenant-owned models must use this
  trait rather than hand-rolled `tenant_id` filtering.
- `CurrentTenant` is populated by `App\Http\Middleware\SetCurrentTenant` in the
  app panel from `auth('app')->user()->tenant`. The backoffice sets no tenant,
  so staff see all tenants' data by design.
- `EnsureActiveSubscription` middleware + `Customer::canAccessPanel()` enforce
  subscription-gated access — don't bypass this in new app-panel resources.

## Domain conventions

- Business logic in `app/Services`; DTOs in `app/DataTransferObjects`; enums
  (string-backed, with `label()`) in `app/Enums`. Follow these existing
  locations for new code rather than introducing parallel folders.
- Authorization via Laravel Policies — Filament picks them up automatically.
