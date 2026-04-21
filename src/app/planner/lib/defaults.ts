// Israeli tax & social-insurance defaults for 2026.
// All monetary values are NIS per month unless noted otherwise.
// Sources: Mas Hachnasa brackets, Bituach Leumi rates. These are editable in the UI —
// if they shift year-to-year the user just retypes them.

export interface TaxBracket {
  upTo: number | null; // monthly NIS; null = no upper bound
  rate: number; // marginal rate as decimal, e.g. 0.10
}

export interface SocialRates {
  // Below the reduced-rate ceiling
  blLow: number; // Bituach Leumi low rate
  healthLow: number; // Mas Briut low rate
  // Above the reduced-rate ceiling, up to full ceiling
  blHigh: number;
  healthHigh: number;
}

export interface TaxConfig {
  brackets: TaxBracket[];
  employee: SocialRates;
  freelancer: SocialRates;
  reducedCeiling: number; // monthly NIS (~60% average wage)
  fullCeiling: number; // monthly NIS — no BL/health above this
  creditPointValue: number; // NIS/month reduction per credit point
}

// 2026 monthly brackets (approximate, rounded).
export const DEFAULT_BRACKETS: TaxBracket[] = [
  { upTo: 7_010, rate: 0.10 },
  { upTo: 10_060, rate: 0.14 },
  { upTo: 16_150, rate: 0.20 },
  { upTo: 22_440, rate: 0.31 },
  { upTo: 46_690, rate: 0.35 },
  { upTo: 60_130, rate: 0.47 },
  { upTo: null, rate: 0.50 },
];

export const DEFAULT_TAX_CONFIG: TaxConfig = {
  brackets: DEFAULT_BRACKETS,
  employee: {
    blLow: 0.004,
    healthLow: 0.031,
    blHigh: 0.07,
    healthHigh: 0.05,
  },
  freelancer: {
    blLow: 0.0287,
    healthLow: 0.031,
    blHigh: 0.1283,
    healthHigh: 0.05,
  },
  reducedCeiling: 7_522,
  fullCeiling: 50_695,
  creditPointValue: 242,
};

export interface EarnerState {
  name: string;
  employeeGross: number; // monthly NIS
  freelancerGross: number; // monthly NIS
  creditPoints: number;
  currentAge: number;
}

export interface Kid {
  id: string;
  startYear: number; // 0 = this year, 1 = next year, ...
  monthlyCost: number; // additional monthly NIS while active
}

export interface PlannerState {
  portfolio: number; // starting portfolio value, NIS
  growthRate: number; // annual nominal return, decimal (e.g. 0.07)
  swr: number; // safe withdrawal rate, decimal (e.g. 0.04)
  retirementAge: number; // target age of earner 1 at which saving stops
  expenseInflation: number; // annual, decimal
  incomeGrowth: number; // annual, decimal
  baseMonthlyExpenses: number; // current monthly expenses (ex-kids)
  earners: [EarnerState, EarnerState];
  kids: Kid[];
  horizonYears: number; // how far to project (e.g. 60)
  tax: TaxConfig;
}

export const DEFAULT_STATE: PlannerState = {
  portfolio: 100_000,
  growthRate: 0.07,
  swr: 0.04,
  retirementAge: 50,
  expenseInflation: 0,
  incomeGrowth: 0,
  baseMonthlyExpenses: 15_000,
  earners: [
    { name: "Tor", employeeGross: 20_000, freelancerGross: 5_000, creditPoints: 2.25, currentAge: 32 },
    { name: "Shira", employeeGross: 0, freelancerGross: 15_000, creditPoints: 2.75, currentAge: 30 },
  ],
  kids: [],
  horizonYears: 50,
  tax: DEFAULT_TAX_CONFIG,
};
