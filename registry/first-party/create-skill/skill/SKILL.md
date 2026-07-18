---
name: create-skill
description: >-
  Guide for authoring a new first-party ted-craft skill, rule, or bundle with
  manifest, frontmatter, validation, and docs generation. Use when creating or
  publishing a new registry artifact.
---

# Create a ted-craft skill

## Skill layout

```text
registry/first-party/<slug>/
├── manifest.json
├── skill/
│   └── SKILL.md
└── subagent/          # optional
    └── <name>.md
```

## Rule layout

Each package installs **one** rule file (`artifacts.rule.file`). Prefer Cursor `.mdc` with `description`, optional `globs`, and `alwaysApply`.

```text
registry/first-party/<slug>/
├── manifest.json          # kind: "rule"
└── rule/
    └── <slug>.mdc
```

### Rule checklist

1. Pick a kebab-case `slug` matching the folder name.
2. Write portable rule body — no single-project names, private paths, or org-only registries unless the rule’s assumptions say so.
3. Fill `manifest.json` with `kind: "rule"` and `artifacts.rule.file` pointing at the `.mdc`.
4. Set installer-facing `description` (what the rule enforces for users browsing the marketplace).
5. Run `npm run validate` then `npm run generate`.
6. Cross-reference sibling rules by **marketplace slug**, not local filenames, so partial installs still make sense.

### Rule manifest essentials

```json
{
  "slug": "my-rule",
  "kind": "rule",
  "name": "My Rule",
  "description": "What this rule enforces for installers.",
  "category": "rules",
  "tags": ["react"],
  "author": { "name": "ted", "url": "https://github.com/dev-ted" },
  "license": "MIT",
  "artifacts": {
    "rule": { "file": "rule/my-rule.mdc" }
  },
  "source": { "type": "first-party" },
  "cli": {
    "promptExample": "npx ted-craft add my-rule -a cursor -g -y",
    "featured": false
  }
}
```

### Rule frontmatter template

```yaml
---
description: Short summary of what the rule enforces
globs:
  - "**/*.{tsx,jsx}"
alwaysApply: true
---

# Title

**Assumes:** stack prerequisites so users know when to skip this rule.
```

## Skill checklist

1. Pick a kebab-case `slug` matching the folder name.
2. Write `SKILL.md` with YAML frontmatter: `name`, `description` (name must match folder / manifest artifact name).
3. Fill `manifest.json` (`kind`, `category`, `tags`, `artifacts`, `source.type: first-party`).
4. Run `npm run validate` — must pass secret scan, frontmatter, and path checks.
5. Run `npm run generate` to refresh `registry/index.json` and docs.
6. Never commit secrets, personal emails, workspace IDs, or absolute home-directory paths — use placeholders.

## Skill frontmatter template

```yaml
---
name: my-skill
description: >-
  One or two sentences. Include trigger phrases for when agents should load this.
---
```

## Manifest essentials

- `kind`: `skill` | `subagent` | `rule` | `hook` | `bundle`
- `cli.featured`: only for high-signal starter items
- `cli.promptExample`: the install or start command users should copy
