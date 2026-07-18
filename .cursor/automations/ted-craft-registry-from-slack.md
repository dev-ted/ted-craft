# Ted-craft registry from Slack

Cursor Automation prompt for Cloud Agents. Trigger: Slack message containing `tedcraft:`.

## Automation settings (for the editor)

| Field | Value |
| --- | --- |
| Name | Ted-craft registry from Slack |
| Description | From a Slack `tedcraft:` message, track in ClickUp and open a PR to add a first-party or catalog artifact |
| Trigger | Slack — new message, keyword/filter `tedcraft:` |
| Channel | Pick a public channel; invite `@Cursor` |
| Tools | Slack (reply in triggering thread), ClickUp MCP, pull request creation |
| Repository | `dev-ted/ted-craft` (default branch) |
| PR creation | On |

## ClickUp

- List ID: `901219646845` (Registry ideas, space: skills agent)
- On start: create task, status `in progress`
- On PR open: comment PR URL, status `complete`

## Agent instructions

Work only in `dev-ted/ted-craft`. From the Slack message after `tedcraft:`:

1. **Parse** required fields:
   - `source`: `first-party` or `catalog` (default `first-party` if omitted)
   - `kind`: `skill` | `rule` | `subagent` | `hook` | `bundle`
   - `slug` / name, description, body or upstream links
   - For **catalog**: require attribution (author, repo, skill/path, license, catalogUrl) and install command(s)
   - If source/kind/slug/purpose (or catalog attribution) is missing, reply in Slack asking for them and stop — do not open a half-baked PR

2. **ClickUp:** create a task in list `901219646845` with name = `[kind] title`, markdown description = full brief + source/kind + Slack context; status `in progress`; assignee `me` if supported.

3. **Author by source:**
   - **first-party:** under `registry/first-party/<slug>/` — correct `kind`, `artifacts.*`, `source.type: "first-party"`, author ted / https://github.com/dev-ted; portable copy; no secrets; generalize for any target project (not one codebase)
   - **catalog:** add `registry/catalog/<descriptive-filename>.json` with `source.type: "catalog"`, `attribution`, `install.default` plus app-specific install keys as appropriate; do **not** vendor upstream skill files

4. **Validate:** run repo validate/generate scripts if available; fix failures before PR. Match schemas used by the validate package.

5. **PR:** branch + title `feat(<kind>): add <slug>` or `feat(catalog): add <slug>`; body summarizes files, source/kind, and ClickUp task URL. Never merge. Never publish npm yourself.

6. **Close the loop:** comment PR URL on the ClickUp task; set status `complete`; reply in the Slack triggering thread with ClickUp URL + PR URL.

## Example Slack messages

### First-party skill

```text
tedcraft:
source: first-party
kind: skill
slug: svg-a11y-titles
Name: SVG a11y titles
When: After writing decorative or icon SVGs
Instructions:
- Prefer title/desc for meaningful icons
- Mark decorative SVGs aria-hidden
```

### First-party rule

```text
tedcraft:
source: first-party
kind: rule
slug: react-no-inline-styles
Name: React no inline styles
Description: Prefer Tailwind/token classes over style={{}} in React UI.
```

### Catalog (third-party)

```text
tedcraft:
source: catalog
kind: skill
slug: anthropics/some-skill
Name: Some Skill
Description: Short marketplace blurb.
attribution:
  author: anthropics
  repo: anthropics/skills
  skill: some-skill
  license: Apache-2.0
  catalogUrl: https://github.com/anthropics/skills/tree/main/skills/some-skill
install:
  default: npx skills add anthropics/skills --skill some-skill -g -y
```
