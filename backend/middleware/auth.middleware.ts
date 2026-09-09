/**
 * @file auth.middleware.ts
 * @module backend/middleware
 * @description Instructions for JWT Authentication and Role-Based Authorization Middleware.
 *
 * PURPOSE:
 * Guard all protected API routes. Verify JWT tokens, extract user identity, enforce RBAC.
 *
 * FUNCTIONS TO IMPLEMENT (no code here):
 *
 * 1. authenticateToken(req, res, next):
 *    - Extract Bearer token from Authorization header.
 *    - Verify token signature using JWT_SECRET from auth.config.
 *    - Decode and attach decoded user (id, role) to req.user.
 *    - Return 401 if missing / 403 if expired or invalid.
 *
 * 2. requireRole(...roles: Role[]):
 *    - Factory function returning a middleware guard.
 *    - Compare req.user.role against allowed roles array.
 *    - Return 403 Forbidden if role not allowed.
 *    - Log access violations in AuditLog.
 *
 * 3. requireOwnership(entityType, paramKey):
 *    - Ensure the requesting user owns the requested resource.
 *    - Used for traveler own-profile access, own-itinerary access.
 *    - Return 403 if ownership mismatch.
 *
 * KEY CONSTRAINTS:
 * - Every protected route MUST call authenticateToken before any business logic.
 * - Role checks must align with the Role-Based Access Matrix defined in PRD Section 18.
 * - Vendor access must be scoped only to their assigned bookings/services.
 */
