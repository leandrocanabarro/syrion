---
description: Frontend rules for React/TypeScript source and styles.
applyTo: '**/*.{tsx,jsx,css,scss}'
---

# Frontend (React / TypeScript)

Applies to React UI in Vite SPA and Next.js App Router. See
`skills/frontend-react/SKILL.md` and `frontend-architecture`.

- **Component types (Next.js):** Server Components by default; add `"use client"`
  only for state/effects/browser APIs, and keep client boundaries small. Never
  leak server-only code or secrets into Client Components.
- **Typing:** props and public hooks are fully typed; no implicit `any`.
- **State:** local UI state in components; server/remote state via the data layer
  (TanStack Query, or Next.js server fetch) — do not store server data in global
  client state.
- **States:** handle loading, empty, and error explicitly — not just the happy path.
- **Accessibility:** semantic elements, labeled inputs, keyboard-operable
  interactive elements.
- **Tests:** query by role/label with Testing Library; assert behavior, not
  implementation (`testing-standards`).
