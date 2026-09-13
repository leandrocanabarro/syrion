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
├── plans/            # accepted plans with step status and decision IDs
└── WORKLOG.md         # concise handoffs, decisions, and next actions
```

At the start of a task, the agent compares Git changes against the saved commit,
including uncommitted and untracked files. It uses those paths to inspect relevant
diffs and refresh affected facts. Broad exploration is required when usable
context is missing or for cross-cutting changes such as authentication, schemas,
public contracts, or CI.

## Using repository memory

Describe your task normally. When the Syrion instructions are active, the agent
manages repository memory as part of the work; no manual memory commands or
separate requests to save context are needed.

- **Starting or resuming:** the agent initializes missing memory, reads saved
  context, and checks which files changed before relying on previous facts.
- **During the task:** it records meaningful decisions, their rationale,
  validated findings, and pending work as they arise, so progress does not depend
  on reaching the end of the conversation.
- **At a milestone or handoff:** it consolidates verified architecture facts and
  records what was checked and what remains to do.

Memory is maintained by the agent following Syrion's instructions, rather than
by a background service. Its internal helper requires Node.js and a Git
repository with at least one commit. If memory cannot be read or saved, the agent
reports the limitation instead of claiming that context was preserved.

## Guiding principle

Repository memory is never an independent source of truth. Every recorded fact
must cite the relevant file or symbol and its verification commit. When evidence
is absent, Syrion requires the agent to inspect the code rather than invent
context.

## VS Code planning and resumption

Select `planner` to research a task without changing repository files. It saves
its working plan with `vscode/memory` at `/memories/session/plan.md`, presents it
in chat, and provides **Start Implementation** (to `orchestrator`) and **Open in
Editor** handoffs. The orchestrator saves the accepted plan in
`.ai/memory/plans/<task-id>.md`, records its link in `WORKLOG.md`, and delegates
only unfinished work. Specialists are enabled for subagent invocation.

The plan tracks decision IDs, rationale, evidence, completed steps, verification
results, and the next action. Repeated searches without new evidence stop after
two attempts; accepted decisions reopen only when requirements or evidence change.
These are agent instructions, not a runtime loop limiter or a background saver.

VS Code session memory is scoped to a conversation. Optional
`/memories/repo/syrion.md` can index stable project knowledge across conversations
on the same workspace, but is not shared through Git. Repository files preserve
reviewable history when versioned. When native memory is unavailable, the planner
returns its plan in chat and execution uses repository memory.

To check the flow in VS Code, open a `planner` session, request a small plan,
confirm the memory tool saved it, then use **Start Implementation**. Verify the
orchestrator resumes its steps and writes the durable plan link. In a new
conversation, request resumption and verify it reads that link before searching.
Make sure the installed plugin exposes the updated agents in Chat: Open
Customizations; editing this checkout alone does not update an installed copy.

References: [VS Code memory](https://code.visualstudio.com/docs/agents/run/memory)
and [custom agents and handoffs](https://code.visualstudio.com/docs/agent-customization/custom-agents).
