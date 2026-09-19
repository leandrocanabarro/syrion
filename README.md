# Syrion

Syrion is a GitHub Copilot engineering harness that gives agents a disciplined,
evidence-backed workflow for understanding, changing, testing, and reviewing
software.

It combines specialist agents, task-specific skills, engineering policies, and
incremental repository memory so a new session resumes from verified context
instead of repeatedly scanning the entire codebase.

## What Syrion provides

- **A practical engineering flow:** Resume → Delegate missing work → Verify →
  Save checkpoint → Deliver. Run only the phases needed by the request.
- **Specialist agents:** orchestration, exploration, planning, design,
  implementation, and review.
- **Stack-aware skills:** Node.js/React and PHP/Laravel guidance, plus quality,
  testing, API design, and security practices.
- **Repository memory:** a small, reviewable state that lets the agent inspect
  relevant records and changes since each record’s verification commit.

## Reusable plugin rules

`rules/engineering.instructions.md` is the single shared engineering baseline,
with `applyTo: '**'`. Stack-specific instructions remain in `rules/*.instructions.md`;
policies live in `rules/policies/`. The former `rules/AGENTS.md` and
`rules/copilot-instructions.md` duplicates have been consolidated into that baseline.

This package keeps its existing Copilot plugin format: `plugin.json` at the root,
with `agents/`, `skills/`, and `rules/` beside it. Consumers install the plugin;
they do not need to copy its baseline into their own `AGENTS.md` or
`.github/copilot-instructions.md`. Those project files can hold local conventions.
Plugin paths resolve from the installed package; commands and `.ai/` writes target
the consuming repository. Do not edit the installed package to save project state.

The plugin does not assume a particular application's domains, identity models,
tenancy, framework versions, or test database. Capture verified project facts in
its `.ai/contexts/` and reuse them on subsequent tasks. Host-specific capabilities
such as `vscode/memory` require that host; repository memory uses Node.js and Git.
Sharing instructions does not make VS Code tools available in other clients.

After updating the installed plugin, inspect VS Code's loaded instructions on a
small task: the engineering baseline should appear once, the matching stack rules
should apply, and a second repository should receive its own memory and architecture.
These runtime checks are separate from the memory CLI tests below.

## Shared repository memory

Syrion keeps team context in versioned Markdown in the target repository:

```text
.ai/
├── context.md        # short overview (maximum 4,000 characters)
├── contexts/         # source-linked knowledge by area
├── decisions/        # rationale and consequences of decisions
├── tasks/            # one plan/progress record per task or issue
├── archive/          # completed records, excluded from default loading
└── index.json        # generated metadata catalog, no duplicated bodies
```

Describe the task normally. The execution agent initializes missing memory and
loads relevant records automatically by following the repository-memory skill.
The CLI requires Node.js and Git; loading requires at least one commit.

```sh
node <plugin-root>/memory.mjs init .
node <plugin-root>/memory.mjs load .
node <plugin-root>/memory.mjs load . --task login --paths src/auth/login.ts
```

The loader prioritizes the overview, named task, area records matching supplied
or uncommitted paths, and explicit related records. With no known task or paths,
it returns the overview and a compact reference catalog; the agent locates the
source and requests the relevant area next. Completed/superseded and archived
records require an explicit task ID or relationship to load.

Output is limited to 12,000 characters by default (`--budget` overrides this).
Documents that do not fit are listed for on-demand reading, never silently cut in
half. The limit includes headers and references. The CLI reads Markdown locally
to derive current metadata, even if the index is stale; the model receives only
the bounded selection. This bounds model context, not filesystem scan cost.

Each record has metadata, for example:

```yaml
---
id: auth-context
status: active
paths: ["src/auth/**", "tests/auth/**"]
related: ["decisions/session-storage.md"]
verified_at: unverified
---
```

Use unique IDs and existing related paths relative to `.ai/`. Metadata supports
plain/quoted scalar values and JSON arrays or YAML block lists, not arbitrary
YAML. Status values: `active`, `draft`, `blocked`, `complete`, `superseded`.
Path globs support `*`, `**`, and `?`. After inspecting the sources, replace
`unverified` with the full Git commit hash. Cite source files/symbols in the body;
label uncommitted observations as working-tree evidence. Each record has its own
verification baseline. Changed associated paths produce a possible-staleness
warning; unavailable or non-ancestor commits require revalidation. The loader
never advances baselines or proves that the prose is true.

## Maintaining and sharing records

The agent updates a task file at material milestones, including decisions,
checks, blockers, and the next action. Accepted decisions and implementation facts
are distinct. Native memory is optional local working storage; `.ai/` is the
shared record, and code remains authoritative.

```sh
node <plugin-root>/memory.mjs index .
node <plugin-root>/memory.mjs validate .
```

The deterministic index is regenerated from Markdown after edits or merges.
Validation rejects malformed metadata, duplicate IDs, broken `related` links,
records above their size limit, and a stale index. The overview is limited to
4,000 characters and other records to 16,000, including metadata. Split oversized
records into related documents. Mark tasks `complete` to exclude them automatically;
moving them into `archive/` is optional and requires updating incoming links.

Commit memory changes alongside relevant code in the same PR. Teammates see
progress after the branch is pushed; merged records become the shared baseline.
Resolve conflicts in task/area files first, then regenerate the index. No single
worklog or global verification commit is edited by every task.

For a consuming project's CI, run `node <plugin-root>/memory.mjs validate .` after
making the Syrion helper available. CI must validate the checked-in index, not
regenerate it before checking. This repository's workflow runs the CLI integration
tests and validates its own `.ai/` when present. Validation checks structural
consistency; source freshness is reported by `load` for agent review.

Automatic startup currently depends on agent instructions. No editor startup
hook, daemon, automatic commit, or background synchronization is installed.
If the helper is unavailable, the agent reports that and uses targeted file reads.

## Migration from the old memory format

`init` is idempotent and preserves `.ai/memory/`. The loader warns when legacy
records exist and excludes them from its new catalog. Migrate relevant
`ARCHITECTURE.md`, `WORKLOG.md`, and plan content into area/decision/task files,
preserving evidence and unfinished work. Review before deleting legacy records.
There is no automatic semantic migration. The former `status` and `checkpoint`
commands are replaced by `load`, Markdown edits, `index`, and `validate`.

## VS Code planning and resumption

The planner keeps its working plan at `/memories/session/plan.md` using
`vscode/memory` and returns it in chat. Execution saves the authorized plan as
`.ai/tasks/<task-id>.md` and resumes unfinished steps. Planning-only agents read
selected repository files without invoking the CLI or editing the repository.
Optional `/memories/repo/syrion.md` contains local pointers to shared records.
These native paths are virtual tool paths, never shell paths.

The orchestrator loads memory before investigation and calls the specialist for
its next unfinished step. Clear changes go directly to the implementer; an
explorer receives only a specific evidence gap. The orchestrator has no file-edit or terminal tools and uses `vscode/memory`
only for reading. It delegates task progress and native checkpoint writes to the
implementer, which returns saved paths and validation evidence. Persistence is
bundled into implementation assignments; other specialist deltas can be saved
through a bounded memory-only assignment.
The CLI does not write findings automatically: successful Markdown/native writes
and catalog validation are required before claiming persistence.

To check a direct change, select orchestrator and request a bounded adjustment.
Expect memory loading, an actual implementer call (or one bounded explorer call
if evidence is missing), and successful checkpoint writes after its return.
There should be no automatic brainstorming or extra plan approval. In a new
conversation, request continuation by task ID; it should resume pending steps,
checking only missing or stale evidence. These are manual integration checks;
CLI tests do not prove VS Code agent delegation or native memory behavior.

To check the integration, request a small plan and use **Start Implementation**.
Verify that execution persists a task file and regenerates its index. In a new
conversation, request the task by ID and verify selective loading before research.
Editing this checkout does not update an installed plugin copy.

## Development checks

```sh
node --test tests/memory.test.mjs
```
