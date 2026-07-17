# ted-craft

Agent artifact marketplace: first-party skills/subagents/rules/hooks, an attributed third-party catalog, a Fumadocs site, and `npx ted-craft`.

**Repo:** [github.com/dev-ted/ted-craft](https://github.com/dev-ted/ted-craft)

## Quick start

```bash
npx ted-craft start
npx ted-craft add click-up-maintainer -a cursor -g -y
npx ted-craft list
npx ted-craft search clickup
```

Browse the registry on the site (`/browse`) or read generated docs under `/docs`.

## Clone

```bash
git clone https://github.com/dev-ted/ted-craft.git
cd ted-craft
npm install
npm run generate
npm run dev
```

## Monorepo

| Path | Package |
|------|---------|
| `apps/web` | `@ted-craft/web` — TanStack Start + Fumadocs marketplace |
| `packages/cli` | `ted-craft` — npm CLI |
| `packages/validate` | Schema validation, secret scan, generate index/docs |
| `registry/first-party` | Owned artifacts + manifests |
| `registry/catalog` | Third-party metadata + install commands only |

```bash
npm install
npm run generate   # validate + write index.json + docs
npm run dev        # web on :3000
npm run validate
```

## Install from this clone

Prefer the CLI. Legacy full sync:

```bash
./scripts/install.sh
```

## Authoring

See [CONTRIBUTING.md](./CONTRIBUTING.md). Security checklist lives in the `security-review` skill.

## License

MIT for first-party artifacts unless a manifest specifies otherwise. Catalog entries remain under their upstream licenses.
