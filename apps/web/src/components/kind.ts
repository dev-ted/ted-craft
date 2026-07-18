export type Kind = 'skill' | 'subagent' | 'rule' | 'hook' | 'bundle';

/** Visitor-facing labels — bundles lead with subagent since that’s the distinctive piece. */
export const KIND_LABELS: Record<Kind, string> = {
  skill: 'skill',
  subagent: 'subagent',
  rule: 'rule',
  hook: 'hook',
  bundle: 'subagent + skill',
};

export function kindLabel(kind: Kind | string): string {
  return KIND_LABELS[kind as Kind] ?? kind;
}
