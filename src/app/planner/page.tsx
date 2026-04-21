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
    if (confirm("לאפס את כל ההגדרות לברירת המחדל?")) setState(DEFAULT_STATE);
  };

  return (
    <TooltipProvider>
      <div dir="rtl" className="min-h-screen bg-background">
        <header className="border-b bg-card sticky top-0 z-50">
          <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                💰 מתכנן פיננסי משפחתי
              </h1>
              <p className="text-xs text-muted-foreground">
                מודל תרחישים חי · מיסוי ישראלי · פרישה וילדים
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={copyShare}>
                {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
                {copied ? "הועתק!" : "שתף תרחיש"}
              </Button>
              <Button variant="ghost" size="sm" onClick={reset}>
                <RotateCcw className="h-3.5 w-3.5" /> איפוס
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-[1600px] mx-auto px-4 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(340px,2fr)_3fr] gap-4">
            <div className="lg:sticky lg:top-[72px] lg:self-start lg:max-h-[calc(100vh-88px)] lg:overflow-auto lg:pl-2">
              <InputPanel state={state} setState={setState} />
            </div>
            <div>
              <ResultsPanel sim={sim} state={state} />
            </div>
          </div>
        </main>

        <footer className="border-t mt-8 py-4 px-4 text-center text-[10px] text-muted-foreground">
          <p>כל הסכומים בשקלים. ניתן להזין צמיחה ריאלית (נטו-אינפלציה) ולקרוא את התוצאות בשקלי היום.</p>
          <p>⚠️ כלי לדיון משפחתי, לא ייעוץ פיננסי. מודל המס מקורב — יש לוודא פרטים מדויקים עם רו&quot;ח.</p>
        </footer>
      </div>
    </TooltipProvider>
  );
}
