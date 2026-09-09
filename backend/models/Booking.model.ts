/**
 * @file Booking.model.ts
 * @module backend/models
 * @description Specification for Service Booking Operational Lifecycle Entity.
 * 
 * SCHEMA FIELDS & PARAMETERS:
 * - id: UUID (Primary Key)
 * - itinerary_id: UUID (Foreign Key -> Itinerary.id)
 * - itinerary_item_id: UUID (Foreign Key -> ItineraryItem.id)
 * - vendor_id: UUID (Foreign Key -> Vendor.id)
 * - status: Enum ['DISCOVERED', 'SELECTED', 'QUOTED', 'PENDING_APPROVAL', 'APPROVED', 'PAYMENT_PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REFUND_PENDING', 'REFUNDED', 'CHANGE_REQUESTED', 'RESCHEDULED']
 * - confirmation_code: string (Unique vendor voucher code)
 * - quantity: number (Number of travelers / rooms / vehicles)
 * - total_price: decimal
 * - supplier_cost: decimal
 * - scheduled_start: Timestamp
 * - scheduled_end: Timestamp
 * - cancellation_deadline: Timestamp
 * - created_at: Timestamp
 * - updated_at: Timestamp
 */
