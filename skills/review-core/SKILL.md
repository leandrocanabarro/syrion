---
name: review-core
description: >
  The core code-review methodology for this org: what to check, how to prioritize
  findings by severity, and how to give actionable feedback. Use when reviewing a
  change or preparing one for review.
license: MIT
---

# review-core

How we review changes. Used by the `reviewer` agent; pairs with `code-quality` and
`security-best-practices`.

## When to use

- Reviewing a diff/PR, or self-reviewing before requesting review.

## Review order (fastest signal first)

1. **Correctness** — does it do what the plan/acceptance criteria say? Any logic
   or edge-case bugs?
2. **Security** — apply `security-best-practices` (input, authz, secrets, injection).
3. **Tests** — meaningful coverage of the change; no over-mocking; failure paths
   tested (`testing-standards`).
4. **Design & quality** — structure, naming, duplication, error handling
   (`code-quality`); contracts respected (`api-design` / component contracts).
5. **Scope** — is the diff focused? Flag unrelated changes.

## Severity

| Severity   | Meaning                                    | Action           |
| ---------- | ------------------------------------------ | ---------------- |
| Critical   | Correctness/security defect, data loss     | **Blocks** merge |
| Major      | Real problem, should be fixed before merge | Request changes  |
| Minor/nit  | Style/preference; non-blocking             | Suggest          |

## Giving feedback

- Be specific: cite the file/line and give a **concrete** fix, not just a complaint.
- Explain the *why* (risk/impact), especially for critical/major items.
- Separate blocking issues from nits clearly so the author can prioritize.
- Acknowledge good solutions; reviews are collaborative, not adversarial.

## Defer to external

- For the review *process* (pre-review checklist, and responding to received
  feedback), use the Superpowers `requesting-code-review` / `receiving-code-review`
  skills.

## Dependencies

- `code-quality`, `security-best-practices`, `testing-standards`.

## Validation

- [ ] Verdict given (blocked / changes-requested / approved) with reasons.
- [ ] Findings prioritized by severity; each has a concrete remedy.
- [ ] Correctness, security, and tests explicitly checked.
