---
name: design-thinking
description: >-
  Run a human-centered design-thinking pass—Empathize, Define, Ideate, Prototype,
  Test plan—when exploring user problems before build. Prefer this for HCD/service/UX
  discovery and how-might-we framing; skip when the spec is frozen or the task is
  code-only maintenance.
---

# Design Thinking

Human-centered discovery workflow for framing problems and exploring solutions before implementation. Stages follow the classic Empathize → Define → Ideate → Prototype → Test arc (see [Interaction Design Foundation — Design Thinking](https://ixdf.org/literature/topics/design-thinking)). Paraphrase those stages here; do not paste upstream page text.

Use when the user wants design thinking, HCD, service/UX concept work, problem framing from user evidence, or how-might-we discovery. Skip when requirements are already frozen or the task is pure code maintenance.

## Execution rules

1. **No invented research.** Only use evidence the user provides, artifacts already in the workspace, or clearly labeled assumptions. If evidence is thin, say what is missing and what to gather next.
2. **POV + HMW before Ideate.** Do not jump to solutions. Lock a point-of-view statement and at least one how-might-we question before ideation.
3. **Ideate with substance.** Produce a real option set (not a single obvious answer). Score or annotate ideas with the three lenses as **hypotheses**, not facts:
   - **Desirable** — do people want this?
   - **Feasible** — can we build it with available tech/skills?
   - **Viable** — does it make sense for the business/mission?
4. **Prototype with purpose.** State what the prototype is meant to learn and at what fidelity (sketch, clickable, stub UI, service blueprint, etc.).
5. **Falsifiable tests.** Every test plan item needs a signal that could prove the idea wrong.
6. **Portable.** No project-specific paths, private IDs, or single-repo assumptions. Adapt prompts to the user's domain.

## Workflow

Run stages in order. Summarize each stage before moving on. End with **What to learn next**.

### 0. Setup

Capture in a few lines:

- Goal / opportunity the user cares about
- Primary users or stakeholders (roles, not invented personas)
- Constraints (time, stack, brand, compliance, scope)
- Available evidence (interviews, analytics, tickets, competitor notes, prior decisions)
- Success for this pass (e.g. "aligned POV + 3 testable concepts")

If evidence is missing, list concrete research asks instead of fabricating users or quotes.

### 1. Empathize

Synthesize what is known about people and context:

- Jobs, pains, gains, and workarounds (sourced or assumed—label which)
- Environment and channel (web, mobile, support, in-person, etc.)
- Emotions and trust issues that affect adoption
- Gaps: questions you still cannot answer

Output: a short empathy summary + open questions. No solutions yet.

### 2. Define

Converge on a problem frame:

1. **Point of view (POV):** `[user] needs [need] because [insight]` grounded in Empathize.
2. **How-might-we (HMW):** 2–5 generative questions that open solution space without prescribing a feature.
3. **Out of scope:** what you are intentionally not solving this pass.
4. **Success criteria:** observable outcomes if a good solution lands.

Do not proceed to Ideate until POV + at least one HMW are explicit.

### 3. Ideate

Widen then cluster:

1. Generate a diverse set of ideas against the HMW set (aim for breadth before polish).
2. Cluster by theme; kill duplicates.
3. Shortlist 3–7 concepts worth carrying forward.
4. For each shortlisted idea, note desirability / feasibility / viability as **hypotheses** (what would have to be true).

Prefer contrasting approaches (different interaction models, service vs product, automation vs human) over minor UI variants.

### 4. Prototype

For each shortlisted concept (or the top 1–2 if time-boxed):

- **Purpose:** what uncertainty this prototype reduces
- **Fidelity:** sketch / wire / clickable / copy deck / service map / stub
- **Artifact outline:** screens, flows, scripts, or touchpoints to produce
- **Non-goals:** what not to polish yet

Describe enough that someone could build or draw the prototype; do not implement production code unless the user asks.

### 5. Test plan

Define how learning will happen:

| Concept | Method | Participants / sample | Success signal | Fail / pivot signal |
| --- | --- | --- | --- | --- |
| … | interview, usability, concierge, A/B, dogfood, support replay, … | who / how many (realistic) | falsifiable yes | falsifiable no |

Include ethics basics: informed consent for research, no deceptive dark patterns in tests, respect private data.

### 6. What to learn next

Close with a crisp backlog:

1. Highest-risk assumption still untested
2. Next research or prototype step (one primary)
3. Decision gate: what evidence would justify building vs killing vs reframing the POV

## Output shape

Prefer a single structured pass the user can paste into a doc:

```markdown
## Setup
…

## Empathize
…

## Define
**POV:** …
**HMW:** …
**Out of scope:** …
**Success:** …

## Ideate
### Shortlist
1. … — D/F/V hypotheses: …
…

## Prototype
…

## Test plan
…

## What to learn next
1. …
2. …
3. …
```

## Quality bar

- Evidence and assumptions are separated
- POV and HMW appear before any solution list
- Ideation is plural and D/F/V-tagged as hypotheses
- Prototypes state learning purpose + fidelity
- Tests can fail (not only confirm)
- No secrets, personal IDs, or project-locked paths
