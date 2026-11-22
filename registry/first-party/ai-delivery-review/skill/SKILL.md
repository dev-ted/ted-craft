---
name: ai-delivery-review
description: >-
  Review AI-generated work: findings before fixes, definition of ready, review
  depth, and the reviewer checklist. Use when reviewing a pull request,
  triaging bugs for agents, or checking generated comments. Reviewer output is
  advisory and never an approval.
---

# AI Delivery Review

The instinct when reviewing AI output is to fix small things as you spot them. Resist that for anything beyond a typo. Reviewer output is advisory. It never merges and never approves. A person approves.

## Definition of ready

An item enters To do only when it has five fields: acceptance criteria, affected paths, contract (`none`, `slice`, or `shared`), review depth, and priority. Above the approach threshold it also needs an approved approach. Agents take work only from To do. Nothing skips triage.

## Findings before fixes

1. Do a full pass and write every finding first, with enough detail that someone else can act on it.
2. Then dispatch the fixes, one prompt per finding.
3. Re-verify against the finding, not against a sense that it looks better.

A generated doc comment is a claim. Check it against the code. A comment that restates the code, narrates the change, or addresses a person is a finding.

## Review depth

Set depth at triage.

- **Light:** gates plus a skim. Low impact, high detectability. Pins in the same pull request are a listed decision.
- **Standard:** this findings pass. Pins stay in the same pull request.
- **Deep:** this pass plus a second human, or `ai-delivery-reviewer` in a fresh context. A new module, a shared contract, or a framework upgrade is deep. A separate test-writer, and a human read of the cases before coding, applies here. A one-person project that uses only the reviewer agent is weaker. Say so.

## Reviewer checklist

Answer yes without taking the agent's word:

- `check:change` is green, or CI is green for a human-authored change. Evidence is the command output, not a sentence about it.
- The pull request links the work item and carries an `ai:` label.
- Reversible decisions are listed, at most five unmarked, and each names the chosen option and the rejected ones.
- Slice-contract changes are listed. Shared-contract changes are not buried in the diff.
- New behaviour has a happy-path test. No test was skipped, focused, weakened, or deleted unless that change is a listed decision.
- Acceptance tests, where the item has them, were not edited by the implementing agent to go green.
- On a UI, tokens are used, and loading, empty, and error states exist. Copy is judged here, not by a stop before the draft.
- Comments follow `ai-delivery-comments`. The pull request body leads with what the reviewer must decide.
- The change is small enough to review in one sitting. Fixes address the stated findings and do not quietly grow scope.
- Config, lockfile, or shared-package diffs ran the full check.
- Structure added or moved: the same pull request updates the codebase map. A decision file exists only when future work must follow it.
- On an existing codebase, no ratchet entry and no inline disable was added by the agent.

## Report shapes

Lead with what the reader must do. Templates: [references/review-comment.md](references/review-comment.md), [references/pr-body.md](references/pr-body.md), [references/done-report.md](references/done-report.md).

The agent's done report stays four parts. This checklist is for the reviewer. Optional style findings go in one summary comment.

## Triage

Bugs do not go straight to an agent. A human triages first. If the profile names a tracker, use it. If the board optional is on: Logged, Triage, To do, In progress, Parked, Ready for review, Done. An agent never creates a board on its own.

A finding on a pull request is a review comment. It becomes a tracker item only when it outlives the pull request. Template: [references/finding.md](references/finding.md).

## Repeated finding becomes a sensor

Do not correct the same finding a third time. In the same sprint, add a sensor, in this order: a lint rule, a structural test, a hook, then a line in the instructions file. The tracker item records whether a sensor was added, and which.

## When a human writes the code

Every check still runs. The pull request carries `ai:assisted`. You own every generated line. A test an agent wrote for code that same agent wrote is not your check. One line in the pull request says what the agent produced. The agent does not create a new documentation file.
