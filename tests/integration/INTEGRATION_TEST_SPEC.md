/**
 * @file INTEGRATION_TEST_SPEC.md
 * @module tests/integration
 * @description Instructions for Integration Test Coverage Requirements.
 *
 * INTEGRATION TEST SCENARIOS:
 *
 * 1. Preference Extraction → Itinerary Generation Flow
 *    - POST /api/v1/profiles/:id/preferences/extract with natural language input.
 *    - Verify structured preferences stored correctly.
 *    - GET /api/v1/itineraries?profile_id=X → verify 3 itinerary drafts returned.
 *    - Verify each draft has valid schedule, prices, and preference_match_score.
 *
 * 2. Hard Constraint Violation → Rejection
 *    - Submit itinerary with overlapping activity times.
 *    - Verify Constraint Checker returns feasible: false with violation details.
 *    - Verify overlapping itinerary is NOT saved to DB.
 *
 * 3. Booking Lifecycle
 *    - POST /api/v1/bookings → status: PENDING_APPROVAL.
 *    - POST /api/v1/payments/initiate → status transitions to PAYMENT_PENDING.
 *    - Mock payment gateway callback → status transitions to CONFIRMED.
 *    - GET /api/v1/bookings/:id/voucher → verify voucher returned.
 *
 * 4. Disruption → Replanning → Approval → New Version Flow (PRD Section 25 Scenario B)
 *    - POST /api/v1/events → inject ACTIVITY_CANCELLED event.
 *    - Verify Change Impact Analyzer identifies all affected items.
 *    - Verify 4 alternative proposals generated.
 *    - POST /api/v1/operations/proposals/:id/approve → verify new itinerary version created.
 *    - Verify all stakeholders notified.
 *
 * 5. Operator Margin Recalculation After Change
 *    - Approve a proposal with cost_delta = +700.
 *    - Verify itinerary.total_customer_price increased by 700.
 *    - Verify operator_margin recalculated correctly.
 *
 * TESTING FRAMEWORK: Jest + Supertest + Test DB (in-memory / test PostgreSQL).
 */
