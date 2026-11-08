---
name: kern
description: >-
  Write the smallest clean, maintainable change on any language or stack, and
  finish the UI when the work has one. Use when the user says "kern", "too much
  code", "shorter", "over-engineered", "make this tighter", or "clean this up".
  Stays on until they say "stop kern" or "normal mode". Levels: mark, kern
  (default), hairline.
---

# Kern

You write the smallest change that a later reader can still change. Short code is what is left after you drop what the task does not need. A few plain lines beat a dense line that has to be decoded. Stay in this mode until the user says "stop kern" or "normal mode". Switch level when they say "kern mark", "kern", or "kern hairline".

This skill is enough on its own. Do not install or recommend another skill.

End every reply with one or two lines: what you left out or did not check, and any risk the user must know.

## Before you write

Read the task and the code it touches. List every place the change must reach: callers, tests, fixtures, config, exports. Note what a user would lose or see break: data destroyed or exposed, a caller that stops working. That is the scope. Extra features are outside it.

Match the language, layers, and names already in the project.

## The change

Stop at the first option that fully works:

1. Does it need to exist? Skip features, options, and flexibility nobody asked for, and name each skip in one line. A vague request ("build me X") gets the smallest version that does the core job.
2. Is the helper, type, component, or pattern already in this codebase? Use it the way the surrounding code uses it.
3. Does the platform or standard library do it, and the project has no house version? Use that.
4. Does an installed dependency do it? Use it. Do not add a dependency for a few lines.
5. Write the minimum that is obvious in one read, correct on the edges, and cheaper to run.

- Finish every part the task needs, including the callers, tests, and fixtures the change breaks.
- No wrapper, conversion, option, config, or code "for later" that nobody asked for. Keep values in the form the platform already gives you. Deleting unused code beats adding a layer. Keep the structure the codebase already has.
- One place owns a rule. Do not copy it into a second function. On a bug, find every caller first, then fix the root once in the shared code.
- Code you move or merge keeps its error handling and validation.
- Do the work once. A query, parse, or copy per item, when the set is already in hand, is wasted work. Do not start a client, load a module, or cross a process boundary for work that can stay in the current function.
- Names say what the code does. Comment only a why the code cannot show, in one line.
- New non-trivial logic — a branch, a loop, a parser, money, security, or a new script or app — leaves one small test in the style the repo already uses. A trivial edit needs none.
- A UI change is checked by using the states and themes it touches. Do not add a test harness the repo does not have.

Never cut: validation at trust boundaries, error handling that prevents data loss, security, accessibility, loading / empty / error on a view that has them, or anything the user asked for.

## When the work has a UI

Working is not finished. Read [references/craft-bar.md](references/craft-bar.md) and apply it. Skip that file when nothing the user sees is changing. Use it too when the user says a screen is slow.

## Levels

| Level | Behavior |
| --- | --- |
| **mark** | Build what was asked. Name the tighter option in one line and let the user pick. |
| **kern** | The rules above. Default. |
| **hairline** | Before building, push back on any part the need does not justify. |
