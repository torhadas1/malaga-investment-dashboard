'use client';

import { Card, CardContent } from "@/components/ui/card";
import { formatNIS, formatNISFull } from "../lib/state";
import type { SimResult } from "../lib/simulate";
import type { PlannerState } from "../lib/defaults";
import { Flag, Hourglass, PiggyBank, Coins, Shield } from "lucide-react";

interface Props {
  sim: SimResult;
  state: PlannerState;
}

export function SummaryCards({ sim, state }: Props) {
  const retRow = sim.retirementRow;
  const sustainable = retRow ? retRow.sustainableMonthly : null;
  const projectedMonthlyExpensesAtRet = retRow ? retRow.expenses / 12 : null;
  const ratio =
    sustainable !== null && projectedMonthlyExpensesAtRet
      ? sustainable / projectedMonthlyExpensesAtRet
      : null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
      <Tile
        icon={<Flag className="h-4 w-4" />}
        label="FI age"
        value={sim.fiAge !== null ? `${sim.fiAge}` : "—"}
        sub={sim.fiYear !== null ? `in year ${sim.fiYear}` : "not reached in horizon"}
        accent={sim.fiAge !== null ? "ok" : "warn"}
      />
      <Tile
        icon={<Hourglass className="h-4 w-4" />}
        label="Years to FI"
        value={sim.fiYear !== null ? `${sim.fiYear}` : "—"}
        sub={sim.fiYear !== null ? "from today" : ""}
      />
      <Tile
        icon={<PiggyBank className="h-4 w-4" />}
        label={`Portfolio @ age ${state.retirementAge}`}
        value={retRow ? formatNIS(retRow.portfolio) : "—"}
        sub={retRow ? formatNISFull(retRow.portfolio) : ""}
      />
      <Tile
        icon={<Coins className="h-4 w-4" />}
        label="Sustainable /mo"
        value={sustainable !== null ? formatNIS(sustainable) + "₪" : "—"}
        sub={
          ratio !== null
            ? `${(ratio * 100).toFixed(0)}% of expenses`
            : ""
        }
        accent={ratio !== null ? (ratio >= 1 ? "ok" : "warn") : undefined}
      />
      <Tile
        icon={<Shield className="h-4 w-4" />}
        label="Survives horizon?"
        value={sim.survivesToEnd ? "Yes" : "No"}
        sub={`end age ${state.earners[0].currentAge + state.horizonYears}`}
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
