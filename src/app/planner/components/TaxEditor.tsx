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
          {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          Tax brackets & social insurance (Israel 2026)
        </button>
        {open && (
          <Button variant="ghost" size="xs" onClick={() => onChange(DEFAULT_TAX_CONFIG)}>
            <RotateCcw className="h-3 w-3" /> Reset
          </Button>
        )}
      </div>
      {open && (
        <div className="rounded-lg border p-3 space-y-3 bg-muted/20">
          <div>
            <div className="text-xs font-medium mb-1.5">Progressive income tax (monthly NIS)</div>
            <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end text-[11px]">
              <span className="text-muted-foreground">Up to (₪/mo)</span>
              <span className="text-muted-foreground">Rate (%)</span>
              <span />
              {config.brackets.map((b, i) => (
                <div key={i} className="contents">
                  <NumField
                    label=""
                    value={b.upTo ?? 0}
                    onChange={(v) => updateBracket(i, { upTo: v === 0 ? null : v })}
                    step={100}
                    hint={b.upTo === null ? "∞ (top bracket)" : undefined}
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
              title="Employee"
              rates={config.employee}
              onChange={(r) => onChange({ ...config, employee: r })}
            />
            <SocialPanel
              title="Freelancer (עצמאי)"
              rates={config.freelancer}
              onChange={(r) => onChange({ ...config, freelancer: r })}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <NumField
              label="Reduced ceiling ₪/mo"
              value={config.reducedCeiling}
              onChange={(v) => onChange({ ...config, reducedCeiling: v })}
              step={100}
            />
            <NumField
              label="Full ceiling ₪/mo"
              value={config.fullCeiling}
              onChange={(v) => onChange({ ...config, fullCeiling: v })}
              step={100}
            />
            <NumField
              label="Credit point ₪/mo"
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
          label="BL low %"
          value={Math.round(rates.blLow * 10000) / 100}
          onChange={(v) => onChange({ ...rates, blLow: v / 100 })}
          step={0.1}
          suffix="%"
        />
        <NumField
          label="BL high %"
          value={Math.round(rates.blHigh * 10000) / 100}
          onChange={(v) => onChange({ ...rates, blHigh: v / 100 })}
          step={0.1}
          suffix="%"
        />
        <NumField
          label="Health low %"
          value={Math.round(rates.healthLow * 10000) / 100}
          onChange={(v) => onChange({ ...rates, healthLow: v / 100 })}
          step={0.1}
          suffix="%"
        />
        <NumField
          label="Health high %"
          value={Math.round(rates.healthHigh * 10000) / 100}
          onChange={(v) => onChange({ ...rates, healthHigh: v / 100 })}
          step={0.1}
          suffix="%"
        />
      </div>
    </div>
  );
}
