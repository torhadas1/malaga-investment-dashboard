'use client';

import { SummaryCards } from "./SummaryCards";
import { PortfolioChart, IncomeExpensesChart, SavingsBars } from "./Charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNISFull } from "../lib/state";
import type { SimResult } from "../lib/simulate";
import type { PlannerState } from "../lib/defaults";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Props {
  sim: SimResult;
  state: PlannerState;
}

export function ResultsPanel({ sim, state }: Props) {
  return (
    <div className="space-y-3">
      <SummaryCards sim={sim} state={state} />
      <PortfolioChart sim={sim} state={state} />
      <IncomeExpensesChart sim={sim} state={state} />
      <SavingsBars sim={sim} state={state} />
      <YearTable sim={sim} />
    </div>
  );
}

function YearTable({ sim }: { sim: SimResult }) {
  const [open, setOpen] = useState(false);
  return (
    <Card size="sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 hover:text-primary"
          >
            {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            Year-by-year table
          </button>
        </CardTitle>
      </CardHeader>
      {open && (
        <CardContent className="overflow-auto max-h-96">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-card">
              <tr className="text-left text-muted-foreground border-b">
                <th className="py-1 px-1">Age</th>
                <th className="py-1 px-1 text-right">Net income</th>
                <th className="py-1 px-1 text-right">Expenses</th>
                <th className="py-1 px-1 text-right">Savings</th>
                <th className="py-1 px-1 text-right">Portfolio</th>
                <th className="py-1 px-1 text-right">Sust. /mo</th>
                <th className="py-1 px-1 text-center">FI</th>
              </tr>
            </thead>
            <tbody>
              {sim.rows.map((r) => (
                <tr key={r.year} className={`border-b border-border/30 ${r.retired ? "text-muted-foreground" : ""}`}>
                  <td className="py-0.5 px-1">{r.age1}</td>
                  <td className="py-0.5 px-1 text-right">{formatNISFull(r.netIncome)}</td>
                  <td className="py-0.5 px-1 text-right">{formatNISFull(r.expenses)}</td>
                  <td className={`py-0.5 px-1 text-right ${r.savings < 0 ? "text-destructive" : ""}`}>
                    {formatNISFull(r.savings)}
                  </td>
                  <td className="py-0.5 px-1 text-right font-medium">{formatNISFull(r.portfolio)}</td>
                  <td className="py-0.5 px-1 text-right">{formatNISFull(r.sustainableMonthly)}</td>
                  <td className="py-0.5 px-1 text-center">{r.fiReached ? "✓" : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      )}
    </Card>
  );
}
