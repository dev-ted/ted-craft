import { loader } from 'fumadocs-core/source';
import type { DocMethods } from 'fumadocs-mdx/runtime/types';
import { docs } from 'collections/server';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docsRoute } from './shared';

export const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: docsRoute,
  plugins: [lucideIconsPlugin()],
});

export function markdownPathToSlugs(segs: string[]) {
  if (segs.length === 0) return [];

  const out = [...segs];
  out[out.length - 1] = out[out.length - 1].replace(/\.md$/, '');
  if (out.length === 1 && out[0] === 'index') out.pop();
  return out;
}

export function slugsToMarkdownPath(slugs: string[]) {
  const segments = [...slugs];
  if (segments.length === 0) {
    segments.push('index.md');
  } else {
    segments[segments.length - 1] += '.md';
  }

  return {
    segments,
    url: `${docsRoute}/${segments.join('/')}`,
  };
}

export async function getLLMText(page: (typeof source)['$inferPage']) {
  // Generated collections are @ts-nocheck, so loader page data falls back to
  // PageData without DocMethods — narrow for includeProcessedMarkdown.
  const data = page.data as typeof page.data & DocMethods;
  const processed = await data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}
