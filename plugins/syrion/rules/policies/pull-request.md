# Pull Request Policy

How changes are packaged for review and merge.

## Scope

- One PR does one logical thing. Split unrelated changes.
- Keep PRs small enough to review in one sitting; large features come as a sequence
  of small, independently reviewable PRs.

## Title & description

- **Title:** concise, imperative, and scoped (Conventional Commits encouraged:
  `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`).
- **Description** must cover:
  - **What & why** — the change and its motivation (link the issue/ticket).
  - **How** — approach and any notable decisions or trade-offs.
  - **Testing** — what was tested and how to verify.
  - **Risk & rollback** — impact, breaking changes, and how to revert.
  - **Screenshots** for user-facing UI changes.

## Checklist (author self-review before requesting review)

- [ ] Meets `definition-of-done.md`.
- [ ] Passes `quality-gates.md` (lint, type-check, tests, security/audit, build).
- [ ] Diff is focused; no debug code, secrets, or commented-out blocks.
- [ ] Breaking changes are called out with a migration path.
- [ ] Docs updated where behavior/contracts changed.

## Review

- Address review feedback per severity (see `review-core`): critical/major before
  merge; resolve or explicitly defer nits.
- Do **not** bypass checks (`--no-verify`, force-merge) to get a PR through.

## Merge

- All required checks green and at least one approving review.
- Prefer squash merge with a clean, descriptive commit message.
