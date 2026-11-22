---
name: ai-delivery-setup
description: >-
  Stand a repository up for AI-assisted delivery: project profile, contracts,
  AGENTS.md, and check commands. Use when bootstrapping a project for any
  coding agent. Do not write feature code until a human signs off.
---

# AI Delivery Setup

This skill stands a project up so coding agents can work in it. It does not write feature code. The same steps apply no matter which agent tool runs them.

Read `ai-delivery` if you need the pack map. Work the steps in order. Skip a step tied to a surface the profile does not have. If a linked template is missing, follow the rule in this skill. Do not stop only because a file path is absent.

If you cannot complete a step, say so. Do not hide a missing design system or contract by inventing one.

## 1. Confirm the profile

Write back a short summary of what you are building. Confirm with the human, then wait:

- Preset: small or standard
- Codebase: new or existing
- Surfaces: web, api, mobile, data (only what exists)
- Tracker: none, github-issues, gitlab, jira, linear, or other
- Team size: 1 or 2+
- Optional: board, model-routing

Small means one implementing agent and no orchestration. An existing codebase also follows [references/adoption.md](references/adoption.md).

## 2. Design system (UI only)

Wire tokens, components, states, and accessibility rules. If one exists, adopt it. If not, propose one and get it approved. A project with no UI skips this step.

## 3. Contracts

Type the shapes the next increment crosses. Mark each as slice (only consumer is this repo and this work item) or shared (more than one consumer, or a consumer outside the repo). See `ai-delivery-contracts`. Do not invent a contract the code never had.

## 4. Architecture

Write modules, owners, and seams. Flag uncertainty. Do not guess.

## 5. Approach layer

Write the project-level approach note and have a senior engineer sign it off. Create `docs/decisions/` and a thin codebase map. Templates: [references/approach-note.md](references/approach-note.md), [references/decision-record.md](references/decision-record.md), [references/codebase-map.md](references/codebase-map.md).

Most reversible decisions stay in the pull request body. A file in `docs/decisions/` is only for a choice future work must follow. Name it `DR-PENDING-<slug>` until a pull request number exists, then rename it in that same pull request before the first push.

### Acceptance tests

On the small preset, the ticket's acceptance criteria are the cases. The implementing agent turns them into tests and lists that as one decision. A human reads the assertions in the pull request.

A separate test-writer, and a human read of the cases before coding, only when review depth is deep. The implementing agent does not start that writer and does not treat its own cases as sufficient. A subagent uses the parent model unless the human picks another at launch. Do not promise a different model.

Template: [references/acceptance-tests.md](references/acceptance-tests.md).

### Pins (existing code)

For light and standard review, pins live in the same pull request as the change and are a listed decision. A separate pin pull request only for a deep-list path, or when the pin diff is too large to review with the change.

## 6. Instructions file

Copy [references/agents-md.md](references/agents-md.md) to `AGENTS.md`. Fill the profile and the one-paragraph description. Keep it short.

## 7. Check commands

Name scripts for the moment they run. Do not build a CI platform, scanners, or metrics unless this work item is setup. Do not name a script after a tier number.

- `check:file` — format, lint, and related tests for one edited file.
- `check:change` — typecheck, lint, and tests for the change. Contract tests for touched packages. Full run if the diff touches config, a lockfile, or a shared package.

Detect the package manager from the lockfile (`bun.lock` / `bun.lockb`, `pnpm-lock.yaml`, `yarn.lock`, else npm). Add scripts to `package.json` when that file exists. Otherwise add `scripts/check-file.mjs` and `scripts/check-change.mjs`.

When the tool can run hooks, install `ai-delivery-checks` in the project. When it cannot, the agent still runs `check:change` before it reports done.

Add `.ai-delivery/hard-stop.json` to the project's ignore file. An agent may write that file to end a turn on a hard stop. It must not commit it. CI still blocks a red merge.

On UI surfaces, include design-adherence lint and accessibility checks in `check:change` only when those tools already exist.

## 8. Branch rules, labels, tracker

Present this checklist. A human applies it on the platform. Do not call platform APIs unless the human asks.

- One approval from a person. Stale approvals dismissed on a new push. The approver is not the last pusher (off for a one-person project).
- Code owners on shared contracts, acceptance tests, and `docs/decisions/`.
- Labels: `ai:none`, `ai:assisted`, `ai:generated`.
- If the board optional is on, add triage columns in the tracker the profile names: Logged, Triage, To do, In progress, Parked, Ready for review, Done. If the profile names no tracker, repository issues are the tracker. Do not create a board on your own.

Gitignore `.ai-delivery/hard-stop.json`.

If the human wants a pull request template, copy [references/pull-request.md](references/pull-request.md) to the platform's template path.

## 9. Stop and hand off

Present the prep for human review. Feature work starts only after a person signs off.

## Templates

- [references/agents-md.md](references/agents-md.md)
- [references/adoption.md](references/adoption.md)
- [references/approach-note.md](references/approach-note.md)
- [references/decision-record.md](references/decision-record.md)
- [references/codebase-map.md](references/codebase-map.md)
- [references/acceptance-tests.md](references/acceptance-tests.md)
- [references/pull-request.md](references/pull-request.md)
- [references/metrics-baseline.md](references/metrics-baseline.md)
