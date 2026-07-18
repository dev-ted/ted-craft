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

## Executable hooks

Hooks install and run code on the user’s machine. Treat them like shipping a small binary.

Before merging a `kind: "hook"` artifact:

1. Human-read every file under `artifacts.hook.scriptsDir` (`.mjs`, `.js`, `.sh`, etc.)
2. Prefer Node built-ins only — no `child_process`, network (`fetch`/`http`/`https`), `eval`, or dynamic remote imports
3. Confine writes to the intended paths (workspace jail / allowlisted extensions); refuse path escapes and out-of-workspace symlinks
4. Fail closed: catch errors and exit `0` so a hook never blocks the agent
5. Docs must disclose side effects (which files are written) and that the script is local-only
6. No secrets, absolute home paths, or personal IDs in config or scripts
7. `npm run validate` must pass (hooks JSON + secret/path scan of the whole package)

If a hook needs shell or network, reject the PR unless there is a clear, documented, least-privilege reason and user confirmation before destructive work.

## CI

PRs touching `registry/` run `validate-registry`. Fix errors locally before push.
