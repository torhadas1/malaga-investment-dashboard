'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Listing } from '@/lib/types';
import { formatEur, getGrossYield } from '@/lib/data';
import { Calculator, Euro, Percent, TrendingUp, Minus, Building } from 'lucide-react';

interface FinancialCalculatorProps {
  listing: Listing;
}

export function FinancialCalculator({ listing }: FinancialCalculatorProps) {
  const l = listing;
  const baseYield = getGrossYield(l.price_eur, l.rooms, l.district);

  const [purchasePrice, setPurchasePrice] = useState(l.price_eur);
  const [reformCost, setReformCost] = useState(l.reformado ? 0 : Math.round(l.sqm * 500));
  const [monthlyRent, setMonthlyRent] = useState(Math.round((baseYield.low + baseYield.high) / 2 * l.price_eur / 1200));
  const [mortgagePercent, setMortgagePercent] = useState(70);
  const [interestRate, setInterestRate] = useState(3.5);
  const [mortgageYears, setMortgageYears] = useState(25);
  const [appreciationRate, setAppreciationRate] = useState(8);

  // Spanish transaction costs
  const itp = Math.round(purchasePrice * 0.07); // 7% ITP Andalucía
  const notaryFees = Math.round(purchasePrice * 0.015); // ~1.5% notary + registry
  const agencyFee = 0; // buyer typically doesn't pay in Spain
  const totalAcquisition = purchasePrice + itp + notaryFees + agencyFee + reformCost;

  // Mortgage calculation
  const mortgageAmount = Math.round(purchasePrice * mortgagePercent / 100);
  const downPayment = totalAcquisition - mortgageAmount;
  const monthlyRate = interestRate / 100 / 12;
  const nPayments = mortgageYears * 12;
  const monthlyMortgage = mortgageAmount > 0
    ? Math.round(mortgageAmount * (monthlyRate * Math.pow(1 + monthlyRate, nPayments)) / (Math.pow(1 + monthlyRate, nPayments) - 1))
    : 0;

  // Annual costs (Spain)
  const annualIBI = Math.round(purchasePrice * 0.006); // ~0.6% property tax
  const communityFees = 100 * 12; // ~€100/month community
  const insurance = 300;
  const maintenanceReserve = Math.round(monthlyRent * 12 * 0.05); // 5% of rent
  const managementFee = Math.round(monthlyRent * 12 * 0.08); // 8% if managed
  const totalAnnualCosts = annualIBI + communityFees + insurance + maintenanceReserve + managementFee;

  // Yields
  const annualRent = monthlyRent * 12;
  const grossYield = Math.round(annualRent / totalAcquisition * 1000) / 10;
  const netOperatingIncome = annualRent - totalAnnualCosts;
  const netYield = Math.round(netOperatingIncome / totalAcquisition * 1000) / 10;

  // Cash flow (with mortgage)
  const annualMortgage = monthlyMortgage * 12;
  const annualCashFlow = netOperatingIncome - annualMortgage;
  const monthlyCashFlow = Math.round(annualCashFlow / 12);

  // Cash-on-cash return (ROI on actual cash invested)
  const cashOnCash = downPayment > 0 ? Math.round(annualCashFlow / downPayment * 1000) / 10 : 0;

  // 5-year projection
  const fiveYearAppreciation = Math.round(purchasePrice * Math.pow(1 + appreciationRate / 100, 5) - purchasePrice);
  const fiveYearRent = Math.round(annualRent * 5 * 1.03); // 3% annual rent growth
  const fiveYearMortgagePaid = annualMortgage * 5;
  const fiveYearTotalReturn = fiveYearAppreciation + (netOperatingIncome * 5) - fiveYearMortgagePaid + (annualMortgage * 5 * 0.4); // rough principal paydown

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          Investment Calculator — {l.id}: {l.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <div>
            <label className="text-[10px] text-muted-foreground">Purchase Price</label>
            <Input
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(parseInt(e.target.value) || 0)}
              className="h-8 text-xs"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground">Reform Cost</label>
            <Input
              type="number"
              value={reformCost}
              onChange={(e) => setReformCost(parseInt(e.target.value) || 0)}
              className="h-8 text-xs"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground">Monthly Rent</label>
            <Input
              type="number"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(parseInt(e.target.value) || 0)}
              className="h-8 text-xs"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground">LTV %</label>
            <Input
              type="number"
              value={mortgagePercent}
              onChange={(e) => setMortgagePercent(parseInt(e.target.value) || 0)}
              className="h-8 text-xs"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground">Interest %</label>
            <Input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
              className="h-8 text-xs"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground">Term (yrs)</label>
            <Input
              type="number"
              value={mortgageYears}
              onChange={(e) => setMortgageYears(parseInt(e.target.value) || 0)}
              className="h-8 text-xs"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground">Annual Apprec. %</label>
            <Input
              type="number"
              step="0.5"
              value={appreciationRate}
              onChange={(e) => setAppreciationRate(parseFloat(e.target.value) || 0)}
              className="h-8 text-xs"
            />
          </div>
        </div>

        <Separator />

        {/* Results Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Acquisition */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-1.5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Euro className="h-3 w-3" /> Acquisition
            </p>
            <div className="text-xs space-y-0.5">
              <div className="flex justify-between"><span>Purchase</span><span className="font-mono">{formatEur(purchasePrice)}</span></div>
              <div className="flex justify-between"><span>ITP (7%)</span><span className="font-mono">{formatEur(itp)}</span></div>
              <div className="flex justify-between"><span>Notary/Reg</span><span className="font-mono">{formatEur(notaryFees)}</span></div>
              {reformCost > 0 && <div className="flex justify-between"><span>Reform</span><span className="font-mono">{formatEur(reformCost)}</span></div>}
              <Separator className="my-1" />
              <div className="flex justify-between font-bold"><span>Total In</span><span className="font-mono">{formatEur(totalAcquisition)}</span></div>
            </div>
          </div>

          {/* Mortgage */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-1.5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Building className="h-3 w-3" /> Mortgage
            </p>
            <div className="text-xs space-y-0.5">
              <div className="flex justify-between"><span>Loan ({mortgagePercent}%)</span><span className="font-mono">{formatEur(mortgageAmount)}</span></div>
              <div className="flex justify-between"><span>Down Payment</span><span className="font-mono">{formatEur(downPayment)}</span></div>
              <div className="flex justify-between"><span>Monthly</span><span className="font-mono font-bold">{formatEur(monthlyMortgage)}/mo</span></div>
              <div className="flex justify-between"><span>Rate</span><span className="font-mono">{interestRate}% × {mortgageYears}yr</span></div>
            </div>
          </div>

          {/* Yield */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-1.5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Percent className="h-3 w-3" /> Yield
            </p>
            <div className="text-xs space-y-0.5">
              <div className="flex justify-between"><span>Annual Rent</span><span className="font-mono">{formatEur(annualRent)}</span></div>
              <div className="flex justify-between"><span>Annual Costs</span><span className="font-mono text-red-500">−{formatEur(totalAnnualCosts)}</span></div>
              <div className="flex justify-between"><span>Gross Yield</span><span className="font-mono font-bold text-blue-600">{grossYield}%</span></div>
              <div className="flex justify-between"><span>Net Yield</span><span className="font-mono font-bold text-green-600">{netYield}%</span></div>
            </div>
          </div>

          {/* Cash Flow */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-1.5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Minus className="h-3 w-3" /> Cash Flow
            </p>
            <div className="text-xs space-y-0.5">
              <div className="flex justify-between"><span>Monthly CF</span>
                <span className={`font-mono font-bold ${monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {monthlyCashFlow >= 0 ? '+' : ''}{formatEur(monthlyCashFlow)}/mo
                </span>
              </div>
              <div className="flex justify-between"><span>Annual CF</span>
                <span className={`font-mono ${annualCashFlow >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {formatEur(annualCashFlow)}
                </span>
              </div>
              <div className="flex justify-between"><span>Cash-on-Cash</span><span className="font-mono font-bold">{cashOnCash}%</span></div>
            </div>
          </div>
        </div>

        {/* 5-Year Projection */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30 rounded-lg p-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-2">
            <TrendingUp className="h-3 w-3" /> 5-Year Projection (at {appreciationRate}% annual appreciation)
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-bold text-blue-600">{formatEur(fiveYearAppreciation)}</p>
              <p className="text-[10px] text-muted-foreground">Capital Gains</p>
            </div>
            <div>
              <p className="text-xl font-bold text-green-600">{formatEur(netOperatingIncome * 5)}</p>
              <p className="text-[10px] text-muted-foreground">Net Rental Income</p>
            </div>
            <div>
              <p className="text-xl font-bold text-purple-600">{formatEur(fiveYearAppreciation + netOperatingIncome * 5)}</p>
              <p className="text-[10px] text-muted-foreground">Total Return</p>
            </div>
          </div>
        </div>

        <p className="text-[9px] text-muted-foreground italic">
          * Spanish tax context: 7% ITP (Andalucía), ~0.6% IBI, 8% property management, 5% maintenance reserve. 
          Rental income taxed at ~19-24% for non-residents, ~19% for EU residents. IRPF deductions available for residents. 
          All figures are estimates — consult a Spanish fiscal advisor.
        </p>
      </CardContent>
    </Card>
  );
}
