import { query, isDbAvailable } from '../../lib/db';
import { Vendor, Hotel, Experience, Transport, VendorType } from '../../types';

// ============================================
// Vendor Catalog Service
// With in-memory fallback for demo when DB is unavailable
// ============================================

// Fallback mock data for when database is unavailable
const MOCK_EXPERIENCES: Experience[] = [
  {
    id: 'exp-001',
    vendor_id: 'ven-001',
    title: 'Sal Backwater Kayaking Tour',
    category: 'WATER_SPORTS',
    price_per_person: 1200,
    supplier_cost_per_person: 950,
    duration_minutes: 120,
    opening_hours: { mon: { open: '07:00', close: '18:00' }, tue: { open: '07:00', close: '18:00' }, wed: { open: '07:00', close: '18:00' }, thu: { open: '07:00', close: '18:00' }, fri: { open: '07:00', close: '18:00' }, sat: { open: '07:00', close: '18:00' }, sun: { open: '07:00', close: '18:00' } },
    capacity_per_slot: 12,
    weather_dependent: true,
    indoor_outdoor: 'OUTDOOR',
    minimum_age: 10,
    rating: 4.80,
  },
  {
    id: 'exp-002',
    vendor_id: 'ven-001',
    title: 'Authentic Goan Cooking Masterclass',
    category: 'CULINARY',
    price_per_person: 900,
    supplier_cost_per_person: 720,
    duration_minutes: 180,
    opening_hours: { mon: { open: '10:00', close: '16:00' }, tue: { open: '10:00', close: '16:00' }, wed: { open: '10:00', close: '16:00' }, thu: { open: '10:00', close: '16:00' }, fri: { open: '10:00', close: '16:00' }, sat: { open: '10:00', close: '16:00' }, sun: null },
    capacity_per_slot: 8,
    weather_dependent: false,
    indoor_outdoor: 'INDOOR',
    minimum_age: 12,
    rating: 4.90,
  },
  {
    id: 'exp-003',
    vendor_id: 'ven-001',
    title: 'Sahakari Spice Plantation Guided Walk',
    category: 'HERITAGE',
    price_per_person: 700,
    supplier_cost_per_person: 560,
    duration_minutes: 150,
    opening_hours: { mon: { open: '09:00', close: '17:00' }, tue: { open: '09:00', close: '17:00' }, wed: { open: '09:00', close: '17:00' }, thu: { open: '09:00', close: '17:00' }, fri: { open: '09:00', close: '17:00' }, sat: { open: '09:00', close: '17:00' }, sun: { open: '09:00', close: '17:00' } },
    capacity_per_slot: 30,
    weather_dependent: false,
    indoor_outdoor: 'OUTDOOR',
    minimum_age: 0,
    rating: 4.65,
  },
  {
    id: 'exp-004',
    vendor_id: 'ven-001',
    title: 'Old Goa Portuguese Museum & Art Gallery',
    category: 'CULTURE',
    price_per_person: 800,
    supplier_cost_per_person: 640,
    duration_minutes: 90,
    opening_hours: { mon: null, tue: { open: '10:00', close: '18:00' }, wed: { open: '10:00', close: '18:00' }, thu: { open: '10:00', close: '18:00' }, fri: { open: '10:00', close: '18:00' }, sat: { open: '10:00', close: '18:00' }, sun: { open: '10:00', close: '18:00' } },
    capacity_per_slot: 50,
    weather_dependent: false,
    indoor_outdoor: 'INDOOR',
    minimum_age: 0,
    rating: 4.70,
  },
  {
    id: 'exp-005',
    vendor_id: 'ven-001',
    title: 'Thalassa Sunset Beach Club Lounge',
    category: 'RELAXATION',
    price_per_person: 500,
    supplier_cost_per_person: 400,
    duration_minutes: 240,
    opening_hours: { mon: { open: '16:00', close: '23:59' }, tue: { open: '16:00', close: '23:59' }, wed: { open: '16:00', close: '23:59' }, thu: { open: '16:00', close: '23:59' }, fri: { open: '16:00', close: '23:59' }, sat: { open: '16:00', close: '23:59' }, sun: { open: '16:00', close: '23:59' } },
    capacity_per_slot: 100,
    weather_dependent: true,
    indoor_outdoor: 'OUTDOOR',
    minimum_age: 18,
    rating: 4.75,
  },
  {
    id: 'exp-006',
    vendor_id: 'ven-001',
    title: 'Dudhsagar Waterfall Trek',
    category: 'ADVENTURE',
    price_per_person: 1500,
    supplier_cost_per_person: 1200,
    duration_minutes: 360,
    opening_hours: { mon: { open: '06:00', close: '14:00' }, tue: { open: '06:00', close: '14:00' }, wed: { open: '06:00', close: '14:00' }, thu: { open: '06:00', close: '14:00' }, fri: { open: '06:00', close: '14:00' }, sat: { open: '06:00', close: '14:00' }, sun: { open: '06:00', close: '14:00' } },
    capacity_per_slot: 20,
    weather_dependent: true,
    indoor_outdoor: 'OUTDOOR',
    minimum_age: 12,
    rating: 4.85,
  },
  {
    id: 'exp-007',
    vendor_id: 'ven-001',
    title: 'Divar Island Ferry & Village Walk',
    category: 'HERITAGE',
    price_per_person: 450,
    supplier_cost_per_person: 360,
    duration_minutes: 240,
    opening_hours: { mon: { open: '08:00', close: '17:00' }, tue: { open: '08:00', close: '17:00' }, wed: { open: '08:00', close: '17:00' }, thu: { open: '08:00', close: '17:00' }, fri: { open: '08:00', close: '17:00' }, sat: { open: '08:00', close: '17:00' }, sun: { open: '08:00', close: '17:00' } },
    capacity_per_slot: 15,
    weather_dependent: false,
    indoor_outdoor: 'MIXED',
    minimum_age: 5,
    rating: 4.60,
  },
  {
    id: 'exp-008',
    vendor_id: 'ven-001',
    title: 'Anjuna Flea Market Shopping Tour',
    category: 'SHOPPING',
    price_per_person: 200,
    supplier_cost_per_person: 160,
    duration_minutes: 180,
    opening_hours: { wed: { open: '09:00', close: '19:00' } },
    capacity_per_slot: 50,
    weather_dependent: true,
    indoor_outdoor: 'OUTDOOR',
    minimum_age: 0,
    rating: 4.50,
  },
];

const MOCK_HOTELS: Hotel[] = [
  {
    id: 'hotel-001',
    vendor_id: 'ven-002',
    name: 'Zostel Anjuna Hostel',
    category: 'BUDGET',
    price_per_night: 800,
    supplier_cost_per_night: 650,
    check_in_time: '13:00',
    check_out_time: '11:00',
    amenities: ['WiFi', 'AC', 'Shared Pool', 'Lockers'],
    rating: 4.50,
    available_rooms: 15,
  },
  {
    id: 'hotel-002',
    vendor_id: 'ven-002',
    name: 'Santana Beach Resort Boutique',
    category: 'BOUTIQUE',
    price_per_night: 3000,
    supplier_cost_per_night: 2450,
    check_in_time: '14:00',
    check_out_time: '11:00',
    amenities: ['Pool', 'Beachfront', 'Breakfast Included', 'Bar'],
    rating: 4.70,
    available_rooms: 8,
  },
  {
    id: 'hotel-003',
    vendor_id: 'ven-002',
    name: 'Taj Fort Aguada Resort & Spa',
    category: 'LUXURY',
    price_per_night: 7500,
    supplier_cost_per_night: 6000,
    check_in_time: '15:00',
    check_out_time: '12:00',
    amenities: ['Private Beach', 'Infinity Pool', 'Spa', 'Fine Dining'],
    rating: 4.90,
    available_rooms: 5,
  },
];

const MOCK_TRANSPORTS: Transport[] = [
  {
    id: 'trans-001',
    vendor_id: 'ven-003',
    transport_mode: 'PRIVATE_CAR',
    vehicle_type: 'Sedan (Dzire/Etios)',
    capacity: 4,
    base_flat_rate: 2500,
    rate_per_km: 12,
    supplier_cost_base: 2000,
    rating: 4.60,
  },
  {
    id: 'trans-002',
    vendor_id: 'ven-003',
    transport_mode: 'SHARED_SHUTTLE',
    vehicle_type: 'Tempo Traveller AC',
    capacity: 8,
    base_flat_rate: 300,
    rate_per_km: 5,
    supplier_cost_base: 240,
    rating: 4.40,
  },
  {
    id: 'trans-003',
    vendor_id: 'ven-003',
    transport_mode: 'RENTAL_SCOOTER',
    vehicle_type: 'Honda Activa 125cc',
    capacity: 2,
    base_flat_rate: 400,
    rate_per_km: 0,
    supplier_cost_base: 320,
    rating: 4.80,
  },
];

export interface HotelFilter {
  location?: string;
  category?: string;
  max_price?: number;
  min_rating?: number;
  limit?: number;
}

export interface ExperienceFilter {
  location?: string;
  category?: string;
  max_price?: number;
  weather_dependent?: boolean;
  indoor_outdoor?: 'INDOOR' | 'OUTDOOR' | 'MIXED';
  limit?: number;
}

export interface TransportFilter {
  transport_mode?: string;
  vehicle_type?: string;
  min_capacity?: number;
  limit?: number;
}

/**
 * List vendors by type and location.
 */
export async function getVendors(vendorType?: VendorType, location?: string): Promise<Vendor[]> {
  if (!isDbAvailable()) {
    return [];
  }
  const conditions: string[] = [];
  const params: any[] = [];

  if (vendorType) {
    params.push(vendorType);
    conditions.push(`vendor_type = $${params.length}`);
  }

  if (location) {
    params.push(`%${location}%`);
    conditions.push(`location ILIKE $${params.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const result = await query<Vendor>(`SELECT * FROM vendors ${whereClause} ORDER BY rating DESC`, params);
  return result.rows;
}

/**
 * Search hotels in catalog.
 */
export async function searchHotels(filter: HotelFilter = {}): Promise<Hotel[]> {
  if (!isDbAvailable()) {
    let hotels = MOCK_HOTELS;
    if (filter.category) {
      hotels = hotels.filter(h => h.category === filter.category);
    }
    if (filter.max_price) {
      hotels = hotels.filter(h => h.price_per_night <= filter.max_price!);
    }
    return hotels.slice(0, filter.limit || 20);
  }

  const conditions: string[] = [];
  const params: any[] = [];

  if (filter.category) {
    params.push(filter.category);
    conditions.push(`h.category = $${params.length}`);
  }

  if (filter.max_price) {
    params.push(filter.max_price);
    conditions.push(`h.price_per_night <= $${params.length}`);
  }

  if (filter.min_rating) {
    params.push(filter.min_rating);
    conditions.push(`h.rating >= $${params.length}`);
  }

  if (filter.location) {
    params.push(`%${filter.location}%`);
    conditions.push(`v.location ILIKE $${params.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const limit = filter.limit || 20;
  params.push(limit);

  const sql = `
    SELECT h.*
    FROM hotels h
    JOIN vendors v ON h.vendor_id = v.id
    ${whereClause}
    ORDER BY h.rating DESC
    LIMIT $${params.length}
  `;

  const result = await query<Hotel>(sql, params);
  return result.rows;
}

/**
 * Search experiences in catalog.
 */
export async function searchExperiences(filter: ExperienceFilter = {}): Promise<Experience[]> {
  if (!isDbAvailable()) {
    let experiences = MOCK_EXPERIENCES;
    if (filter.category) {
      experiences = experiences.filter(e => e.category === filter.category);
    }
    if (filter.max_price) {
      experiences = experiences.filter(e => e.price_per_person <= filter.max_price!);
    }
    if (filter.weather_dependent !== undefined) {
      experiences = experiences.filter(e => e.weather_dependent === filter.weather_dependent);
    }
    if (filter.indoor_outdoor) {
      experiences = experiences.filter(e => e.indoor_outdoor === filter.indoor_outdoor);
    }
    return experiences.slice(0, filter.limit || 20);
  }

  const conditions: string[] = [];
  const params: any[] = [];

  if (filter.category) {
    params.push(filter.category);
    conditions.push(`e.category = $${params.length}`);
  }

  if (filter.max_price) {
    params.push(filter.max_price);
    conditions.push(`e.price_per_person <= $${params.length}`);
  }

  if (filter.weather_dependent !== undefined) {
    params.push(filter.weather_dependent);
    conditions.push(`e.weather_dependent = $${params.length}`);
  }

  if (filter.indoor_outdoor) {
    params.push(filter.indoor_outdoor);
    conditions.push(`e.indoor_outdoor = $${params.length}`);
  }

  if (filter.location) {
    params.push(`%${filter.location}%`);
    conditions.push(`v.location ILIKE $${params.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const limit = filter.limit || 20;
  params.push(limit);

  const sql = `
    SELECT e.*
    FROM experiences e
    JOIN vendors v ON e.vendor_id = v.id
    ${whereClause}
    ORDER BY e.rating DESC
    LIMIT $${params.length}
  `;

  const result = await query<Experience>(sql, params);
  return result.rows;
}

/**
 * Search transport options in catalog.
 */
export async function searchTransports(filter: TransportFilter = {}): Promise<Transport[]> {
  if (!isDbAvailable()) {
    let transports = MOCK_TRANSPORTS;
    if (filter.transport_mode) {
      transports = transports.filter(t => t.transport_mode === filter.transport_mode);
    }
    if (filter.min_capacity) {
      transports = transports.filter(t => t.capacity >= filter.min_capacity!);
    }
    return transports.slice(0, filter.limit || 20);
  }

  const conditions: string[] = [];
  const params: any[] = [];

  if (filter.transport_mode) {
    params.push(filter.transport_mode);
    conditions.push(`transport_mode = $${params.length}`);
  }

  if (filter.vehicle_type) {
    params.push(`%${filter.vehicle_type}%`);
    conditions.push(`vehicle_type ILIKE $${params.length}`);
  }

  if (filter.min_capacity) {
    params.push(filter.min_capacity);
    conditions.push(`capacity >= $${params.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const limit = filter.limit || 20;
  params.push(limit);

  const sql = `
    SELECT * FROM transports
    ${whereClause}
    ORDER BY rating DESC
    LIMIT $${params.length}
  `;

  const result = await query<Transport>(sql, params);
  return result.rows;
}
