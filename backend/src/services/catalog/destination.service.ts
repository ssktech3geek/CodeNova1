import { query, isDbAvailable } from '../../lib/db';
import { Destination } from '../../types';

export interface DestinationFilter {
  state?: string;
  country?: string;
  interest?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Fallback mock destinations
const MOCK_DESTINATIONS: Destination[] = [
  { id: 'dest-001', name: 'Goa', state: 'Goa', country: 'India', coordinates: { lat: 15.2993, lng: 74.1240 }, popular_interests: ['BEACHES', 'NIGHTLIFE', 'WATER_SPORTS', 'HERITAGE'], climate_info: { season: 'Tropical', bestMonths: ['Nov', 'Dec', 'Jan', 'Feb'] } },
  { id: 'dest-002', name: 'Munnar', state: 'Kerala', country: 'India', coordinates: { lat: 10.0889, lng: 77.0595 }, popular_interests: ['NATURE', 'TEA_GARDENS', 'TREKKING', 'RELAXATION'], climate_info: { season: 'Hill Station', bestMonths: ['Sep', 'Oct', 'Nov', 'Mar'] } },
  { id: 'dest-003', name: 'Jaipur', state: 'Rajasthan', country: 'India', coordinates: { lat: 26.9124, lng: 75.7873 }, popular_interests: ['FORT_CULTURE', 'HERITAGE', 'PALACES', 'SHOPPING'], climate_info: { season: 'Arid', bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb'] } },
  { id: 'dest-004', name: 'Manali', state: 'Himachal Pradesh', country: 'India', coordinates: { lat: 32.2432, lng: 77.1892 }, popular_interests: ['SNOW_SPORTS', 'MOUNTAIN_VIEWS', 'ADVENTURE', 'HIKING'], climate_info: { season: 'Alpine', bestMonths: ['Dec', 'Jan', 'Feb', 'May'] } },
  { id: 'dest-005', name: 'Ooty', state: 'Tamil Nadu', country: 'India', coordinates: { lat: 11.4102, lng: 76.6950 }, popular_interests: ['NATURE', 'LAKES', 'BOTANICAL_GARDENS', 'TOY_TRAIN'], climate_info: { season: 'Mild', bestMonths: ['Oct', 'Nov', 'Apr', 'May'] } },
  { id: 'dest-006', name: 'Leh', state: 'Ladakh', country: 'India', coordinates: { lat: 34.1526, lng: 77.5771 }, popular_interests: ['ADVENTURE', 'MONASTERIES', 'LAKES', 'TREKKING'], climate_info: { season: 'Cold Desert', bestMonths: ['Jun', 'Jul', 'Aug', 'Sep'] } },
  { id: 'dest-007', name: 'Andaman', state: 'Andaman and Nicobar', country: 'India', coordinates: { lat: 11.7401, lng: 92.6586 }, popular_interests: ['BEACHES', 'DIVING', 'WATER_SPORTS', 'NATURE'], climate_info: { season: 'Tropical', bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'] } },
  { id: 'dest-008', name: 'Rishikesh', state: 'Uttarakhand', country: 'India', coordinates: { lat: 30.1026, lng: 78.2937 }, popular_interests: ['YOGA', 'ADVENTURE', 'SPIRITUAL', 'RIVER_RIDING'], climate_info: { season: 'Subtropical', bestMonths: ['Sep', 'Oct', 'Nov', 'Mar', 'Apr', 'May'] } },
];

/**
 * Get list of destinations with optional filters and pagination.
 */
export async function getDestinations(filter: DestinationFilter = {}): Promise<{
  destinations: Destination[];
  total: number;
}> {
  const page = filter.page || 1;
  const limit = Math.min(filter.limit || 10, 50);

  if (!isDbAvailable()) {
    let destinations = MOCK_DESTINATIONS;
    if (filter.state) {
      destinations = destinations.filter(d => d.state.toLowerCase().includes(filter.state!.toLowerCase()));
    }
    if (filter.search) {
      const search = filter.search.toLowerCase();
      destinations = destinations.filter(d => d.name.toLowerCase().includes(search) || d.state.toLowerCase().includes(search));
    }
    if (filter.interest) {
      destinations = destinations.filter(d => d.popular_interests?.includes(filter.interest!));
    }
    const total = destinations.length;
    const offset = (page - 1) * limit;
    return {
      destinations: destinations.slice(offset, offset + limit),
      total,
    };
  }

  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const params: any[] = [];

  if (filter.state) {
    params.push(`%${filter.state}%`);
    conditions.push(`state ILIKE $${params.length}`);
  }

  if (filter.country) {
    params.push(filter.country);
    conditions.push(`country = $${params.length}`);
  }

  if (filter.search) {
    params.push(`%${filter.search}%`);
    conditions.push(`(name ILIKE $${params.length} OR state ILIKE $${params.length})`);
  }

  if (filter.interest) {
    params.push(filter.interest);
    conditions.push(`popular_interests ? $${params.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await query<{ count: string }>(
    `SELECT COUNT(*) as count FROM destinations ${whereClause}`,
    params
  );

  const dataParams = [...params, limit, offset];
  const queryResult = await query<Destination>(
    `SELECT * FROM destinations ${whereClause} ORDER BY name ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    dataParams
  );

  return {
    destinations: queryResult.rows,
    total: parseInt(countResult.rows[0].count),
  };
}

/**
 * Get destination by ID.
 */
export async function getDestinationById(id: string): Promise<Destination | null> {
  if (!isDbAvailable()) {
    return MOCK_DESTINATIONS.find(d => d.id === id) || null;
  }
  const result = await query<Destination>('SELECT * FROM destinations WHERE id = $1', [id]);
  return result.rowCount > 0 ? result.rows[0] : null;
}
