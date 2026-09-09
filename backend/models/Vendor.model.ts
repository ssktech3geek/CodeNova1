/**
 * @file Vendor.model.ts
 * @module backend/models
 * @description Specification for Vendor, Guide, Driver, and Activity Provider Entity.
 * 
 * SCHEMA FIELDS & PARAMETERS:
 * - id: UUID (Primary Key)
 * - user_id: UUID (Foreign Key -> User.id)
 * - business_name: string
 * - vendor_type: Enum ['HOTEL', 'EXPERIENCE', 'TRANSPORT', 'GUIDE', 'RESTAURANT']
 * - location: string
 * - geo_coordinates: Point (Latitude, Longitude)
 * - rating: decimal (0.0 - 5.0)
 * - is_verified: boolean
 * - cancellation_policy: JSON Object (e.g. { refund_percentage_24h: 100, refund_percentage_12h: 50 })
 * - created_at: Timestamp
 * - updated_at: Timestamp
 * 
 * RELATIONSHIPS:
 * - Belongs to User
 * - Fulfills Many Bookings / Itineraries
 */
