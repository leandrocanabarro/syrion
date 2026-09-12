# Syrion — Baseline Instructions

These are the always-on rules for this repository. Keep them short; detailed,
task-specific guidance lives in **skills** (`skills/`) and is loaded on
demand. Path-specific rules live in `com.github.copilot/rules/instructions/`.

## Stack

This harness supports two stacks side by side. Detect which one applies to the
current repo/task (check for `package.json` vs. `composer.json`/`artisan`) and
load the matching skills — don't assume Node/React when the repo is Laravel.

**Node.js + React**
- **Language:** TypeScript (default for all new code).
- **Frontend:** React — Vite SPA and/or Next.js (App Router). Testing Library.
- **Backend:** Node.js, framework-agnostic (Express / Fastify / Nest all valid).
- **Testing:** Vitest or Jest + Testing Library.

**PHP + Laravel**
- **Language:** PHP with `declare(strict_types=1)` and fully typed signatures.
- **Backend & UI:** Laravel, Filament panels + Livewire + Alpine + Blade/Tailwind.
- **Testing:** Pest (feature + unit), SQLite in-memory.
- **Tooling:** Pint (style), Larastan/PHPStan (static analysis).

## Engineering flow

Do not jump straight to code. Follow the harness flow, escalating only as far as
the task needs:

```
Explore → Plan → Design → Build → Test → Review → PR
```

## Memory between sessions

Conversation history is not a reliable source of repository knowledge. At the
start of every task, use `repository-memory` and run
`node <plugin-root>/scripts/memory.mjs status .`. The agent owns initialization and
persistence; do not require users to run memory commands or ask for a save.

- When the state is `current`, read `.ai/memory/ARCHITECTURE.md` and the
  most relevant recent `WORKLOG.md` entry, then investigate only the task's
  direct area.
- When it is `changed`, inspect the reported paths and their diff before using
  the saved architecture facts. Update only facts affected by that diff.
- When it is `uninitialized`, initialize it and perform one appropriately
  scoped exploration before recording facts. Initialization is not evidence of
  architecture.
- Re-scan broadly only for absent/stale context or changes to auth, public
  contracts, schema/migrations, build/CI, framework bootstrapping, or an
  explicitly architectural task.

During work, use the skill to record material decisions, rationale, validated
findings, and pending actions in `WORKLOG.md` as they arise. Distinguish proposed
or accepted decisions from implemented facts. Incremental notes do not advance
the Git verification baseline.

End a non-trivial task by updating only changed architecture facts and writing a
concise checkpoint. Every remembered fact needs a source file/symbol and the
commit where it was verified. Never record secrets, PII, or chat transcripts.

- **Explore** the existing code and constraints before proposing changes.
- **Plan** non-trivial work into small, verifiable tasks with acceptance criteria.
- **Design** contracts (API shapes, component boundaries) before implementing.
- **Build** with tests; keep changes minimal and idiomatic.
- **Review** against `com.github.copilot/rules/policies/quality-gates.md` and the Definition of Done.

Users normally start with the `orchestrator` agent and describe the request; it
delegates to the internal specialist agents in `com.github.copilot/agents/` (explorer,
planner, designer, implementer, reviewer) as needed.

## Skills

- Load a skill only when it is relevant to the current task — do not preload many
  skills at once.
- Prefer the harness's internal skills for enterprise/stack specifics.
- Defer general engineering methodology (TDD, planning, debugging, git worktrees,
  code review) to the installed Superpowers skills.

## Precedence

- **Superpowers** is the methodology owner: it drives
  Explore → Plan → Design → Build → Test → Review → PR and the harness's own
  skills/agents build on it. Nothing below overrides that flow.

## Non-negotiables

- Never commit secrets. Validate input at system boundaries.
- Follow OWASP Top 10; consult `skills/security-best-practices/`.
- A task is not "done" until it meets `com.github.copilot/rules/policies/definition-of-done.md`.
