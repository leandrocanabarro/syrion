---
name: security-best-practices
description: >
  Application security baseline aligned to the OWASP Top 10 for both stacks
  (Node.js + React and PHP + Laravel): input validation, authn/authz, secrets,
  dependencies, and safe output. Use when writing or reviewing
  security-sensitive code, or handling auth, input, or secrets.
license: MIT
---

# security-best-practices

The security baseline. Consult for any change touching input, auth, secrets, or
external data. Aligned to the OWASP Top 10.

## When to use

- Handling user input, authentication/authorization, secrets, file/URL/DB access,
  or third-party data; and during security review.

## Input validation (boundaries)

- Validate and coerce **all** external input at the system boundary with a schema
  (e.g. Zod) — body, params, query, headers, and messages. Reject unexpected
  fields. Never trust client-supplied types.

## Injection & output

- Use parameterized queries / prepared statements or an ORM's safe API — never
  string-concatenate SQL/NoSQL. Avoid shell interpolation of user input.
- **React/XSS:** rely on JSX escaping; never build DOM from untrusted strings.
  Avoid `dangerouslySetInnerHTML`; if unavoidable, sanitize first.
- Set safe response headers (CSP, `X-Content-Type-Options`, etc.) at the edge.

## Laravel specifics

- **Mass assignment:** validate with a Form Request / Livewire rules; never pass
  `$request->all()` into `create`/`update`. Guard models with `$fillable`.
- **Blade:** `{{ }}` is auto-escaped; use `{!! !!}` only on sanitized content.
- **Injection:** use Eloquent / the query builder; bind parameters in any
  `DB::raw()`/`whereRaw()`.
- **AuthZ & IDOR:** enforce via Policies/Gates; for tenant-owned models rely on
  the `BelongsToTenant` global scope, never a client-supplied `tenant_id`.
- **Sessions/CSRF:** keep CSRF middleware on web routes; isolate guards and
  cookies per surface.

## AuthN / AuthZ

- Enforce authorization on the **server** for every protected operation; never
  trust the client. Check ownership/roles per request (avoid IDOR).
- Use vetted libraries for sessions/tokens; set secure, httpOnly, sameSite cookies;
  short-lived tokens with rotation. Don't roll your own crypto.

## Secrets

- **Never** commit secrets or log them. Load from environment/secret manager via a
  typed config validated at startup. Keep secrets out of Client Components/bundles
  (Next.js: only `NEXT_PUBLIC_*` reaches the client).

## Dependencies & supply chain

- Keep dependencies current; run audit tooling and address known CVEs. Avoid
  unmaintained or low-trust packages. Pin/lock versions.

## Errors & data exposure

- Do not leak stack traces, internal messages, or PII to clients or logs. Return
  the generic error shape from `api-design`.

## Dependencies

- `backend-nodejs`, `api-design`, `frontend-react`, `review-core`.

## Validation (OWASP-minded)

- [ ] All external input validated/sanitized at the boundary.
- [ ] Server-side authz on every protected action; no IDOR.
- [ ] No secrets in code, logs, or client bundles.
- [ ] Parameterized data access; no untrusted HTML injection.
- [ ] Dependencies audited; no known unpatched CVEs.
