/**
 * @file ItineraryItem.model.ts
 * @module backend/models
 * @description Specification for Individual Itinerary Node in Dependency Graph.
 * 
 * SCHEMA FIELDS & PARAMETERS:
 * - id: UUID (Primary Key)
 * - itinerary_id: UUID (Foreign Key -> Itinerary.id)
 * - day_number: number (e.g. Day 1, Day 2)
 * - start_time: Timestamp / Time
 * - end_time: Timestamp / Time
 * - item_type: Enum ['HOTEL', 'EXPERIENCE', 'TRANSPORT', 'MEAL', 'FREE_TIME']
 * - service_ref_id: UUID (Polymorphic FK to Hotel / Experience / Transport)
 * - vendor_id: UUID (Foreign Key -> Vendor.id)
 * - title: string
 * - description: string
 * - price: decimal
 * - supplier_cost: decimal
 * - location: string
 * - geo_coordinates: Point
 * - dependencies: JSON Array of UUIDs (IDs of precursor ItineraryItems this node depends on)
 * - depends_on_transport_id: UUID (Foreign Key -> Transport ItineraryItem)
 * - depends_on_guide_id: UUID (Foreign Key -> Vendor/Guide)
 * - weather_risk_level: Enum ['LOW', 'MEDIUM', 'HIGH']
 * - is_disrupted: boolean (Default: false)
 * - created_at: Timestamp
 */
