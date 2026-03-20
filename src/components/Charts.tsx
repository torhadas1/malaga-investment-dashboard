'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Cell,
  PieChart, Pie,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Listing, DISTRICT_COLORS, STRATEGY_COLORS } from '@/lib/types';
import { computeDistrictStats, getScoreBands, formatEur } from '@/lib/data';

interface ChartsProps {
  listings: Listing[];
}

export function DistrictBarChart({ listings }: ChartsProps) {
  const stats = computeDistrictStats(listings);
  const data = stats.map(s => ({
    name: s.name,
    'Listings Avg': s.avgPriceSqm,
    'Market Avg': s.marketAvg,
    count: s.count,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">€/m² by District: Listings vs Market Average</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={50} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `€${v}`} />
            <RTooltip
              formatter={(value: unknown, name: unknown) => [`€${value}/m²`, String(name)]}
              contentStyle={{ fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="Listings Avg" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Market Avg" fill="#ef4444" radius={[4, 4, 0, 0]} opacity={0.6} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ScoreVsValueScatter({ listings }: ChartsProps) {
  const data = listings.map(l => ({
    x: l.value_gap_pct,
    y: l.total_score,
    z: l.sqm,
    name: l.id,
    district: l.district,
    price: l.price_eur,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Score vs Value Gap (size = m²)</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              type="number"
              dataKey="x"
              name="Value Gap %"
              tick={{ fontSize: 10 }}
              label={{ value: 'Value Gap %', position: 'insideBottom', offset: -5, fontSize: 10 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Score"
              tick={{ fontSize: 10 }}
              label={{ value: 'Score', angle: -90, position: 'insideLeft', fontSize: 10 }}
            />
            <ZAxis type="number" dataKey="z" range={[30, 300]} />
            <RTooltip
              content={({ payload }) => {
                if (!payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-background border rounded-lg p-2 text-xs shadow-lg">
                    <p className="font-bold">{d.name}</p>
                    <p>{d.district} · {formatEur(d.price)}</p>
                    <p>Score: {d.y} · Gap: {d.x > 0 ? '-' : '+'}{Math.abs(d.x).toFixed(1)}%</p>
                    <p>{d.z}m²</p>
                  </div>
                );
              }}
            />
            <Scatter data={data}>
              {data.map((entry, i) => (
                <Cell key={i} fill={DISTRICT_COLORS[entry.district] || '#6b7280'} fillOpacity={0.7} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ScorePieChart({ listings }: ChartsProps) {
  const bands = getScoreBands(listings);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Score Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={bands}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              dataKey="count"
              nameKey="label"
              label={((props: any) => `${props.count ?? ''}`) as any}
              labelLine={false}
            >
              {bands.map((b, i) => (
                <Cell key={i} fill={b.color} />
              ))}
            </Pie>
            <RTooltip formatter={(value: unknown, name: unknown) => [String(value), String(name)]} contentStyle={{ fontSize: 11 }} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function StrategyRadar({ listings }: ChartsProps) {
  const strategies = Object.keys(STRATEGY_COLORS);
  const data = strategies.map(s => {
    const items = listings.filter(l => l.strategy === s);
    if (items.length === 0) return null;
    return {
      strategy: s.replace(/[🏖️📈🏠]/g, '').trim(),
      'Avg Score': Math.round(items.reduce((a, l) => a + l.total_score, 0) / items.length),
      'Avg Value Gap': Math.round(items.reduce((a, l) => a + Math.max(l.value_gap_pct, 0), 0) / items.length),
      'Avg Utility': Math.round(items.reduce((a, l) => a + l.p2_rental_utility, 0) / items.length * 5),
      'Avg Location': Math.round(items.reduce((a, l) => a + l.p3_location_tier, 0) / items.length * 4),
      Count: items.length,
    };
  }).filter(Boolean);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Strategy Profile Comparison</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="strategy" tick={{ fontSize: 9 }} />
            <PolarRadiusAxis tick={{ fontSize: 8 }} />
            <Radar name="Avg Score" dataKey="Avg Score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            <Radar name="Avg Value Gap" dataKey="Avg Value Gap" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
