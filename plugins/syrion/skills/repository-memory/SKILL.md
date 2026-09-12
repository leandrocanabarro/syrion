---
name: repository-memory
description: Resume engineering work from evidence-backed repository memory, using an incremental Git diff instead of re-scanning the entire repository. Use at the beginning and end of a coding task, especially across sessions.
license: MIT
---

# Repository memory

Use durable, reviewable repository state instead of assuming chat history is
available or correct. The state directory is `.ai/memory` in the target
repository. It is data for agents, not a replacement for source code.

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
