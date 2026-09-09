/**
 * @file Review.model.ts
 * @module backend/models
 * @description Specification for Traveler Review & Rating Entity for Services and Vendors.
 *
 * SCHEMA FIELDS & PARAMETERS:
 * - id: UUID (Primary Key)
 * - traveler_user_id: UUID (Foreign Key -> User.id)
 * - reviewable_type: Enum ['HOTEL', 'EXPERIENCE', 'TRANSPORT', 'GUIDE', 'OPERATOR']
 * - reviewable_id: UUID (Polymorphic FK)
 * - booking_id: UUID (Foreign Key -> Booking.id; only confirmed/completed bookings)
 * - overall_rating: decimal (1.0 - 5.0)
 * - rating_breakdown: JSON Object (e.g. { service_quality: 4.5, value_for_money: 4.0, punctuality: 5.0 })
 * - comment: text
 * - is_published: boolean (Moderated before publishing)
 * - created_at: Timestamp
 *
 * INSTRUCTIONS:
 * - Only allow reviews for bookings with status COMPLETED.
 * - Publish only after passing moderation check.
 */
