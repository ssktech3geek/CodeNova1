/**
 * @file priceCalculator.util.ts
 * @module backend/utils
 * @description Instructions for Deterministic Pricing Utility Functions.
 *
 * PURPOSE:
 * Perform all pricing calculations with no AI involvement. Prices must be sourced
 * from real vendor data, not fabricated by the AI (Brain Section 19 & PRD Section 10).
 *
 * FUNCTIONS TO IMPLEMENT (no code here):
 *
 * 1. calculateCustomerPrice(items: PricedItem[]): PriceBreakdown
 *    - Sum: hotel costs + transport costs + activity costs + guide costs + meal costs.
 *    - Add platform charges and taxes.
 *    - Subtract applicable discounts.
 *    - Return itemized PriceBreakdown object.
 *
 * 2. calculateOperatorMargin(customerPrice: decimal, supplierCosts: SupplierCost[]): MarginResult
 *    - Compute: customerPrice - totalSupplierCost - discounts - refunds - operationalCharges.
 *    - Return margin value and margin percentage.
 *
 * 3. calculateRefundAmount(booking: Booking, cancelledAt: Timestamp): RefundResult
 *    - Apply vendor cancellation policy (time-based refund tiers).
 *    - Return refund amount and reason.
 *
 * 4. recalculatePriceAfterChange(itinerary: Itinerary, changeProposal: ChangeProposal): DeltaPrice
 *    - Compute cost delta (positive or negative) from proposed change.
 *    - Recalculate operator margin after proposal.
 *
 * KEY CONSTRAINTS:
 * - All prices sourced from vendor/service records. Never use AI-generated prices.
 * - Every calculation must produce a full itemized breakdown (not just a total).
 * - Currency precision: use 2 decimal places for INR.
 */
