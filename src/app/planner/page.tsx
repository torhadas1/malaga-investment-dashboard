'use client';

import { useEffect, useMemo, useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { DEFAULT_STATE, type PlannerState } from "./lib/defaults";
import { decodeState, encodeState } from "./lib/state";
import { simulate } from "./lib/simulate";
import { InputPanel } from "./components/InputPanel";
import { ResultsPanel } from "./components/ResultsPanel";
import { RotateCcw, Share2, Check } from "lucide-react";

function readInitialState(): PlannerState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  const params = new URLSearchParams(window.location.search);
  return decodeState(params.get("s")) ?? DEFAULT_STATE;
}

export default function PlannerPage() {
  const [state, setState] = useState<PlannerState>(readInitialState);
  const [copied, setCopied] = useState(false);

  // Mirror state into URL so bookmarking/sharing captures the full scenario.
  useEffect(() => {
    const encoded = encodeState(state);
    const url = new URL(window.location.href);
    url.searchParams.set("s", encoded);
    window.history.replaceState(null, "", url.toString());
  }, [state]);

  const sim = useMemo(() => simulate(state), [state]);

  const copyShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const reset = () => {
    if (confirm("Reset all inputs to defaults?")) setState(DEFAULT_STATE);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card sticky top-0 z-50">
          <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                💰 Family Financial Planner
              </h1>
              <p className="text-xs text-muted-foreground">
                Live what-if modeling · Israeli tax · Retirement & kids
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={copyShare}>
                {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Share scenario"}
              </Button>
              <Button variant="ghost" size="sm" onClick={reset}>
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-[1600px] mx-auto px-4 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(340px,2fr)_3fr] gap-4">
            <div className="lg:sticky lg:top-[72px] lg:self-start lg:max-h-[calc(100vh-88px)] lg:overflow-auto lg:pr-2">
              <InputPanel state={state} setState={setState} />
            </div>
            <div>
              <ResultsPanel sim={sim} state={state} />
            </div>
          </div>
        </main>

        <footer className="border-t mt-8 py-4 px-4 text-center text-[10px] text-muted-foreground">
          <p>All numbers are nominal NIS. Growth rate can be entered as real (inflation-adjusted) to read results in today&apos;s money.</p>
          <p>⚠️ This is a discussion tool, not financial advice. Tax model is approximate — verify specifics with an accountant.</p>
        </footer>
      </div>
    </TooltipProvider>
  );
}
