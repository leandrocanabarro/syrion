---
description: Baseline engineering rules for all files in this repository.
applyTo: '**'
---

# Engineering (all files)

- Follow the harness flow: Explore → Plan → Design → Build → Test → Review → PR.
  Escalate only as far as the task needs.
- Keep changes **minimal and focused**. No speculative features, abstractions, or
  unrelated refactors in the same change (`code-quality`).
- New code follows the project's language strictness: **TypeScript** with `strict`
  on and no implicit `any` (`typescript-standards`), or **PHP** with
  `declare(strict_types=1)` and fully typed signatures (`php-standards`).
- Every behavioral change ships with tests and they pass before "done"
  (`testing-standards` for Vitest/Jest, `laravel-testing` for Pest).
- Never commit secrets; validate input at system boundaries
  (`security-best-practices`).
- A task is not done until it meets `com.github.copilot/rules/policies/definition-of-done.md`.
- Comment *why*, not *what* — one short line where code can't explain itself.
