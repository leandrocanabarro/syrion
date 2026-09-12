# Engineering Principles

The values that shape every decision in this harness. When guidance conflicts,
these principles win.

## Process over guessing

Follow the flow — Explore → Plan → Design → Build → Test → Review → PR — escalating
only as far as the task needs. Understand before changing; design contracts before
implementing.

## Simplicity first

Reduce complexity. The best change is the smallest one that fully solves the
problem. Prefer boring, readable solutions over clever ones. YAGNI: don't build for
imagined futures.

## Evidence over claims

Verify before declaring success. Tests pass, commands succeed, behavior is
observed — not assumed. "It should work" is not "it works".

## Test-driven

Write tests with (ideally before) the code. Tests assert behavior, not
implementation. A change without tests is not complete.

## Security by default

Validate at boundaries, enforce authorization on the server, never commit secrets.
Follow the OWASP Top 10. Security is not a later step.

## Minimal, focused changes

One change does one thing. No unrelated refactors, speculative abstractions, or
drive-by edits. Keep diffs reviewable.

## Consistency

Match the existing codebase's patterns and conventions over introducing new ones.
Standardization is a feature.

## Right tool, right layer

Agents decide and delegate; skills describe how; instructions set always-on rules;
policies define done. Determinstic checks belong in automation, not prompts.
