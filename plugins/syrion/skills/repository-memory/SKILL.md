---
name: repository-memory
description: Resume engineering work from evidence-backed repository memory, using an incremental Git diff instead of re-scanning the entire repository. Use when starting or resuming a coding task, recording material decisions during work, and handing off progress.
license: MIT
---

# Repository memory

Use durable, reviewable repository state instead of assuming chat history is
available or correct. The state directory is `.ai/memory` in the target
repository. It is data for agents, not a replacement for source code.

## Agent ownership

Invoke this workflow automatically when working under Syrion instructions. Run
helper commands yourself; do not ask the user to initialize, save, or maintain
memory. Keep routine commands out of user-facing explanations. If prerequisites
(Node.js, Git, and at least one commit) or permissions prevent persistence,
report the limitation and continue independent work without claiming a save.

## Start of a session

1. Run `node <plugin-root>/scripts/memory.mjs status .` from the repository root.
2. For `uninitialized`, run `init`, then explore only enough of the repository
   to write verified initial facts. Initialization alone does not understand the
   architecture.
3. For `current`, read `ARCHITECTURE.md` and the relevant recent `WORKLOG.md`
   entry. Do not enumerate the repository tree again.
4. For `changed`, inspect the reported paths and `git diff` for them. Revalidate
   and update only affected facts.
5. Trust a memory fact only when it names its source file/symbol and verification
   commit. If it lacks evidence or conflicts with code, state uncertainty and
   inspect the smallest relevant area.

## During the task

Write a concise dated entry directly to `WORKLOG.md` when a design decision is
accepted, a finding is validated, an approach is ruled out by evidence, or a
blocker or next action materially changes. Save before switching phases or
handing off work; do not wait for a final response. Skip routine tool calls and
repeated observations. Update an existing entry for the same decision when
possible; mark superseded decisions rather than leaving contradictory guidance.

Each entry should identify the task, decision or finding, rationale, relevant
files/symbols, validation performed, and pending next action. Distinguish accepted
decisions from implemented facts and unresolved proposals. For code evidence,
record the inspected HEAD commit; label uncommitted observations as working-tree
state based on that commit, not as code already present in it. Summarize project
decisions without copying user messages or personal information.

Incremental notes must not change `state.json` or advance the verification
baseline. Run `checkpoint` only after reviewing changes since the saved baseline
and revalidating affected memory; explicitly retain unresolved work in the
handoff. The helper records supplied text and HEAD, but does not verify claims,
run tests, or commit code. Uncommitted changes remain visible after a checkpoint.

If native session memory is available, use it for temporary planning. Keep
resumable decisions and handoffs in `.ai/memory/`; do not rely on native memory
being available to another agent or session, or duplicate every note there.

## When a broad exploration is necessary

Do it only with no usable architecture record or when the task/change affects
authentication/authorization, public API/event contracts, database
schema/migrations, package/build/CI configuration, shared framework bootstrap,
or an explicitly architectural refactor.

## End of task

Update `ARCHITECTURE.md` only for changed facts. Then record a concise handoff:

```sh
node <plugin-root>/scripts/memory.mjs checkpoint . \
  --task "short task name" \
  --summary "what changed and why" \
  --next "next action or none" \
  --files "src/example.ts,tests/example.test.ts"
```

Never store secrets, personal data, large chat transcripts, or unverified
guesses. A useful fact includes its source and commit, for example:

```md
- **Authentication:** `src/auth/session.ts#createSession` creates sessions and
  `src/http/auth-middleware.ts#requireUser` enforces them.
  _Verified at `<commit>` on YYYY-MM-DD._
```
