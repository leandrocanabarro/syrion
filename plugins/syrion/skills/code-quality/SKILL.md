---
name: code-quality
description: >
  Baseline code-quality standards for this org: readability, structure, naming,
  small functions, error handling, and avoiding over-engineering. Use when writing
  or reviewing code to keep changes clean, minimal, and idiomatic.
license: MIT
---

# code-quality

The standard every change is held to. Pairs with `review-core` during review.

## When to use

- Writing any code, and during review of a change's cleanliness and structure.

## Principles

- **Minimal & focused.** Implement only what the task requires. No speculative
  features, abstractions, or "while I'm here" refactors in the same change.
- **Readable first.** Clear names over clever code. Optimize for the next reader.
- **Small units.** Small functions/components with a single responsibility; extract
  when a block needs a comment to explain *what* it does.
- **Consistency.** Match existing patterns and structure in the codebase over
  introducing a new style.

## Naming

- Intention-revealing names; no abbreviations that aren't domain-standard.
- Booleans read as predicates (`isLoading`, `hasAccess`); functions are verbs.

## Functions & flow

- Prefer early returns over deep nesting. Keep the happy path unindented.
- Avoid boolean/flag parameters that change behavior — split the function instead.
- Pure functions where practical; isolate side effects.

## Error handling

- Handle errors at the right level; don't swallow them. Fail loudly in dev,
  gracefully at boundaries. No empty `catch` blocks.

## Comments

- Comment *why*, not *what*. One short line where the code can't explain itself.
  Do not add narration, restated logic, or multi-paragraph doc comments where a
  line will do.

## Over-engineering (avoid)

- No helpers/abstractions for one-time use. No error handling for impossible cases.
  No config/flags nobody asked for. Validate only at real boundaries.

## Dependencies

- `typescript-standards`, `review-core`, `testing-standards`.

## Validation

- [ ] Change is minimal and focused; no unrelated refactors.
- [ ] Names are intention-revealing; nesting is shallow.
- [ ] No swallowed errors; no dead code; comments explain *why*.
