/**
 * @file User.model.ts
 * @module backend/models
 * @description Specification for User Entity and Authentication Record.
 * 
 * SCHEMA FIELDS & PARAMETERS:
 * - id: UUID (Primary Key)
 * - email: string (Unique, Index, Valid email format)
 * - password_hash: string (Bcrypt hash)
 * - role: Enum ['TRAVELER', 'OPERATOR', 'VENDOR', 'ADMIN']
 * - phone_number: string (E.164 format)
 * - full_name: string
 * - is_active: boolean (Default: true)
 * - created_at: Timestamp
 * - updated_at: Timestamp
 * 
 * RELATIONSHIPS:
 * - One-to-One with TravelerProfile (if role == 'TRAVELER')
 * - One-to-One with Operator (if role == 'OPERATOR')
 * - One-to-One with Vendor (if role == 'VENDOR')
 * 
 * INSTRUCTIONS:
 * - PII fields must be encrypted at rest.
 * - Password hashes must use bcrypt with work factor >= 12.
 */
