import { Listing, DistrictStats } from './types';

let _listings: Listing[] | null = null;

export async function getListings(): Promise<Listing[]> {
  if (_listings) return _listings;
  const res = await fetch('/listings.json');
  _listings = await res.json();
  return _listings!;
}

export function computeDistrictStats(listings: Listing[]): DistrictStats[] {
  const map = new Map<string, Listing[]>();
  for (const l of listings) {
    if (!map.has(l.district)) map.set(l.district, []);
    map.get(l.district)!.push(l);
  }

  return Array.from(map.entries())
    .map(([name, items]) => ({
      name,
      avgPriceSqm: Math.round(items.reduce((s, l) => s + l.price_per_sqm, 0) / items.length),
      marketAvg: items[0].district_avg_sqm,
      count: items.length,
      avgScore: Math.round(items.reduce((s, l) => s + l.total_score, 0) / items.length),
      avgPrice: Math.round(items.reduce((s, l) => s + l.price_eur, 0) / items.length),
      topScore: Math.max(...items.map(l => l.total_score)),
    }))
    .sort((a, b) => b.avgScore - a.avgScore);
}

export function getStrategyCounts(listings: Listing[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const l of listings) {
    counts[l.strategy] = (counts[l.strategy] || 0) + 1;
  }
  return counts;
}

export function getScoreBands(listings: Listing[]) {
  const bands = [
    { label: '⭐ 70-100 (Gems)', min: 70, max: 100, color: '#eab308', count: 0 },
    { label: '✅ 60-69 (Strong)', min: 60, max: 69, color: '#22c55e', count: 0 },
    { label: '🟡 50-59 (Solid)', min: 50, max: 59, color: '#3b82f6', count: 0 },
    { label: '🟠 40-49 (Fair)', min: 40, max: 49, color: '#f97316', count: 0 },
    { label: '🔴 <40 (Weak)', min: 0, max: 39, color: '#ef4444', count: 0 },
  ];
  for (const l of listings) {
    const band = bands.find(b => l.total_score >= b.min && l.total_score <= b.max);
    if (band) band.count++;
  }
  return bands;
}

export function formatEur(n: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

export function getGrossYield(price: number, rooms: number, district: string): { low: number; high: number } {
  // Monthly rental estimates by district and rooms
  const rentals: Record<string, Record<number, [number, number]>> = {
    'Centro': { 1: [650, 850], 2: [900, 1200], 3: [1200, 1600], 4: [1500, 2000], 5: [1800, 2500] },
    'Este': { 1: [550, 750], 2: [800, 1100], 3: [900, 1300], 4: [1200, 1700], 5: [1500, 2100] },
    'Teatinos': { 1: [500, 700], 2: [700, 950], 3: [850, 1150], 4: [1000, 1400], 5: [1200, 1700] },
    'Cruz de Humilladero': { 1: [450, 650], 2: [650, 900], 3: [800, 1100], 4: [950, 1300], 5: [1100, 1500] },
    'Bailén-Miraflores': { 1: [400, 600], 2: [600, 850], 3: [750, 1050], 4: [900, 1250], 5: [1050, 1450] },
    'Carretera de Cádiz': { 1: [450, 650], 2: [650, 900], 3: [800, 1100], 4: [950, 1300], 5: [1100, 1500] },
    'Ciudad Jardín': { 1: [400, 550], 2: [550, 800], 3: [700, 950], 4: [850, 1150], 5: [1000, 1350] },
    'Churriana': { 1: [350, 500], 2: [500, 700], 3: [650, 900], 4: [800, 1100], 5: [950, 1300] },
  };

  const distRent = rentals[district] || rentals['Cruz de Humilladero'];
  const r = Math.min(Math.max(rooms, 1), 5);
  const [low, high] = distRent[r] || [600, 900];

  return {
    low: Math.round((low * 12 / price) * 1000) / 10,
    high: Math.round((high * 12 / price) * 1000) / 10,
  };
}
