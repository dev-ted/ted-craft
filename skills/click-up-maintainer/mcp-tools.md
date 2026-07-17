# ClickUp MCP Tool Reference

Server ID: `user-clickup`

Always inspect schemas with `GetMcpTools` before calling unfamiliar tools.

## Discovery & hierarchy

| Tool | Use when |
|------|----------|
| `clickup_get_workspace_hierarchy` | Need spaces → folders → lists tree |
| `clickup_get_list` | Resolve list name → list_id |
| `clickup_get_folder` | Resolve folder name → folder_id |
| `clickup_get_workspace_members` | Need full member list |
| `clickup_find_member_by_name` | Quick member lookup |
| `clickup_resolve_assignees` | Convert email/username/`me` → numeric user IDs |
| `clickup_get_custom_fields` | Required or optional fields on a list |

## Search & read

| Tool | Use when |
|------|----------|
| `clickup_search` | Keyword search across tasks, docs, chats, etc. |
| `clickup_filter_tasks` | Filter by status, tags, lists, assignees, dates |
| `clickup_get_task` | Single task; use `include` for attachments, subtasks, custom_fields, dependencies |
| `clickup_get_task_comments` | Read comments; check `reply_count` |
| `clickup_get_threaded_comments` | Fetch replies to a comment |
| `clickup_get_task_time_in_status` | Time spent in each status |
| `clickup_get_bulk_tasks_time_in_status` | Same for multiple tasks |

## Tasks — create & update

| Tool | Use when |
|------|----------|
| `clickup_create_task` | New task/card (requires `name`, `list_id`) |
| `clickup_update_task` | Patch status, priority, dates, assignees, description |
| `clickup_delete_task` | Delete (confirm first) |
| `clickup_move_task` | Change home list |
| `clickup_merge_tasks` | Merge sources into target (confirm first) |

### `clickup_create_task` key fields

- `name`, `list_id` — required
- `markdown_description`, `status`, `priority` (`urgent`|`high`|`normal`|`low`)
- `due_date`, `start_date` — `YYYY-MM-DD` or `YYYY-MM-DD HH:MM`
- `parent` — create as subtask
- `assignees` — user IDs (resolve first)
- `tags` — must exist in space
- `task_type` — e.g. Bug, Feature (must exist in workspace)
- `custom_fields` — array of `{ id, value }`
- `time_estimate` — minutes as string

## Lists, folders, spaces

| Tool | Use when |
|------|----------|
| `clickup_create_list` | New list in a space |
| `clickup_create_list_in_folder` | New list in a folder |
| `clickup_create_folder` | New folder in a space |
| `clickup_update_list` | Rename or change list settings |
| `clickup_update_folder` | Rename folder |

## Task relationships

| Tool | Use when |
|------|----------|
| `clickup_add_task_dependency` | `waiting_on` or `blocking` |
| `clickup_remove_task_dependency` | Remove dependency |
| `clickup_add_task_link` | Non-blocking association |
| `clickup_remove_task_link` | Remove link |
| `clickup_add_task_to_list` | Task in multiple lists |
| `clickup_remove_task_from_list` | Remove from extra list |

## Tags

| Tool | Use when |
|------|----------|
| `clickup_add_tag_to_task` | Tag must exist in space |
| `clickup_remove_tag_from_task` | Remove tag |

## Comments

| Tool | Use when |
|------|----------|
| `clickup_create_comment` | Task/list/view comment; supports Markdown; `reply_to_id` for threads |

## Time tracking

| Tool | Use when |
|------|----------|
| `clickup_start_time_tracking` | Start timer on task |
| `clickup_stop_time_tracking` | Stop active timer |
| `clickup_get_current_time_entry` | Check running timer |
| `clickup_add_time_entry` | Manual entry: `start` + `duration` or `end_time` |
| `clickup_get_time_entries` | List entries for task/user/date range |

## Attachments

| Tool | Use when |
|------|----------|
| `clickup_attach_task_file` | URL or small base64 file |
| `clickup_request_attachment_upload` | Local file upload flow |
| `clickup_download_task_attachment` | Short-lived URL (~5 min, single-use on private workspaces) |

## Docs (ClickUp Docs)

| Tool | Use when |
|------|----------|
| `clickup_create_document` | New doc |
| `clickup_create_document_page` | Add page |
| `clickup_list_document_pages` | Page structure |
| `clickup_get_document_pages` | Page content |
| `clickup_update_document_page` | Edit page |

## Chat & reminders

| Tool | Use when |
|------|----------|
| `clickup_get_chat_channels` | List channels |
| `clickup_get_chat_channel_messages` | Read messages |
| `clickup_send_chat_message` | Post or reply |
| `clickup_create_reminder` | Personal reminder |
| `clickup_search_reminders` | Find reminders |
| `clickup_update_reminder` | Edit reminder |

## ID conventions

- Regular numeric IDs and **custom IDs** (e.g. `DEV-1234`) both work for most task tools.
- Search/filter tools that take assignees need **numeric user IDs** — always resolve first.
- List/space/folder IDs are numeric strings from hierarchy or get_* tools.
