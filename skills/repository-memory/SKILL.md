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

## Memory scopes and ownership

- `/memories/session/plan.md`: working plan, decisions, step status, and next
  action in the current VS Code conversation. Access only via `vscode/memory`;
  this is a virtual tool path, not a repository or terminal path.
- `/memories/repo/syrion.md`: optional compact index of stable conventions and
  links to durable records, accessed via `vscode/memory`. This workspace-scoped
  memory survives conversations locally; it is not shared through Git.
- `.ai/memory/`: durable, reviewable repository record. Keep accepted plans in
  `plans/<task-id>.md` and link them from `WORKLOG.md`. Use a unique task ID;
  preserve previous tasks. These ordinary files can be versioned for team use.

Do not copy the full worklog into native memory. Code and checked evidence take
precedence over either memory store. On conflict, inspect the referenced source
and mark superseded decisions. Never overwrite another task's session plan.

The orchestrator (or standalone execution agent) owns durable writes. Delegated
specialists receive validated context and return deltas, avoiding repeated
initialization. A planning-only agent writes native memory only and includes the
complete plan in its response for the execution agent to persist. Missing native
memory never prevents use of repository files; report failed persistence once.

## Start of a session

1. Read the current session plan when available; verify its task/repository.
   Run `node <plugin-root>/memory.mjs status .` from the repository root.
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

After loading context, resume the first unfinished action. Do not rerun searches
or reopen accepted decisions unless source changes, failed checks, or changed
requirements invalidate them. Read only the relevant worklog entry and linked
plan, not the entire history.

## During the task

Write a concise dated entry directly to `WORKLOG.md` when a design decision is
accepted, a finding is validated, an approach is ruled out by evidence, or a
blocker or next action materially changes. Save before switching phases or
handing off work; do not wait for a final response. Skip routine tool calls and
repeated observations. Update an existing entry for the same decision when
possible; mark superseded decisions rather than leaving contradictory guidance.

Each entry should identify the task and stable decision ID, status
(proposed/accepted/superseded), decision or finding, rationale, relevant
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

At acceptance and material handoffs, save/update `plans/<task-id>.md` with the
plan revision, goal/scope, decisions and evidence, step IDs and status, actual
verification results, blockers, and next action. Link it from the task worklog
entry. Use ordinary authorized file tools; the helper does not save plan files.
Do not mark a plan accepted merely because it was saved.

## When a broad exploration is necessary

Do it only with no usable architecture record or when the task/change affects
authentication/authorization, public API/event contracts, database
schema/migrations, package/build/CI configuration, shared framework bootstrap,
or an explicitly architectural refactor.

## End of task

Update `ARCHITECTURE.md` only for changed facts. Then record a concise handoff:

```sh
node <plugin-root>/memory.mjs checkpoint . \
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
