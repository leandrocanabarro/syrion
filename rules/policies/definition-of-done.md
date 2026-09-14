# Definition of Done

A task is **not done** until every applicable item below is true. Agents must check
this before declaring completion; the `reviewer` gates on it. Applicability is
based on the requested change and the target project's configured requirements.
For docs/instruction-only changes, validate structure, references, and consistency;
do not invent an application test suite. Explain unavailable required checks as
unverified, never as passed.

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
- [ ] Relevant tests pass; run the full suite when required by the project or
  when shared behavior, integration boundaries, or broad impact warrant it.

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
- [ ] Relevant `.ai/` context, decision, and task records were updated when the
  task changed knowledge or leaves follow-up work; the regenerated index passes
  `node <plugin-root>/memory.mjs validate .`.
- [ ] Observability considered (structured logs at boundaries/errors; no secrets/PII).
- [ ] Applicable `quality-gates.md` checks pass. Prepare a PR per
  `pull-request.md` only when PR delivery is in the authorized scope.
