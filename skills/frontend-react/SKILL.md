---
name: frontend-react
description: >
  How to build React UI in this org with TypeScript, covering both Vite SPA and
  Next.js (App Router). Use when creating or changing React components, hooks,
  routing, data fetching, or client/server state. States when each stack applies.
license: MIT
---

# frontend-react

Playbook for React work. Applies to **both** Vite SPA and **Next.js App Router**;
each step notes which stack it targets.

## When to use

- Creating/changing components, hooks, pages/routes, or data fetching.
- Deciding client vs. server state, or Server vs. Client Components (Next.js).

Not for: pure design/UX decisions (`frontend-design`) or app-wide structure
(`frontend-architecture`).

## Inputs

- The contract/design from the `designer` (component boundaries, props, types).
- Which stack the project uses (Vite SPA or Next.js) — check `package.json`.

## Process

1. **Pick component type.**
   - *Next.js:* default to **Server Components**; add `"use client"` only when you
     need state, effects, or browser APIs. Keep client boundaries small.
   - *Vite SPA:* all components are client; keep them presentational where possible.
2. **Type everything.** Props and public hooks are typed; no implicit `any`. Follow
   `typescript-standards`.
3. **State.**
   - Local UI state → `useState`/`useReducer`.
   - Server/remote state → a data-fetching library (TanStack Query for Vite;
     `fetch` in Server Components or Route Handlers for Next.js). Do not store
     server data in global client state unless it must be shared and mutated.
4. **Data fetching.**
   - *Next.js:* fetch in Server Components / Route Handlers; use `cache`/`revalidate`
     deliberately; never leak secrets to Client Components.
   - *Vite SPA:* fetch via a typed client + TanStack Query; handle loading/error/empty.
5. **Composition.** Prefer small composable components and custom hooks over prop
   drilling and large components. Co-locate component + test + styles.
6. **Accessibility & semantics.** Use semantic elements, labels, and roles; keep
   interactive elements keyboard-accessible.
7. **Test.** Every component/hook gets a test (`testing-standards`): render, assert
   behavior via Testing Library queries by role/label, cover error/empty states.

## Outputs

- Typed, tested components/hooks that match the design contract.
- Correct client/server boundary (Next.js) and explicit loading/error/empty states.

## Dependencies

- `frontend-design`, `frontend-architecture`, `typescript-standards`,
  `testing-standards`, `code-quality`.

## Validation

- [ ] No implicit `any`; props/hooks fully typed.
- [ ] Loading, error, and empty states handled.
- [ ] (Next.js) No secrets or server-only code in Client Components.
- [ ] Tests query by role/label and assert behavior, not implementation.
