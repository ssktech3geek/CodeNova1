/**
 * @file Experience.model.ts
 * @module backend/models
 * @description Specification for Experience / Activity Candidate Entity.
 * 
 * SCHEMA FIELDS & PARAMETERS:
 * - id: UUID (Primary Key)
 * - vendor_id: UUID (Foreign Key -> Vendor.id)
 * - title: string (e.g. 'Kayaking in Backwaters', 'Goan Cooking Workshop', 'Spice Plantation Tour')
 * - category: string (e.g. 'adventure', 'culture', 'culinary', 'nature')
 * - price_per_person: decimal
 * - supplier_cost_per_person: decimal
 * - duration_minutes: number (e.g. 120)
 * - opening_hours: JSON Object (e.g. { start: '09:00', end: '17:00' })
 * - capacity_per_slot: number
 * - weather_dependent: boolean (true for outdoor kayaking/beach, false for cooking workshop)
 * - indoor_outdoor: Enum ['INDOOR', 'OUTDOOR', 'MIXED']
 * - minimum_age: number
 * - location_address: string
 * - geo_coordinates: Point
 * - rating: decimal
 */
