'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart, Bar, BarChart, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNIS, formatNISFull } from "../lib/state";
import type { SimResult } from "../lib/simulate";
import type { PlannerState } from "../lib/defaults";

interface Props {
  sim: SimResult;
  state: PlannerState;
}

const tipStyle = { fontSize: 11 };

export function PortfolioChart({ sim, state }: Props) {
  const data = sim.rows.map((r) => ({
    year: r.year,
    age: r.age1,
    portfolio: Math.round(r.portfolio),
    target25x: Math.round(r.expenses / state.swr),
  }));
  return (
    <Card size="sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Portfolio value over time</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="age"
              tick={{ fontSize: 10 }}
              label={{ value: `Age (${state.earners[0].name})`, fontSize: 10, position: "insideBottom", offset: -2 }}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              tickFormatter={(v: number) => formatNIS(v)}
            />
            <RTooltip
              formatter={(v: unknown) => formatNISFull(Number(v))}
              labelFormatter={(age) => `Age ${age}`}
              contentStyle={tipStyle}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine
              x={state.retirementAge}
              stroke="#ef4444"
              strokeDasharray="4 2"
              label={{ value: "Retire", fontSize: 10, fill: "#ef4444" }}
            />
            {sim.fiAge !== null && (
              <ReferenceLine
                x={sim.fiAge}
                stroke="#10b981"
                strokeDasharray="4 2"
                label={{ value: "FI", fontSize: 10, fill: "#10b981" }}
              />
            )}
            <Line
              type="monotone"
              dataKey="portfolio"
              name="Portfolio"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="target25x"
              name="25× expenses (FI target)"
              stroke="#f59e0b"
              strokeWidth={1.5}
              strokeDasharray="5 3"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function IncomeExpensesChart({ sim, state }: Props) {
  const data = sim.rows.map((r) => ({
    age: r.age1,
    netIncome: Math.round(r.netIncome / 12),
    expenses: Math.round(r.expenses / 12),
  }));
  return (
    <Card size="sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Monthly net income vs expenses</CardTitle>
      </CardHeader>
      <CardContent className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="age" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => formatNIS(v)} />
            <RTooltip
              formatter={(v: unknown) => formatNISFull(Number(v))}
              labelFormatter={(age) => `Age ${age}`}
              contentStyle={tipStyle}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine
              x={state.retirementAge}
              stroke="#ef4444"
              strokeDasharray="4 2"
            />
            <Area
              type="monotone"
              dataKey="netIncome"
              name="Net income /mo"
              stroke="#10b981"
              fill="#10b98133"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              name="Expenses /mo"
              stroke="#ef4444"
              fill="#ef444433"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function SavingsBars({ sim }: Props) {
  const data = sim.rows.map((r) => ({
    age: r.age1,
    savings: Math.round(r.savings),
  }));
  return (
    <Card size="sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Annual savings</CardTitle>
      </CardHeader>
      <CardContent className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="age" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => formatNIS(v)} />
            <RTooltip
              formatter={(v: unknown) => formatNISFull(Number(v))}
              labelFormatter={(age) => `Age ${age}`}
              contentStyle={tipStyle}
            />
            <ReferenceLine y={0} stroke="#888" />
            <Bar dataKey="savings" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
