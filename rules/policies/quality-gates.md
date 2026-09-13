# Quality Gates

Deterministic checks a change must pass. These are intended to run in CI (and,
post-MVP, via `.github/hooks/`). Agents should run the local equivalents before
declaring a task done. These tables are templates, not evidence that a command,
CI job, or tool exists. Inspect the target project's scripts and configuration.
Use applicable checks for the changed behavior and all project-required checks;
do not add tools or dependencies merely to instantiate this template. Reuse
recorded passing results when relevant files/configuration/environment have not
changed. Required merge checks still apply before merge.

## Gates — Node/React stack

| Gate            | Requirement                                              | Local command (typical)      |
| --------------- | ------------------------------------------------------- | ---------------------------- |
| **Format**      | Code formatted; no diffs                                 | `npm run format:check`       |
| **Lint**        | No new lint errors/warnings                              | `npm run lint`               |
| **Type-check**  | `tsc` passes with `strict`; no errors                    | `npm run typecheck`          |
| **Tests**       | Full suite passes                                        | `npm test`                   |
| **Coverage**    | Meets threshold (see below); no assertion-free padding   | `npm test -- --coverage`     |
| **Security**    | No known unpatched CVEs in dependencies                  | `npm audit --audit-level=high` |
| **Build**       | Production build succeeds                                | `npm run build`              |

> Commands are illustrative — use the scripts defined in each project's
> `package.json`. Adapt for pnpm/yarn as needed.

## Gates — PHP/Laravel stack

| Gate                | Requirement                                                | Local command (typical)          |
| ------------------- | ----------------------------------------------------------- | --------------------------------- |
| **Format**          | Pint style clean; no diffs                                   | `composer test:lint` (`pint --test`) |
| **Static analysis** | PHPStan/Larastan passes at the configured level; no new baseline | `composer stan`               |
| **Tests**           | Full suite passes                                            | `composer test` (`artisan test`)   |
| **Security**        | No known unpatched CVEs in dependencies                     | `composer audit`                   |
| **Build**           | Frontend assets build succeeds (Filament/Livewire assets)   | `pnpm run build`                   |

> Examples only; confirm commands in the target repository before running them.

## Coverage threshold

- **80%** lines/branches on changed code as a baseline **where coverage is
  configured** (a driver like Xdebug/PCOV and a runner threshold). CI may run
  with `coverage: none` for speed — don't claim a coverage gate the project
  doesn't actually enforce. Coverage is a signal, not a target: meaningful
  assertions on critical paths matter more than the number, and tests must not
  be written solely to inflate it.

## Rules

- A gate failure **blocks** merge. Do not disable a gate or bypass hooks
  (`--no-verify`) to get around a failure — fix the cause.
- New warnings count as failures; keep the baseline clean.

## Not yet automated (MVP)

Deterministic enforcement via `.github/hooks/` is a post-MVP step. Until then these
gates require agent-run checks; CI enforcement exists only where the target
project actually configures it. Do not claim hooks or CI enforcement from this
document alone.
