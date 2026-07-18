import { z } from "zod";

export const kindSchema = z.enum(["skill", "subagent", "rule", "hook", "bundle"]);

export const authorSchema = z.object({
  name: z.string().min(1),
  url: z.string().url().optional(),
});

export const artifactsSchema = z.object({
  skill: z
    .object({
      dir: z.string().min(1),
      name: z.string().min(1),
    })
    .optional(),
  subagent: z
    .object({
      file: z.string().min(1),
      name: z.string().min(1),
    })
    .optional(),
  rule: z
    .object({
      file: z.string().min(1),
    })
    .optional(),
  hook: z
    .object({
      config: z.string().min(1),
      scriptsDir: z.string().optional(),
    })
    .optional(),
});

export const firstPartyManifestSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  kind: kindSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  author: authorSchema,
  license: z.string().optional(),
  docs: z
    .object({
      readme: z.string().optional(),
    })
    .optional(),
  artifacts: artifactsSchema,
  source: z.object({ type: z.literal("first-party") }),
  cli: z
    .object({
      promptExample: z.string().optional(),
      featured: z.boolean().optional(),
    })
    .optional(),
});

export const catalogEntrySchema = z.object({
  slug: z.string().min(1),
  kind: kindSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  attribution: z.object({
    author: z.string().min(1),
    repo: z.string().min(1),
    skill: z.string().min(1),
    license: z.string().min(1),
    catalogUrl: z.string().url(),
  }),
  source: z.object({ type: z.literal("catalog") }),
  install: z.object({
    default: z.string().min(1),
    cursor: z.string().optional(),
    claude: z.string().optional(),
    codex: z.string().optional(),
    vscode: z.string().optional(),
  }),
  cli: z
    .object({
      featured: z.boolean().optional(),
    })
    .optional(),
});

export const registryIndexEntrySchema = z.discriminatedUnion("sourceType", [
  firstPartyManifestSchema.extend({
    sourceType: z.literal("first-party"),
    path: z.string(),
  }),
  catalogEntrySchema.extend({
    sourceType: z.literal("catalog"),
    path: z.string(),
  }),
]);

export const registryIndexSchema = z.object({
  generatedAt: z.string(),
  items: z.array(
    z.union([
      firstPartyManifestSchema.extend({
        sourceType: z.literal("first-party"),
        path: z.string(),
      }),
      catalogEntrySchema.extend({
        sourceType: z.literal("catalog"),
        path: z.string(),
      }),
    ]),
  ),
});

export type Kind = z.infer<typeof kindSchema>;
export type FirstPartyManifest = z.infer<typeof firstPartyManifestSchema>;
export type CatalogEntry = z.infer<typeof catalogEntrySchema>;
export type RegistryIndex = z.infer<typeof registryIndexSchema>;
export type RegistryItem = RegistryIndex["items"][number];
