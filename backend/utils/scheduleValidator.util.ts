/**
 * @file scheduleValidator.util.ts
 * @module backend/utils
 * @description Instructions for Schedule Feasibility Validation Utility.
 *
 * PURPOSE:
 * Validate that a traveler can physically move through a proposed schedule.
 * Implements Brain Section 32 (Route and Schedule Brain) logic.
 *
 * FUNCTIONS TO IMPLEMENT (no code here):
 *
 * 1. isScheduleFeasible(items: ItineraryItem[], travelMatrix: TravelTimeMatrix): ValidationResult
 *    - For each consecutive item pair: verify ActivityA.endTime + travelTime(A→B) + buffer ≤ ActivityB.startTime.
 *    - Check hotel check-in/check-out validity.
 *    - Check departure-compatible schedule on the last day.
 *    - Return ValidationResult: { feasible: boolean, violations: ConstraintViolation[] }.
 *
 * 2. detectScheduleOverlaps(items: ItineraryItem[]): OverlapConflict[]
 *    - Find any two items where time windows overlap.
 *    - Overlapping items must be rejected (Hard Constraint FR-04).
 *
 * 3. checkOpeningHoursCompliance(item: ItineraryItem, service: Experience | Hotel): boolean
 *    - Verify item.startTime and item.endTime fall within service.openingHours.
 *
 * 4. estimateFatigueScore(items: ItineraryItem[]): number
 *    - Compute schedule intensity based on: activity count, total travel time, rest gaps.
 *    - Higher score = more tiring schedule (used in soft constraint scoring).
 *
 * KEY CONSTRAINTS:
 * - Travel buffer policy must be configurable (e.g. 15 min default).
 * - Function must return structured violation details, not just pass/fail.
 */
