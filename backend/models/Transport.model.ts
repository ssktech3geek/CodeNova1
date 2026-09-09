/**
 * @file Transport.model.ts
 * @module backend/models
 * @description Specification for Transport Service Candidate Entity.
 * 
 * SCHEMA FIELDS & PARAMETERS:
 * - id: UUID (Primary Key)
 * - vendor_id: UUID (Foreign Key -> Vendor.id)
 * - transport_mode: Enum ['PRIVATE_CAR', 'PUBLIC_BUS', 'SHARED_SHUTTLE', 'SCOOTER_RENTAL']
 * - vehicle_type: string (e.g. 'Sedan', 'SUV', 'Minivan')
 * - capacity: number
 * - base_flat_rate: decimal
 * - rate_per_km: decimal
 * - supplier_cost_base: decimal
 * - driver_assigned: boolean
 * - rating: decimal
 */
