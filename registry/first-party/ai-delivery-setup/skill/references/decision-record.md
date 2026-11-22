# Decision record

Use a file only when future work must follow the choice. Most reversible decisions stay in the pull request body, under "decisions requested of the reviewer".

One short file per decision in `docs/decisions/`. It lands in the pull request that first acts on it. A separate pull request only when the decision must precede the work (project-level approach note, or a change to the architecture).

Name the file `DR-PENDING-<slug>.md` until a pull request number exists. Rename it to `DR-<number>-<slug>.md` in that same pull request before the first push.

Status: `proposed` | `accepted` | `superseded by <id>` | `deprecated` (with reason). Once accepted, nobody edits the body. A change is a new record that supersedes the old one. The one permitted edit to an accepted record is the status line. Nothing is deleted.

```markdown
# DR-PENDING-<slug>: <title>

- Date: YYYY-MM-DD
- Status: proposed
- Approved by: _

## Context

_

## Decision

_

## Alternatives considered

_

## Consequences

_
```
