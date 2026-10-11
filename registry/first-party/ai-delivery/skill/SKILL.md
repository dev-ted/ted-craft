---
name: ai-delivery
description: >-
  Index of the AI Delivery pack: lean agent instructions, slice and shared
  contracts, review gates, and optional orchestration. Use when setting up
  AI-assisted delivery or choosing which pack artifacts to install. The same
  markdown works for any coding agent.
---

# AI Delivery

Agents are fast at producing work that looks right. They do not know what "done" means for a given codebase. This pack structures the work so an agent speeds a team up without a hidden cost later.

The same skills, rules, and agents install for any coding agent the registry supports. A hook needs a tool that can run it. When the tool has no hooks, the agent still runs `check:change` before it reports done.

Install only what the **project profile** names.

## Protocol

1. Confirm the profile: preset, codebase, surfaces, tracker, team size.
2. Recommend the smallest combo that matches the preset.
3. Point at sibling slugs. Do not invent files this pack does not ship.
4. Do not write feature code until `ai-delivery-setup` has been signed off.

## Project profile

```text
Preset: small | standard
Codebase: new | existing
Surfaces: web | api | mobile | data
Tracker: none | github-issues | gitlab | jira | linear | other
Team size: 1 | 2+
Optional: board | model-routing
```

Small means one implementing agent and no orchestration. Standard may add the orchestrate bundles only when domains are independent, shared contracts are locked, and a human can review the extra output.

Skip every artifact tied to a surface the profile does not have.

## Install

Run this from the app repository. It installs the preset into the project and writes `AGENTS.md` only when that file is missing.

```bash
npx ted-craft setup ai-delivery -a cursor --preset small
npx ted-craft setup ai-delivery -a cursor --preset small --ui
npx ted-craft setup ai-delivery -a claude --preset standard --ui
```

`--preset small` is one implementing agent and no orchestration. `--preset standard` adds the orchestrator, worker, and reviewer. `--ui` adds the UI rule. Omit `--ui` for an API-only repository.

Use `-a cursor`, `-a claude`, `-a codex`, or `-a vscode`. Pass `-g` only for a personal install. The checks hook always stays in the project.

Then open the agent in that repository and run `ai-delivery-setup`. Confirm the profile before any feature code.

### Install one slug

Use `-a cursor`, `-a claude`, `-a codex`, or `-a vscode`. Hooks install into the project (no `-g`).

```bash
npx ted-craft add ai-delivery-guardrails -a cursor -g -y
npx ted-craft add ai-delivery-checks -a cursor -y
```

Add `ai-delivery-ui` only when the profile has a UI. Pair it with `react-accessibility` and `react-styling` when the stack is React.

The small preset is `ai-delivery`, `ai-delivery-guardrails`, `ai-delivery-comments`, `ai-delivery-contracts`, `ai-delivery-setup`, `ai-delivery-review`, and `ai-delivery-checks`. Standard also adds `ai-delivery-orchestrate`, `ai-delivery-orchestrator`, `ai-delivery-worker`, and `ai-delivery-reviewer`.

## Catalog

| Slug | Kind | What it does |
|------|------|----------------|
| `ai-delivery` | skill | This index. Profile, combos, portable `AGENTS.md` template. |
| `ai-delivery-guardrails` | rule | Reversible decisions, seven hard stops, test rule. |
| `ai-delivery-comments` | rule | When to comment, where an explanation lives. |
| `ai-delivery-contracts` | rule | Slice contracts continue. Shared contracts stop. |
| `ai-delivery-ui` | rule | Tokens, three states. Copy is not a stop. |
| `ai-delivery-setup` | skill | Stand the repo up. No feature code before sign-off. |
| `ai-delivery-review` | skill | Findings before fixes. Reviewer checklist. |
| `ai-delivery-orchestrate` | skill | When to split agents. Park ends the turn. |
| `ai-delivery-orchestrator` | bundle | Plan agent. Does not edit code. |
| `ai-delivery-worker` | bundle | One focused task. Attaches check evidence. |
| `ai-delivery-reviewer` | bundle | Fresh-context findings pass. Does not merge. |
| `ai-delivery-checks` | hook | Runs `check:file` after edit and `check:change` before done. |

## Portable instructions file

Copy [references/agents-md.md](references/agents-md.md) to `AGENTS.md`. Keep it short. Path-scoped rules and on-demand skills carry the rest.

## Hard facts

- A person reviews and merges everything.
- A reversible decision is recorded and the agent continues. A hard stop ends the turn.
- A slice contract may change inside the work item. A shared contract may not.
- The agent runs `check:change` before it reports done. It does not weaken a test or a gate to go green.
