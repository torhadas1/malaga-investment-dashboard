'use client';

import { useState, useEffect, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Listing } from '@/lib/types';
import { KPICards } from '@/components/KPICards';
import { FilterPanel, FilterState, defaultFilters, applyFilters } from '@/components/FilterPanel';
import { PropertyCard } from '@/components/PropertyCard';
import { DistrictBarChart, ScoreVsValueScatter, ScorePieChart, StrategyRadar } from '@/components/Charts';
import { DistrictMap } from '@/components/DistrictMap';
import { FinancialCalculator } from '@/components/FinancialCalculator';
import { LayoutDashboard, List, BarChart3, Calculator, Map } from 'lucide-react';

export default function Dashboard() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    fetch(`${basePath}/listings.json`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: Listing[]) => {
        setListings(data);
        setSelectedListing(data[0] || null);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load listings:", err);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => applyFilters(listings, filters), [listings, filters]);

  const handleDistrictClick = (district: string) => {
    setFilters(prev => {
      const next = new Set(prev.districts);
      if (next.has(district)) next.delete(district);
      else {
        next.clear();
        next.add(district);
      }
      return { ...prev, districts: next };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-lg font-semibold">Loading Málaga Investment Dashboard…</p>
          <p className="text-sm text-muted-foreground">{listings.length} properties · 8 districts · Q1 2026</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card sticky top-0 z-50">
          <div className="max-w-[1600px] mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  🏡 Málaga Investment Dashboard
                </h1>
                <p className="text-xs text-muted-foreground">
                  Q1 2026 · {listings.length} properties · Idealista + Fotocasa + Pisos.com · Budget &lt;€600k
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full font-medium">
                  ⚠️ VFT Moratorium Active
                </span>
                <span className="text-[10px] px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full font-medium">
                  5-Pillar Scoring v3.0
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-[1600px] mx-auto px-4 py-4 space-y-4">
          {/* KPI Row */}
          <KPICards listings={filtered} />

          {/* Filters */}
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            listings={listings}
            filteredCount={filtered.length}
          />

          {/* Tab Navigation */}
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-5 max-w-xl">
              <TabsTrigger value="overview" className="text-xs gap-1">
                <LayoutDashboard className="h-3 w-3" /> Overview
              </TabsTrigger>
              <TabsTrigger value="listings" className="text-xs gap-1">
                <List className="h-3 w-3" /> Listings
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs gap-1">
                <BarChart3 className="h-3 w-3" /> Analytics
              </TabsTrigger>
              <TabsTrigger value="map" className="text-xs gap-1">
                <Map className="h-3 w-3" /> Map
              </TabsTrigger>
              <TabsTrigger value="calculator" className="text-xs gap-1">
                <Calculator className="h-3 w-3" /> Calculator
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Top 10 */}
                <div className="lg:col-span-2 space-y-3">
                  <h2 className="text-sm font-bold">🏆 Top Investment Opportunities</h2>
                  <div className="space-y-2">
                    {filtered.slice(0, 10).map((l, i) => (
                      <div key={l.id} onClick={() => setSelectedListing(l)}>
                        <PropertyCard listing={l} rank={i + 1} compact />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Side: Selected Property Detail */}
                <div className="space-y-3">
                  <h2 className="text-sm font-bold">📋 Property Detail</h2>
                  {selectedListing ? (
                    <PropertyCard listing={selectedListing} />
                  ) : (
                    <p className="text-xs text-muted-foreground">Click a property to see details</p>
                  )}

                  {/* Quick Charts */}
                  <ScorePieChart listings={filtered} />
                </div>
              </div>
            </TabsContent>

            {/* Listings Tab */}
            <TabsContent value="listings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((l, i) => (
                  <PropertyCard key={l.id} listing={l} rank={i + 1} />
                ))}
              </div>
              {filtered.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No properties match your filters. Try adjusting.
                </div>
              )}
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <DistrictBarChart listings={filtered} />
                <ScoreVsValueScatter listings={filtered} />
                <ScorePieChart listings={filtered} />
                <StrategyRadar listings={filtered} />
              </div>
            </TabsContent>

            {/* Map Tab */}
            <TabsContent value="map" className="space-y-4">
              <DistrictMap listings={filtered} onDistrictClick={handleDistrictClick} />
            </TabsContent>

            {/* Calculator Tab */}
            <TabsContent value="calculator" className="space-y-4">
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Select a property from the list above, or pick from the top opportunities:
                </p>
                <div className="flex flex-wrap gap-2">
                  {filtered.slice(0, 15).map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setSelectedListing(l)}
                      className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                        selectedListing?.id === l.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {l.id} ({l.total_score}pts) — {l.district}
                    </button>
                  ))}
                </div>
                {selectedListing && <FinancialCalculator listing={selectedListing} />}
              </div>
            </TabsContent>
          </Tabs>
        </main>

        {/* Footer */}
        <footer className="border-t mt-8 py-4 px-4 text-center text-[10px] text-muted-foreground">
          <p>Málaga Real Estate Investment Dashboard · Q1 2026 · Data: Fotocasa + Pisos.com</p>
          <p>5-Pillar Scoring Algorithm v3.0 · {listings.length} properties analyzed · VFT Moratorium: Active since Aug 2025</p>
          <p className="mt-1">⚠️ This is research intelligence, not financial advice. Always conduct independent due diligence.</p>
        </footer>
      </div>
    </TooltipProvider>
  );
}
