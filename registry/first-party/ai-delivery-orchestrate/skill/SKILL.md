---
name: ai-delivery-orchestrate
description: >-
  When and how to split coding agents: isolation, review chain, context hygiene,
  and optional cheap-model routing. Use for multi-domain work, parallel agents,
  or when a single agent is losing the plot.
---

# AI Delivery Orchestrate

The default is one agent on one focused task. Orchestration is the exception. It must justify its cost.

The bar: the domains are independent, the contracts are locked, and human review capacity exists for the extra output. Multi-agent setups underperform a single strong agent when those conditions do not hold. The failures are coordination failures, not model limitations. When in doubt, do not orchestrate.

For a single feature, a bug fix, or a small change, use one agent and one context. For sequential steps that share context, a chain of sub-agents only pays the reload cost for nothing.

## Layers

Use the installed bundles. A domain owner is `ai-delivery-orchestrator` scoped to one package. Do not invent a fourth agent type.

- **Orchestrator** (`ai-delivery-orchestrator`): holds the plan and the big picture, not the code detail. It decides what work exists, splits it into domains, and dispatches a worker per domain. It sequences batches. It never edits code. It reads summaries, not diffs.
- **Domain owner:** same agent, scoped to one service, shell, or layer. It breaks the domain into focused tasks, dispatches `ai-delivery-worker`, and reviews against the domain's rules before anything goes up.
- **Worker** (`ai-delivery-worker`): one focused, well-scoped task in a clean context. It does the task and returns a condensed result. A fresh context per task is the point.
- **Reviewer** (`ai-delivery-reviewer`): findings pass in a fresh context after the chain, or as the second reader on a one-person project.

## Acceptance is on artefacts

Summaries never carry acceptance. A domain owner accepts a worker's result on:

- `check:change` command and output, attached and green
- Acceptance tests passing where the item has them
- No surprising shared-contract diff

It never accepts on the worker's account of itself. The human still merges.

## Isolation

- One writer uses one branch from main. A separate worktree is required only when more than one agent is writing. Never share a working directory.
- Never share a log file. The platform holds the record.
- Never build a branch on another unmerged branch. If a task depends on unmerged work, end the turn. Do not start the next ticket in this context. Resume from the progress note.
- Distrust "it passed" when agents run in parallel. Shared caches and shared dev-server ports give false green results.
- Cap parallelism to what one human can review.
- Park means write the stop note and end the turn. Do not wait in the chat.

## Context

Treat context as a finite resource with diminishing returns. Find the smallest set of high-signal tokens that get the outcome. Keep `AGENTS.md` lean. Scope files to the task. Start a fresh session when the task changes. Compact in the middle of a long task before quality drops, around 60 to 80 percent of the window. Tell the agent what to keep: decisions, open bugs, files in scope, hard constraints.

Durable rules belong in `AGENTS.md` and path-scoped rules, not in the conversation. They survive compaction.

Longer habits: [references/optimize.md](references/optimize.md). Optional cheap-tier brief: [references/worker-light.md](references/worker-light.md). Copy it into the project's agents directory only when the profile turns model-routing on.

A subagent uses the parent model unless the human picks another at launch. Do not promise a cheaper model when the tool cannot set one on the agent file. A cheap tier is a human choice at launch. The checks, not the model, confirm the work.
