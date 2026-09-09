/**
 * @file integrations.config.ts
 * @module backend/config
 * @description Configuration specifications for External API Integrations (Maps, Weather, Payments, Notifications).
 * 
 * CORE RESPONSIBILITIES:
 * 1. Maps & Geolocation API (Google Maps / Mapbox / OpenStreetMap):
 *    - Matrix travel time API credentials and rate limits.
 *    - Route calculation buffer policies.
 * 2. Weather API (Weather Service Provider):
 *    - Severe weather alert polling intervals & webhook secrets.
 * 3. Payment Gateways (Razorpay / Stripe):
 *    - Secret keys, webhook verification tokens, currency configuration (INR/USD).
 * 4. Multi-Channel Messaging (SendGrid Email, Twilio SMS, WhatsApp Business API):
 *    - Template IDs for disruption alerts, quote approvals, and booking confirmations.
 * 
 * PARAMETERS:
 * - MAPS_API_KEY: string
 * - WEATHER_API_KEY: string
 * - PAYMENT_GATEWAY_KEY: string
 * - PAYMENT_GATEWAY_SECRET: string
 * - NOTIFICATION_SERVICE_SID: string
 */
