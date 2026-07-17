import { generateIndex } from "./generate-index.js";
import { generateDocs } from "./generate-docs.js";
import { findRepoRoot } from "./load.js";

const root = findRepoRoot();
generateIndex(root);
generateDocs(root);
