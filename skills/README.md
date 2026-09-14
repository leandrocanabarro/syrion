# Skills Catalog

Skill folders are **flat** here — Copilot only auto-discovers direct
subdirectories of `skills/`. This index is the catalog of what's
available and when to load it.

Copilot loads a skill when its `description` matches the task. Load only what a
task needs; do not preload many skills at once.

| [repository-memory](repository-memory/SKILL.md) | Starting or ending a task across sessions; loads selective, Git-checked team context and records task progress. |

## Frontend — Node/React stack

| Skill | Use when |
| ----- | -------- |
| [frontend-react](frontend-react/SKILL.md) | Building/changing React components, hooks, routing, data fetching (Vite SPA + Next.js). |
| [frontend-architecture](frontend-architecture/SKILL.md) | Structuring a frontend: folders, boundaries, state, data layer, routing. |
| [frontend-design](frontend-design/SKILL.md) | Designing a screen/component: layout, states, accessibility, prop contract. |

## Backend — Node/React stack

| Skill | Use when |
| ----- | -------- |
| [backend-nodejs](backend-nodejs/SKILL.md) | Building Node.js services/business logic (framework-agnostic). |
| [api-design](api-design/SKILL.md) | Designing an HTTP endpoint or its request/response/error contract. |

## Backend & UI — PHP/Laravel stack

| Skill | Use when |
| ----- | -------- |
| [backend-laravel](backend-laravel/SKILL.md) | Building/changing controllers, actions/services, Eloquent, jobs in a Laravel app. |
| [laravel-api-design](laravel-api-design/SKILL.md) | Designing a Laravel API endpoint: routes, Form Requests, API Resources, versioning. |
| [filament-livewire](filament-livewire/SKILL.md) | Building/changing Filament resources, Livewire components, Blade views. |
| [php-standards](php-standards/SKILL.md) | Writing/reviewing PHP; typing a class, method, or Eloquent model. |
| [laravel-testing](laravel-testing/SKILL.md) | Adding/reviewing Pest tests for Laravel/Livewire/Filament code. |

## Language

| Skill | Use when |
| ----- | -------- |
| [typescript-standards](typescript-standards/SKILL.md) | Writing/reviewing TypeScript; typing a boundary or data shape. |

## Quality

| Skill | Use when |
| ----- | -------- |
| [testing-standards](testing-standards/SKILL.md) | Adding/reviewing tests (Vitest/Jest + Testing Library), Node/React stack. |
| [code-quality](code-quality/SKILL.md) | Keeping a change clean, minimal, and idiomatic. |
| [code-simplifier](code-simplifier/SKILL.md) | Simplifying already-working, touched code for clarity — after its tests are green. |
| [security-best-practices](security-best-practices/SKILL.md) | Handling input, auth, secrets; security review (OWASP Top 10). |

## Design & brand

| Skill | Use when |
| ----- | -------- |
| [brandkit](brandkit/SKILL.md) | Building a brand board (logo concepts, palette, typography, mockups) for a new brand/sub-brand/product. When the ask is only the brand board, this stays outside the Explore→Plan→Design→Build→Test→Review→PR code flow. |

## Review

| Skill | Use when |
| ----- | -------- |
| [review-core](review-core/SKILL.md) | Reviewing a change or preparing one for review. |

## External capabilities

General engineering methodology (TDD, planning, debugging, git worktrees, code
review) is **not** duplicated here — it is deferred to Superpowers, which owns
Explore → Plan → Design → Build → Test → Review → PR.
