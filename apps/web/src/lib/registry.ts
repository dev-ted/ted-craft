import type { RegistryIndex, RegistryItem } from './registry-types';
import registryJson from '@/data/registry.json';

export type { RegistryIndex, RegistryItem };

export function loadRegistryIndex(): RegistryIndex {
  return registryJson as RegistryIndex;
}

export function docsPathForItem(item: RegistryItem): string {
  const slug = item.slug.replace(/\//g, '--');
  return `/docs/registry/${item.category}/${slug}`;
}

export function installCommands(item: RegistryItem): {
  cursor: string;
  claude: string;
  codex: string;
  default: string;
} {
  if (item.sourceType === 'catalog') {
    return {
      cursor: item.install?.cursor ?? item.install?.default ?? '',
      claude: item.install?.claude ?? item.install?.default ?? '',
      codex: item.install?.codex ?? item.install?.default ?? '',
      default: item.install?.default ?? '',
    };
  }
  return {
    cursor: `npx ted-craft add ${item.slug} -a cursor -g -y`,
    claude: `npx ted-craft add ${item.slug} -a claude -g -y`,
    codex: `npx ted-craft add ${item.slug} -a codex -g -y`,
    default: `npx ted-craft add ${item.slug} -g -y`,
  };
}
