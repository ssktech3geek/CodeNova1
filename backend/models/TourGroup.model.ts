/**
 * @file TourGroup.model.ts
 * @module backend/models
 * @description Specification for Group Tour Management & Assigned Coordinator Entity.
 * 
 * SCHEMA FIELDS & PARAMETERS:
 * - id: UUID (Primary Key)
 * - operator_id: UUID (Foreign Key -> Operator.id)
 * - coordinator_user_id: UUID (Foreign Key -> User.id)
 * - group_name: string
 * - max_capacity: number
 * - current_members_count: number
 * - status: Enum ['FORMING', 'CONFIRMED', 'IN_TRANSIT', 'COMPLETED']
 * - created_at: Timestamp
 */
