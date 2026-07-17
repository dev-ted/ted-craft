import { createFileRoute } from '@tanstack/react-router';
import { source, getLLMText } from '@/lib/source';
import { loadRegistryIndex } from '@/lib/registry';

export const Route = createFileRoute('/llms-full.txt')({
  server: {
    handlers: {
      GET: async () => {
        const scan = source.getPages().map(getLLMText);
        const scanned = await Promise.all(scan);
        const registry = loadRegistryIndex();
        const registryDump = [
          '# ted-craft registry index',
          '',
          JSON.stringify(registry, null, 2),
        ].join('\n');
        return new Response([...scanned, registryDump].join('\n\n'));
      },
    },
  },
});
