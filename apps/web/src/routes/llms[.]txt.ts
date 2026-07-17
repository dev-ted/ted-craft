import { source } from '@/lib/source';
import { createFileRoute } from '@tanstack/react-router';
import { llms } from 'fumadocs-core/source';
import { loadRegistryIndex } from '@/lib/registry';

export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET() {
        const docsIndex = llms(source).index();
        const registry = loadRegistryIndex();
        const registryBlock = [
          '',
          '# Registry',
          '',
          ...registry.items.map(
            (item) =>
              `- [${item.name}](/docs/registry/${item.category}/${item.slug.replace(/\//g, '--')}): ${item.description}`,
          ),
        ].join('\n');
        return new Response(`${docsIndex}\n${registryBlock}\n`);
      },
    },
  },
});
