## Learned User Preferences

- Public docs and marketplace copy should speak to users browsing and installing artifacts, not to maintainers developing this repo.
- Prefer shadcn/ui for web UI primitives (buttons, selects, code blocks, etc.); avoid breaking the live site when applying presets or refactors.
- Keep scripts and workflows package-manager agnostic (bun, npm, and others), not npm-only.
- Dark mode must be fully themed; toggled dark surfaces should not leave white/light panels or controls.
- On docs item pages, show author names (third-party authors such as Anthropics; first-party as `dev-ted`) instead of vague labels like "Other authors" or "Maintained here".
- Prefer a unified install + code preview on skill/agent/hook docs pages (Cursor, Claude, Codex, and VS Code CTAs labeled “Add to …”, with real app logos—especially Claude and Codex—plus a Shiki-highlighted preview with Show more/Show less) rather than separate install and code panels.
- Never expose secrets or private data in published skills/agents/hooks; hooks especially must be reviewed for malicious or unsafe code before publish.
- Landing and marketplace UI should avoid a generic AI-generated look; use intentional design and motion (including GSAP where it fits).
- Terminal and code-block chrome on the landing page and docs should look like a real macOS-style terminal window (traffic-light window controls), not a labeled bar such as "WORKBENCH" or "TERMINAL".
- Site footer should credit Created by `ted.code` linking to https://frontendted.co.za (with copyright / all rights reserved).
- When promoting project-derived rules or skills into the marketplace, generalize them so they apply to any React (or target) project—not one specific codebase.
