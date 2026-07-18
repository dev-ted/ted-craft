"use client";

import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  children: string;
  label?: string;
  className?: string;
};

export function CodeBlock({
  children,
  label = "ted-craft — zsh",
  className,
}: Props) {
  const [copied, setCopied] = useState(false);
  const command = typeof children === "string" ? children.trim() : "";
  const showPrompt =
    label === "ted-craft — zsh" ||
    /\b(zsh|bash|shell|terminal)\b/i.test(label);

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
        "not-prose my-4 overflow-hidden rounded-xl border border-white/10 bg-[color:var(--tc-console)] shadow-[0_24px_60px_-28px_rgba(20,24,31,0.55)]",
        className,
      )}
    >
      <div className="relative flex h-9 items-center border-b border-white/10 px-3.5">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="pointer-events-none absolute inset-x-0 text-center font-mono text-[11px] text-white/40">
          {label}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => void copy()}
          className="relative z-10 ml-auto text-[color:var(--tc-brass)] hover:bg-white/5 hover:text-[color:var(--tc-brass)]"
        >
          {copied ? (
            <IconCheck data-icon="inline-start" />
          ) : (
            <IconCopy data-icon="inline-start" />
          )}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-sm text-[color:var(--tc-console-fg)]">
        <code>
          {showPrompt ? (
            <span className="select-none text-white/40">$ </span>
          ) : null}
          {command}
        </code>
      </pre>
    </div>
  );
}
