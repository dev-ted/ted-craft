# ted-craft CLI

Install and discover agent artifacts (skills, subagents, rules, hooks) from the ted-craft marketplace.

```bash
npx ted-craft start
npx ted-craft list
npx ted-craft add click-up-maintainer -a cursor -g -y
npx ted-craft search clickup
npx ted-craft get ted-craft-root
```

Wraps [vercel-labs/skills](https://github.com/vercel-labs/skills) for catalog installs and copies first-party artifacts into Cursor / Claude / Codex directories.
