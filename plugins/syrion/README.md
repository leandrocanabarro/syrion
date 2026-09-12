# Syrion

Syrion is a GitHub Copilot engineering harness that gives agents a disciplined,
evidence-backed workflow for understanding, changing, testing, and reviewing
software.

It combines specialist agents, task-specific skills, engineering policies, and
incremental repository memory so a new session resumes from verified context
instead of repeatedly scanning the entire codebase.

## What Syrion provides

- **A practical engineering flow:** Explore → Plan → Design → Build → Test →
  Review → PR.
- **Specialist agents:** orchestration, exploration, planning, design,
  implementation, and review.
- **Stack-aware skills:** Node.js/React and PHP/Laravel guidance, plus quality,
  testing, API design, and security practices.
- **Repository memory:** a small, reviewable state that lets the agent inspect
  only changes since its last checkpoint.

## Repository memory

Syrion stores durable task context in the target repository:

```text
.ai/memory/
├── state.json        # last verified commit and checkpoint metadata
├── ARCHITECTURE.md    # source-linked architecture facts
└── WORKLOG.md         # concise handoffs, decisions, and next actions
```

At the start of a task, the agent compares Git changes against the saved commit,
including uncommitted and untracked files. It uses those paths to inspect relevant
diffs and refresh affected facts. Broad exploration is required when usable
context is missing or for cross-cutting changes such as authentication, schemas,
public contracts, or CI.

## Using repository memory

Ask Copilot to use the `repository-memory` skill to initialize context for your
project, resume a task, or record a handoff. The skill guides the agent; the
helper does not summarize code automatically.

For manual use, the package includes `scripts/memory.mjs`. It requires Node.js
and Git, and the target must be a Git repository with at least one commit.
Replace `/path/to/syrion` with the actual plugin package directory,
and `/path/to/project` with the target repository root:

```sh
node /path/to/syrion/scripts/memory.mjs init /path/to/project
node /path/to/syrion/scripts/memory.mjs status /path/to/project
```

Run `init` once per project. It creates the memory files; then have the agent
inspect the relevant code and populate `ARCHITECTURE.md` with verified facts.
Run `status` when resuming work:

- `uninitialized`: initialize memory before recording a handoff.
- `current`: no relevant Git changes were detected; read the saved context.
- `changed`: review the listed paths and revalidate affected facts.

After updating architecture facts, save a concise handoff:

```sh
node /path/to/syrion/scripts/memory.mjs checkpoint /path/to/project \
  --task "Update session validation" \
  --summary "Updated validation and verified its tests" \
  --next "Review the middleware integration" \
  --files "src/auth/session.ts,tests/session.test.ts"
```

The command records your supplied summary and the current commit. It does not
verify claims, run tests, or commit changes. Uncommitted changes remain visible
in `status` after a checkpoint. Use the explicit Node.js invocation; the plugin
does not register a global shell command.

## Guiding principle

Repository memory is never an independent source of truth. Every recorded fact
must cite the relevant file or symbol and its verification commit. When evidence
is absent, Syrion requires the agent to inspect the code rather than invent
context.
