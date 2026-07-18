# Vercel / Next.js high-impact patterns

Apply when `next` is in the project. Ordered by typical impact.

## Critical — eliminate waterfalls

- Start independent promises together; `await Promise.all([...])`
- Move `await` into branches that actually need the data
- Use Suspense to stream slower segments without blocking the shell
- In route handlers: kick off work early, await late

## Critical — bundle size

- Avoid barrel-file re-exports that pull entire packages
- `next/dynamic` (or `React.lazy`) for heavy client components
- Defer analytics/logging until after hydration / idle
- Load feature modules only when the feature activates
- Prefetch on hover/focus for likely navigations

## High — server-side

- Authenticate Server Actions like API routes
- `React.cache()` for per-request deduplication
- Minimize props serialized to Client Components
- Hoist static I/O (fonts, logos) to module scope
- Parallelize fetches by restructuring Server Components
- `after()` for non-blocking post-response work when available

## Medium-high — client data

- SWR / TanStack Query for dedup and cache
- Passive listeners for scroll; one shared listener where possible
- Version and minimize `localStorage` payloads

## Medium — re-renders & rendering

- Don’t subscribe to state only used inside event handlers
- Hoist default non-primitive props; no components defined inside components
- Derive booleans during render; avoid effect→setState loops
- Functional `setState`; lazy `useState(() => expensive())`
- `startTransition` / `useDeferredValue` for expensive UI behind input
- `content-visibility` for long static-ish lists
- Prefer ternary over `&&` when left side can be `0`
- Resource hints (`preload` / `prefetch`) for critical assets

## Platform features

- `next/image` with explicit dimensions (or fill + sized parent)
- `useReportWebVitals` + Vercel Analytics / Speed Insights
- CDN caching via `Cache-Control` / `CDN-Cache-Control` on route handlers
- ISR / `revalidate` / `'use cache'` + Suspense for PPR-style shells
- Prefer Fluid Compute / Node for functions; don’t assume Edge for everything

## Quick anti-patterns

| Avoid | Prefer |
|-------|--------|
| Sequential `await a; await b` when independent | `Promise.all` |
| `import { Icon } from 'icons'` barrel | Direct path import |
| Passing full DB rows to client | Narrow DTOs |
| Unsized `<img>` | `next/image` + dimensions |
| Eager chart/editor in initial JS | Dynamic import |

## Sources

- [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [Image Optimization quickstart](https://vercel.com/docs/image-optimization/quickstart)
- [CDN Cache / Cache-Control](https://vercel.com/docs/caching/cdn-cache)
- [Incremental Static Regeneration](https://vercel.com/docs/incremental-static-regeneration/quickstart)
- [Partial Prerendering](https://vercel.com/docs/partial-prerendering)
- [Web Analytics quickstart](https://vercel.com/docs/analytics/quickstart)
- Vercel React best-practices skill (Cursor plugin: impact-ordered React/Next rules)
