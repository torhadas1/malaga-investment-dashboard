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
  coastFiReached: boolean; // could stop saving now and still hit retirement target
  coastProjection: number; // portfolio grown to retirement age with no further savings
  sustainableMonthly: number; // portfolio * swr / 12
  retired: boolean;
}

export interface SimResult {
  rows: YearRow[];
  fiYear: number | null;
  fiAge: number | null;
  coastFiYear: number | null;
  coastFiAge: number | null;
  retirementRow: YearRow | null;
  retirementTargetAnnual: number; // inflated retirement expenses (annual, at retirement year)
  survivesToEnd: boolean;
}

export function simulate(state: PlannerState): SimResult {
  const rows: YearRow[] = [];
  let portfolio = state.portfolio;
  let fiYear: number | null = null;
  let fiAge: number | null = null;
  let coastFiYear: number | null = null;
  let coastFiAge: number | null = null;

  // Retirement target in NIS at the retirement year, inflated from today.
  const yearsToRetirement0 = state.retirementAge - state.earners[0].currentAge;
  const retirementExpenseMultiplier = Math.pow(1 + state.expenseInflation, Math.max(0, yearsToRetirement0));
  const retirementTargetAnnual =
    state.retirementMonthlyExpenses * 12 * retirementExpenseMultiplier;
  const retirementTargetPortfolio = retirementTargetAnnual / state.swr;

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

    // Expenses differ pre-retirement (working-life, with kids) vs post-retirement (desired).
    let monthlyExpenses: number;
    if (retired) {
      monthlyExpenses = state.retirementMonthlyExpenses * expenseMultiplier;
    } else {
      const kidsCost = state.kids
        .filter((k) => y >= k.startYear)
        .reduce((s, k) => s + k.monthlyCost, 0);
      monthlyExpenses = (state.baseMonthlyExpenses + kidsCost) * expenseMultiplier;
    }

    const annualNet = monthlyNet * 12;
    const annualGross = monthlyGross * 12;
    const annualExpenses = monthlyExpenses * 12;
    const annualSavings = annualNet - annualExpenses;

    // Grow portfolio, then apply net savings (or retirement drawdown).
    portfolio = portfolio * (1 + state.growthRate) + annualSavings;
    if (portfolio < 0) portfolio = 0;

    // Coast projection: if you stopped saving at end of this year, what would
    // the portfolio be worth at retirement age (just growth, no contributions)?
    const yearsToRet = Math.max(0, state.retirementAge - age1);
    const coastProjection = portfolio * Math.pow(1 + state.growthRate, yearsToRet);
    const coastFiReached = !retired && coastProjection >= retirementTargetPortfolio;
    if (coastFiReached && coastFiYear === null) {
      coastFiYear = y;
      coastFiAge = age1;
    }

    // FI against the desired retirement spend (inflated to this year).
    const fiTargetThisYear = state.retirementMonthlyExpenses * 12 * expenseMultiplier;
    const fiReached = portfolio * state.swr >= fiTargetThisYear;
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
      coastFiReached,
      coastProjection,
      sustainableMonthly: (portfolio * state.swr) / 12,
      retired,
    });
  }

  const retirementRow =
    rows.find((r) => r.age1 === state.retirementAge) ?? null;
  const survivesToEnd = rows[rows.length - 1].portfolio > 0;

  return {
    rows,
    fiYear,
    fiAge,
    coastFiYear,
    coastFiAge,
    retirementRow,
    retirementTargetAnnual,
    survivesToEnd,
  };
}
