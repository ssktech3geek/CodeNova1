/**
 * @file Payment.model.ts
 * @module backend/models
 * @description Specification for Payment Transactions, Refund Records, and Split Financial Ledger.
 * 
 * SCHEMA FIELDS & PARAMETERS:
 * - id: UUID (Primary Key)
 * - itinerary_id: UUID (Foreign Key -> Itinerary.id)
 * - booking_id: UUID (Foreign Key -> Booking.id, optional for full trip payment)
 * - user_id: UUID (Payer)
 * - transaction_type: Enum ['CUSTOMER_PAYMENT', 'SUPPLIER_PAYOUT', 'CUSTOMER_REFUND', 'SUPPLIER_REFUND', 'PLATFORM_FEE']
 * - amount: decimal
 * - currency: string (e.g. 'INR')
 * - gateway_name: string (e.g. 'Razorpay', 'Stripe')
 * - gateway_transaction_id: string
 * - status: Enum ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED']
 * - refund_reason: string
 * - created_at: Timestamp
 */
