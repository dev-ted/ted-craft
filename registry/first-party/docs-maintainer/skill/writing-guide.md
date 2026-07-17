# ted-craft public docs — writing guide

Visitor-facing copy for the marketplace site. Inspired by Falcorp UI's public docs voice: speak to people **using** the product, not people **building** the repo.

## Who is reading

Someone who:

1. Lands on ted-craft
2. Wants to know what a skill/subagent does
3. Wants a command to add it to Cursor, Claude, or Codex

They are not cloning this repo to maintain it.

## Voice

- Second person ("you")
- Imperative for steps ("Add the skill", "Browse the registry")
- Present tense for what something does
- Direct — no fluff, no "simply" / "just" padding
- Warm enough to feel human; not cute; not corporate

## Word choices

| Prefer | Avoid on public pages |
|--------|------------------------|
| skill, subagent, hook | artifact (unless explaining once) |
| add / install | register into the index |
| browse | explore the generated registry tree |
| Cursor / Claude / Codex | agent targets as implementation detail |
| what it does | how the monorepo generates MDX |

OK to say **registry** once as "the catalog of skills on this site." Do not explain `sourceType`, Zod schemas, or generate pipelines on Getting started.

## Page shapes

### Home / intro

- What ted-craft is (one sentence)
- One install or start command
- Links: Getting started, Browse

### Getting started

1. Pick an agent (Cursor / Claude / Codex)
2. Add a skill with `npx ted-craft add …`
3. Optional: list / search / start for discovery

Stop there. Authoring skills belongs in contributor docs or the `create-skill` skill — not here.

### Skill / item page chrome

- Plain-language title + description ("what you get")
- Install commands for each agent
- Attribution for catalog items
- Then the skill body (agent instructions) as reference for what it teaches the agent

## Good vs bad

**Bad (maintainer tone):**

> ted-craft is a registry + docs site + CLI for sharing agent artifacts. Registry docs are generated from manifests under `/docs/registry`. Author a first-party skill: add `registry/first-party/<slug>/`, run `npm run validate`, open a PR.

**Good (visitor tone):**

> ted-craft is a marketplace of skills and helpers you can add to Cursor, Claude, or Codex. Browse what is available, then install with one command.

**Bad:**

> Sources: **first-party** means artifacts living in this repo under `registry/first-party/`. **catalog** means metadata-only entries with attribution.

**Good:**

> Some skills are maintained here; others come from upstream authors (with credit and their install command). Either way, you add them the same way from this site.

**Bad:**

> See create-skill and security-review for the full checklist.

**Good:**

> Want to publish your own skill later? Use the create-skill guide when you are ready to contribute — it is separate from installing skills for daily use.

## Maintainer-only topics (keep out of public MDX)

- `npm run validate` / `npm run generate`
- Manifest schema, Zod, CI workflows
- Local docs app / Vite / Fumadocs setup
- Monorepo package layout
- "When developing this application…"

Put those in `CONTRIBUTING.md`, skills like `create-skill` / `security-review`, or Cursor rules — not in visitor docs.
