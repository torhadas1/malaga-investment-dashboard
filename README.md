# 🏡 Málaga Investment Dashboard

Interactive real estate investment intelligence dashboard for Málaga, Spain.

## Features

### 📊 Overview Tab
- **KPI Cards** — 6 key metrics: total properties, avg score, hidden gems count, value gap, VFT licenses, best opportunity
- **Top 10 Ranked List** — Compact property cards sorted by investment score
- **Property Detail Panel** — Full breakdown with 5-pillar scoring, amenities, embedded equity calculation
- **Score Distribution Pie Chart**

### 📋 Listings Tab
- **Full Property Grid** — All 237 properties in ranked 3-column cards
- Each card shows: score gauge, price/m², value gap %, gross yield range, 5-pillar breakdown, amenity badges

### 📈 Analytics Tab
- **District Bar Chart** — Listings avg €/m² vs market average by district
- **Score vs Value Gap Scatter** — Interactive scatter plot (bubble size = m²)
- **Score Distribution Pie** — Band breakdown (Gems/Strong/Solid/Fair/Weak)
- **Strategy Radar** — Comparison of Airbnb Winner vs Capital Appreciation vs Long-Term Rental

### 🗺️ Map Tab
- **SVG Bubble Map** — Geographic visualization of all 8 Málaga districts
- Bubble size = listing count, ring color = average score indicator
- Clickable districts filter the entire dashboard

### 🧮 Calculator Tab
- **Full Investment Calculator** — Spanish tax-aware financial modeling
- Inputs: purchase price, reform cost, monthly rent, LTV%, interest rate, term, appreciation
- Outputs: acquisition costs (ITP 7%, notary), mortgage, gross/net yield, monthly cash flow, cash-on-cash return
- **5-Year Projection** — Capital gains + net rental income + total return

### 🔍 Filter System
- Text search across title, address, ID, district
- Score threshold, price range, size range, room minimum
- District toggle chips, strategy toggle chips, amenity requirement badges
- Multi-criteria sort (Score, Price, €/m², Value Gap, Size) with direction toggle

## Tech Stack
- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS 4** + **shadcn/ui** components
- **Recharts** — Bar, scatter, pie, radar charts
- **Lucide React** — Icons

## Quick Start

```bash
cd real_estate_dashboard/dashboard
npm install
npm run dev
# → http://localhost:3000
```

## Data
- `public/listings.json` — 237 scored properties from `scored_v3.jsonl`
- Sources: Fotocasa (126) + Pisos.com (111)
- Scoring: 5-Pillar Algorithm v3.0 (Value Gap, Rental Utility, Location Tier, Legal Safety, Reform Potential)

## Market Context (Q1 2026)
- VFT tourist license moratorium active since Aug 2025 (3-year)
- Budget filter: <€600,000
- 8 districts analyzed with updated live market averages
