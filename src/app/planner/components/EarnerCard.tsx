'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NumField } from "./NumField";
import { grossToNet, netToGross } from "../lib/taxes";
import { formatNISFull } from "../lib/state";
import type { EarnerState, TaxConfig } from "../lib/defaults";

interface Props {
  earner: EarnerState;
  onChange: (e: EarnerState) => void;
  tax: TaxConfig;
}

export function EarnerCard({ earner, onChange, tax }: Props) {
  const [netTarget, setNetTarget] = useState<number>(0);
  const breakdown = grossToNet(earner, tax);
  const marginalBracket =
    tax.brackets.find((b) => (b.upTo ?? Infinity) >= breakdown.gross)?.rate ?? 0;

  const suggested = netTarget > 0 ? netToGross(netTarget, earner, tax) : null;

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          <input
            type="text"
            value={earner.name}
            onChange={(e) => onChange({ ...earner, name: e.target.value })}
            className="bg-transparent font-medium text-sm focus:outline-none focus:ring-1 focus:ring-primary rounded px-1 -mx-1 max-w-[10rem]"
          />
          <span className="text-xs text-muted-foreground font-normal">
            Age <input
              type="number"
              value={earner.currentAge}
              onChange={(e) => onChange({ ...earner, currentAge: parseInt(e.target.value) || 0 })}
              className="bg-transparent w-10 text-center focus:outline-none focus:ring-1 focus:ring-primary rounded"
            />
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <NumField
            label="Employee gross /mo"
            value={earner.employeeGross}
            onChange={(v) => onChange({ ...earner, employeeGross: v })}
            suffix="₪"
            step={500}
          />
          <NumField
            label="Freelancer gross /mo"
            value={earner.freelancerGross}
            onChange={(v) => onChange({ ...earner, freelancerGross: v })}
            suffix="₪"
            step={500}
          />
        </div>
        <NumField
          label="Credit points"
          value={earner.creditPoints}
          onChange={(v) => onChange({ ...earner, creditPoints: v })}
          step={0.25}
          hint="Default: 2.25 (resident man), 2.75 (resident woman)"
        />

        <div className="rounded-lg bg-muted/40 p-2.5 space-y-1 text-xs">
          <Row label="Gross" value={formatNISFull(breakdown.gross)} bold />
          <Row label="– Income tax" value={`-${formatNISFull(breakdown.incomeTax)}`} />
          <Row label="– Bituach Leumi" value={`-${formatNISFull(breakdown.bituachLeumi)}`} />
          <Row label="– Health" value={`-${formatNISFull(breakdown.health)}`} />
          <div className="border-t border-border/50 my-1" />
          <Row label="Net /month" value={formatNISFull(breakdown.net)} bold accent />
          <Row
            label="Effective / marginal"
            value={`${(breakdown.effectiveRate * 100).toFixed(1)}% / ${(marginalBracket * 100).toFixed(0)}%`}
          />
        </div>

        <div className="rounded-lg border border-dashed border-border p-2.5 space-y-2">
          <div className="text-xs font-medium">I want to net…</div>
          <div className="flex items-center gap-2">
            <NumField
              label=""
              value={netTarget}
              onChange={setNetTarget}
              suffix="₪/mo"
              step={500}
              className="flex-1"
            />
          </div>
          {suggested && netTarget > 0 && (
            <div className="text-xs space-y-0.5">
              <div>
                …so you need gross: <span className="font-semibold">{formatNISFull(suggested.gross)}/mo</span>
              </div>
              <div className="text-muted-foreground">
                Extra vs today: {formatNISFull(suggested.gross - breakdown.gross)} gross →{" "}
                {formatNISFull(suggested.breakdown.net - breakdown.net)} net
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`${accent ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
      <span className={`${bold ? "font-semibold" : ""} ${accent ? "text-primary" : ""}`}>{value}</span>
    </div>
  );
}
