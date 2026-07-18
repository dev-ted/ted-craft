"use client";

import { IconCheck, IconCopy } from "@tabler/icons-react";
import { type ReactNode, useEffect, useState } from "react";
import {
  ClaudeIcon,
  CodexIcon,
  CursorIcon,
  VsCodeIcon,
} from "@/components/agent-icons";
import { Button } from "@/components/ui/button";
import { highlightCode } from "@/lib/highlight-code";
import { cn } from "@/lib/utils";

type Agent = "cursor" | "claude" | "codex" | "vscode";

type Props = {
  children: string;
  cursorCommand?: string;
  claudeCommand?: string;
  codexCommand?: string;
  vscodeCommand?: string;
  showInstall?: boolean;
  className?: string;
};

const agentOrder: Agent[] = ["cursor", "claude", "codex", "vscode"];

const agentMeta: Record<Agent, { label: string; icon: ReactNode }> = {
  cursor: { label: "Add to Cursor", icon: <CursorIcon className="size-3.5" /> },
  claude: { label: "Add to Claude", icon: <ClaudeIcon /> },
  codex: { label: "Add to Codex", icon: <CodexIcon /> },
  vscode: { label: "Add to VS Code", icon: <VsCodeIcon /> },
};

export function RegistryInstallPreview({
  children,
  cursorCommand = "",
  claudeCommand = "",
  codexCommand = "",
  vscodeCommand = "",
  showInstall = true,
  className,
}: Props) {
  const code = typeof children === "string" ? children.trim() : "";
  const [copiedAgent, setCopiedAgent] = useState<Agent | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [html, setHtml] = useState<string | null>(null);

  const commands: Record<Agent, string> = {
    cursor: cursorCommand,
    claude: claudeCommand,
    codex: codexCommand,
    vscode: vscodeCommand,
  };

  useEffect(() => {
    let cancelled = false;
    void highlightCode(code, "markdown").then((result) => {
      if (!cancelled) setHtml(result);
    });
    return () => {
      cancelled = true;
    };
  }, [code]);

  async function copyAgent(agent: Agent) {
    const cmd = commands[agent];
    if (!cmd) return;
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedAgent(agent);
      window.setTimeout(() => setCopiedAgent(null), 2000);
    } catch {
      setCopiedAgent(null);
    }
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      window.setTimeout(() => setCopiedCode(false), 1600);
    } catch {
      setCopiedCode(false);
    }
  }

  return (
    <div className={cn("not-prose my-6", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 py-2">
        {showInstall ? (
          <div className="flex flex-wrap gap-1.5">
            {agentOrder.map((agent) => (
              <Button
                key={agent}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void copyAgent(agent)}
                disabled={!commands[agent]}
                className="tc-press gap-1.5 border-transparent bg-transparent text-[color:var(--tc-ink)] hover:bg-[color:var(--tc-panel)] [&_img]:size-3.5 [&_svg]:size-3.5"
              >
                {agentMeta[agent].icon}
                {copiedAgent === agent ? "Copied" : agentMeta[agent].label}
              </Button>
            ))}
          </div>
        ) : (
          <span />
        )}
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => void copyCode()}
          className="text-[color:var(--tc-muted)] hover:bg-[color:var(--tc-panel)] hover:text-[color:var(--tc-ink)]"
        >
          {copiedCode ? (
            <IconCheck data-icon="inline-start" />
          ) : (
            <IconCopy data-icon="inline-start" />
          )}
          {copiedCode ? "Copied" : "Copy"}
        </Button>
      </div>

      <div
        data-expanded={expanded}
        className="relative overflow-hidden rounded-lg bg-[color:var(--tc-surface)]"
      >
        <div
          className={cn(
            "tc-shiki-block",
            !expanded && "max-h-[7.5rem] overflow-hidden",
          )}
        >
          {html ? (
            // Shiki output from highlightCode — trusted, not user HTML
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki HTML
            <div dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <pre className="overflow-x-auto px-4 py-3 font-mono text-sm leading-relaxed text-[color:var(--tc-ink)]">
              <code>{code}</code>
            </pre>
          )}
        </div>

        {!expanded ? (
          <div className="absolute inset-0 flex items-end justify-center pb-3">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, var(--tc-surface), color-mix(in oklab, var(--tc-surface) 55%, transparent), transparent)",
              }}
              aria-hidden
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="relative z-10 rounded-lg border-[color:var(--tc-line)] bg-[color:var(--tc-paper)] text-[color:var(--tc-ink)] shadow-none hover:bg-[color:var(--tc-panel)]"
              onClick={() => setExpanded(true)}
            >
              Show more
            </Button>
          </div>
        ) : (
          <div className="flex justify-center border-t border-[color:var(--tc-line)]/40 py-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="text-[color:var(--tc-muted)] hover:bg-[color:var(--tc-panel)] hover:text-[color:var(--tc-ink)]"
              onClick={() => setExpanded(false)}
            >
              Show less
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
