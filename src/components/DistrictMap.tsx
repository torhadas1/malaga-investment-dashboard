'use client';

import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Listing, DISTRICT_COLORS, DISTRICT_COORDS } from '@/lib/types';
import { computeDistrictStats, formatEur } from '@/lib/data';
import { MapPin } from 'lucide-react';

interface DistrictMapProps {
  listings: Listing[];
  onDistrictClick?: (district: string) => void;
}

// Lightweight SVG-based district bubble map (no Leaflet dependency needed for initial render)
export function DistrictMap({ listings, onDistrictClick }: DistrictMapProps) {
  const stats = computeDistrictStats(listings);
  
  // Malaga bounds
  const minLat = 36.66, maxLat = 36.74;
  const minLng = -4.50, maxLng = -4.37;
  const width = 600, height = 400;

  const toSvg = (lat: number, lng: number): [number, number] => {
    const x = ((lng - minLng) / (maxLng - minLng)) * width;
    const y = height - ((lat - minLat) / (maxLat - minLat)) * height;
    return [x, y];
  };

  const maxCount = Math.max(...stats.map(s => s.count));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          District Investment Map — Málaga
        </CardTitle>
      </CardHeader>
      <CardContent>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" style={{ maxHeight: 400 }}>
          {/* Background */}
          <rect width={width} height={height} fill="hsl(var(--muted))" rx="12" opacity="0.3" />
          
          {/* Coast line approximation */}
          <path
            d={`M 0 ${height * 0.85} Q ${width * 0.3} ${height * 0.75}, ${width * 0.5} ${height * 0.82} T ${width} ${height * 0.7}`}
            fill="none"
            stroke="#60a5fa"
            strokeWidth="2"
            strokeDasharray="8 4"
            opacity="0.4"
          />
          <text x={width * 0.5} y={height * 0.95} textAnchor="middle" fontSize="11" fill="#60a5fa" opacity="0.6">
            Mediterranean Sea
          </text>

          {/* District bubbles */}
          {stats.map(s => {
            const coords = DISTRICT_COORDS[s.name];
            if (!coords) return null;
            const [cx, cy] = toSvg(coords[0], coords[1]);
            const r = 20 + (s.count / maxCount) * 40;
            const color = DISTRICT_COLORS[s.name] || '#6b7280';
            const scoreColor = s.avgScore >= 50 ? '#22c55e' : s.avgScore >= 40 ? '#eab308' : '#ef4444';

            return (
              <g
                key={s.name}
                className="cursor-pointer transition-transform hover:scale-110"
                onClick={() => onDistrictClick?.(s.name)}
              >
                {/* Outer ring: score indicator */}
                <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke={scoreColor} strokeWidth="3" opacity="0.5" />
                {/* Main bubble */}
                <circle cx={cx} cy={cy} r={r} fill={color} opacity="0.7" />
                <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="1.5" />
                {/* Labels */}
                <text x={cx} y={cy - 8} textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">
                  {s.name.length > 12 ? s.name.substring(0, 10) + '…' : s.name}
                </text>
                <text x={cx} y={cy + 4} textAnchor="middle" fontSize="9" fill="white" opacity="0.9">
                  {s.count} props
                </text>
                <text x={cx} y={cy + 16} textAnchor="middle" fontSize="9" fill="white" opacity="0.9">
                  Ø{s.avgScore} pts
                </text>
                <text x={cx} y={cy + 28} textAnchor="middle" fontSize="8" fill="white" opacity="0.8">
                  €{Math.round(s.avgPriceSqm)}/m²
                </text>
              </g>
            );
          })}

          {/* Legend */}
          <g transform={`translate(10, 10)`}>
            <rect width="130" height="55" rx="6" fill="hsl(var(--background))" opacity="0.85" />
            <text x="8" y="15" fontSize="9" fontWeight="bold" fill="hsl(var(--foreground))">Legend</text>
            <circle cx="16" cy="28" r="5" fill="none" stroke="#22c55e" strokeWidth="2" />
            <text x="26" y="31" fontSize="8" fill="hsl(var(--foreground))">Avg Score ≥50</text>
            <circle cx="16" cy="43" r="5" fill="none" stroke="#ef4444" strokeWidth="2" />
            <text x="26" y="46" fontSize="8" fill="hsl(var(--foreground))">Avg Score &lt;40</text>
          </g>
        </svg>

        {/* District table */}
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
          {stats.map(s => (
            <button
              key={s.name}
              onClick={() => onDistrictClick?.(s.name)}
              className="text-left p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: DISTRICT_COLORS[s.name] }} />
                <span className="text-xs font-semibold">{s.name}</span>
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {s.count} listings · Ø{s.avgScore}/100 · {formatEur(s.avgPriceSqm)}/m²
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
