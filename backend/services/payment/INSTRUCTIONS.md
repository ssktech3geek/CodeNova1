# Payment Service - Instructions

## Purpose
Handles payment processing, payment schedules, refunds, and financial transactions for bookings and itinerary changes.

## Core Responsibilities
1. **Payment Processing**
   - Integrate with payment gateways (Razorpay, Stripe)
   - Handle multiple payment methods (card, UPI, net banking, wallet)
   - Process deposits, milestone payments, final payments
   - Payment retry logic for failed transactions

2. **Payment Schedules**
   - Generate payment schedules from pricing
   - Track payment status per milestone
   - Automated reminders for upcoming payments
   - Late payment handling

3. **Refund Management**
   - Process refunds per cancellation policies
   - Partial refunds for modifications
   - Refund to original payment method
   - Refund status tracking

4. **Financial Reconciliation**
   - Match payments to bookings
   - Vendor payout calculation
   - Platform fee collection
   - Tax reporting data

5. **Currency Handling**
   - Multi-currency support
   - Real-time exchange rates
   - Currency conversion for international bookings

## Data Model
- **Payment**: id, booking_id, amount, currency, method, status, gateway_transaction_id, processed_at, failure_reason
- **PaymentSchedule**: id, booking_id, milestone, amount, due_date, status, paid_at
- **Refund**: id, payment_id, amount, reason, status, processed_at, gateway_refund_id
- **Payout**: id, vendor_id, booking_id, amount, status, scheduled_at, paid_at
- **Transaction**: id, type (payment/refund/payout), amount, currency, status, related_entity_id, related_entity_type

## API Endpoints
- `POST /payments` - Initiate payment
- `GET /payments/:id` - Get payment details
- `POST /payments/:id/retry` - Retry failed payment
- `GET /payments/booking/:bookingId` - Get payments for booking
- `POST /refunds` - Initiate refund
- `GET /refunds/:id` - Get refund status
- `GET /schedules/:bookingId` - Get payment schedule
- `POST /schedules/:id/remind` - Send payment reminder
- `GET /payouts/vendor/:vendorId` - Get vendor payouts
- `POST /webhooks/payment-gateway` - Payment gateway webhook handler

## Integration Points
- **Booking Service**: Payment triggers on booking confirmation
- **Pricing Service**: Payment amounts from pricing calculations
- **Operations Service**: Refunds from disruptions
- **Notification Service**: Payment confirmations, reminders, refund notifications
- **Vendor Service**: Vendor payouts
- **Analytics Service**: Financial reporting

## Key Constraints
- PCI DSS compliance for payment handling
- Secure storage of payment tokens (not raw card data)
- Idempotent payment processing
- Audit trail for all financial transactions
- Refund must reference original payment
- Real-time payment status updates