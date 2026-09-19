---
name: testing-standards
description: >
  How to test JS/TS code in this org with Vitest or Jest plus Testing Library.
  Covers what to test, structure, queries, mocking discipline, and coverage. Use
  when adding or reviewing tests for React components or Node.js code.
license: MIT
---

# testing-standards

Our stack-specific testing conventions. This layers on top of the Superpowers
`test-driven-development` methodology (RED-GREEN-REFACTOR); this skill defines
*how* we write the tests.

## When to use

- Adding tests for React components/hooks or Node.js services.
- Reviewing whether a change is adequately and correctly tested.

## Tooling

- **Vitest** or **Jest** as the runner (match the project's existing choice —
  check `package.json`). Both use the same patterns below.
- **Testing Library** for React (`@testing-library/react` + `user-event`).
- `@testing-library/jest-dom` matchers work with both runners.

## What to test

- **Behavior, not implementation.** Assert observable outcomes (rendered output,
  return values, side effects), not internal state or private calls.
- **Boundaries and branches.** Cover success, error, empty, and edge cases —
  especially validation and error mapping.
- Business logic in services is unit-tested directly (it has no framework types —
  see `backend-nodejs`).

## React specifics

- Query by **role/label/text** (accessible queries); avoid test ids unless there
  is no accessible alternative.
- Drive interaction with `user-event`, not raw fire events.
- Assert loading/empty/error states, not just the happy path.

## Mocking discipline

- Mock at boundaries only (network, clock, filesystem, external SDKs). Do **not**
  mock the unit under test or over-mock collaborators.
- Prefer real objects and fakes over deep mock chains; a test full of mocks that
  restate the implementation is a smell.

## Structure

- Co-locate tests with the code (`x.ts` → `x.test.ts`, component → `.test.tsx`).
- Arrange–Act–Assert; one behavior per test; descriptive names stating the
  expectation.

## Coverage

- Coverage is a signal, not a goal. Meaningful assertions on critical paths matter
  more than a percentage. Meet the threshold in `rules/policies/quality-gates.md`
  without writing assertion-free tests to game it.

## Dependencies

- `frontend-react`, `backend-nodejs`, `code-quality`; external Superpowers TDD.

## Validation

- [ ] Tests assert behavior via accessible queries / observable outputs.
- [ ] Error/empty/edge cases covered, not only the happy path.
- [ ] Mocks limited to real boundaries; no mocking the unit under test.
