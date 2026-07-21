import type { RegistryIndex, RegistryItem } from './registry-types';
import registryJson from '@/data/registry.json';

export type { RegistryIndex, RegistryItem };

/** Matches packages/validate generate-docs public-docs exclusions. */
const DOCS_EXCLUDED_CATEGORIES = new Set(['meta']);
const DOCS_EXCLUDED_SLUGS = new Set(['0xdesign/design-lab']);

export function loadRegistryIndex(): RegistryIndex {
  return registryJson as RegistryIndex;
}

/** Whether this item has a generated page under /docs/registry. */
export function hasPublicDocs(item: RegistryItem): boolean {
  if (DOCS_EXCLUDED_CATEGORIES.has(item.category)) return false;
  if (DOCS_EXCLUDED_SLUGS.has(item.slug)) return false;
  return true;
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
