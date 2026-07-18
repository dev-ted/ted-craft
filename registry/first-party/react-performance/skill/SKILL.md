---
name: react-performance
description: >-
  Optimize React and Next.js apps for load time and runtime responsiveness:
  Core Web Vitals, bundle size, re-renders, data fetching, assets, and perceived
  performance. Use when the UI feels slow, Lighthouse/INP/LCP is poor, or the
  user asks to profile, optimize, or improve React performance.
---

# React Performance

Measure first. Fix highest-impact issues. Re-measure.

**Stacks:** React 18/19. Prefer Next.js App Router guidance when `next` is present; otherwise Vite/SPA patterns. Prefer structural fixes and React Compiler over blanket `useMemo`/`useCallback`.

## Workflow

Copy and track:

```
Perf Progress:
- [ ] 1. Baseline metrics (LCP, INP, CLS, FCP; Profiler/Lighthouse)
- [ ] 2. Classify: load vs runtime vs perceived
- [ ] 3. Fix by impact (waterfalls → bundle → server → re-renders)
- [ ] 4. Re-measure same routes/interactions
- [ ] 5. Document what changed and remaining budget
```

### 1. Baseline

Capture before changing code:

| Signal | Tools |
|--------|--------|
| Load (FCP, LCP, TTI) | Lighthouse, PageSpeed, WebPageTest |
| Responsiveness (INP) | Chrome Performance panel, field RUM |
| Layout shift (CLS) | Lighthouse, Performance panel |
| Component cost | React DevTools Profiler |
| Bundle weight | Vite/Webpack analyzer |

Next.js: wire `useReportWebVitals` or Vercel Analytics/Speed Insights when available.

### 2. Prioritize by impact

Apply in this order (highest ROI first):

1. **Eliminate async waterfalls** — `Promise.all`, start fetch early / await late, Suspense boundaries
2. **Shrink JS sent to the client** — no barrel imports, `next/dynamic` / `React.lazy`, defer analytics
3. **Server / CDN path** (Next) — RSC caching, `revalidate` / `use cache`, `next/image`, Cache-Control
4. **Client data** — SWR/TanStack Query dedup; debounce search; throttle scroll/resize
5. **Re-renders** — localize state; split components; memo only where Profiler proves cost
6. **Rendering / perceived** — virtualize long lists; reserve image space; skeletons; `startTransition`

Deep checklists: [references/sentry-checklist.md](references/sentry-checklist.md), [references/vercel-patterns.md](references/vercel-patterns.md).

### 3. Fix rules (defaults)

**Do**

- Parallelize independent awaits; move `await` into branches that need the result
- Import leaf modules, not large barrels (`import { X } from 'lib'` → `import X from 'lib/x'`)
- Keep state close to consumers; subscribe stores selectively (Zustand/Jotai/Redux selectors)
- Lazy-load modals, charts, editors; show Suspense fallbacks
- Prefer CSS animations for transforms/opacity; clean up listeners/timers in `useEffect`
- Cap interaction animations ≤ ~300ms; avoid animating every repeated click

**Don't**

- Sprinkle `useMemo`/`useCallback` without a Profiler hit
- Put frequently changing values in a wide Context that re-renders the tree
- Block first paint with third-party scripts
- Ship oversized images/fonts “for convenience”

### 4. Next.js specifics

When the project uses Next.js App Router:

- Prefer Server Components for data; pass minimal props to Client Components
- Use `next/image` with width/height (or fill + sized parent) to protect CLS
- Use `next/dynamic` for heavy client-only UI
- Cache: `React.cache` for per-request dedupe; route `revalidate` / `'use cache'` where appropriate
- Stream with Suspense; avoid sequential waterfalls across sibling server fetches

Vite/SPA: route-level code splitting, CDN compression (Brotli/Gzip), same client rules.

### 5. Output format

When reporting optimizations:

```markdown
## Performance pass

**Baseline:** [metrics / route]
**Top issues:** [1–3 ranked]
**Changes:** [what + why]
**After:** [same metrics]
**Left on the table:** [optional follow-ups]
```

## Sources

Synthesized for agents (not a verbatim copy):

- [React.js Performance Guide (Sentry)](https://blog.sentry.io/react-js-performance-guide/)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [Image Optimization quickstart](https://vercel.com/docs/image-optimization/quickstart)
- [CDN Cache / Cache-Control](https://vercel.com/docs/caching/cdn-cache)
- [Incremental Static Regeneration](https://vercel.com/docs/incremental-static-regeneration/quickstart)
- [Partial Prerendering](https://vercel.com/docs/partial-prerendering)
- [Web Analytics quickstart](https://vercel.com/docs/analytics/quickstart)
- Vercel React best-practices skill (impact-ordered rules: waterfalls, bundles, RSC, re-renders)
