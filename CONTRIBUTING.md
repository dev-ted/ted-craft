# Contributing to ted-craft

## First-party artifacts

1. Create `registry/first-party/<slug>/` with `manifest.json` and artifacts.
2. `SKILL.md` / subagent frontmatter must include `name` and `description`.
3. Never commit secrets, personal emails, workspace IDs, or absolute user paths.
4. Run `npm run validate` then `npm run generate`.
5. Commit generated `registry/index.json`, `apps/web/src/data/registry.json`, and docs under `apps/web/content/docs/registry/`.

### Hooks (`kind: "hook"`)

Hooks are **executable** — they run on installers’ machines. Before opening a PR:

- Keep scripts local-only (no network, no shell, no secrets).
- Jail file writes to workspace paths; document side effects in `docs.readme`.
- Run the **security-review** checklist (Executable hooks section) and have a human read every script under `scriptsDir`.

## Catalog entries

Third-party skills are **metadata only** — no vendored copies.

- Include `attribution` (author, repo, skill, license, catalogUrl)
- Provide `install.default` (and optional cursor/claude/codex variants) pointing upstream

## CLI

```bash
npm run cli -- list
npm run cli -- add click-up-maintainer -a cursor -g -y
```
