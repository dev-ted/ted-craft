import { z } from "zod";

const kindSchema = z.enum(["skill", "subagent", "rule", "hook", "bundle"]);

const firstPartySchema = z.object({
  slug: z.string(),
  kind: kindSchema,
  name: z.string(),
  description: z.string(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  author: z.object({ name: z.string(), url: z.string().optional() }),
  license: z.string().optional(),
  artifacts: z.object({
    skill: z.object({ dir: z.string(), name: z.string() }).optional(),
    subagent: z.object({ file: z.string(), name: z.string() }).optional(),
    rule: z.object({ file: z.string() }).optional(),
    hook: z
      .object({ config: z.string(), scriptsDir: z.string().optional() })
      .optional(),
  }),
  source: z.object({ type: z.literal("first-party") }),
  sourceType: z.literal("first-party"),
  path: z.string(),
  cli: z
    .object({
      promptExample: z.string().optional(),
      featured: z.boolean().optional(),
    })
    .optional(),
});

const catalogSchema = z.object({
  slug: z.string(),
  kind: kindSchema,
  name: z.string(),
  description: z.string(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  attribution: z.object({
    author: z.string(),
    repo: z.string(),
    skill: z.string(),
    license: z.string(),
    catalogUrl: z.string(),
  }),
  source: z.object({ type: z.literal("catalog") }),
  sourceType: z.literal("catalog"),
  path: z.string(),
  install: z.object({
    default: z.string(),
    cursor: z.string().optional(),
    claude: z.string().optional(),
    codex: z.string().optional(),
    vscode: z.string().optional(),
  }),
  cli: z.object({ featured: z.boolean().optional() }).optional(),
});

export const registryIndexSchema = z.object({
  generatedAt: z.string(),
  items: z.array(z.union([firstPartySchema, catalogSchema])),
});

export type RegistryIndex = z.infer<typeof registryIndexSchema>;
export type RegistryItem = RegistryIndex["items"][number];
