/**
 * @file TravelerProfile.model.ts
 * @module backend/models
 * @description Specification for Traveler Profile & Structured Preferences Entity.
 * 
 * SCHEMA FIELDS & PARAMETERS:
 * - id: UUID (Primary Key)
 * - user_id: UUID (Foreign Key -> User.id, Unique)
 * - destination_interest: string
 * - duration_days: number (min: 1, max: 30)
 * - travelers_count: number (min: 1)
 * - budget_limit: decimal (Currency unit: INR / USD)
 * - interests: JSON Array of strings (e.g. ['beaches', 'local food', 'light adventure'])
 * - accommodation_preference: string (e.g. 'boutique hotel', 'luxury resort', 'budget hostel')
 * - transport_preference: string (e.g. 'private car', 'public transport', 'self-drive')
 * - pace: Enum ['RELAXED', 'BALANCED', 'INTENSE']
 * - food_preferences: JSON Array (e.g. ['vegetarian', 'seafood', 'street food'])
 * - accessibility_needs: JSON Array of strings
 * - adventure_level: Enum ['NONE', 'LIGHT', 'MODERATE', 'EXTREME']
 * - preferred_activity_times: JSON Object (e.g. { morning: true, evening: true })
 * - activities_to_avoid: JSON Array of strings (e.g. ['nightlife', 'water sports'])
 * - created_at: Timestamp
 * - updated_at: Timestamp
 * 
 * RELATIONSHIPS:
 * - Belongs to User
 * - Has Many Itineraries
 */
