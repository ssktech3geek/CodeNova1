/**
 * @file index.types.ts
 * @module shared/types
 * @description Canonical shared TypeScript type definitions used across frontend, backend, and ai-ml modules.
 *
 * TYPES / INTERFACES TO DEFINE (no code):
 *
 * 1. AuthUser: { id: UUID, email: string, role: Role }
 *
 * 2. Role: 'TRAVELER' | 'OPERATOR' | 'VENDOR' | 'ADMIN'
 *
 * 3. BookingStatus: 'DISCOVERED' | 'SELECTED' | 'QUOTED' | 'PENDING_APPROVAL' | 'APPROVED' | 'PAYMENT_PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'REFUND_PENDING' | 'REFUNDED' | 'CHANGE_REQUESTED' | 'RESCHEDULED'
 *
 * 4. ItineraryStatus: 'DRAFT' | 'FEASIBILITY_CHECK' | 'QUOTE' | 'CUSTOMER_APPROVAL' | 'PAYMENT_PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'DISRUPTED' | 'CANCELLED'
 *
 * 5. EventType: 'ACTIVITY_CANCELLED' | 'ACTIVITY_DELAYED' | 'TRANSPORT_DELAYED' | 'TRANSPORT_CANCELLED' | 'WEATHER_RISK' | 'HOTEL_UNAVAILABLE' | 'VENDOR_UNAVAILABLE' | 'TRAVELER_CHANGE' | 'AVAILABILITY_CHANGED'
 *
 * 6. ApprovalRole: 'TRAVELER' | 'OPERATOR' | 'ADMIN'
 *
 * 7. Coordinates: { lat: number, lng: number }
 *
 * 8. DateRange: { start: string, end: string }  (ISO 8601)
 *
 * 9. PriceBreakdown: { hotel: number, transport: number, activities: number, guides: number, meals: number, taxes: number, platform_charges: number, discounts: number, total: number }
 *
 * 10. MarginResult: { customer_price: number, supplier_cost: number, discounts: number, refunds: number, operational_charges: number, margin: number, margin_percentage: number }
 *
 * 11. ValidationResult: { valid: boolean, errors: ValidationError[] }
 *
 * 12. ValidationError: { field: string, message: string }
 *
 * INSTRUCTIONS:
 * - This file is the single source of truth for cross-layer types.
 * - Both frontend (TypeScript) and backend must import from this shared module.
 * - Never duplicate these types in service-specific files.
 */
