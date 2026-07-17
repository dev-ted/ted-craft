export {
  kindSchema,
  authorSchema,
  artifactsSchema,
  firstPartyManifestSchema,
  catalogEntrySchema,
  registryIndexSchema,
  type Kind,
  type FirstPartyManifest,
  type CatalogEntry,
  type RegistryIndex,
  type RegistryItem,
} from "./schema.js";
export { loadRegistry, findRepoRoot, type ValidationIssue } from "./load.js";
export { scanForSecrets, type SecretFinding } from "./secrets.js";
export { generateIndex } from "./generate-index.js";
export { generateDocs } from "./generate-docs.js";
