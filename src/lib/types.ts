export interface Listing {
  id: string;
  source: string;
  title: string;
  price_eur: number;
  sqm: number;
  price_per_sqm: number;
  district: string;
  address: string;
  rooms: number;
  baths: number;
  ground_floor: boolean;
  elevator: boolean;
  terrace: boolean;
  balcony: boolean;
  pool: boolean;
  furnished: boolean;
  parking: boolean;
  air_conditioning: boolean;
  reformado: boolean;
  vft_license: boolean;
  url: string;
  description: string;
  district_avg_sqm: number;
  value_gap_pct: number;
  p1_value_gap: number;
  p2_rental_utility: number;
  p3_location_tier: number;
  p4_legal_safety: number;
  p5_reform_potential: number;
  total_score: number;
  strategy: string;
  // Idealista-specific fields (optional — only present for source="idealista")
  latitude?: number | null;
  longitude?: number | null;
  agent_phone?: string;
  agent_name?: string;
  thumbnail?: string;
  images?: string[];
  num_photos?: number;
  has_video?: boolean;
  has_3d_tour?: boolean;
  neighborhood?: string;
  property_type?: string;
  property_code?: string;
  has_garden?: boolean;
  has_storage?: boolean;
  new_development?: boolean;
}

export interface DistrictStats {
  name: string;
  avgPriceSqm: number;
  marketAvg: number;
  count: number;
  avgScore: number;
  avgPrice: number;
  topScore: number;
}

export interface Filters {
  priceRange: [number, number];
  scoreRange: [number, number];
  sqmRange: [number, number];
  districts: string[];
  strategies: string[];
  amenities: string[];
  rooms: number[];
}

export const DISTRICT_COLORS: Record<string, string> = {
  'Centro': '#ef4444',
  'Este': '#f97316',
  'Cruz de Humilladero': '#eab308',
  'Bailén-Miraflores': '#22c55e',
  'Teatinos': '#3b82f6',
  'Carretera de Cádiz': '#8b5cf6',
  'Ciudad Jardín': '#ec4899',
  'Churriana': '#6b7280',
};

export const STRATEGY_COLORS: Record<string, string> = {
  '🏖️ Airbnb Winner': '#ef4444',
  '📈 Capital Appreciation Play': '#3b82f6',
  '🏠 Stable Long-Term Rental': '#22c55e',
  '🏖️ Airbnb Gold (VFT Licensed)': '#eab308',
};

export const DISTRICT_COORDS: Record<string, [number, number]> = {
  'Centro': [36.7213, -4.4214],
  'Este': [36.7200, -4.3900],
  'Cruz de Humilladero': [36.7100, -4.4400],
  'Bailén-Miraflores': [36.7300, -4.4350],
  'Teatinos': [36.7250, -4.4700],
  'Carretera de Cádiz': [36.7050, -4.4500],
  'Ciudad Jardín': [36.7350, -4.4200],
  'Churriana': [36.6700, -4.4900],
};
