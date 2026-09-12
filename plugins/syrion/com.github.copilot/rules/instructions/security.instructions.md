---
description: Security rules applied to all code (OWASP Top 10 baseline).
applyTo: '**'
---

# Security (all code)

Baseline aligned to the OWASP Top 10. See
`skills/security-best-practices/SKILL.md`.

- **Input:** validate/coerce all external input at the boundary with a schema;
  reject unexpected fields; never trust client-supplied types.
- **Injection:** parameterized queries / safe ORM APIs only — never concatenate
  SQL/NoSQL or interpolate user input into shells.
- **XSS:** rely on JSX escaping; avoid `dangerouslySetInnerHTML` (sanitize if
  truly unavoidable).
- **AuthZ:** enforce authorization on the server for every protected operation;
  check ownership/roles per request (avoid IDOR).
- **Secrets:** never commit or log secrets; load from env/secret manager; keep them
  out of client bundles (Next.js: only `NEXT_PUBLIC_*` reaches the client).
- **Dependencies:** keep current; run audit tooling; address known CVEs.
- **Errors:** never leak stack traces, internal messages, or PII to clients/logs.

## PHP / Laravel specifics

- **Input & mass assignment:** validate with a Form Request or Livewire rules;
  never pass `$request->all()` into `Model::create`/`update`. Guard models with
  `$fillable` (or `$guarded`) so unexpected columns can't be set.
- **Blade output:** use `{{ $value }}` (auto-escaped); use `{!! !!}` only for
  content you have sanitized. Never build HTML from untrusted strings.
- **Injection:** use Eloquent / the query builder; bind parameters in any
  `DB::raw()` / `whereRaw()` — never interpolate user input.
- **AuthZ & IDOR:** enforce with Policies/Gates on every protected action. For
  tenant-owned models, rely on the `BelongsToTenant` global scope rather than
  ad-hoc `where('tenant_id', ...)`; never expose or trust a client-supplied
  `tenant_id`.
- **Sessions & CSRF:** keep the CSRF middleware on web routes; keep guards and
  cookies isolated per surface (`SESSION_DOMAIN`/host-only) so one panel's
  session can't be replayed on another.
- **Secrets:** read via `config()`, never `env()` outside `config/*.php`; never
  commit or log secrets.
