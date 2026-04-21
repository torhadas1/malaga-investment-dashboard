'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NumField } from "./NumField";
import { ChevronDown, ChevronRight, RotateCcw } from "lucide-react";
import { DEFAULT_TAX_CONFIG, type TaxBracket, type TaxConfig } from "../lib/defaults";

interface Props {
  config: TaxConfig;
  onChange: (c: TaxConfig) => void;
}

export function TaxEditor({ config, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const updateBracket = (i: number, patch: Partial<TaxBracket>) => {
    const next = [...config.brackets];
    next[i] = { ...next[i], ...patch };
    onChange({ ...config, brackets: next });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 text-xs font-medium hover:text-primary"
        >
          {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5 rotate-180" />}
          מדרגות מס וביטוח סוציאלי (ישראל 2026)
        </button>
        {open && (
          <Button variant="ghost" size="xs" onClick={() => onChange(DEFAULT_TAX_CONFIG)}>
            <RotateCcw className="h-3 w-3" /> איפוס
          </Button>
        )}
      </div>
      {open && (
        <div className="rounded-lg border p-3 space-y-3 bg-muted/20">
          <div>
            <div className="text-xs font-medium mb-1.5">מס הכנסה פרוגרסיבי (₪/חודש)</div>
            <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end text-[11px]">
              <span className="text-muted-foreground">עד (₪/חודש)</span>
              <span className="text-muted-foreground">שיעור (%)</span>
              <span />
              {config.brackets.map((b, i) => (
                <div key={i} className="contents">
                  <NumField
                    label=""
                    value={b.upTo ?? 0}
                    onChange={(v) => updateBracket(i, { upTo: v === 0 ? null : v })}
                    step={100}
                    hint={b.upTo === null ? "∞ (מדרגה עליונה)" : undefined}
                  />
                  <NumField
                    label=""
                    value={Math.round(b.rate * 1000) / 10}
                    onChange={(v) => updateBracket(i, { rate: v / 100 })}
                    step={0.5}
                    suffix="%"
                  />
                  <span />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SocialPanel
              title="שכיר"
              rates={config.employee}
              onChange={(r) => onChange({ ...config, employee: r })}
            />
            <SocialPanel
              title="עצמאי"
              rates={config.freelancer}
              onChange={(r) => onChange({ ...config, freelancer: r })}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <NumField
              label="תקרה מופחתת ₪/ח׳"
              value={config.reducedCeiling}
              onChange={(v) => onChange({ ...config, reducedCeiling: v })}
              step={100}
            />
            <NumField
              label="תקרה מלאה ₪/ח׳"
              value={config.fullCeiling}
              onChange={(v) => onChange({ ...config, fullCeiling: v })}
              step={100}
            />
            <NumField
              label="נק׳ זיכוי ₪/ח׳"
              value={config.creditPointValue}
              onChange={(v) => onChange({ ...config, creditPointValue: v })}
              step={1}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SocialPanel({
  title,
  rates,
  onChange,
}: {
  title: string;
  rates: TaxConfig["employee"];
  onChange: (r: TaxConfig["employee"]) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-xs font-medium">{title}</div>
      <div className="grid grid-cols-2 gap-2">
        <NumField
          label="ביט״ל נמוך"
          value={Math.round(rates.blLow * 10000) / 100}
          onChange={(v) => onChange({ ...rates, blLow: v / 100 })}
          step={0.1}
          suffix="%"
        />
        <NumField
          label="ביט״ל גבוה"
          value={Math.round(rates.blHigh * 10000) / 100}
          onChange={(v) => onChange({ ...rates, blHigh: v / 100 })}
          step={0.1}
          suffix="%"
        />
        <NumField
          label="בריאות נמוך"
          value={Math.round(rates.healthLow * 10000) / 100}
          onChange={(v) => onChange({ ...rates, healthLow: v / 100 })}
          step={0.1}
          suffix="%"
        />
        <NumField
          label="בריאות גבוה"
          value={Math.round(rates.healthHigh * 10000) / 100}
          onChange={(v) => onChange({ ...rates, healthHigh: v / 100 })}
          step={0.1}
          suffix="%"
        />
      </div>
    </div>
  );
}
