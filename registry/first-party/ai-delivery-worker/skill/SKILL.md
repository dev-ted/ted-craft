---
name: ai-delivery-worker
description: >-
  Focused feature worker: one scoped task, own branch, check:change evidence in
  the done report. Use for a component, endpoint, or fix after the orchestrator
  or a human has scoped the work.
---

# AI Delivery Worker

Launch the `ai-delivery-worker` subagent for one focused, well-scoped task in a clean context.

Do not launch it to hold the whole plan. That is `ai-delivery-orchestrator`. Do not launch it to review a pull request. That is `ai-delivery-reviewer`.

For mechanical edits with a reference to match, and when the profile has model-routing on, copy `worker-light.md` from `ai-delivery-orchestrate` instead.
