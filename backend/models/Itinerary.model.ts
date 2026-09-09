/**
 * @file Itinerary.model.ts
 * @module backend/models
 * @description Specification for Itinerary Operational State & Version Record.
 * 
 * SCHEMA FIELDS & PARAMETERS:
 * - id: UUID (Primary Key)
 * - version: number (Default: 1, increments on approved change)
 * - parent_itinerary_id: UUID (Null for v1, points to previous version)
 * - traveler_profile_id: UUID (Foreign Key)
 * - operator_id: UUID (Foreign Key)
 * - title: string (e.g. 'Goa Relaxed 4-Day Journey')
 * - status: Enum ['DRAFT', 'FEASIBILITY_CHECK', 'QUOTE', 'CUSTOMER_APPROVAL', 'PAYMENT_PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'DISRUPTED', 'CANCELLED']
 * - start_date: Date
 * - end_date: Date
 * - total_customer_price: decimal
 * - total_supplier_cost: decimal
 * - total_taxes: decimal
 * - total_discounts: decimal
 * - operator_margin: decimal
 * - operator_margin_percentage: decimal
 * - preference_match_score: decimal (0 - 100%)
 * - schedule_intensity_score: decimal (0 - 100%)
 * - created_at: Timestamp
 * - updated_at: Timestamp
 * 
 * RELATIONSHIPS:
 * - Has Many Itineraries (versions)
 * - Has Many ItinerariesItems
 * - Has Many Bookings
 * - Has Many ChangeEvents / Proposals
 */
