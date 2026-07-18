# SVG currentColor

After an agent writes an SVG file, this hook rewrites hardcoded `stroke` and `fill` colors to `currentColor` so icons pick up your theme text color.

## Why use it

Agents often emit SVGs with fixed hex colors. Those icons ignore dark mode and parent text color. With `currentColor`, the SVG follows CSS `color` like the rest of your UI.

## Install

This is a **hook**, not a skill — you still add it with `ted-craft add` (same CLI). Run the command in the **app project** where you want the hook (the folder that should get `.cursor/`), not as a global skill install.

```bash
npx ted-craft add svg-current-color -a cursor -y
```

That writes into the current project:

- `.cursor/hooks.json` — registers the `afterFileEdit` hook (merged with any hooks you already have)
- `.cursor/hooks/svg-current-color.mjs` — the normalizer script

Pass `-g` only if you intentionally want Cursor’s user-level hooks directory. The packaged command path is project-relative (`.cursor/hooks/...`), so project install is the usual choice.

### Manual install

If the CLI is unavailable, copy from the registry package:

1. Create `.cursor/hooks/` in your project
2. Copy `svg-current-color.mjs` into `.cursor/hooks/`
3. Merge this entry into `.cursor/hooks.json` (keep any hooks you already have):

```json
{
  "version": 1,
  "hooks": {
    "afterFileEdit": [
      {
        "command": "node .cursor/hooks/svg-current-color.mjs",
        "matcher": "Write"
      }
    ]
  }
}
```

## What it does

On Cursor `afterFileEdit` when the edit matcher is `Write`:

1. Reads the edited path from the hook payload
2. Skips anything that is not a `.svg` under a workspace root
3. Replaces hardcoded `stroke` / `fill` attributes and simple inline styles with `currentColor`
4. Leaves `none` and existing `currentColor` values alone

## Safety

This hook is local-only by design:

- No network, no shell, no downloads
- Writes only the edited SVG, and only if it resolves inside a workspace root
- Skips symlinks that point outside the workspace
- Skips files larger than 2 MiB
- Exits quietly on errors so it never blocks the agent

Review the script on this page before you install — hooks run on your machine.

## Caveats

- Runs on `Write` via `afterFileEdit` only
- If you need brand-specific SVG colors, keep them out of agent-generated icons or re-apply them after the hook runs
- `fill="none"` is preserved so hollow icons stay hollow
