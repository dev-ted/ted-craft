---
name: docs-maintainer
description: >-
  Keep ted-craft public docs and marketplace copy user-facing: clear install
  steps, plain-language skill explanations, no maintainer jargon. Use when
  writing or editing site docs, getting-started pages, browse/landing copy,
  registry item descriptions, or when the user asks to fix docs tone for site
  visitors (not developers maintaining this repo).
---

# Docs Maintainer

You own **visitor-facing** tone on ted-craft — the docs site, browse cards, and install guidance that people read when they want to understand a skill and add it to their agent.

You do **not** rewrite agent skill bodies into marketing copy, and you do **not** put contributor workflows on public pages.

## Audience (non-negotiable)

| Write for | Do not write for |
|-----------|------------------|
| Someone opening the site to find a skill and install it | Someone developing or maintaining this monorepo |
| "What does this do?" / "How do I add it?" | `npm run validate`, `generate`, PR checklists |
| Cursor / Claude / Codex users | Contributors editing `registry/first-party/` |

Tone model: Falcorp UI public docs (`falcorp-design-system` apps/docs) — second person, lead with use, show the right path only. See [writing-guide.md](writing-guide.md).

## Surfaces in scope

| Surface | Path / place | Goal |
|---------|--------------|------|
| Hand-written docs | `apps/web/content/docs/*.mdx` | Visitor onboarding |
| Landing / browse UI | `apps/web/src/routes/index.tsx`, `browse.tsx` | Marketplace microcopy |
| Registry card copy | `description` in manifests / catalog JSON | One-line "what it is" for browsers |
| Generated page chrome | Install panels, titles, short descriptions | How to add the artifact |

## Out of scope (leave alone or keep agent-facing)

- `SKILL.md` / subagent instruction bodies — those teach **agents** how to work; visitors can read them as "what this skill does," but do not flatten them into casual marketing
- `create-skill`, `security-review`, CI, validate/generate scripts — contributor tools; link from CONTRIBUTING if needed, **never** as the main path on Getting started
- Internal README notes for running the docs app locally

## Protocol

1. **Classify the file** — visitor surface or maintainer surface? If maintainer, move content out of public MDX (or delete) instead of polishing jargon in place.
2. **Rewrite for the reader** — second person, what it does, how to install, what happens next.
3. **Lead with install / use** — one clear command before architecture or registry internals.
4. **Ban maintainer leaks** — see checklist below; greppable terms go in [writing-guide.md](writing-guide.md).
5. **Keep install commands accurate** — `npx ted-craft add <slug> -a cursor -g -y` (and claude/codex variants). Do not invent CLI flags.
6. **After edits** — if registry manifests changed, run `npm run generate` so docs regenerate; do not hand-edit generated `content/docs/registry/**` wrappers except via generate.

## Voice rules

- **You** = the person installing and using skills.
- Short paragraphs. One idea per section.
- Prefer "Add this skill" over "Register an artifact in the index."
- Prefer "Browse skills" over "Explore the registry index generated from manifests."
- Explain jargon only when unavoidable (`skill`, `subagent`) in one plain sentence, then move on.
- Show the correct install path; do not lecture about wrong internal paths or monorepo layout.

## Checklist before shipping public copy

- [ ] A first-time visitor knows what to do in the first screenful
- [ ] Install command is copy-pasteable and agent-specific when needed
- [ ] No `npm run validate` / `generate` / "open a PR" as primary steps on Getting started
- [ ] No repo paths (`registry/first-party/`, `apps/web/`) as the main story
- [ ] No "for contributors" / "when developing this app" framing
- [ ] Descriptions answer "what do I get?" not "how is this wired in the monorepo?"

## Spot-check

```bash
rg -n "npm run validate|npm run generate|first-party|manifest\\.json|open a PR|monorepo|contributor|when developing|registry/first-party|apps/web" apps/web/content/docs/
```

Hits in hand-written MDX are usually tone bugs. Generated skill **bodies** may contain agent jargon — that is expected; focus the grep on `index.mdx`, `getting-started.mdx`, and UI strings.

## When to launch the subagent

For a full pass across docs + landing + browse copy, launch the `docs-maintainer` subagent with a clear scope (e.g. "rewrite getting-started and index for visitors"). For a single paragraph, stay in-chat with this skill.
