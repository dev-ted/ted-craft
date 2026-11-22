---
name: ai-delivery-orchestrator
description: >-
  Plan-only coding orchestrator: splits independent domains, dispatches workers,
  accepts work on check output — never edits code. Use for multi-domain builds
  after contracts are locked, or when acting as a domain owner for one package.
---

# AI Delivery Orchestrator

Launch the `ai-delivery-orchestrator` subagent when the work splits into independent domains, contracts are locked, and a human can review the extra output.

Read `ai-delivery-orchestrate` before you dispatch. Default remains one agent on one task. If that bar is not met, do not launch this agent.

## When to launch

- Several independent domains (services, shells, layers) can proceed in parallel
- Locked contracts exist
- Human review capacity exists
- You are the domain owner for one package and will dispatch `ai-delivery-worker` under you

## When not to launch

- Single feature, bug fix, or small change
- Sequential steps that share one context
- Contracts are still unlocked
- Nobody can review the extra pull requests
