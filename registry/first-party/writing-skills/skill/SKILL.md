---
name: writing-skills
description: >-
  Compose high-quality writing with a modular framework—constitution, tone/format
  packs, workflow, editing pipeline, and checklists. Use for emails, docs, PRs,
  proposals, blogs, and social posts; skip for pure code generation with no prose.
---

# Writing Skills

A modular writing framework for AI agents. Compose pieces by combining a **constitution**, **decision trees**, a **workflow**, **tone packs**, **format packs**, an **editing pipeline**, and **checklists**—not by dumping one giant prompt.

Use when the user asks to write, rewrite, polish, or adapt prose (email, docs, PR, proposal, blog, social, status update, etc.). Skip when the task is pure code with no user-facing writing.

## Execution rules

1. **Ask before inventing facts.** Do not invent metrics, quotes, dates, product claims, or legal language. Label assumptions or ask.
2. **Pick tone + format explicitly.** State which tone pack and format pack you are using before drafting (or confirm with the user if ambiguous).
3. **Draft → Edit → Check.** Never ship a first draft as final. Run the editing pipeline, then the relevant checklist.
4. **Audience first.** Every piece answers: who is reading, what they need to do or know, and by when.
5. **Portable.** No project-specific paths, private IDs, secrets, or single-repo assumptions. Adapt examples to the user's domain.
6. **Match length to job.** Prefer the shortest piece that still decides, informs, or persuades.

---

## 1. Writing constitution

Non-negotiables for every piece:

| Principle | Practice |
| --- | --- |
| Clarity over cleverness | Prefer plain words; cut jargon unless the audience expects it |
| One idea per unit | One point per sentence; one theme per paragraph; one job per section |
| Active and concrete | Prefer active voice; prefer specific nouns and verbs over abstractions |
| Truthfulness | Only claim what evidence supports; flag uncertainty |
| Respect | No condescension, no dark-pattern urgency, no manipulative framing |
| Inclusive default | Avoid idioms that exclude; use accessible reading level unless tone pack says otherwise |
| Scannable | Lead with the point; use structure (headers, lists, short paras) when length grows |
| Editable | Leave the draft easy for a human to tweak—no ornate filler |

**Forbidden by default:** filler openers ("I hope this email finds you well"), throat-clearing, stacked hedges ("might possibly potentially"), fake urgency, unexplained acronyms, wall-of-text paragraphs.

---

## 2. Decision trees

### 2.1 Which tone pack?

```
Is the reader a peer / teammate casually?
  → conversational or friendly
Is the reader an exec / board / time-starved decision maker?
  → executive
Is the piece selling / launching / converting?
  → marketing
Is the piece specifying systems, APIs, or procedures?
  → technical
Is the piece formal client / partner / external professional?
  → professional
Unsure?
  → professional (safe default), then offer a tone swap
```

### 2.2 Which format pack?

```
Internal code review / merge request → PR
How-to, reference, or README → documentation
Persuade a stakeholder to approve spend/scope → proposal
Public long-form thought leadership → blog
Short public channel (LinkedIn/X/etc.) → social
Direct message to one person or small group → email
Status / standup / changelog note → email (short) or documentation (changelog)
```

### 2.3 Depth vs speed?

```
User said "quick" / "draft" / "rough" → draft only; light edit; skip few-shot polish
User said "ship" / "send" / "final" → full workflow + editing pipeline + checklist
High-stakes (legal, exec, public) → full pipeline + offer alternatives (A/B openings)
```

### 2.4 Structure first or prose first?

```
Complex / multi-audience / long → outline → draft sections → edit
Short / single ask → draft whole → edit for punch
Rewrite of existing text → diagnose issues → edit in place → diff summary
```

---

## 3. Writing workflow

Run in order. Skip stages only when the user already supplied that output.

### Stage A — Brief

Capture (ask only for what is missing):

- **Goal:** inform / persuade / request / document / celebrate / apologize
- **Audience:** role, knowledge level, relationship, constraints
- **Tone pack** + **format pack**
- **Must include / must avoid**
- **Length budget** (e.g. 5 bullets, ≤150 words, 1 page)
- **Call to action** (what should happen next)
- **Facts & sources** (user-provided only)

### Stage B — Outline

Produce a skeleton: sections or beat list. For short forms, a 3–5 beat outline is enough.

### Stage C — Draft

Write the full piece using the chosen tone + format packs. Prefer getting a complete draft over perfecting the first paragraph.

### Stage D — Edit pipeline

Run §6 Editing pipeline (passes 1–5).

### Stage E — Checklist + deliver

Run the relevant checklist (§8). Deliver:

1. Final piece (ready to paste)
2. Optional: 1–2 alternate openings or subject lines when high-stakes
3. Brief note of tone/format used and any assumptions

---

## 4. Tone packs

Apply one primary pack. You may blend lightly (e.g. professional + friendly) if the user asks.

### Professional

- Warm but restrained; complete sentences; modest hedging only when needed
- No slang; light contractions OK in email, avoid in formal proposals
- Example vibe: "Attached is the revised timeline. Please confirm by Friday so we can lock vendor slots."

### Conversational

- Natural speech rhythm; contractions; short sentences; one clear ask
- Still specific—casual ≠ vague
- Example vibe: "Quick update: the migration landed. One follow-up—can you sanity-check the staging URL when you have 10 minutes?"

### Executive

- Bottom line first; options with tradeoffs; numbers over narrative
- Ruthlessly short; no background essay unless asked
- Example vibe: "Recommend Option B. Ships two weeks sooner, +8% cost, lower delivery risk. Need a yes/no by Thursday."

### Technical

- Precise terms; define once; prefer steps, inputs/outputs, failure modes
- No marketing adjectives; link concepts to observable behavior
- Example vibe: "The worker retries 3× with exponential backoff (1s, 4s, 16s), then dead-letters the payload to `queue.dlq`."

### Marketing

- Benefit-led; concrete outcomes; credible proof only if provided
- Strong verbs; scannable; CTA explicit—not hype stacks
- Example vibe: "Cut review time from days to minutes. Start with one workflow—see results this sprint."

### Friendly

- Approachable, encouraging, human; still clear on the ask
- Soften bad news without obscuring it
- Example vibe: "Thanks for hanging in there on this. Here's where we landed, and here's the one thing I need from you."

**Tone swap cue:** If the user says "make it more X", remap to the pack above and rewrite—don't just sprinkle adjectives.

---

## 5. Format packs

### Email

- Subject: specific + actionable (not "Quick question")
- Opening line = purpose; body = context → ask → deadline
- Close with clear owner + next step
- Default length: ≤150 words unless complexity requires more

### Documentation

- Title states the job ("Install the CLI", not "Overview")
- Prerequisites → steps → verify → troubleshoot
- Use imperative mood in procedures; present tense in reference
- Call out warnings before destructive steps

### Pull requests (PRs)

- Title: `type(scope): summary` when the repo uses conventional commits; else clear imperative summary
- Body: **Why** → **What changed** → **How to test** → **Risks / follow-ups**
- Bullet the user-visible behavior; link issues if provided
- No novel-length backstory

### Proposals

- Situation → problem → proposed approach → options → recommendation → ask
- Include cost/time/risk only with user-supplied figures
- End with an explicit decision request

### Blog

- Hook → thesis → sections with subheads → concrete examples → takeaway
- One thesis; cut side quests
- Prefer stories or examples the user provided; do not fabricate case studies

### Social posts

- One idea; hook in the first line; short paragraphs or line breaks
- CTA or question optional; hashtags only if asked
- Platform note: keep X/Twitter tighter; LinkedIn can run slightly longer

### Other short forms

- **Status / standup:** Done / Doing / Blockers (or equivalent)
- **Apology:** Acknowledge → impact → fix → prevention → ask
- **Decline:** Thanks → clear no → brief reason → alternative if any

---

## 6. Editing pipeline

Run these passes in order on every "final" draft:

### Pass 1 — Purpose

- Does the first screenful answer "so what?" / state the ask?
- Delete anything that does not serve goal, audience, or CTA.

### Pass 2 — Structure

- Logical order; headers or bullets where they help scan
- One job per section; merge duplicates; cut preambles.

### Pass 3 — Clarity

- Replace abstractions with concrete nouns/verbs
- Resolve ambiguous pronouns ("this", "it", "they")
- Expand or define acronyms on first use

### Pass 4 — Tightening

- Cut filler, double hedges, and throat-clearing
- Prefer shorter sentences; split run-ons
- Prefer active voice unless passive is clearer (e.g. error victims)

### Pass 5 — Voice + mechanics

- Align to the chosen tone pack
- Check grammar, punctuation, consistency (capitalization, product names)
- Verify claims against the brief—remove unsupported ones

**Diff habit:** When rewriting existing text, briefly list what changed (clarity, tone, structure) so the user can trust the edit.

---

## 7. Readability and clarity techniques

Use deliberately—not all at once:

| Technique | When |
| --- | --- |
| **BLUF / bottom line up front** | Exec, email asks, status |
| **Inverted pyramid** | News-like updates: most important first |
| **Given–new** | Docs: start with known context, then new info |
| **Parallelism** | Lists and compared options |
| **Chunking** | Long docs: short sections, descriptive headers |
| **Example after rule** | Technical and docs: show one concrete case |
| **Contrast** | Proposals: Option A vs B on same axes |
| **Cut nominalizations** | "make a decision" → "decide"; "provide assistance" → "help" |
| **Specific numbers** | Prefer "3 days" over "soon" when known |
| **Read-aloud test** | If you stumble speaking it, rewrite |

**Reading level:** Default to clear adult prose (~8th–10th grade) unless technical or legal audience requires denser language.

---

## 8. Checklists

### Universal (always)

- [ ] Audience and goal are clear
- [ ] Tone pack + format pack applied intentionally
- [ ] Ask / CTA is explicit (or explicitly "FYI only")
- [ ] No invented facts, quotes, or metrics
- [ ] No secrets, tokens, private URLs, or personal data
- [ ] Length fits the budget
- [ ] Editing passes 1–5 completed

### Email

- [ ] Subject line is specific
- [ ] Purpose in first 2 sentences
- [ ] Single primary ask (or numbered asks)
- [ ] Deadline / owner if action needed

### Documentation

- [ ] Prerequisites listed
- [ ] Steps are ordered and completable
- [ ] Verification step present
- [ ] Failure/edge cases called out when relevant

### PR

- [ ] Why is clear without reading the diff
- [ ] Test plan is actionable
- [ ] Risks / breaking changes noted
- [ ] Title matches repo conventions if known

### Proposal

- [ ] Recommendation is unambiguous
- [ ] Options compared fairly
- [ ] Decision ask is time-bound when appropriate
- [ ] Unstated assumptions listed

### Blog / social

- [ ] One thesis / one idea
- [ ] Hook earns the next line
- [ ] CTA (if any) is one clear action
- [ ] No fabricated testimonials or results

---

## 9. Few-shot examples

### Example A — Email (professional → executive rewrite)

**Brief:** Ask design lead to review checkout flow by Wednesday; blocking launch.

**Professional draft:**

```text
Subject: Checkout flow review needed by Wednesday

Hi Maya,

Could you review the updated checkout flow when you have a chance? We're hoping to lock copy and empty states before launch, and your pass would help us catch friction we might miss.

If you can leave comments by Wednesday EOD, we can still land fixes in this sprint.

Thanks,
Alex
```

**Executive variant (same facts):**

```text
Subject: Decision needed: checkout review by Wed EOD

Maya — need your review on checkout (copy + empty states) by Wed EOD to keep launch. Blocking without it. Link in thread. Thanks.
```

### Example B — PR body

```markdown
## Why
Users could submit the form twice and create duplicate orders.

## What changed
- Disable submit after first click; show pending state
- Idempotency key on create-order request

## Test plan
1. Submit form once — single order created
2. Double-click submit — still one order
3. Refresh mid-submit — no duplicate

## Risks / follow-ups
- Follow-up: server-side idempotency for older clients
```

### Example C — Docs step (technical)

```markdown
## Verify the worker is healthy

1. Run `appctl status worker`
2. Confirm `ready: true` and `lag < 100`
3. If `ready: false`, check logs for `dial tcp` errors and confirm broker connectivity
```

### Example D — Social (marketing, proof supplied by user)

```text
We cut average review time from 2 days to 14 minutes by standardizing PR templates.

One change. Same team. Faster merges.

Want the template? Comment "PR" and we'll share it.
```

*(Only use metrics the user provided—as in this example.)*

### Example E — Soft decline (friendly)

```text
Thanks for thinking of me for the panel—it sounds great.

I need to pass this time so I can protect delivery on an in-flight launch. If a later date opens up, I'd be glad to reconsider.

Happy to suggest a couple of folks who speak on this topic if that helps.
```

---

## 10. Output shape

Default delivery:

```markdown
**Tone:** <pack> · **Format:** <pack>

## Draft
<final piece>

## Notes
- Assumptions: …
- Alternatives (optional): …
```

For rewrites of user text, prefer:

```markdown
## Revised
…

## What changed
- …
```

---

## Quality bar

- Constitution followed; no filler openers or fake urgency
- Tone and format stated and applied consistently
- Workflow completed through edit + checklist for "final" asks
- Facts only from user/context; assumptions labeled
- Portable: no secrets, private IDs, or project-locked paths
- Shortest effective version wins
