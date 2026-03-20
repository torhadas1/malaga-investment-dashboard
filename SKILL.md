# Real Estate Research Dashboard Skill

This skill enables an agent to build, analyze, and deploy high-end real estate investment dashboards using multi-source scraping (Idealista, Fotocasa, Pisos.com) and automated investment scoring.

## Core Capabilities

- **Multi-Source Scraping**: Integrated Apify actors for Idealista (bypassing DataDome) + local scrapers for other platforms.
- **5-Pillar Investment Scoring**:
  1. **Yield-to-Price (30%)**: GROSS yield relative to purchase price + 7% ITP.
  2. **Price-per-SQM (25%)**: Neighborhood-weighted valuation versus current market average.
  3. **VFT Licensing (20%)**: Existing license check or structural moratorium compliance.
  4. **Value-Add (15%)**: Refurbishment potential or distressed asset markers.
  5. **Liquidity (10%)**: Days on market + district demand velocity.
- **Interactive Visualization**: Next.js/Tailwind dashboard with district mapping (GPS) and financial simulators.
- **Automated Deployment**: CI/CD pipeline for GitHub Pages.

## Usage Guide

1. **Phase 1: Discovery**: Scrape 40-50 listings from target sources to verify data structure.
2. **Phase 2: Scale & Enrich**: Use `apify` for high-protection sites (Idealista) and local scripts for secondary sites.
3. **Phase 3: Standardize**: Merge all sources into a unified `listings_master.json`.
4. **Phase 4: Score**: Run the investment algorithm to generate the 'Hidden Gems' top 10.
5. **Phase 5: Deploy**: Push the `dashboard/` folder to GitHub to generate the live URL.

## Technical Stack

- **Backend**: Python (pandas, requests, beautifulsoup4).
- **Frontend**: Next.js 16, Lucide, Tailwind CSS.
- **Infrastructure**: GitHub Actions + Pages.
- **External**: Apify (Smart Idealista Scraper).

---
*Created on 2026-03-20 for the Málaga Investment Project.*
