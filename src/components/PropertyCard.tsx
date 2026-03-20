'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScoreGauge } from './ScoreGauge';
import { PillarBar } from './PillarBar';
import { Listing, STRATEGY_COLORS } from '@/lib/types';
import { formatEur, getGrossYield } from '@/lib/data';
import {
  Building2,
  Bed,
  Bath,
  ArrowUpDown,
  Wind,
  Car,
  Sofa,
  Waves,
  ExternalLink,
  TrendingDown,
  Percent,
} from 'lucide-react';

interface PropertyCardProps {
  listing: Listing;
  rank?: number;
  compact?: boolean;
}

export function PropertyCard({ listing, rank, compact = false }: PropertyCardProps) {
  const l = listing;
  const yld = getGrossYield(l.price_eur, l.rooms, l.district);
  const embeddedEquity = Math.round(l.value_gap_pct > 0 ? (l.value_gap_pct / 100) * l.sqm * l.district_avg_sqm : 0);
  const strategyColor = STRATEGY_COLORS[l.strategy] || '#6b7280';

  const pillars = [
    { label: 'Value Gap', value: l.p1_value_gap, max: 25, color: '#ef4444' },
    { label: 'Utility', value: l.p2_rental_utility, max: 20, color: '#f97316' },
    { label: 'Location', value: l.p3_location_tier, max: 25, color: '#3b82f6' },
    { label: 'Legal', value: l.p4_legal_safety, max: 15, color: '#22c55e' },
    { label: 'Reform', value: l.p5_reform_potential, max: 15, color: '#8b5cf6' },
  ];

  if (compact) {
    return (
      <Card className="hover:shadow-lg transition-shadow border-l-4 cursor-pointer" style={{ borderLeftColor: strategyColor }}>
        <CardContent className="p-3 flex items-center gap-3">
          {rank && (
            <span className="text-2xl font-black text-muted-foreground/30 w-8 text-center">
              {rank}
            </span>
          )}
          <ScoreGauge score={l.total_score} size={52} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{l.title}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-bold text-foreground">{formatEur(l.price_eur)}</span>
              <span>·</span>
              <span>{l.sqm}m²</span>
              <span>·</span>
              <span>{l.rooms}bd/{l.baths}ba</span>
              <span>·</span>
              <span className={l.value_gap_pct > 0 ? 'text-green-600 font-semibold' : 'text-red-500'}>
                {l.value_gap_pct > 0 ? '-' : '+'}{Math.abs(l.value_gap_pct).toFixed(1)}%
              </span>
            </div>
            <div className="flex gap-1 mt-1">
              <Badge variant="outline" className="text-[10px] h-4 px-1" style={{ borderColor: strategyColor, color: strategyColor }}>
                {l.strategy.replace(/[🏖️📈🏠]/g, '').trim()}
              </Badge>
              <Badge variant="outline" className="text-[10px] h-4 px-1">{l.district}</Badge>
              {l.vft_license && <Badge className="text-[10px] h-4 px-1 bg-amber-500">VFT ✓</Badge>}
            </div>
          </div>
          <a
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-xl transition-all border-l-4 overflow-hidden" style={{ borderLeftColor: strategyColor }}>
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {rank && (
                <span className="text-3xl font-black text-muted-foreground/20">#{rank}</span>
              )}
              <div>
                <h3 className="font-bold text-sm leading-tight truncate">{l.title}</h3>
                <p className="text-xs text-muted-foreground">{l.address}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <Badge style={{ backgroundColor: strategyColor }} className="text-white text-[10px]">
                {l.strategy}
              </Badge>
              {l.vft_license && (
                <Badge className="bg-amber-500 text-white text-[10px]">🔑 VFT Licensed</Badge>
              )}
              <Badge variant="outline" className="text-[10px]">{l.source}</Badge>
            </div>
          </div>
          <ScoreGauge score={l.total_score} size={72} label="/100" />
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 space-y-3">
        {/* Price & Key Metrics */}
        <div className="grid grid-cols-4 gap-2 bg-muted/50 rounded-lg p-3">
          <div className="text-center">
            <p className="text-lg font-bold">{formatEur(l.price_eur)}</p>
            <p className="text-[10px] text-muted-foreground">Price</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">{formatEur(l.price_per_sqm)}</p>
            <p className="text-[10px] text-muted-foreground">€/m²</p>
          </div>
          <div className="text-center">
            <p className={`text-lg font-bold ${l.value_gap_pct > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {l.value_gap_pct > 0 ? '-' : '+'}{Math.abs(l.value_gap_pct).toFixed(1)}%
            </p>
            <p className="text-[10px] text-muted-foreground">vs Market</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-blue-600">{yld.low}–{yld.high}%</p>
            <p className="text-[10px] text-muted-foreground">Gross Yield</p>
          </div>
        </div>

        {/* Embedded Equity */}
        {embeddedEquity > 0 && (
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/30 rounded-lg px-3 py-2">
            <TrendingDown className="h-4 w-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700 dark:text-green-400">
              {formatEur(embeddedEquity)} embedded equity
            </span>
            <span className="text-xs text-muted-foreground ml-auto">
              (at €{l.district_avg_sqm}/m² market avg)
            </span>
          </div>
        )}

        {/* Property Details */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="flex items-center gap-1"><Bed className="h-3 w-3" />{l.rooms} bed</span>
          <span className="flex items-center gap-1"><Bath className="h-3 w-3" />{l.baths} bath</span>
          <span className="flex items-center gap-1"><ArrowUpDown className="h-3 w-3" />{l.sqm}m²</span>
          {l.elevator && <Badge variant="secondary" className="text-[10px] h-5"><Building2 className="h-3 w-3 mr-0.5" />Elevator</Badge>}
          {l.terrace && <Badge variant="secondary" className="text-[10px] h-5">☀️ Terrace</Badge>}
          {l.air_conditioning && <Badge variant="secondary" className="text-[10px] h-5"><Wind className="h-3 w-3 mr-0.5" />A/C</Badge>}
          {l.parking && <Badge variant="secondary" className="text-[10px] h-5"><Car className="h-3 w-3 mr-0.5" />Parking</Badge>}
          {l.furnished && <Badge variant="secondary" className="text-[10px] h-5"><Sofa className="h-3 w-3 mr-0.5" />Furnished</Badge>}
          {l.pool && <Badge variant="secondary" className="text-[10px] h-5"><Waves className="h-3 w-3 mr-0.5" />Pool</Badge>}
          {l.ground_floor && <Badge variant="destructive" className="text-[10px] h-5">Ground Floor</Badge>}
          {l.reformado && <Badge variant="secondary" className="text-[10px] h-5 bg-blue-100">✨ Reformed</Badge>}
        </div>

        {/* 5-Pillar Breakdown */}
        <PillarBar pillars={pillars} />

        {/* Description */}
        {l.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 italic">
            &ldquo;{l.description}&rdquo;
          </p>
        )}

        {/* Action */}
        <a
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View Listing <ExternalLink className="h-3 w-3" />
        </a>
      </CardContent>
    </Card>
  );
}
