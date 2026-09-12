---
name: frontend-architecture
description: >
  App-level structure for React frontends: folder layout, module boundaries, state
  strategy, data-fetching layer, and routing for Vite SPA and Next.js App Router.
  Use when setting up a new frontend or making structural/architectural decisions.
license: MIT
---

# frontend-architecture

Structure decisions for React apps. For component-level work use `frontend-react`.

## When to use

- Bootstrapping a new frontend, or reorganizing an existing one.
- Deciding where state lives, how data flows, and how features are bounded.

## Structure (feature-first)

```
src/
├── app/                 # Next.js routes (App Router) — or app bootstrap (Vite)
├── features/<feature>/  # co-located UI, hooks, api, types, tests per feature
├── components/          # shared, presentational, reusable
├── lib/                 # framework-agnostic utilities, typed API client
├── hooks/               # shared hooks
└── types/               # shared cross-feature types
```

- **Feature-first**: keep a feature's components, hooks, data access, and tests
  together. Promote to `shared` only when reused.
- **Dependency direction**: features may use `components`/`lib`; shared code must
  not import from features.

## State strategy

| State kind        | Where it lives                                              |
| ----------------- | ---------------------------------------------------------- |
| Local UI          | Component (`useState`/`useReducer`)                        |
| Server/remote     | Data layer (TanStack Query / Next.js server fetch), cached |
| Global client     | A small store (Context or Zustand) — only when truly shared |
| URL/navigation    | Router (search params, route segments)                     |

Avoid putting server data into global client stores.

## Routing & rendering

- **Next.js:** App Router; Server Components by default; group routes by segment;
  use layouts for shared shells; Route Handlers for API endpoints.
- **Vite SPA:** React Router; lazy-load routes; keep a single typed API client in
  `lib`.

## Data layer

- One typed API client in `lib` (fetch wrapper) with centralized error handling.
- Co-locate feature-specific queries/mutations in the feature folder.

## Dependencies

- `frontend-react`, `frontend-design`, `typescript-standards`, `api-design`
  (for the client/server contract).

## Validation

- [ ] Features are self-contained; shared code has no feature imports.
- [ ] Single typed API client; consistent error handling.
- [ ] State placed in the right tier (no server data in global client state).
