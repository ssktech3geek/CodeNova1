/**
 * @file Hotel.model.ts
 * @module backend/models
 * @description Specification for Hotel & Accommodation Candidate Entity.
 * 
 * SCHEMA FIELDS & PARAMETERS:
 * - id: UUID (Primary Key)
 * - vendor_id: UUID (Foreign Key -> Vendor.id)
 * - name: string
 * - category: string (e.g. 'Boutique Hotel', 'Resort', 'Homestay')
 * - price_per_night: decimal
 * - supplier_cost_per_night: decimal
 * - check_in_time: string (e.g. '14:00')
 * - check_out_time: string (e.g. '11:00')
 * - amenities: JSON Array (e.g. ['wifi', 'pool', 'breakfast', 'parking'])
 * - location_address: string
 * - geo_coordinates: Point
 * - rating: decimal
 * - available_rooms: number
 */
