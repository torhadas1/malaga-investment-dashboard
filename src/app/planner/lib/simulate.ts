import type { PlannerState } from "./defaults";
import { grossToNet } from "./taxes";

export interface YearRow {
  year: number; // 0 = this year
  age1: number;
  age2: number;
  grossIncome: number; // annual
  netIncome: number; // annual
  expenses: number; // annual
  savings: number; // annual (can be negative)
  portfolio: number; // end-of-year
  fiReached: boolean;
  sustainableMonthly: number; // portfolio * swr / 12
  retired: boolean;
}

export interface SimResult {
  rows: YearRow[];
  fiYear: number | null;
  fiAge: number | null;
  retirementRow: YearRow | null;
  survivesToEnd: boolean;
}

export function simulate(state: PlannerState): SimResult {
  const rows: YearRow[] = [];
  let portfolio = state.portfolio;
  let fiYear: number | null = null;
  let fiAge: number | null = null;

  for (let y = 0; y <= state.horizonYears; y++) {
    const age1 = state.earners[0].currentAge + y;
    const age2 = state.earners[1].currentAge + y;
    const retired = age1 >= state.retirementAge;

    const incomeMultiplier = Math.pow(1 + state.incomeGrowth, y);
    const expenseMultiplier = Math.pow(1 + state.expenseInflation, y);

    let monthlyNet = 0;
    let monthlyGross = 0;
    if (!retired) {
      for (const e of state.earners) {
        const scaled = {
          ...e,
          employeeGross: e.employeeGross * incomeMultiplier,
          freelancerGross: e.freelancerGross * incomeMultiplier,
        };
        const b = grossToNet(scaled, state.tax);
        monthlyNet += b.net;
        monthlyGross += b.gross;
      }
    }

    const kidsCost = state.kids
      .filter((k) => y >= k.startYear)
      .reduce((s, k) => s + k.monthlyCost, 0);
    const monthlyExpenses = (state.baseMonthlyExpenses + kidsCost) * expenseMultiplier;

    const annualNet = monthlyNet * 12;
    const annualGross = monthlyGross * 12;
    const annualExpenses = monthlyExpenses * 12;
    const annualSavings = annualNet - annualExpenses;

    // Grow portfolio, then apply net savings (or retirement drawdown).
    portfolio = portfolio * (1 + state.growthRate) + annualSavings;
    if (portfolio < 0) portfolio = 0;

    const fiReached = portfolio * state.swr >= annualExpenses;
    if (fiReached && fiYear === null) {
      fiYear = y;
      fiAge = age1;
    }

    rows.push({
      year: y,
      age1,
      age2,
      grossIncome: annualGross,
      netIncome: annualNet,
      expenses: annualExpenses,
      savings: annualSavings,
      portfolio,
      fiReached,
      sustainableMonthly: (portfolio * state.swr) / 12,
      retired,
    });
  }

  const retirementRow =
    rows.find((r) => r.age1 === state.retirementAge) ?? null;
  const survivesToEnd = rows[rows.length - 1].portfolio > 0;

  return { rows, fiYear, fiAge, retirementRow, survivesToEnd };
}
