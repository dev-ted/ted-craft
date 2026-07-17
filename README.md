# cursor-config

Personal Cursor configuration synced via GitHub — skills, subagents, and setup scripts.

## Contents

| Path | Purpose |
|------|---------|
| `skills/click-up-maintainer/` | ClickUp MCP skill (task/card management) |
| `agents/click-up-maintainer.md` | ClickUp subagent for bulk triage and complex ops |
| `scripts/install.ps1` | Install/sync to `~/.cursor/` on Windows |
| `scripts/install.sh` | Install/sync to `~/.cursor/` on macOS/Linux |

## Quick install

### Windows (PowerShell)

```powershell
git clone https://github.com/dev-ted/cursor-config.git
cd cursor-config
.\scripts\install.ps1
```

### macOS / Linux

```bash
git clone https://github.com/dev-ted/cursor-config.git
cd cursor-config
chmod +x scripts/install.sh
./scripts/install.sh
```

Restart Cursor after installing.

## Usage

### Skill (auto-discovered)

The agent loads `click-up-maintainer` when you mention ClickUp, tasks, cards, tickets, backlog, etc.

Example prompts:

- "Create a ClickUp task for fixing the login bug in the Backend list"
- "Show my open ClickUp tasks due this week"
- "Move DEV-1234 to In Progress and assign to me"
- "Add a comment on the auth refactor task with today's progress"

### Subagent (explicit)

In chat, invoke the custom agent by name or ask Cursor to use the **click-up-maintainer** agent for bulk work:

- "Use click-up-maintainer to triage all unassigned bugs in Engineering"
- "Have the ClickUp maintainer create tasks from this meeting notes list"

## Sync across laptops

1. Clone this repo on each machine
2. Run the install script (copies skills + agents into `~/.cursor/`)
3. Pull updates when you change the repo: `git pull && ./scripts/install.ps1`

Optional: symlink instead of copy — edit the install script if you prefer live sync from the clone.

## Prerequisites

- [Cursor](https://cursor.com) with MCP enabled
- **ClickUp MCP** connected (`user-clickup` server)

## Customize defaults

Edit the "Default targets" table in `skills/click-up-maintainer/SKILL.md` with your preferred space, list, and list_id after running workspace hierarchy once.

## Adding more skills

```text
cursor-config/
├── skills/
│   └── your-skill/
│       └── SKILL.md
└── agents/
    └── your-agent.md
```

Re-run the install script after adding new files.
