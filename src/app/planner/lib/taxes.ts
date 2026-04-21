import type { EarnerState, SocialRates, TaxConfig } from "./defaults";

export interface TaxBreakdown {
  gross: number;
  incomeTax: number;
  bituachLeumi: number;
  health: number;
  creditReduction: number;
  net: number;
  effectiveRate: number; // 0..1
}

function incomeTaxOnGross(gross: number, config: TaxConfig): number {
  let tax = 0;
  let prev = 0;
  for (const b of config.brackets) {
    const top = b.upTo ?? Infinity;
    if (gross <= prev) break;
    const slice = Math.min(gross, top) - prev;
    tax += slice * b.rate;
    prev = top;
    if (gross <= top) break;
  }
  return tax;
}

function socialOnSlice(gross: number, rates: SocialRates, config: TaxConfig): { bl: number; health: number } {
  const low = Math.min(gross, config.reducedCeiling);
  const high = Math.max(0, Math.min(gross, config.fullCeiling) - config.reducedCeiling);
  return {
    bl: low * rates.blLow + high * rates.blHigh,
    health: low * rates.healthLow + high * rates.healthHigh,
  };
}

// Compute monthly net for one earner. BL/health are assessed per employment type
// on that portion of their gross (employee ceiling and freelancer ceiling apply
// independently in reality; this treats them separately, which matches how most
// dual-status earners file).
export function grossToNet(earner: EarnerState, config: TaxConfig): TaxBreakdown {
  const gross = earner.employeeGross + earner.freelancerGross;
  const rawIncomeTax = incomeTaxOnGross(gross, config);
  const creditReduction = Math.min(rawIncomeTax, earner.creditPoints * config.creditPointValue);
  const incomeTax = rawIncomeTax - creditReduction;

  const empSoc = socialOnSlice(earner.employeeGross, config.employee, config);
  const freeSoc = socialOnSlice(earner.freelancerGross, config.freelancer, config);
  const bituachLeumi = empSoc.bl + freeSoc.bl;
  const health = empSoc.health + freeSoc.health;

  const net = gross - incomeTax - bituachLeumi - health;
  return {
    gross,
    incomeTax,
    bituachLeumi,
    health,
    creditReduction,
    net,
    effectiveRate: gross > 0 ? 1 - net / gross : 0,
  };
}

// What gross (keeping the employee/freelancer split ratio) do we need so that
// net equals the target? Binary search, ~30 iterations for NIS-level precision.
export function netToGross(
  targetNet: number,
  earner: EarnerState,
  config: TaxConfig,
): { gross: number; employeeGross: number; freelancerGross: number; breakdown: TaxBreakdown } {
  const currentGross = earner.employeeGross + earner.freelancerGross;
  const empShare = currentGross > 0 ? earner.employeeGross / currentGross : 1;

  let lo = 0;
  let hi = Math.max(targetNet * 3, 200_000);
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const trial: EarnerState = {
      ...earner,
      employeeGross: mid * empShare,
      freelancerGross: mid * (1 - empShare),
    };
    const net = grossToNet(trial, config).net;
    if (net < targetNet) lo = mid;
    else hi = mid;
  }
  const gross = (lo + hi) / 2;
  const employeeGross = gross * empShare;
  const freelancerGross = gross * (1 - empShare);
  const breakdown = grossToNet({ ...earner, employeeGross, freelancerGross }, config);
  return { gross, employeeGross, freelancerGross, breakdown };
}
