'use client';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Listing, DISTRICT_COLORS, STRATEGY_COLORS } from '@/lib/types';
import { X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

export interface FilterState {
  search: string;
  priceMin: number;
  priceMax: number;
  scoreMin: number;
  sqmMin: number;
  sqmMax: number;
  roomsMin: number;
  districts: Set<string>;
  strategies: Set<string>;
  amenities: Set<string>;
  sortBy: string;
  sortDir: 'asc' | 'desc';
}

export const defaultFilters: FilterState = {
  search: '',
  priceMin: 0,
  priceMax: 600000,
  scoreMin: 0,
  sqmMin: 0,
  sqmMax: 999,
  roomsMin: 0,
  districts: new Set(),
  strategies: new Set(),
  amenities: new Set(),
  sortBy: 'total_score',
  sortDir: 'desc',
};

interface FilterPanelProps {
  filters: FilterState;
  setFilters: (fn: (prev: FilterState) => FilterState) => void;
  listings: Listing[];
  filteredCount: number;
}

const AMENITY_OPTIONS = [
  { key: 'elevator', label: 'Elevator' },
  { key: 'terrace', label: 'Terrace' },
  { key: 'parking', label: 'Parking' },
  { key: 'air_conditioning', label: 'A/C' },
  { key: 'pool', label: 'Pool' },
  { key: 'furnished', label: 'Furnished' },
  { key: 'reformado', label: 'Reformed' },
  { key: 'vft_license', label: 'VFT License' },
];

const SORT_OPTIONS = [
  { key: 'total_score', label: 'Score' },
  { key: 'price_eur', label: 'Price' },
  { key: 'price_per_sqm', label: '€/m²' },
  { key: 'value_gap_pct', label: 'Value Gap' },
  { key: 'sqm', label: 'Size' },
];

export function FilterPanel({ filters, setFilters, listings, filteredCount }: FilterPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const districts = [...new Set(listings.map(l => l.district))].sort();
  const strategies = [...new Set(listings.map(l => l.strategy))];

  const toggleSet = (field: 'districts' | 'strategies' | 'amenities', val: string) => {
    setFilters((prev) => {
      const next = new Set(prev[field]);
      if (next.has(val)) next.delete(val);
      else next.add(val);
      return { ...prev, [field]: next };
    });
  };

  const activeCount = (filters.districts.size > 0 ? 1 : 0)
    + (filters.strategies.size > 0 ? 1 : 0)
    + (filters.amenities.size > 0 ? 1 : 0)
    + (filters.scoreMin > 0 ? 1 : 0)
    + (filters.priceMax < 600000 ? 1 : 0)
    + (filters.search ? 1 : 0);

  return (
    <div className="bg-card border rounded-xl p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="font-semibold text-sm">Filters</span>
          {activeCount > 0 && (
            <Badge variant="secondary" className="text-[10px] h-5">{activeCount} active</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{filteredCount}/{listings.length} properties</span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-primary hover:underline"
          >
            {expanded ? 'Collapse' : 'Expand'}
          </button>
          {activeCount > 0 && (
            <button
              onClick={() => setFilters(() => defaultFilters)}
              className="text-xs text-destructive hover:underline flex items-center gap-0.5"
            >
              <X className="h-3 w-3" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Quick Search + Score Threshold */}
      <div className="flex gap-2">
        <Input
          placeholder="Search title, address, ID..."
          value={filters.search}
          onChange={(e) => setFilters(p => ({ ...p, search: e.target.value }))}
          className="h-8 text-xs"
        />
        <div className="flex items-center gap-1 shrink-0">
          <label className="text-[10px] text-muted-foreground">Score ≥</label>
          <Input
            type="number"
            min={0}
            max={100}
            value={filters.scoreMin || ''}
            onChange={(e) => setFilters(p => ({ ...p, scoreMin: parseInt(e.target.value) || 0 }))}
            className="h-8 w-16 text-xs"
          />
        </div>
      </div>

      {expanded && (
        <>
          {/* Price & Size Range */}
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1">
              <label className="text-muted-foreground">Price €</label>
              <Input
                type="number"
                value={filters.priceMin || ''}
                onChange={(e) => setFilters(p => ({ ...p, priceMin: parseInt(e.target.value) || 0 }))}
                className="h-7 w-24 text-xs"
                placeholder="Min"
              />
              <span>–</span>
              <Input
                type="number"
                value={filters.priceMax || ''}
                onChange={(e) => setFilters(p => ({ ...p, priceMax: parseInt(e.target.value) || 600000 }))}
                className="h-7 w-24 text-xs"
                placeholder="Max"
              />
            </div>
            <div className="flex items-center gap-1">
              <label className="text-muted-foreground">m²</label>
              <Input
                type="number"
                value={filters.sqmMin || ''}
                onChange={(e) => setFilters(p => ({ ...p, sqmMin: parseInt(e.target.value) || 0 }))}
                className="h-7 w-16 text-xs"
                placeholder="Min"
              />
              <span>–</span>
              <Input
                type="number"
                value={filters.sqmMax || ''}
                onChange={(e) => setFilters(p => ({ ...p, sqmMax: parseInt(e.target.value) || 999 }))}
                className="h-7 w-16 text-xs"
                placeholder="Max"
              />
            </div>
            <div className="flex items-center gap-1">
              <label className="text-muted-foreground">Rooms ≥</label>
              <Input
                type="number"
                min={0}
                value={filters.roomsMin || ''}
                onChange={(e) => setFilters(p => ({ ...p, roomsMin: parseInt(e.target.value) || 0 }))}
                className="h-7 w-14 text-xs"
              />
            </div>
          </div>

          {/* Districts */}
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Districts</p>
            <div className="flex flex-wrap gap-1">
              {districts.map(d => (
                <Badge
                  key={d}
                  variant={filters.districts.has(d) ? 'default' : 'outline'}
                  className="text-[10px] cursor-pointer h-5"
                  style={filters.districts.has(d) ? { backgroundColor: DISTRICT_COLORS[d] || '#6b7280' } : {}}
                  onClick={() => toggleSet('districts', d)}
                >
                  {d}
                </Badge>
              ))}
            </div>
          </div>

          {/* Strategies */}
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Strategy</p>
            <div className="flex flex-wrap gap-1">
              {strategies.map(s => (
                <Badge
                  key={s}
                  variant={filters.strategies.has(s) ? 'default' : 'outline'}
                  className="text-[10px] cursor-pointer h-5"
                  style={filters.strategies.has(s) ? { backgroundColor: STRATEGY_COLORS[s] || '#6b7280' } : {}}
                  onClick={() => toggleSet('strategies', s)}
                >
                  {s.replace(/[🏖️📈🏠]/g, '').trim()}
                </Badge>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Amenities</p>
            <div className="flex flex-wrap gap-1">
              {AMENITY_OPTIONS.map(a => (
                <Badge
                  key={a.key}
                  variant={filters.amenities.has(a.key) ? 'default' : 'outline'}
                  className="text-[10px] cursor-pointer h-5"
                  onClick={() => toggleSet('amenities', a.key)}
                >
                  {a.label}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Sort */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-muted-foreground">Sort:</span>
        {SORT_OPTIONS.map(s => (
          <button
            key={s.key}
            onClick={() => setFilters(p => ({
              ...p,
              sortBy: s.key,
              sortDir: p.sortBy === s.key ? (p.sortDir === 'desc' ? 'asc' : 'desc') : 'desc',
            }))}
            className={`px-2 py-0.5 rounded text-[10px] ${
              filters.sortBy === s.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {s.label} {filters.sortBy === s.key && (filters.sortDir === 'desc' ? '↓' : '↑')}
          </button>
        ))}
      </div>
    </div>
  );
}

export function applyFilters(listings: Listing[], f: FilterState): Listing[] {
  let result = listings.filter(l => {
    if (f.search) {
      const q = f.search.toLowerCase();
      if (
        !l.title.toLowerCase().includes(q) &&
        !l.address.toLowerCase().includes(q) &&
        !l.id.toLowerCase().includes(q) &&
        !l.district.toLowerCase().includes(q)
      ) return false;
    }
    if (l.price_eur < f.priceMin || l.price_eur > f.priceMax) return false;
    if (l.total_score < f.scoreMin) return false;
    if (l.sqm < f.sqmMin || l.sqm > f.sqmMax) return false;
    if (f.roomsMin > 0 && l.rooms < f.roomsMin) return false;
    if (f.districts.size > 0 && !f.districts.has(l.district)) return false;
    if (f.strategies.size > 0 && !f.strategies.has(l.strategy)) return false;
    if (f.amenities.size > 0) {
      for (const a of f.amenities) {
        if (!(l as unknown as Record<string, unknown>)[a]) return false;
      }
    }
    return true;
  });

  const sortKey = f.sortBy as keyof Listing;
  result.sort((a, b) => {
    const av = a[sortKey] as number;
    const bv = b[sortKey] as number;
    return f.sortDir === 'desc' ? bv - av : av - bv;
  });

  return result;
}
