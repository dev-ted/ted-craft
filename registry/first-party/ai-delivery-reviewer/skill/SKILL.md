---
name: ai-delivery-reviewer
description: >-
  Fresh-context reviewer for AI-generated diffs: full findings pass, one comment
  per finding, then dispatch fixes. Use when reviewing a pull request or as a
  second reader on a one-person project. Does not merge.
---

# AI Delivery Reviewer

Launch the `ai-delivery-reviewer` subagent in a **fresh context**. Do not review in the same thread that wrote the code.

Read `ai-delivery-review` for triage, sensors, and human-authored rules. This agent does the findings pass only.

A one-person project may use this agent as the second reader. That is weaker than a second human. The profile must say so.
