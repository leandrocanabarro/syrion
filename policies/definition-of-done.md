# Definition of Done

A task is **not done** until every applicable item below is true. Agents must check
this before declaring completion; the `reviewer` gates on it.

## Implementation

- [ ] Requirement met and matches the approved plan/acceptance criteria.
- [ ] Change is minimal and focused — no unrelated refactors or dead code.
- New code follows the project's language strictness: TypeScript with `strict`
  and no implicit `any`, or PHP with `declare(strict_types=1)` and fully typed
  signatures.
- Contracts respected (API shape per `api-design`/`laravel-api-design`;
  component contracts).

## Tests

- [ ] Tests added/updated for the change (Vitest/Jest + Testing Library, or Pest).
- [ ] Tests assert behavior; error/empty/edge cases covered.
- [ ] The full test suite passes locally.

## Quality

- [ ] Lint/format and type-check/static-analysis pass with no new errors/warnings
  (ESLint + `tsc`, or Pint + PHPStan/Larastan).
- [ ] Names are intention-revealing; functions/components are small and single-purpose.
- [ ] Errors handled at the right level; none swallowed.

## Security

- [ ] External input validated at boundaries.
- [ ] Server-side authorization on protected actions; no IDOR.
- [ ] No secrets in code, logs, or client bundles.
- [ ] Dependencies free of known unpatched CVEs.

## Documentation & delivery

- [ ] Docs/README updated when behavior or contracts change.
- [ ] `.ai/memory/ARCHITECTURE.md` and `WORKLOG.md` were updated when the
  task changed architecture knowledge or leaves meaningful follow-up work.
- [ ] Observability considered (structured logs at boundaries/errors; no secrets/PII).
- [ ] PR prepared per `pull-request.md` and passes `quality-gates.md`.
