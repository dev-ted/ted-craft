import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { AttributionCard } from "@/components/AttributionCard";
import { CliCommand } from "@/components/CliCommand";
import { CodeBlock } from "@/components/CodeBlock";
import { KindBadge } from "@/components/KindBadge";
import { RegistryInstallPreview } from "@/components/RegistryInstallPreview";

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    CliCommand,
    AttributionCard,
    KindBadge,
    CodeBlock,
    RegistryInstallPreview,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
