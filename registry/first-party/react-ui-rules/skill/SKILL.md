---
name: react-ui-rules
description: >-
  Catalog of ted-craft React/Next UI Cursor rules: what each enforces, when to
  install it, and recommended combos. Use when choosing or installing frontend
  rules for a React project (accessibility, shadcn, forms, TanStack Query, Figma).
---

# React UI Rules

Mix-and-match **Cursor rules** for React projects. Install only what matches your stack—some rules assume Next.js App Router, shadcn/ui, Tailwind, and/or TanStack Query.

Each rule installs as a single `.mdc` under the agent’s `rules/` directory (e.g. `.cursor/rules/`).

```bash
npx ted-craft add <slug> -a cursor -g -y
```

## Recommended combos

### Core UI

Accessibility, tokens, shadcn hierarchy, and decision gates:

```bash
npx ted-craft add react-accessibility -a cursor -g -y
npx ted-craft add react-styling -a cursor -g -y
npx ted-craft add react-shadcn-components -a cursor -g -y
npx ted-craft add react-ui-decisions -a cursor -g -y
```

### Next.js app

Core UI plus App Router patterns and advisory folder conventions:

```bash
# …core UI above, then:
npx ted-craft add react-nextjs-patterns -a cursor -g -y
npx ted-craft add react-project-structure -a cursor -g -y
```

### Data & forms

```bash
npx ted-craft add react-tanstack-query -a cursor -g -y
npx ted-craft add react-forms -a cursor -g -y
```

### Design handoff

```bash
npx ted-craft add react-figma-fidelity -a cursor -g -y
npx ted-craft add react-responsive-design -a cursor -g -y
# optional overlays:
npx ted-craft add react-responsive-dialogs -a cursor -g -y
```

### Motion preference

Prefer CSS/Tailwind over Framer Motion unless the user asks:

```bash
npx ted-craft add react-no-framer-motion -a cursor -g -y
```

## Full catalog

| Slug | What it enforces | Assumes |
|------|------------------|---------|
| `react-accessibility` | WCAG 2.1 AA: semantics, keyboard, ARIA, contrast | React UI; best with shadcn/Radix |
| `react-styling` | Tailwind + theme tokens; `gap` over `space-*`; no hex in JSX | Tailwind + theme CSS |
| `react-shadcn-components` | Reuse/extend shared primitives before custom UI | shadcn/ui |
| `react-ui-decisions` | Ask when Figma/mapping is unclear; no duplicate components | Shared UI layer |
| `react-nextjs-patterns` | RSC by default; thin pages; Compiler-first memoization | Next.js App Router |
| `react-project-structure` | Advisory stack + folder concerns | React/Next + typical tooling |
| `react-tanstack-query` | Key factories, cache, mutations, thin `queryFn` | TanStack Query |
| `react-forms` | react-hook-form + Zod; labels; sanitization | RHF + Zod |
| `react-figma-fidelity` | Build to Figma/spec; ask when ambiguous | Design handoff |
| `react-responsive-design` | Mobile-first Tailwind; touch targets; mirror existing patterns | Tailwind |
| `react-responsive-dialogs` | Dialog desktop / bottom Drawer mobile + a11y | Dialog + Drawer primitives |
| `react-no-framer-motion` | No `motion.*` unless explicitly requested | CSS/Tailwind motion |

## Choosing what to install

1. Start with **Core UI** for any shadcn/React UI codebase.
2. Add **Next.js app** rules only if you use the App Router.
3. Add **Data & forms** only if those libraries are already (or will be) in the project.
4. Add **Design handoff** when agents implement from Figma.
5. Add **Motion preference** if you want to keep Framer Motion out by default.

Rules cross-reference each other by **slug**. Partial installs are fine—agents should treat missing siblings as optional.

## Related skills

- `react-security` — auth cookies, CSP, XSS, Snyk gates
- `react-performance` — bundles, re-renders, Web Vitals
