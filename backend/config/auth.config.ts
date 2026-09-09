/**
 * @file auth.config.ts
 * @module backend/config
 * @description Configuration specifications for Authentication, Authorization, and Security Policies.
 * 
 * CORE RESPONSIBILITIES:
 * 1. JWT Token Strategy:
 *    - Access token secret, algorithm (HS256/RS256), expiry duration (e.g. 15m).
 *    - Refresh token secret, storage in HttpOnly cookies, expiry duration (7d).
 * 2. Role-Based Access Control (RBAC) Definitions:
 *    - Roles: TRAVELER, OPERATOR, VENDOR, ADMIN.
 *    - Permission scope mapping for endpoints and data models.
 * 3. Encryption at Rest & In Transit:
 *    - Encryption keys for PII (personally identifiable information).
 *    - TLS enforcement policies.
 * 
 * PARAMETERS:
 * - JWT_SECRET: string
 * - JWT_EXPIRES_IN: string (default: "15m")
 * - REFRESH_TOKEN_SECRET: string
 * - ENCRYPTION_KEY_32BYTES: string
 */
