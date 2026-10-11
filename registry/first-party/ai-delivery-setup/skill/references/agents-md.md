# Agent instructions

Copy this file to `AGENTS.md` at the repo root. The same text works for any coding agent. Keep it short. Every line loads on every message.

## Project profile

- Preset: _small | standard_
- Codebase: _new | existing_
- Surfaces: _web / api / mobile / data — delete the ones you do not have_
- Tracker: _none / github-issues / gitlab / jira / linear / other_
- Team size: _1 | 2+_
- Optional: _board / model-routing — delete unused_

Small means one implementing agent and no orchestration. Standard may add orchestrate and the worker bundles only when domains are independent, shared contracts are locked, and a human can review the extra output.

## What we are building

_One paragraph._

## Hard rules

1. One owner at a time. One agent may own a slice (contract, API, UI) for one work item.
2. A human merges. Agent approval never counts.
3. Protected branches. Pull requests only.
4. Fix forward. Do not rewrite pushed history.
5. One branch from main when you are the only writer. A worktree only when more than one agent is writing. Push when you park, when the slice is ready, or once for the review-fix batch.
6. Every pull request carries `ai:none`, `ai:assisted`, or `ai:generated`.
7. A human reads customer-facing copy and UI at review. That is not a stop. Finish the slice.
8. Short branches off main. Do not build on an unmerged branch.
9. One revert commit can undo the change.

## Decisions

Reversible (the pull request or one revert can undo it): pick the recommended option, list chosen and rejected options, and continue. Count only a change to behaviour, a public API, a runtime dependency, or a patterns-table row. At most five unmarked decisions.

Hard stop: end the turn. Do not wait, and do not start the next ticket here.

1. Shared contract change. A slice contract (only consumer is this repo and this work item) is not a stop.
2. Irreversible action you would run (production, delete outside the item, send mail, shared-database migration).
3. A module another open pull request or parked item is changing. If you cannot check, name your assumption and continue.
4. Auth policy or the permission model.
5. Departing from a rejected alternative or a named module boundary. A tweak inside the approved design is not a stop.
6. A sixth unmarked reversible decision.
7. Main is red on a check this pull request needs, and it reproduces on a clean main tree.

## Tests and checks

Never skip, focus, weaken, or delete a test to go green. A test change is a listed decision. Do not edit the harness, a ratchet, or an inline disable. Run `check:change` before you report done.

## Done report

Done (one line) · not done, and why · command, exit code, last twenty lines · decisions for the reviewer.

## Where records live

- Tracker: _as named above. Repository issues if none._
- Decision files: `docs/decisions/`, only when future work must follow the choice. Name `DR-PENDING-<slug>` until a pull request number exists, then rename before the first push.
- Patterns for this task: _path to the patterns table, if any._
