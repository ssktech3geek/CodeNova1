# Vendor Service - Instructions

## Purpose
Manages vendor registry, service listings, availability, contracts, rates, and vendor portal operations.

## Core Responsibilities
1. **Vendor Registry**
   - Vendor onboarding and verification
   - Vendor profiles: company info, contacts, certifications, specialties
   - Vendor status management (active, suspended, pending)

2. **Service Listing Management**
   - Vendors list their services (hotels, experiences, transport, guides, restaurants)
   - Service details: descriptions, photos, amenities, capacity, policies
   - Service categorization and tagging

3. **Availability Calendar**
   - Real-time availability management
   - Block dates, set capacity per slot
   - Bulk availability updates
   - Integration with external calendar systems

4. **Contracts & Rates**
   - Contract management: terms, validity, commission structures
   - Rate management: contracted rates, seasonal pricing, dynamic pricing rules
   - Rate validation against market rates

5. **Vendor Portal Operations**
   - Dashboard for assigned bookings
   - Confirmation workflow
   - Delay/cancellation reporting
   - Invoice upload and management
   - Communication with operators

6. **Performance Tracking**
   - Confirmation rates
   - Cancellation rates
   - Customer ratings
   - SLA compliance

## Data Model
- **Vendor**: id, name, type, contact_info, address, certifications, status, commission_rate
- **VendorService**: id, vendor_id, service_type, details, capacity, policies, photos
- **VendorAvailability**: id, vendor_service_id, date, start_time, end_time, slots_available, price_override
- **Contract**: id, vendor_id, operator_id, terms, commission_structure, valid_from, valid_to, status
- **RateCard**: id, vendor_id, service_id, base_rate, seasonal_adjustments, currency, valid_from, valid_to
- **Invoice**: id, booking_id, vendor_id, amount, status, uploaded_at, paid_at
- **VendorPerformance**: id, vendor_id, period, confirmation_rate, cancellation_rate, avg_rating, sla_score

## API Endpoints
- `POST /vendors` - Register vendor
- `GET /vendors/:id` - Get vendor profile
- `PUT /vendors/:id` - Update vendor profile
- `POST /vendors/:id/services` - Add service listing
- `GET /vendors/:id/services` - List vendor services
- `PUT /vendors/:id/services/:serviceId` - Update service
- `POST /vendors/:id/availability` - Update availability
- `GET /vendors/:id/availability` - Get availability calendar
- `POST /vendors/:id/contracts` - Create contract
- `GET /vendors/:id/contracts` - List contracts
- `POST /vendors/:id/invoices` - Upload invoice
- `GET /vendors/:id/bookings` - Get assigned bookings (vendor portal)
- `POST /bookings/:id/confirm` - Confirm assigned service
- `POST /bookings/:id/report-delay` - Report delay
- `POST /bookings/:id/report-cancellation` - Report cancellation
- `GET /vendors/:id/performance` - Get performance metrics

## Integration Points
- **Destination Service**: Service catalog integration
- **Booking Service**: Booking assignment and confirmation
- **Operations Service**: Real-time vendor updates
- **Payment Service**: Invoice processing and vendor payments
- **Notification Service**: Vendor notifications
- **Analytics Service**: Performance reporting

## Key Constraints
- Vendor access strictly limited to assigned bookings/services
- Availability updates must be real-time
- Contract rates are authoritative for pricing
- Invoice processing must be auditable
- Vendor communications must be logged