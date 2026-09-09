/**
 * @file E2E_TEST_SPEC.md
 * @module tests/e2e
 * @description Instructions for End-to-End Test Scenarios (PRD Section 25 Acceptance Criteria).
 *
 * E2E TESTS MAP DIRECTLY TO PRD ACCEPTANCE CRITERIA:
 *
 * SCENARIO A: Normal Planning Flow
 * -----------------------------------------------------------------------
 * Test: traveler_normal_planning_flow.e2e.ts
 *
 * Steps:
 * 1. Navigate to TripRequestPage. Enter: "Plan a relaxed 4-day Goa trip for 2 people under ₹45,000..."
 * 2. Verify structured preferences displayed for review.
 * 3. Navigate to ItineraryOptionsPage. Verify 3 plan options shown.
 * 4. Verify each option has: cost, preference_match %, day schedule, availability status.
 * 5. Verify hard constraints are satisfied (no overlaps, within budget).
 * 6. Select "Comfort Balance" plan. Customize: swap activity.
 * 7. Verify price and schedule recalculate after customization.
 * 8. Operator logs in, reviews itinerary, approves quote.
 * 9. Traveler pays. Verify booking status → CONFIRMED.
 * 10. Verify service confirmation vouchers downloadable.
 *
 * SCENARIO B: Disruption Handling Flow
 * -----------------------------------------------------------------------
 * Test: disruption_replanning_flow.e2e.ts
 *
 * Steps:
 * 1. Inject ACTIVITY_CANCELLED event for "Kayaking".
 * 2. Verify DisruptionBanner appears on traveler's ItineraryDetailPage.
 * 3. Verify affected items (guide, pickup, lunch reservation) marked disrupted.
 * 4. Navigate to ApprovalPage. Verify 4 alternatives with trade-off explanations.
 * 5. Verify each alternative has: cost delta, preference match, travel delta, approval required.
 * 6. Traveler approves "Cooking Workshop".
 * 7. Verify new itinerary version created (version = 2).
 * 8. Verify operator receives notification.
 * 9. Verify vendor receives cancellation notification.
 *
 * TESTING FRAMEWORK: Playwright or Cypress.
 * ENVIRONMENT: Docker Compose with test DB + seeded data.
 */
