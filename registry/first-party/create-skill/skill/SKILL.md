---
name: create-skill
description: >-
  Guide for authoring a new first-party ted-craft skill or bundle with manifest,
  SKILL.md frontmatter, validation, and docs generation. Use when creating or
  publishing a new registry artifact.
---

# Create a ted-craft skill

## Layout

```text
registry/first-party/<slug>/
├── manifest.json
├── skill/
│   └── SKILL.md
└── subagent/          # optional
    └── <name>.md
```

## Checklist

1. Pick a kebab-case `slug` matching the folder name.
2. Write `SKILL.md` with YAML frontmatter: `name`, `description` (name must match folder / manifest artifact name).
3. Fill `manifest.json` (`kind`, `category`, `tags`, `artifacts`, `source.type: first-party`).
4. Run `npm run validate` — must pass secret scan, frontmatter, and path checks.
5. Run `npm run generate` to refresh `registry/index.json` and docs.
6. Never commit secrets, personal emails, workspace IDs, or absolute home-directory paths — use placeholders.

## Frontmatter template

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
