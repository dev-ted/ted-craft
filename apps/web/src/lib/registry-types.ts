export type RegistryItem = {
  slug: string;
  kind: 'skill' | 'subagent' | 'rule' | 'hook' | 'bundle';
  name: string;
  description: string;
  category: string;
  tags: string[];
  sourceType: 'first-party' | 'catalog';
  path: string;
  cli?: {
    promptExample?: string;
    featured?: boolean;
  };
  author?: { name: string; url?: string };
  attribution?: {
    author: string;
    repo: string;
    skill: string;
    license: string;
    catalogUrl: string;
  };
  artifacts?: {
    skill?: { dir: string; name: string };
    subagent?: { file: string; name: string };
    rule?: { file: string };
    hook?: { config: string; scriptsDir?: string };
  };
  install?: {
    default: string;
    cursor?: string;
    claude?: string;
    codex?: string;
  };
};

export type RegistryIndex = {
  generatedAt: string;
  items: RegistryItem[];
};
