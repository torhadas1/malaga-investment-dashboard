'use client';

import { Card, CardContent } from "@/components/ui/card";
import { formatNIS, formatNISFull } from "../lib/state";
import type { SimResult } from "../lib/simulate";
import type { PlannerState } from "../lib/defaults";
import { Flag, Hourglass, PiggyBank, Coins, Shield, Anchor } from "lucide-react";

interface Props {
  sim: SimResult;
  state: PlannerState;
}

export function SummaryCards({ sim, state }: Props) {
  const retRow = sim.retirementRow;
  const sustainable = retRow ? retRow.sustainableMonthly : null;
  const retirementMonthly = retRow ? retRow.expenses / 12 : null;
  const ratio =
    sustainable !== null && retirementMonthly
      ? sustainable / retirementMonthly
      : null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
      <Tile
        icon={<Flag className="h-4 w-4" />}
        label="גיל FI"
        value={sim.fiAge !== null ? `${sim.fiAge}` : "—"}
        sub={sim.fiYear !== null ? `בעוד ${sim.fiYear} שנים` : "לא הושג באופק"}
        accent={sim.fiAge !== null ? "ok" : "warn"}
      />
      <Tile
        icon={<Anchor className="h-4 w-4" />}
        label="גיל Coast FI"
        value={sim.coastFiAge !== null ? `${sim.coastFiAge}` : "—"}
        sub={
          sim.coastFiYear !== null
            ? `מגיל זה ניתן להפסיק לחסוך`
            : "לא הושג באופק"
        }
        accent={sim.coastFiAge !== null ? "ok" : "warn"}
      />
      <Tile
        icon={<Hourglass className="h-4 w-4" />}
        label="שנים עד FI"
        value={sim.fiYear !== null ? `${sim.fiYear}` : "—"}
        sub={sim.fiYear !== null ? "מהיום" : ""}
      />
      <Tile
        icon={<PiggyBank className="h-4 w-4" />}
        label={`תיק בגיל ${state.retirementAge}`}
        value={retRow ? formatNIS(retRow.portfolio) : "—"}
        sub={retRow ? formatNISFull(retRow.portfolio) : ""}
      />
      <Tile
        icon={<Coins className="h-4 w-4" />}
        label="משיכה חודשית ברת קיימא"
        value={sustainable !== null ? formatNIS(sustainable) + "₪" : "—"}
        sub={
          ratio !== null
            ? `${(ratio * 100).toFixed(0)}% מההוצאות בפרישה`
            : ""
        }
        accent={ratio !== null ? (ratio >= 1 ? "ok" : "warn") : undefined}
      />
      <Tile
        icon={<Shield className="h-4 w-4" />}
        label="שורד את האופק?"
        value={sim.survivesToEnd ? "כן" : "לא"}
        sub={`גיל סיום: ${state.earners[0].currentAge + state.horizonYears}`}
        accent={sim.survivesToEnd ? "ok" : "warn"}
      />
    </div>
  );
}

function Tile({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: "ok" | "warn";
}) {
  const accentClass =
    accent === "ok"
      ? "text-emerald-600 dark:text-emerald-400"
      : accent === "warn"
        ? "text-amber-600 dark:text-amber-400"
        : "";
  return (
    <Card size="sm">
      <CardContent className="py-2 space-y-0.5">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          {icon}
          <span>{label}</span>
        </div>
        <div className={`text-xl font-bold leading-tight ${accentClass}`}>{value}</div>
        {sub && <div className="text-[10px] text-muted-foreground truncate">{sub}</div>}
      </CardContent>
    </Card>
  );
}
