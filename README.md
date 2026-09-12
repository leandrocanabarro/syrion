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
