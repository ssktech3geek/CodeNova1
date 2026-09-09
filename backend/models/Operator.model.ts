/**
 * @file Operator.model.ts
 * @module backend/models
 * @description Specification for Tour Operator Agency & Manager Entity.
 * 
 * SCHEMA FIELDS & PARAMETERS:
 * - id: UUID (Primary Key)
 * - user_id: UUID (Foreign Key -> User.id)
 * - agency_name: string
 * - license_number: string
 * - operating_regions: JSON Array of strings (e.g. ['Goa', 'Kerala', 'Rajasthan'])
 * - target_margin_percentage: decimal (e.g. 15.0 for 15% margin)
 * - contact_phone: string
 * - support_email: string
 * - is_verified: boolean
 * - created_at: Timestamp
 * - updated_at: Timestamp
 * 
 * RELATIONSHIPS:
 * - Belongs to User
 * - Manages Many Itineraries, TourGroups, VendorContracts
 */
