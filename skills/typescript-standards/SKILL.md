---
name: typescript-standards
description: >
  Cross-cutting TypeScript conventions for frontend and backend: strictness,
  typing style, module boundaries, and safe patterns. Use when writing or
  reviewing TypeScript and deciding how to type an API, module, or data shape.
license: MIT
---

# typescript-standards

Shared TypeScript conventions across the stack.

## When to use

- Writing or reviewing any TypeScript; deciding how to type a boundary or data shape.

## Compiler & strictness

- `strict: true` is required. Do not disable strict flags per file to silence errors.
- No implicit `any`. Prefer `unknown` over `any` when a type is genuinely unknown,
  then narrow.

## Typing style

- Type **public boundaries** explicitly (exported functions, component props, API
  DTOs). Let inference handle obvious locals.
- Prefer `type` aliases for unions/utility shapes; `interface` for object contracts
  meant to be extended/implemented. Be consistent within a module.
- Model finite sets with **discriminated unions** over booleans/flags; make illegal
  states unrepresentable.
- Prefer `readonly` and immutable data where practical.

## Safety patterns

- Narrow `unknown` with type guards; validate external data with a schema (e.g.
  Zod) at boundaries rather than trusting casts.
- Avoid `as` casts except at well-understood boundaries; never use `as any`.
- Avoid non-null assertions (`!`) unless the invariant is guaranteed and obvious.
- Handle `null`/`undefined` explicitly; use optional chaining and nullish
  coalescing intentionally, not to paper over unclear types.

## Modules & boundaries

- Export the minimum surface; keep internal types internal.
- Share cross-package types via a single source of truth (a `types` module or a
  shared package) — do not duplicate DTOs.

## Dependencies

- Applies alongside every other skill; pairs with `code-quality`.

## Validation

- [ ] `strict` on; no implicit `any`, no `as any`.
- [ ] Public boundaries explicitly typed; illegal states unrepresentable.
- [ ] External data validated at boundaries, not cast.
