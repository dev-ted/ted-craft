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

## Publishing

The npm package name is `ted-craft` (`packages/cli`). From the monorepo root:

### Local (logged into npm)

```bash
bun run cli:version:patch   # or cli:version:minor / cli:version:major
# commit the version bump in packages/cli/package.json
bun run cli:publish:dry
bun run cli:publish
bun run cli:tag
git push origin "$(node scripts/cli-tag.mjs --print)"
```

`cli:tag` creates an annotated tag `cli-vX.Y.Z` matching `packages/cli/package.json`. Prefer CI for the real publish when the tag is pushed (below).

### CI

1. Bump the version, commit, and push to `main`.
2. Create and push the tag: `bun run cli:tag && git push origin "$(node scripts/cli-tag.mjs --print)"`.
3. The **Publish CLI** workflow runs on `cli-v*` tags and publishes to npm.

You can also run the workflow manually (`workflow_dispatch`) with **dry_run** enabled to verify packaging without uploading.

**Secret:** add a GitHub Actions secret `NPM_TOKEN` (npm automation token with publish access to `ted-craft`).
