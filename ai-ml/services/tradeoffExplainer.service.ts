/**
 * @file tradeoffExplainer.service.ts
 * @module ai-ml/services
 * @description Instructions for Structured Trade-Off Explanation Generation Service.
 *
 * PURPOSE:
 * Generate human-readable, structured explanations for each alternative proposal.
 * Implements Brain Sections 14 (Trade-Off Explanation) and 35 (Explainability Contract).
 *
 * FUNCTIONS TO IMPLEMENT (no code here):
 *
 * 1. explainAlternative(proposal: ChangeProposal, originalItem: ItineraryItem, preferences: TravelerPreference): AlternativeExplanation
 *    - Produce a structured explanation object:
 *      {
 *        why_selected: string[],         // e.g. ['Indoor activity', 'Low weather risk', 'High preference match']
 *        preference_match: { score, reasons[] },
 *        cost_change: { delta, direction, breakdown },
 *        travel_change: { additional_minutes, route_impact },
 *        schedule_change: { shift_minutes, affected_items_count },
 *        operational_effect: { vendor_change, guide_change, transport_change },
 *        approval_required: { roles: Role[], reason }
 *      }
 *    - Use LLM for natural-language summary only; all numeric values must come from backend.
 *
 * 2. summarizeItineraryUpdate(previousVersion: Itinerary, newVersion: Itinerary): string
 *    - Generate a plain-language summary of what changed between versions.
 *    - Used for traveler and operator notification messages.
 *
 * KEY CONSTRAINTS:
 * - Numbers (cost, time) must be from pre-calculated backend values, NOT LLM-generated.
 * - LLM role: narrate and explain; backend role: calculate and validate.
 * - Temperature: 0.4 for natural-sounding explanations.
 */
