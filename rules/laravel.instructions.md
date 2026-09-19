---
description: Reusable Laravel architecture guidance; preserve the consuming project's verified conventions.
applyTo: 'app/**,config/**,routes/**,database/**,resources/**'
---

# Laravel project conventions

Apply these rules when the consuming project uses Laravel. Resolve framework,
PHP, Filament and Livewire versions from its manifests and lockfiles. Use
`backend-laravel`, `php-standards`, `laravel-testing`, and `filament-livewire`
only for the components present and relevant to the task.

## Reuse project context

Start with the caller's brief and selected `.ai/` records. Inspect only missing
or stale facts in relevant routes, providers, models, configuration and tests.
Do not infer a SaaS architecture, multiple panels, tenancy, subscriptions or
registration policy merely because the project uses Laravel.

## Boundaries and identity

- Preserve the existing controller/action/service boundaries and naming. Locate
  one relevant implementation before adding a parallel folder or abstraction.
- Identify the actual authenticatable models, guards and password brokers before
  changing authentication. Keep existing identity boundaries intact.
- Reuse Policies/Gates and existing middleware for authorization. Preserve the
  project's registration, invitation and panel-access behavior unless changing
  it is explicitly in scope.
- For multi-domain or multi-panel applications, verify how routes, guards,
  sessions and cookies are isolated; do not assume panel names or hostnames.

## Tenant and subscription boundaries, when present

- Identify the project's tenancy mechanism and how tenant context is established
  for HTTP requests, jobs and console commands. Reuse it for affected operations.
- Check tenant ownership server-side. Do not trust a client-supplied tenant ID
  or assume an unscoped administrative query is authorized.
- Preserve existing subscription/access checks when relevant to the change.
  Do not invent a `BelongsToTenant` trait or subscription middleware.

## Retain findings

Return source-linked architecture findings and invalidated assumptions to the
memory owner. Persist reusable facts in the consuming project's `.ai/contexts/`
with evidence and relevant paths, so later work resumes from that context.
