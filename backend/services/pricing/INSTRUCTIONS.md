# Pricing Service - Instructions

## Purpose
Calculates customer pricing, supplier costs, operator margins, refunds, and handles all pricing-related computations for itineraries and bookings.

## Core Responsibilities
1. **Customer Price Calculation**
   - Formula: Hotel + Transport + Activities + Guides + Meals + Taxes + Platform Charges - Discounts
   - Itemized breakdown per itinerary item
   - Tax calculation per jurisdiction
   - Platform fee structure

2. **Supplier Cost Calculation**
   - Aggregated vendor costs for all booked services
   - Contracted rates vs. rack rates
   - Volume discounts

3. **Operator Margin Calculation**
   - Formula: Customer Price - Supplier Cost - Discounts - Refunds - Operational Charges
   - Real-time margin tracking per itinerary
   - Margin impact analysis for changes

4. **Refund & Cancellation Calculation**
   - Cancellation policies per service
   - Refund estimation based on timing
   - Partial refund calculations

5. **Payment Schedule**
   - Deposit requirements
   - Milestone payments
   - Final payment timing
   - Currency handling

6. **Discount Management**
   - Promo codes
   - Loyalty discounts
   - Volume discounts
   - Operator discretionary discounts

## Data Model
- **PricingRule**: id, service_type, base_price, taxes, platform_fee_percent, currency
- **SupplierRate**: id, vendor_id, service_id, contracted_rate, valid_from, valid_to, conditions
- **Discount**: id, code, type (percent/fixed), value, conditions, valid_from, valid_to
- **PaymentSchedule**: id, booking_id, amount, due_date, status, milestones
- **RefundPolicy**: id, service_type, cancellation_window_hours, refund_percent, conditions

## API Endpoints
- `POST /pricing/calculate` - Calculate full pricing for itinerary
- `POST /pricing/calculate-customer` - Customer price only
- `POST /pricing/calculate-supplier` - Supplier cost only
- `POST /pricing/calculate-margin` - Operator margin
- `POST /pricing/estimate-refund` - Estimate refund for cancellation
- `GET /pricing/rules/:serviceType` - Get pricing rules
- `POST /pricing/discounts/validate` - Validate discount code
- `GET /pricing/schedules/:bookingId` - Get payment schedule

## Integration Points
- **Itinerary Service**: Pricing for generated alternatives
- **Booking Service**: Pricing for confirmed bookings
- **Vendor Service**: Supplier rates and contracts
- **Payment Service**: Payment schedule execution
- **Operations Service**: Margin impact during disruptions
- **Dynamic Replanner**: Recalculate pricing for alternatives

## Key Constraints
- Pricing must be deterministic and backed by actual service data
- Never invent prices or availability
- All calculations must be auditable
- Currency conversion must use real-time rates
- Tax calculations must be jurisdiction-aware
- Margin must be visible to operators, transparent to travelers