/*
@file toolSchemas.model.ts
@module ai-ml/models
@description Specification for AI Tool-Calling Function Schemas (Brain Section 21).

PURPOSE:
Define the JSON schema for each tool the LLM is permitted to call.
The LLM MUST call these tools to get real data; it must NOT fabricate responses.

TOOL SCHEMAS TO DEFINE (no code, schema definitions only):

1. extract_preferences:
   - Description: Convert natural language to structured preferences.
   - Input: { natural_language: string }
   - Output: TravelerPreference

2. search_services:
   - Description: Search available hotels, activities, transport in a destination.
   - Input: { destination: string, dates: DateRange, service_types: string[], filters: SearchFilters }
   - Output: ServiceCandidate[]

3. get_availability:
   - Description: Check real-time availability for a specific service.
   - Input: { service_id: UUID, date: string, quantity: number }
   - Output: AvailabilityResult

4. calculate_route:
   - Description: Get travel time and distance between two locations.
   - Input: { origin: Coordinates, destination: Coordinates, mode: TransportMode }
   - Output: RouteResult

5. check_constraints:
   - Description: Validate an itinerary draft against all hard constraints.
   - Input: { itinerary_draft: ItineraryDraft }
   - Output: FeasibilityReport

6. calculate_price:
   - Description: Calculate customer price and operator margin for an itinerary.
   - Input: { itinerary_draft: ItineraryDraft }
   - Output: PriceBreakdown

7. analyze_change_impact:
   - Description: Analyze the cascading impact of a change event on an itinerary.
   - Input: { itinerary_id: UUID, change_event: ChangeEvent }
   - Output: ImpactReport

8. generate_alternatives:
   - Description: Generate ranked replacement alternatives after a disruption.
   - Input: { itinerary_id: UUID, impact_report: ImpactReport }
   - Output: ChangeProposal[]

9. request_approval:
   - Description: Submit a change proposal for stakeholder approval.
   - Input: { change_proposal_id: UUID }
   - Output: ApprovalRequest

10. summarize_update:
    - Description: Generate a plain-language summary of itinerary version changes.
    - Input: { previous_version_id: UUID, new_version_id: UUID }
    - Output: { summary: string }

KEY CONSTRAINTS:
- LLM result must always pass through a backend validation wrapper before committing.
- Tool calls are the ONLY mechanism for the LLM to act on real operational data.
*/
