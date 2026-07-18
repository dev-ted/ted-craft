import { Badge } from '@/components/ui/badge';
import { kindLabel, type Kind } from './kind';

export function KindBadge({ kind }: { kind: Kind }) {
  return (
    <Badge
      variant="outline"
      className="rounded-md font-mono text-[11px] uppercase tracking-wide text-[color:var(--tc-muted)]"
    >
      {kindLabel(kind)}
    </Badge>
  );
}
