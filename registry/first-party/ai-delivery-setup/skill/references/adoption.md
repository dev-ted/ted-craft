# Adopting an existing codebase

Use this when the profile says the codebase is existing. The rules in `ai-delivery-guardrails` do not change. The order of prep does.

1. Write an as-found note before you commit behaviour changes. Record the commands, the branch layout, where tests are flaky, and where UI bypasses the design system. A human corrects it before anything else changes.
2. Turn on what does not require the legacy tree to be clean: branch protection, labels, the instructions file, and the check command names.
3. Do not turn on a gate that fails the whole legacy tree. A ratchet records those old failures so only new failures block. A human adds ratchet entries. The agent never adds one, and never adds an inline disable.
4. Type only the boundary the next increment crosses. Pin a module with no tests using the pin rule in the setup skill. Do not invent a contract the code never had.
5. One agent works the repository until the codebase map names owners and the first boundary is typed.
6. Do not refactor legacy code to make the map tidier. New code uses the target pattern. Changed code moves to it only when the task says so.

Feature work starts only after a person signs off the as-found note, the map, and the check commands.
