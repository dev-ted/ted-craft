# Sentry-oriented React performance checklist

Companion to the main skill. Eight common problem areas (load + runtime).

## Metrics

| Area | Metrics |
|------|---------|
| Load | FCP, LCP, TTI |
| Runtime | INP, frame rate, Profiler duration |
| Stability | CLS |

## 1. Large bundle size

- Production bundler mode (Webpack `mode: 'production'`; Vite prod build)
- Tree-shake; drop unused deps after analyzer review
- Prefer smaller alternatives before adding heavy UI kits
- Enable Brotli/Gzip (usually on via CDN)

## 2. Unoptimized assets

- Images: WebP/AVIF, resize/compress in build or via `next/image`
- Responsive `srcset` / sized containers to avoid CLS
- Fonts: WOFF2 only; subset; avoid many families/weights
- Challenge large media carousels and decorative font stacks

## 3. Unnecessary / slow re-renders

- Profile with React DevTools + Chrome Performance
- Prefer React Compiler; manual `memo` / `useMemo` / `useCallback` only when proven
- Virtualize long lists (windowing)
- Define stable handlers outside render or via proven memoization

## 4. Inefficient state & structure

- Split monolithic components; clear ownership per unit
- Use `Fragment` instead of unnecessary DOM wrappers
- Context for shared data — keep value stable and narrow
- Localize state; avoid global stores for ephemeral UI
- Selectors so components subscribe only to needed slices

## 5. Too many requests & latency

- Cache/dedupe with SWR or TanStack Query
- Parallelize independent fetches; avoid sync blocking
- Debounce search (~300ms); throttle scroll/resize
- Batch analytics; defer non-critical tracking
- SSR/SSG or server fetch when content is known early
- Serve static assets from a CDN

## 6. Unnecessary resource usage

- Web Workers for heavy sort/filter/image work
- `useEffect` cleanup for listeners, intervals, observers
- Prefer CSS (compositor) animations over JS-driven style thrash

## 7. Inefficient loading strategies

- Route/component code splitting
- `React.lazy` + Suspense for below-the-fold / optional UI
- IntersectionObserver for embeds/charts
- `preload` critical fonts; `prefetch` likely next routes
- `loading="lazy"` for offscreen images (or framework Image lazy)

## 8. Slow perceived performance

- `useTransition` / `useDeferredValue` for non-urgent updates (don’t overuse)
- Reserve space for images/ads to cut CLS
- Skeletons/placeholders for feeds
- Loading feedback on slow mutations
- Interaction animations short (≤ ~300ms); don’t over-animate repeats

## Tools quick list

**Measure:** Chrome Performance, Lighthouse/CI, React Profiler, WebPageTest, PageSpeed  
**Debug:** `<Profiler>`, why-did-you-render, React Scan, bundle analyzers  
**Monitor:** RUM / APM (e.g. Sentry performance) in production

## Source

- [React.js Performance Guide (Sentry)](https://blog.sentry.io/react-js-performance-guide/)
