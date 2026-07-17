'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

type Props = {
  slug: string;
  cursorCommand: string;
  claudeCommand: string;
  codexCommand: string;
  attributionLabel?: string;
};

type Agent = 'cursor' | 'claude' | 'codex';

export function InstallPanel({
  cursorCommand,
  claudeCommand,
  codexCommand,
  attributionLabel,
}: Props) {
  const [copied, setCopied] = useState<Agent | null>(null);

  const commands: Record<Agent, string> = {
    cursor: cursorCommand,
    claude: claudeCommand,
    codex: codexCommand,
  };

  const labels: Record<Agent, string> = {
    cursor: 'Add to Cursor',
    claude: 'Add to Claude',
    codex: 'Add to Codex',
  };

  async function copy(agent: Agent) {
    const cmd = commands[agent];
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(agent);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  }

  return (
    <div className="not-prose my-6 rounded-xl border border-[color:var(--tc-line)] bg-[color:var(--tc-panel)] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-[color:var(--tc-ink)]">Install</p>
        {attributionLabel ? (
          <p className="text-xs text-[color:var(--tc-muted)]">
            via {attributionLabel}
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {(['cursor', 'claude', 'codex'] as const).map((agent) => (
          <Button
            key={agent}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void copy(agent)}
            className="tc-press border-[color:var(--tc-line)] bg-[color:var(--tc-surface)] text-[color:var(--tc-ink)] hover:border-[color:var(--tc-brass)] hover:bg-[color:var(--tc-panel-hover)]"
          >
            {copied === agent ? 'Copied' : labels[agent]}
          </Button>
        ))}
      </div>
      {copied ? (
        <p className="mt-3 break-all font-mono text-xs text-[color:var(--tc-muted)]">
          {commands[copied]}
        </p>
      ) : null}
    </div>
  );
}
