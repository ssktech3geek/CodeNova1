/**
 * @file preferenceExtractor.service.ts
 * @module ai-ml/services
 * @description Instructions for Natural Language Preference Extraction AI Service.
 *
 * PURPOSE:
 * Convert a free-text traveler trip request into a validated, structured TravelerPreference object.
 * Implements Brain Section 4 (Traveler Intent Processing) and FR-01.
 *
 * FUNCTIONS TO IMPLEMENT (no code here):
 *
 * 1. extractPreferences(naturalLanguageInput: string): Promise<TravelerPreference>
 *    - Send input to LLM using the preference-extraction prompt template (see prompts/).
 *    - LLM response must be JSON; enforce JSON mode / structured output.
 *    - Parse response into TravelerPreference schema.
 *    - Validate required fields (destination, dates, budget, travelers_count).
 *    - Return structured preference object.
 *
 * 2. validateExtractedPreferences(prefs: TravelerPreference): ValidationResult
 *    - Run hard constraint checks: budget > 0, dates valid, travelers_count >= 1.
 *    - Flag ambiguous or missing fields for follow-up clarification.
 *
 * FIELDS EXTRACTED (from Brain Section 4):
 * - destination, duration_days, travelers, budget, interests[], accommodation,
 *   transport, pace, nightlife, food_preferences[], accessibility, adventure_level,
 *   preferred_activity_times, activities_to_avoid[]
 *
 * KEY CONSTRAINTS:
 * - LLM MUST NOT invent prices or availability.
 * - On ambiguous input, return clarification_questions[] rather than guessing.
 * - Temperature: 0.1 (strict extraction, minimal creativity).
 * - All extracted preferences must pass backend validation before use.
 */
