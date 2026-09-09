# Booking Service - Instructions

## Purpose
Manages the complete booking lifecycle from quote to confirmation, including vendor coordination, state management, and booking modifications.

## Core Responsibilities
1. **Booking Lifecycle Management**
   - States: DISCOVERED → SELECTED → QUOTED → PENDING_APPROVAL → APPROVED → PAYMENT_PENDING → CONFIRMED → IN_PROGRESS → COMPLETED
   - Exceptional states: CANCELLED, REFUND_PENDING, REFUNDED, CHANGE_REQUESTED, RESCHEDULED
   - State transition validation and audit trail

2. **Vendor Coordination**
   - Send booking requests to vendors
   - Track vendor confirmations
   - Handle vendor-initiated changes/cancellations
   - Manage vendor communications

3. **Booking Operations**
   - Create bookings from approved itineraries
   - Link bookings to itinerary items
   - Manage group bookings
   - Handle partial confirmations

4. **Change Management**
   - Process traveler/operator change requests
   - Coordinate with vendors for modifications
   - Recalculate pricing for changes
   - Trigger approval workflows

5. **Cancellation & Refunds**
   - Process cancellations per policy
   - Coordinate refunds with Payment Service
   - Update vendor schedules
   - Notify stakeholders

## Data Model
- **Booking**: id, itinerary_id, itinerary_item_id, vendor_id, traveler_id, status, confirmed_at, cancelled_at
- **BookingItem**: id, booking_id, service_id, quantity, unit_price, total_price, special_requests
- **VendorConfirmation**: id, booking_id, vendor_id, status, confirmed_at, reference_number, notes
- **BookingChange**: id, booking_id, requested_by, change_type, old_value, new_value, status, approved_at
- **Cancellation**: id, booking_id, reason, refund_amount, status, processed_at

## API Endpoints
- `POST /bookings` - Create booking from approved itinerary
- `GET /bookings/:id` - Get booking details
- `GET /bookings/:id/items` - Get booking items
- `POST /bookings/:id/confirm` - Confirm booking (vendor)
- `POST /bookings/:id/cancel` - Cancel booking
- `POST /bookings/:id/change` - Request booking change
- `GET /bookings/traveler/:travelerId` - Get traveler bookings
- `GET /bookings/operator/:operatorId` - Get operator bookings
- `GET /bookings/vendor/:vendorId` - Get vendor assigned bookings
- `POST /bookings/:id/vendor-confirm` - Vendor confirms service
- `POST /bookings/:id/vendor-update` - Vendor reports delay/cancellation

## Integration Points
- **Itinerary Service**: Convert confirmed itineraries to bookings
- **Pricing Service**: Calculate booking costs
- **Vendor Service**: Vendor communication and confirmation
- **Payment Service**: Payment processing and refunds
- **Notification Service**: Booking confirmations, changes, cancellations
- **Operations Service**: Operational changes affecting bookings

## Key Constraints
- Booking state transitions must be validated
- Vendor access limited to assigned bookings only
- All booking changes must maintain consistency with itinerary
- Audit trail for all booking operations
- Idempotent handling for vendor confirmations