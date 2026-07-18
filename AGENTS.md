## Learned User Preferences

- Public docs and marketplace copy should speak to users browsing and installing artifacts, not to maintainers developing this repo.
- Prefer shadcn/ui for web UI primitives (buttons, selects, code blocks, etc.); avoid breaking the live site when applying presets or refactors.
- Keep scripts and workflows package-manager agnostic (bun, npm, and others), not npm-only.
- Dark mode must be fully themed; toggled dark surfaces should not leave white/light panels or controls.
- On docs item pages, show author names (third-party authors such as Anthropics; first-party as `dev-ted`) instead of vague labels like "Other authors" or "Maintained here".
- Prefer a unified install + code preview on skill/agent/hook docs pages (Cursor, Claude, Codex, and VS Code CTAs labeled “Add to …”, with real app logos—especially Claude and Codex—plus a Shiki-highlighted preview with Show more/Show less) rather than separate install and code panels.
- Never expose secrets or private data in published skills/agents/hooks; treat security as a hard requirement when authoring artifacts.
- Landing and marketplace UI should avoid a generic AI-generated look; use intentional design and motion (including GSAP where it fits).
- Terminal and code-block chrome on the landing page and docs should look like a real macOS-style terminal window (traffic-light window controls), not a labeled bar such as “WORKBENCH” or “TERMINAL”.
- Site footer should credit Created by `ted.code` linking to https://frontendted.co.za (with copyright / all rights reserved).

## Learned Workspace Facts

- This project is ted-craft (local folder may still be named `cursor-config`): a marketplace for Cursor/Claude/Codex skills, subagents, rules, and hooks.
- Primary stack is TanStack Start + Fumadocs in `apps/web`, with install via `npx ted-craft`.
- GitHub remote is `https://github.com/dev-ted/ted-craft`.
- Registry splits first-party artifacts from an attributed third-party catalog (inspired by ui-skills.com-style attribution).
- Cursor workspace is often multi-root with `falcorp-design-system` as a UI/docs tone reference.
- A `docs-maintainer` skill/agent exists to keep public documentation user-facing in tone.
- Local lockfile and CI use Bun (`bun.lock`); GitHub Actions should use `oven-sh/setup-bun`, not npm lockfile caching.
- Web app deploys on Vercel with Root Directory `apps/web` and Framework TanStack Start; leave Build Command and Output Directory on Auto (do not override to `dist`—Nitro writes `.vercel/output`); monorepo Install may be `cd ../.. && bun install --frozen-lockfile`.
- CLI package lives in `packages/cli` and publishes as the `ted-craft` npm package.
- Outside a local checkout, the published CLI loads the registry from GitHub raw (`…/main/registry/index.json`); that URL 404s while `dev-ted/ted-craft` is private—host the index on the Vercel site for remote installs.

## Cursor Cloud specific instructions

- Toolchain: Node 24 and Bun are pre-provisioned in the VM snapshot. Because the base image ships a `/exec-daemon/node` (v22) that would otherwise shadow it, Node 24 (`node`/`npm`/`npx`) and `bun`/`bunx` are symlinked into `/usr/local/cargo/bin` (which sits ahead of `/exec-daemon` on `PATH`), so they resolve in any shell — including the non-login shells the agent runs — without sourcing `~/.bashrc`. The startup update script only runs `bun install`.
- Commands are the standard ones in `README.md` / root `package.json`: `bun run dev` (web on `http://localhost:3000`), `bun run generate`, `bun run validate`, `bun run types:check`, `bun run lint`, and the CLI via `bun run cli -- <list|search|get|add ...>`.
- Non-obvious build ordering: the web app statically imports `apps/web/src/data/registry.json`, so the `generate` step (from `@ted-craft/validate`) must run before the web app can build/serve. `bun run dev`, `bun run build`, and `bun run types:check` already chain `generate` first; run `bun run generate` manually if you serve the web app another way.
- `bun run lint` (Biome) currently reports pre-existing findings on committed source (e.g. quote style in `apps/web/vite.config.ts`); this is the repo's existing state, not a broken environment.
- No secrets or `.env` are required for dev. The `VERCEL_OIDC_TOKEN is not set` message from the dev server is a harmless Vercel-emulation notice.
