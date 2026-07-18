"use client";

import { useCallback, useEffect, useState } from "react";
import {
  type TabContent,
  TerminalAnimationBlinkingCursor,
  TerminalAnimationCommandBar,
  TerminalAnimationContainer,
  TerminalAnimationContent,
  TerminalAnimationOutput,
  TerminalAnimationRoot,
  TerminalAnimationTabList,
  TerminalAnimationTabTrigger,
  TerminalAnimationTrailingPrompt,
  TerminalAnimationWindow,
  type TerminalLine,
  useTerminalAnimation,
} from "@/components/ui/terminal-animation";
import { cn } from "@/lib/utils";

const REPLAY_DELAY_MS = 5000;

/** Real CLI outputs from `npx ted-craft` (condensed for the hero). */
const tabs: TabContent[] = [
  {
    label: "list",
    command: "npx ted-craft list",
    lines: [
      { text: "", delay: 80 },
      {
        text: "anthropics/frontend-design   skill  catalog  Frontend Design ★",
        color: "text-[color:var(--tc-console-fg)]",
        delay: 180,
      },
      {
        text: "click-up-maintainer   subagent+skill  first-party  ClickUp Maintainer ★",
        color: "text-white/55",
        delay: 120,
      },
      {
        text: "docs-maintainer       subagent+skill  first-party  Docs Maintainer ★",
        color: "text-white/55",
        delay: 120,
      },
      {
        text: "emilkowalski/apple-design    skill  catalog  Apple Design ★",
        color: "text-white/55",
        delay: 120,
      },
      {
        text: "ibelick/improve-ui           skill  catalog  Improve UI ★",
        color: "text-white/55",
        delay: 120,
      },
      { text: "", delay: 80 },
      {
        text: "16 item(s)",
        color: "text-[color:var(--tc-brass)]",
        delay: 220,
      },
    ],
  },
  {
    label: "search",
    command: "npx ted-craft search frontend",
    lines: [
      { text: "", delay: 80 },
      {
        text: "anthropics/frontend-design",
        color: "text-[color:var(--tc-console-fg)]",
        delay: 280,
      },
      {
        text: "  Distinctive, intentional UI design guidance — typography,",
        color: "text-white/45",
        delay: 200,
      },
      {
        text: "  palette, and anti-template aesthetics for web interfaces.",
        color: "text-white/45",
        delay: 160,
      },
    ],
  },
  {
    label: "get",
    command: "npx ted-craft get anthropics/frontend-design",
    lines: [
      { text: "", delay: 80 },
      {
        text: "# Frontend Design",
        color: "text-[color:var(--tc-brass)]",
        delay: 240,
      },
      { text: "", delay: 80 },
      {
        text: "Distinctive, intentional UI design guidance — typography,",
        color: "text-[color:var(--tc-console-fg)]",
        delay: 180,
      },
      {
        text: "palette, and anti-template aesthetics for web interfaces.",
        color: "text-[color:var(--tc-console-fg)]",
        delay: 160,
      },
      { text: "", delay: 80 },
      {
        text: "Attribution: anthropics (anthropics/skills)",
        color: "text-white/45",
        delay: 160,
      },
      {
        text: "Install: npx skills add anthropics/skills --skill frontend-design -g -y",
        color: "text-emerald-400",
        delay: 220,
      },
    ],
  },
  {
    label: "start",
    command: "npx ted-craft start",
    lines: [
      { text: "", delay: 80 },
      {
        text: "# ted-craft-root",
        color: "text-[color:var(--tc-brass)]",
        delay: 280,
      },
      { text: "", delay: 60 },
      {
        text: "You are routing through the ted-craft marketplace.",
        color: "text-white/55",
        delay: 200,
      },
      { text: "", delay: 80 },
      {
        text: "## Available (13)",
        color: "text-white/45",
        delay: 180,
      },
      {
        text: "- anthropics/frontend-design (skill, catalog)",
        color: "text-[color:var(--tc-console-fg)]",
        delay: 140,
      },
      {
        text: "- emilkowalski/apple-design (skill, catalog)",
        color: "text-white/55",
        delay: 110,
      },
      {
        text: "- ibelick/improve-ui (skill, catalog)",
        color: "text-white/55",
        delay: 110,
      },
      { text: "", delay: 80 },
      {
        text: "Run: npx ted-craft add <slug> -a cursor -g -y",
        color: "text-white/45",
        delay: 220,
      },
    ],
  },
];

const DEFAULT_TAB = 1;

function renderLine(line: TerminalLine, _index: number, visible: boolean) {
  if (!visible) return null;
  return (
    <div className="leading-relaxed">
      <span
        className={cn(
          "font-mono text-[12px] md:text-sm",
          line.color ?? "text-white/50",
        )}
      >
        {line.text || "\u00A0"}
      </span>
    </div>
  );
}

function ReplayScheduler({ onReplay }: { onReplay: () => void }) {
  const { isTypingCommand, visibleLines, currentTab } = useTerminalAnimation();

  useEffect(() => {
    if (isTypingCommand) return;
    if (visibleLines < currentTab.lines.length) return;

    const timeout = window.setTimeout(onReplay, REPLAY_DELAY_MS);
    return () => window.clearTimeout(timeout);
  }, [currentTab.lines.length, isTypingCommand, onReplay, visibleLines]);

  return null;
}

function TabStrip() {
  return (
    <div className="flex justify-center px-4 pb-4">
      <TerminalAnimationTabList className="inline-flex items-center gap-0 rounded-lg border border-white/15 bg-white/5 px-1 py-1">
        {tabs.map((tab, index) => (
          <TerminalAnimationTabTrigger
            key={tab.label}
            index={index}
            className={cn(
              "cursor-pointer rounded-md px-3 py-1 font-mono text-[11px] transition-all duration-150 md:text-xs",
              "data-[state=active]:bg-[color:var(--tc-brass)] data-[state=active]:font-medium data-[state=active]:text-[color:var(--tc-console)]",
              "data-[state=inactive]:text-white/45 data-[state=inactive]:hover:text-white/80",
            )}
          >
            {tab.label}
          </TerminalAnimationTabTrigger>
        ))}
      </TerminalAnimationTabList>
    </div>
  );
}

function StaticTerminal({
  activeTab,
  onActiveTabChange,
}: {
  activeTab: number;
  onActiveTabChange: (index: number) => void;
}) {
  const tab = tabs[activeTab] ?? tabs[DEFAULT_TAB];

  return (
    <>
      <div className="min-h-[14rem] px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex items-center gap-2 leading-relaxed">
          <span className="select-none font-mono text-[12px] text-white/40 md:text-sm">
            $
          </span>
          <span className="font-mono text-[12px] text-[color:var(--tc-console-fg)] md:text-sm">
            {tab.command}
          </span>
        </div>
        <div className="mt-1">
          {tab.lines.map((line) => (
            <div
              key={`${tab.label}:${line.delay}:${line.color ?? ""}:${line.text}`}
              className="leading-relaxed"
            >
              <span
                className={cn(
                  "font-mono text-[12px] md:text-sm",
                  line.color ?? "text-white/50",
                )}
              >
                {line.text || "\u00A0"}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-1 flex items-center gap-2 leading-relaxed">
          <span className="select-none font-mono text-sm text-white/40">$</span>
          <span className="inline-block h-[14px] w-[7px] bg-white/50" />
        </div>
      </div>
      <div className="flex justify-center px-4 pb-4">
        <div
          className="inline-flex items-center gap-0 rounded-lg border border-white/15 bg-white/5 px-1 py-1"
          role="tablist"
          aria-label="Terminal commands"
        >
          {tabs.map((item, index) => {
            const isActive = activeTab === index;
            return (
              <button
                key={item.label}
                type="button"
                role="tab"
                aria-selected={isActive}
                data-state={isActive ? "active" : "inactive"}
                onClick={() => onActiveTabChange(index)}
                className={cn(
                  "cursor-pointer rounded-md px-3 py-1 font-mono text-[11px] transition-all duration-150 md:text-xs",
                  isActive
                    ? "bg-[color:var(--tc-brass)] font-medium text-[color:var(--tc-console)]"
                    : "text-white/45 hover:text-white/80",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

export function WorkbenchTerminal() {
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB);
  const [replayKey, setReplayKey] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  const handleReplay = useCallback(() => {
    setReplayKey((key) => key + 1);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(media.matches);
    const onChange = () => setReduceMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[color:var(--tc-console)] shadow-[0_24px_60px_-28px_rgba(20,24,31,0.55)]">
      <div className="relative flex h-9 items-center border-b border-white/10 px-3.5">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="pointer-events-none absolute inset-x-0 text-center font-mono text-[11px] text-white/40">
          ted-craft — zsh
        </span>
      </div>

      {reduceMotion ? (
        <StaticTerminal
          activeTab={activeTab}
          onActiveTabChange={setActiveTab}
        />
      ) : (
        <TerminalAnimationRoot
          key={replayKey}
          tabs={tabs}
          activeTab={activeTab}
          onActiveTabChange={setActiveTab}
          alwaysDark
          hideCursorOnComplete={false}
          className="relative"
        >
          <TerminalAnimationContainer className="max-w-none px-0 pt-0 pb-0">
            <TerminalAnimationWindow
              animateOnVisible={false}
              minHeight="16rem"
              backgroundColor="var(--tc-console)"
              className="rounded-none"
            >
              <TerminalAnimationContent className="min-h-[14rem] px-5 py-5 sm:px-6 sm:py-6">
                <div className="flex items-center gap-2 leading-relaxed">
                  <span className="select-none font-mono text-[12px] text-white/40 md:text-sm">
                    $
                  </span>
                  <TerminalAnimationCommandBar
                    className="font-mono text-[12px] text-[color:var(--tc-console-fg)] md:text-sm"
                    cursor={
                      <TerminalAnimationBlinkingCursor className="bg-white/70" />
                    }
                  />
                </div>

                <TerminalAnimationOutput
                  className="mt-1"
                  renderLine={renderLine}
                />

                <TerminalAnimationTrailingPrompt className="mt-1 flex items-center gap-2 leading-relaxed">
                  <span className="select-none font-mono text-sm text-white/40">
                    $
                  </span>
                  <TerminalAnimationBlinkingCursor className="bg-white/70" />
                </TerminalAnimationTrailingPrompt>

                <ReplayScheduler onReplay={handleReplay} />
              </TerminalAnimationContent>

              <TabStrip />
            </TerminalAnimationWindow>
          </TerminalAnimationContainer>
        </TerminalAnimationRoot>
      )}
    </div>
  );
}
