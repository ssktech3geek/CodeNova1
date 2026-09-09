/**
 * @file Notification.model.ts
 * @module backend/models
 * @description Specification for Multi-Channel Notification Entity with Retry Support.
 *
 * SCHEMA FIELDS & PARAMETERS:
 * - id: UUID (Primary Key)
 * - recipient_user_id: UUID (Foreign Key -> User.id)
 * - recipient_role: Enum ['TRAVELER', 'OPERATOR', 'VENDOR', 'DRIVER', 'GUIDE', 'COORDINATOR']
 * - channel: Enum ['EMAIL', 'SMS', 'WHATSAPP', 'IN_APP', 'PUSH']
 * - notification_type: Enum ['DISRUPTION_ALERT', 'APPROVAL_REQUEST', 'BOOKING_CONFIRMED', 'ITINERARY_UPDATED', 'PAYMENT_RECEIVED', 'REFUND_ISSUED', 'REMINDER']
 * - template_id: string
 * - payload: JSON Object (Template variables)
 * - status: Enum ['PENDING', 'SENT', 'DELIVERED', 'FAILED', 'RETRYING']
 * - retry_count: number (Default: 0)
 * - max_retries: number (Default: 3)
 * - sent_at: Timestamp
 * - created_at: Timestamp
 *
 * INSTRUCTIONS:
 * - Notifications MUST be retryable (idempotent delivery).
 * - Each disruption must notify all affected stakeholders: Traveler, Operator, Vendor, Guide, Driver.
 */
