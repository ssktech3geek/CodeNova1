/*
@file preferenceTypes.model.ts
@module ai-ml/models
@description Type Specifications for Structured Traveler Preferences and Constraint Categories.

PURPOSE:
Define the canonical TypeScript types/interfaces for the AI layer's input/output contracts.

TYPES TO DEFINE (no code, interface specifications only):

1. TravelerPreference:
   - destination: string
   - duration_days: number
   - travelers: number
   - budget: number (INR)
   - interests: string[]
   - accommodation: string
   - transport: string
   - pace: 'relaxed' | 'balanced' | 'intense'
   - food_preferences: string[]
   - accessibility_needs: string[]
   - adventure_level: 'none' | 'light' | 'moderate' | 'extreme'
   - nightlife: boolean
   - activities_to_avoid: string[]

2. HardConstraint (Brain Section 5):
   - Must NEVER be violated. Examples: budget_limit, required_dates, accessibility_requirement.
   - Fields: type, value, violation_message

3. SoftConstraint (Brain Section 5):
   - Can be traded off for scoring. Examples: preference_match, vendor_quality, sustainability.
   - Fields: type, weight (configurable), ideal_value

4. CandidateScore:
   - preference_match: number (0-1)
   - budget_fit: number (0-1)
   - travel_efficiency: number (0-1)
   - vendor_quality: number (0-1)
   - weather_risk: number (0-1, lower = safer)
   - sustainability: number (0-1)
   - fatigue_contribution: number (0-1, lower = less tiring)
   - aggregate_score: number (weighted sum)
*/
