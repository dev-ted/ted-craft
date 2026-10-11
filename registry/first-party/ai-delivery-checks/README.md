# AI Delivery Checks

The check contract is the same for every coding agent:

- Run `check:file` on an edited file.
- Run `check:change` before reporting done.
- If the script is missing, or the runner cannot start, say so and continue. Do not invent a linter.
- If `check:change` fails, do not report done. Do not edit a test, a ratchet, or the hook to make it pass.
- A hard stop may end the turn while checks are still red. Write `.ai-delivery/hard-stop.json` as `{"stop":1,"reason":"one line"}` with `stop` from 1 to 7. Do not commit that file. CI still blocks the merge.

When the agent tool can run a hook, this package wires that contract. A tool with no hooks still follows it: the agent runs `check:change` itself.

## Install

This is a **hook**. Run the command in the **app project** that should get `.cursor/`, not as a global skill install.

```bash
npx ted-craft add ai-delivery-checks -a cursor -y
```

That writes:

- `.cursor/hooks.json` — `afterFileEdit` and `stop` entries (merged with hooks you already have)
- `.cursor/hooks/ai-delivery-checks.mjs` — the runner

Wire the scripts first (or right after), or the hook will fail open:

```json
{
  "scripts": {
    "check:file": "your formatter and linter for one file",
    "check:change": "typecheck, lint, and tests for the change"
  }
}
```

Use bun, npm, pnpm, or yarn. The hook picks the runner from the lockfile. You can also put Node scripts at `scripts/check-file.mjs` / `scripts/check-change.mjs` or `.ai-delivery/check-file.mjs` / `.ai-delivery/check-change.mjs`.

## What the hook does

- After a file edit, it runs `check:file`. A failure is extra context. The edit is already on disk.
- When the agent stops, it runs `check:change`. A real failure exits 2 so the agent can fix and try again, up to eight times.
- A missing script, a hook crash, or a runner that cannot start exits 0 and says the checks are not wired.
- If `.ai-delivery/hard-stop.json` names a stop from 1 to 7 and a one-line reason, the hook still prints the red checks and exits 0. Add that path to the project's ignore file. A false marker breaks the test rule. It does not make a red pull request mergeable.

Skipped paths: `node_modules`, `.git`, `dist`, `coverage`, `.next`, `build`.

## Safety

Local-only:

- No network, no `eval`, no remote imports
- Spawn is allowlisted: `bun` / `npm` / `pnpm` / `yarn` with `run <script>`, or `node` on an allowlisted `.mjs` inside the workspace
- `shell` is never true
- File paths must resolve inside a workspace root
- Missing scripts and unexpected errors fail open (exit 0) so a broken hook never bricks the agent
- `check:change` failure is the one intentional block (exit 2)

This hook uses `child_process.spawnSync` for one reason: the delivery pack requires the agent to run the project's own checks. Review the script on this page before you install. Hooks run on your machine.

## Caveats

- You must define `check:file` and `check:change`. The hook does not create them.
- `check:file` should be idempotent. A formatter that rewrites the file will fire `afterFileEdit` again. A second clean run should no-op.
- Name the scripts `check:file` and `check:change`. Do not name them after a tier number.
