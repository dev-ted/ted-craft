# Acceptance tests

On the small preset, the ticket's acceptance criteria are the cases. The implementing agent turns them into executable tests and lists that as one decision. A human reads the assertions in the pull request.

A separate test-writer, and a human read before coding, only when review depth is deep. The implementing agent does not start that writer. A subagent uses the parent model unless the human picks another at launch.

An agent that writes both the code and the tests that judge it, and then treats those tests as sufficient, marks its own work. The human still reads the assertions.

Three to eight per unit of work. Given/when/then at the behaviour boundary. A good acceptance test survives a complete rewrite of the implementation.

Cover: happy path · business edge cases a rewrite must preserve · what must not happen.

Do not write them for internals. The agent still writes its own unit tests underneath.

A failing acceptance test that looks wrong is not a silent edit. Finish the rest of the slice, list the test under decisions for the reviewer, and leave that test red. A change to a merged acceptance test is a listed decision.

Keep a small held-out subset that runs in CI outside the agent's view when the platform allows it. Prefer tests that combine features over tests that exercise them in isolation.

A pass is necessary, not sufficient. Visual or UX acceptance stays as written criteria in review, not brittle automation.

```markdown
# Acceptance: <work item id> <title>

## Happy path

Given _
When _
Then _

## Edge cases a rewrite must preserve

Given _
When _
Then _

## Must not happen

Given _
When _
Then _
```
