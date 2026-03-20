'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Listing } from '@/lib/types';
import { formatEur } from '@/lib/data';
import { Building2, TrendingUp, Star, Key, Target, BarChart3 } from 'lucide-react';

interface KPICardsProps {
  listings: Listing[];
}

export function KPICards({ listings }: KPICardsProps) {
  const totalListings = listings.length;
  const avgScore = Math.round(listings.reduce((s, l) => s + l.total_score, 0) / totalListings);
  const avgPriceSqm = Math.round(listings.reduce((s, l) => s + l.price_per_sqm, 0) / totalListings);
  const gems = listings.filter(l => l.total_score >= 70).length;
  const vftCount = listings.filter(l => l.vft_license).length;
  const avgGap = Math.round(listings.reduce((s, l) => s + l.value_gap_pct, 0) / totalListings * 10) / 10;
  const medianPrice = [...listings].sort((a, b) => a.price_eur - b.price_eur)[Math.floor(totalListings / 2)]?.price_eur || 0;

  const kpis = [
    {
      icon: Building2,
      label: 'Properties',
      value: totalListings.toString(),
      sub: `${formatEur(medianPrice)} median`,
      color: '#3b82f6',
    },
    {
      icon: BarChart3,
      label: 'Avg Score',
      value: `${avgScore}/100`,
      sub: `${formatEur(avgPriceSqm)}/m² avg`,
      color: avgScore >= 50 ? '#22c55e' : '#f97316',
    },
    {
      icon: Star,
      label: 'Hidden Gems',
      value: gems.toString(),
      sub: 'Score ≥70',
      color: '#eab308',
    },
    {
      icon: Target,
      label: 'Avg Value Gap',
      value: `${avgGap > 0 ? '-' : '+'}${Math.abs(avgGap)}%`,
      sub: 'vs market avg',
      color: avgGap > 0 ? '#22c55e' : '#ef4444',
    },
    {
      icon: Key,
      label: 'VFT Licensed',
      value: vftCount.toString(),
      sub: 'Tourist license active',
      color: '#eab308',
    },
    {
      icon: TrendingUp,
      label: 'Best Opportunity',
      value: listings[0]?.id || '—',
      sub: `Score ${listings[0]?.total_score || 0}`,
      color: '#ef4444',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {kpis.map((kpi) => (
        <Card key={kpi.label} className="hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <kpi.icon className="h-4 w-4" style={{ color: kpi.color }} />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
            </div>
            <p className="text-xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
            <p className="text-[11px] text-muted-foreground">{kpi.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
