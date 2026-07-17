import { Badge } from '@/components/ui/badge';
import type { Kind } from './kind';

const LABELS: Record<Kind, string> = {
  skill: 'skill',
  subagent: 'subagent',
  rule: 'rule',
  hook: 'hook',
  bundle: 'bundle',
};

export function KindBadge({ kind }: { kind: Kind }) {
  return (
    <Badge
      variant="outline"
      className="rounded-md font-mono text-[11px] uppercase tracking-wide text-[color:var(--tc-muted)]"
    >
      {LABELS[kind]}
    </Badge>
  );
}
