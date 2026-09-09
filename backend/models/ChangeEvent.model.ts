/**
 * @file ChangeEvent.model.ts
 * @module backend/models
 * @description Specification for Disruption Event Record in Event Store.
 * 
 * SCHEMA FIELDS & PARAMETERS:
 * - id: UUID (Primary Key)
 * - itinerary_id: UUID (Foreign Key -> Itinerary.id)
 * - source: Enum ['VENDOR', 'WEATHER_API', 'TRANSPORT_PROVIDER', 'OPERATOR', 'TRAVELER', 'SYSTEM_SYNC']
 * - event_type: Enum ['ACTIVITY_CANCELLED', 'ACTIVITY_DELAYED', 'TRANSPORT_DELAYED', 'TRANSPORT_CANCELLED', 'WEATHER_RISK', 'HOTEL_UNAVAILABLE', 'VENDOR_UNAVAILABLE', 'TRAVELER_CHANGE', 'AVAILABILITY_CHANGED']
 * - affected_item_id: UUID (Foreign Key -> ItineraryItem.id)
 * - payload: JSON Object (Details e.g. delay minutes, weather severity level)
 * - reported_at: Timestamp
 * - processed_at: Timestamp
 */
