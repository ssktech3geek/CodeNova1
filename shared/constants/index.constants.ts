/**
 * @file index.constants.ts
 * @module shared/constants
 * @description Shared application constants used across frontend and backend.
 *
 * CONSTANTS TO DEFINE (no code, just declarations):
 *
 * ITINERARY:
 * - MAX_ITINERARY_DURATION_DAYS = 30
 * - MAX_TRAVELERS_PER_ITINERARY = 50
 * - MIN_ITINERARY_OPTIONS = 3  (Budget / Comfort / Premium)
 * - DEFAULT_TRAVEL_BUFFER_MINUTES = 15
 * - DEFAULT_SCHEDULE_FATIGUE_THRESHOLD = 75 (score out of 100)
 *
 * PRICING:
 * - PLATFORM_CHARGE_PERCENTAGE = 5.0
 * - GST_PERCENTAGE = 18.0
 * - DEFAULT_CURRENCY = 'INR'
 * - MIN_OPERATOR_MARGIN_PERCENTAGE = 10.0
 *
 * DISRUPTION & APPROVAL:
 * - APPROVAL_HIGH_IMPACT_MARGIN_THRESHOLD = 5.0  (% margin change triggers operator approval)
 * - APPROVAL_HIGH_IMPACT_SCHEDULE_SHIFT_MINUTES = 60
 * - MAX_ALTERNATIVES_PER_DISRUPTION = 5
 *
 * SYSTEM:
 * - API_VERSION = 'v1'
 * - DEFAULT_PAGE_SIZE = 20
 * - MAX_PAGE_SIZE = 100
 * - REQUEST_TIMEOUT_MS = 10000
 * - AI_REQUEST_TIMEOUT_MS = 20000
 *
 * NOTIFICATIONS:
 * - MAX_NOTIFICATION_RETRY_COUNT = 3
 * - NOTIFICATION_RETRY_BACKOFF_BASE_MS = 1000
 */
