---
name: security-review
description: >-
  Pre-publish security checklist for ted-craft registry artifacts: secret scanning,
  no personal IDs, attribution for catalog entries, and validate-registry gates.
  Use before merging registry PRs or publishing new skills.
---

# Security review (registry)

Before publishing or merging registry changes:

## Must pass

1. `npm run validate` — Zod manifests, frontmatter, hooks JSON, secret patterns, no absolute home-directory paths
2. No API keys, tokens, private keys, or `.env` values in artifact files
3. No personal workspace IDs, emails, or private ClickUp list IDs — placeholders only
4. Catalog entries include `attribution.license` + `catalogUrl` + upstream install commands
5. First-party items ship with `manifest.json` + validated artifacts

## Review prompts

- Could this skill cause destructive MCP actions without confirmation?
- Are destructive ops documented as requiring user confirmation?
- Does description over-claim access or hide side effects?

## CI

PRs touching `registry/` run `validate-registry`. Fix errors locally before push.
