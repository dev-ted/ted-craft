## Learned User Preferences

- Public docs and marketplace copy should speak to users browsing and installing artifacts, not to maintainers developing this repo.
- Prefer shadcn/ui for web UI primitives (buttons, selects, code blocks, etc.); avoid breaking the live site when applying presets or refactors.
- Keep scripts and workflows package-manager agnostic (bun, npm, and others), not npm-only.
- Dark mode must be fully themed; toggled dark surfaces should not leave white/light panels or controls.
- On docs item pages, show author names (third-party authors such as Anthropics; first-party as `dev-ted`) instead of vague labels like "Other authors" or "Maintained here".
- Prefer a unified install + code preview on skill/agent/hook docs pages (Cursor/Claude/Codex logo CTAs, Shiki-highlighted preview with Show more/Show less) rather than separate install and code panels.
- Never expose secrets or private data in published skills/agents/hooks; treat security as a hard requirement when authoring artifacts.
- Landing and marketplace UI should avoid a generic AI-generated look; use intentional design and motion (including GSAP where it fits).

## Learned Workspace Facts

- This project is ted-craft (local folder may still be named `cursor-config`): a marketplace for Cursor/Claude/Codex skills, subagents, rules, and hooks.
- Primary stack is TanStack Start + Fumadocs in `apps/web`, with install via `npx ted-craft`.
- GitHub remote is `https://github.com/dev-ted/ted-craft`.
- Registry splits first-party artifacts from an attributed third-party catalog (inspired by ui-skills.com-style attribution).
- Cursor workspace is often multi-root with `falcorp-design-system` as a UI/docs tone reference.
- A `docs-maintainer` skill/agent exists to keep public documentation user-facing in tone.
- Local lockfile and CI use Bun (`bun.lock`); GitHub Actions should use `oven-sh/setup-bun`, not npm lockfile caching.
- Web app deploys on Vercel with root directory `apps/web` (https://ted-craft.vercel.app).
- CLI package lives in `packages/cli` and publishes as the `ted-craft` npm package.
