---
name: click-up-maintainer
description: >-
  Create, update, search, and manage ClickUp tasks, lists, comments, tags,
  dependencies, and time tracking via ClickUp MCP. Use when the user mentions
  ClickUp, tasks, cards, tickets, backlog items, sprint work, assignees, due
  dates, or wants to triage, create, move, or update work items.
---

# ClickUp Maintainer

Manage ClickUp work items through the **ClickUp MCP server** (`user-clickup`). Always use MCP tools — never guess task IDs or list IDs.

## Prerequisites

1. ClickUp MCP must be connected in Cursor (server: `user-clickup`, status: ready).
2. If tools are missing, tell the user to enable the ClickUp MCP integration and authenticate.
3. Before calling any tool, use `GetMcpTools` with `server: "user-clickup"` when schema is unknown.

## Invocation modes

| Mode | When | Action |
|------|------|--------|
| **Direct** | Simple single-task ops in chat | Follow workflows below using `CallMcpTool` |
| **Subagent** | Bulk triage, multi-list updates, complex planning | Launch custom agent `click-up-maintainer` from `~/.cursor/agents/` or delegate with Task tool |

## Core rules

1. **Resolve before mutate** — Find tasks/lists by name with `clickup_search` or `clickup_get_list` before create/update/delete.
2. **Confirm destructive actions** — Always confirm with the user before `clickup_delete_task`, `clickup_merge_tasks`, or bulk status changes.
3. **Prefer custom task IDs** — IDs like `DEV-1234` work everywhere; include them in summaries and links when returned.
4. **Assignees need resolution** — Convert emails, usernames, or `"me"` via `clickup_resolve_assignees` before filter/search tools that require numeric user IDs.
5. **Tags must exist** — Tags are space-scoped; adding a tag fails if it doesn't exist in that space.
6. **List is required for create** — `clickup_create_task` needs `list_id`. Ask which list if unclear, or use defaults below.
7. **Markdown descriptions** — Use `markdown_description` on tasks and Markdown in `clickup_create_comment`.
8. **Report results clearly** — After mutations, return task name, ID/custom ID, list, status, assignees, and ClickUp URL if provided.

## Default targets (edit for your workspace)

Fill these in after first `clickup_get_workspace_hierarchy` run, or leave blank and always ask:

| Setting | Value |
|---------|-------|
| Default space | _(e.g. Engineering)_ |
| Default list | _(e.g. Backlog)_ |
| Default list_id | _(numeric ID)_ |
| Default assignee | `me` |
| Task URL pattern | `https://app.clickup.com/t/{task_id}` |

## Decision tree: find vs filter vs get

```
Need one task by ID/custom ID?     → clickup_get_task
Keyword search across workspace?   → clickup_search
Structured filters (status, tags,  → clickup_filter_tasks
  assignee, dates, lists)?
Need list/folder/space ID?        → clickup_get_list / clickup_get_folder
Full workspace tree?             → clickup_get_workspace_hierarchy
```

## Common workflows

### Create a task (card)

```
Task Progress:
- [ ] Resolve list_id (clickup_get_list or defaults)
- [ ] Resolve assignees if needed (clickup_resolve_assignees)
- [ ] Fetch custom fields if required (clickup_get_custom_fields)
- [ ] Create task (clickup_create_task)
- [ ] Add tags / dependencies / comment if requested
- [ ] Summarize result with task ID and link
```

**Good task description template** (use in `markdown_description`):

```markdown
## Context
Why this work exists.

## Acceptance criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Notes
Links, repo paths, or related tickets.
```

### Update a task

1. `clickup_search` or `clickup_get_task` to locate it
2. `clickup_update_task` with only changed fields (status, priority, due_date, assignees, etc.)
3. Use `clickup_create_comment` for audit trail on significant changes

### Triage / find my work

1. `clickup_resolve_assignees` with `["me"]`
2. `clickup_filter_tasks` with assignee IDs + status filters, **or** `clickup_search` with keywords + assignee filter
3. Present as a table: Name | ID | Status | Priority | Due | List

### Move or reorganize

| Goal | Tool |
|------|------|
| Change home list | `clickup_move_task` |
| Also show in another list | `clickup_add_task_to_list` |
| Remove from extra list | `clickup_remove_task_from_list` |
| Merge duplicates | `clickup_merge_tasks` (confirm first) |
| Subtask | `clickup_create_task` with `parent` set |

### Dependencies and links

| Relationship | Tool |
|--------------|------|
| Blocks / waiting on | `clickup_add_task_dependency` |
| Related (non-blocking) | `clickup_add_task_link` |
| Remove dependency | `clickup_remove_task_dependency` |
| Remove link | `clickup_remove_task_link` |

### Time tracking

| Action | Tool |
|--------|------|
| Start timer | `clickup_start_time_tracking` |
| Stop timer | `clickup_stop_time_tracking` |
| Manual entry | `clickup_add_time_entry` (start + duration or end) |
| View entries | `clickup_get_time_entries` |

Date/time format: `YYYY-MM-DD` or `YYYY-MM-DD HH:MM` in user timezone.

### Comments and attachments

| Action | Tool |
|--------|------|
| Add comment | `clickup_create_comment` |
| Read comments | `clickup_get_task_comments` |
| Thread replies | `clickup_get_threaded_comments` |
| Attach URL file | `clickup_attach_task_file` with `file_url` |
| Attach local file | `clickup_request_attachment_upload` then upload |
| Download attachment | `clickup_get_task` with `include: ["attachments"]`, then `clickup_download_task_attachment` (URL expires ~5 min — fetch once immediately) |

## Bulk operations

For 5+ tasks or cross-list updates:

1. Gather task IDs first (search/filter)
2. Show planned changes as a checklist
3. Get user confirmation
4. Execute sequentially; stop and report on first hard failure
5. Summarize: succeeded, skipped, failed

## Error handling

| Error | Response |
|-------|----------|
| MCP auth failure | Ask user to re-authenticate ClickUp MCP |
| Tag doesn't exist | List available tags or create in ClickUp UI first |
| Required custom field | Call `clickup_get_custom_fields`, prompt user for values |
| Ambiguous task name | Show top matches; ask user to pick |
| delete/merge | Never proceed without explicit confirmation |

## Tool reference

For the full MCP tool catalog and parameter notes, see [mcp-tools.md](mcp-tools.md).
