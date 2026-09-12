---
name: frontend-design
description: >
  UI/UX and component-contract design for React features: layout, states,
  accessibility, and responsive behavior, before implementation. Use when
  designing a screen or component's appearance, interaction, and prop contract.
license: MIT
---

# frontend-design

Design the *shape and behavior* of UI before it is built. Implementation lives in
`frontend-react`.

## When to use

- Designing a new screen or component: its layout, states, and prop contract.
- Reviewing UX consistency and accessibility of a proposed UI.

## Process

1. **Component contract.** Define the component's props (typed), events/callbacks,
   and which state it owns vs. receives.
2. **States by design.** Explicitly design for: default, loading, empty, error,
   success, and disabled. A screen is not designed until all apply-able states are.
3. **Layout & responsiveness.** Define breakpoints and how layout adapts; prefer
   fluid layouts and design tokens over magic numbers.
4. **Accessibility (WCAG-minded).** Semantic structure, labels for inputs,
   sufficient contrast, focus order, keyboard operability, and ARIA only when
   semantics are insufficient.
5. **Consistency.** Reuse existing design tokens/components; do not introduce
   one-off styles when a shared component exists.

## Output (template)

```
### Component: <Name>
- Props: { ... } (typed)
- Owns state: ...   Receives: ...
### States
- default / loading / empty / error / success / disabled: ...
### Layout & a11y
- breakpoints: ...   focus order: ...   labels: ...
```

## Dependencies

- `frontend-react` (implementation), `frontend-architecture` (where it lives),
  `typescript-standards` (prop types).

## Validation

- [ ] All applicable states designed (loading/empty/error included).
- [ ] Every interactive element is keyboard-accessible and labeled.
- [ ] Reuses existing tokens/components; no unjustified one-offs.
