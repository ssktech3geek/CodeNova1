/**
 * @file rateLimiter.middleware.ts
 * @module backend/middleware
 * @description Instructions for Rate Limiting and Throttling Middleware.
 *
 * PURPOSE:
 * Protect the API from abuse, DDoS, and excessive LLM API calls.
 * Use a sliding window rate limiter backed by Redis.
 *
 * FUNCTIONS TO IMPLEMENT (no code here):
 *
 * 1. globalRateLimiter:
 *    - Apply to all routes.
 *    - Limit: 200 requests per minute per IP.
 *    - Return 429 Too Many Requests with Retry-After header.
 *
 * 2. aiToolLimiter:
 *    - Apply to AI assistant and replanning endpoints.
 *    - Limit: 20 requests per minute per authenticated user.
 *    - Prevents runaway LLM cost escalation.
 *
 * 3. paymentLimiter:
 *    - Apply to payment initiation endpoints.
 *    - Limit: 5 requests per minute per user.
 *    - Reduces fraud surface area.
 *
 * KEY CONSTRAINTS:
 * - Limits must be stored in Redis for distributed multi-instance support.
 * - Headers X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset must be set.
 */
