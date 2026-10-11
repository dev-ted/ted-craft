# Optimise agents

Better output and fewer tokens come from the smallest high-signal context, not from a bigger model or a longer prompt. Recall drops as the token count grows. A safe working range is about 60 percent of the window.

## Habits

- Keep the instructions file lean. Every line loads on every message. Move occasional patterns into on-demand skills.
- Scope the context to the task. Prefer just-in-time file reads over pre-loading the repo.
- Match model and effort to the task. A cheap model for mechanical edits. The strongest for architecture. Lower reasoning effort for simple work.
- Batch related work. One context load for three related changes beats three separate loads.
- Start fresh instead of continuing a long thread. After 20 to 30 messages, summarise decisions and open threads, drop redundant tool output, and start clean.
- Use sub-agents for the token win on parallel or isolated work. Each sub-agent is a full context reload. Do not use them for sequential steps that could share one context.
- Let the agent take notes on long work. A progress file it can re-read beats keeping everything in the conversation. Progress files may be pruned. Decision records may not.
- Front-load the stable stuff so it caches: system prompt, instructions file, project files. Keep them unchanged mid-session so you do not invalidate the cache.
- Measure before you optimise. Watch recurring or automated jobs. They drain budget silently.

## Compact vs clear

Compaction summarises the thread and keeps going. Use it in the middle of a task. A clear, or a new chat, drops the context. Use it when you move to something unrelated.

Compact before quality drops, not after. Somewhere around 60 to 80 percent of the window. Tell it what to keep: five to ten specific things. Check the summary. Ask the agent to restate where things stand and what is still open.

Use the tool's compact command in the middle of a task, and start a new session when the task changes. Command names differ by tool.

## Optional model routing

Not every task needs your best model. This part is optional. Record the choice in the project profile. It adds nothing to the guardrails or the definition of done.

Commit two or three agent definitions. Put a cheap fast model on mechanical work. Keep the strong model for the orchestrator session. The gate stack, not the model, confirms the mechanical work is right.

Four questions for the cheap tier:

1. Is correctness mechanically verifiable by `check:file` / `check:change`?
2. Is there a reference to match, or does structure have to be invented?
3. Does the change cross a contract boundary?
4. How ambiguous is the brief?

Work that passes those tests rarely repays a stronger model.

Three things lose the saving:

1. A definition that omits the model field inherits the invoking agent's model.
2. The built-in exploration agent is high-volume, low-stakes, and often inherits the expensive model. Pin it cheap.
3. Runtime overrides outrank committed files in some tools. Committed definitions get reviewed in a pull request. A runtime choice does not.

Log escalations: work assigned to the cheap model and redone on a stronger one. Use an optional `model:` label on the pull request. After a few months the routing rule comes from your own numbers.

Copy [worker-light.md](worker-light.md) into the tool's agents directory when routing is on. A subagent uses the parent model unless the human picks a cheaper one at launch. Do not promise a cheaper model when the tool cannot store one on the file.
