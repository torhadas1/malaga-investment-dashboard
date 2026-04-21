'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NumField, PercentField } from "./NumField";
import { EarnerCard } from "./EarnerCard";
import { KidsEditor } from "./KidsEditor";
import { TaxEditor } from "./TaxEditor";
import type { PlannerState, EarnerState, Kid } from "../lib/defaults";
import { Wallet, Users, Home, Sunrise, Receipt } from "lucide-react";

interface Props {
  state: PlannerState;
  setState: (updater: (prev: PlannerState) => PlannerState) => void;
}

export function InputPanel({ state, setState }: Props) {
  const setEarner = (idx: 0 | 1) => (e: EarnerState) =>
    setState((s) => {
      const earners = [...s.earners] as [EarnerState, EarnerState];
      earners[idx] = e;
      return { ...s, earners };
    });

  const setKids = (kids: Kid[]) => setState((s) => ({ ...s, kids }));

  return (
    <div className="space-y-3">
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Wallet className="h-4 w-4" /> תיק השקעות וצמיחה
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          <NumField
            label="תיק התחלתי"
            value={state.portfolio}
            onChange={(v) => setState((s) => ({ ...s, portfolio: v }))}
            suffix="₪"
            step={10_000}
          />
          <PercentField
            label="תשואה שנתית"
            value={state.growthRate}
            onChange={(v) => setState((s) => ({ ...s, growthRate: v }))}
            hint="ריאלית, אחרי אינפלציה"
          />
          <PercentField
            label="שיעור משיכה בטוח"
            value={state.swr}
            onChange={(v) => setState((s) => ({ ...s, swr: v }))}
            hint="4% = כלל FIRE קלאסי"
          />
          <PercentField
            label="צמיחת הכנסה בשנה"
            value={state.incomeGrowth}
            onChange={(v) => setState((s) => ({ ...s, incomeGrowth: v }))}
          />
          <PercentField
            label="גידול הוצאות בשנה"
            value={state.expenseInflation}
            onChange={(v) => setState((s) => ({ ...s, expenseInflation: v }))}
          />
          <NumField
            label="אופק תכנון (שנים)"
            value={state.horizonYears}
            onChange={(v) => setState((s) => ({ ...s, horizonYears: v }))}
            step={5}
          />
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4" /> משתכרים
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <EarnerCard earner={state.earners[0]} onChange={setEarner(0)} tax={state.tax} />
          <EarnerCard earner={state.earners[1]} onChange={setEarner(1)} tax={state.tax} />
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Home className="h-4 w-4" /> הוצאות וילדים
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <NumField
            label="הוצאות חודשיות נוכחיות (ללא ילדים)"
            value={state.baseMonthlyExpenses}
            onChange={(v) => setState((s) => ({ ...s, baseMonthlyExpenses: v }))}
            suffix="₪"
            step={500}
          />
          <NumField
            label="הוצאות חודשיות רצויות בפרישה"
            value={state.retirementMonthlyExpenses}
            onChange={(v) => setState((s) => ({ ...s, retirementMonthlyExpenses: v }))}
            suffix="₪"
            step={500}
            hint="בלי ילדים תלויים, בלי משכנתא, וכד׳ — כמה אתם באמת צריכים כדי לחיות בפרישה"
          />
          <KidsEditor kids={state.kids} onChange={setKids} />
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Sunrise className="h-4 w-4" /> פרישה
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NumField
            label={`גיל פרישה יעד (${state.earners[0].name})`}
            value={state.retirementAge}
            onChange={(v) => setState((s) => ({ ...s, retirementAge: v }))}
            step={1}
            hint="הגיל בו מפסיקים לעבוד; מגיל זה התיק חייב לממן את ההוצאות."
          />
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Receipt className="h-4 w-4" /> הגדרות מס
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TaxEditor
            config={state.tax}
            onChange={(tax) => setState((s) => ({ ...s, tax }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
