'use client';

import { useState } from 'react';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
  children: string;
  label?: string;
  className?: string;
};

export function CodeBlock({ children, label = 'Terminal', className }: Props) {
  const [copied, setCopied] = useState(false);
  const command = typeof children === 'string' ? children.trim() : '';

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      className={cn(
        'not-prose my-4 overflow-hidden rounded-xl border border-[color:var(--tc-line)] bg-[color:var(--tc-console)]',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <span className="text-[10px] uppercase tracking-[0.14em] text-white/50">
          {label}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => void copy()}
          className="text-[color:var(--tc-brass)] hover:bg-white/5 hover:text-[color:var(--tc-brass)]"
        >
          {copied ? (
            <IconCheck data-icon="inline-start" />
          ) : (
            <IconCopy data-icon="inline-start" />
          )}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-sm text-[color:var(--tc-console-fg)]">
        <code>{command}</code>
      </pre>
    </div>
  );
}
