/**
 * @file AuditLog.model.ts
 * @module backend/models
 * @description Specification for Immutable Audit Trail for Security-Sensitive and Operationally Important Actions.
 *
 * SCHEMA FIELDS & PARAMETERS:
 * - id: UUID (Primary Key)
 * - actor_user_id: UUID (Foreign Key -> User.id; nullable for system actions)
 * - actor_role: string
 * - action: string (e.g. 'ITINERARY_APPROVED', 'BOOKING_CANCELLED', 'PAYMENT_PROCESSED')
 * - entity_type: string (e.g. 'Itinerary', 'Booking', 'ChangeProposal')
 * - entity_id: UUID
 * - previous_state: JSON Object (Snapshot before change)
 * - new_state: JSON Object (Snapshot after change)
 * - ip_address: string
 * - request_id: string (Correlation ID from API Gateway)
 * - occurred_at: Timestamp (Immutable; never updated)
 *
 * INSTRUCTIONS:
 * - Audit logs are append-only and must NEVER be deleted or mutated.
 * - Must log: approvals, payment events, itinerary version changes, booking changes, RBAC violations.
 * - Required by FR-20 Auditability and Security NFR.
 */
