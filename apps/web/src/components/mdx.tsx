import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { InstallPanel } from '@/components/InstallPanel';
import { CliCommand } from '@/components/CliCommand';
import { AttributionCard } from '@/components/AttributionCard';
import { KindBadge } from '@/components/KindBadge';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    InstallPanel,
    CliCommand,
    AttributionCard,
    KindBadge,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
