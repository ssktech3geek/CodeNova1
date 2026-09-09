# Profile Service - Instructions

## Purpose
Manages traveler profiles, preferences, and structured travel requirements extracted from natural language input.

## Core Responsibilities
1. **Profile CRUD Operations**
   - Create, read, update, delete traveler profiles
   - Manage profile versions and history

2. **Preference Extraction**
   - Convert natural language trip requests into structured preferences
   - Interface with Travel Assistant AI for NLP processing
   - Validate and normalize extracted preferences

3. **Preference Storage**
   - Store structured preferences (budget, dates, interests, accommodation, transport, pace, accessibility, etc.)
   - Support both hard constraints (must-haves) and soft preferences (nice-to-haves)
   - Maintain preference categories: hard, soft, contextual

## Data Model
- **User**: Base user entity with authentication info
- **TravelerProfile**: Extended profile with travel preferences
  - destination, dates, duration, travelers count
  - budget, interests, accommodation type
  - transport preference, pace, food preferences
  - accessibility needs, adventure level
  - activity timing preferences, activities to avoid

## API Endpoints
- `POST /profiles` - Create profile
- `GET /profiles/:id` - Get profile
- `PUT /profiles/:id` - Update profile
- `DELETE /profiles/:id` - Delete profile
- `POST /profiles/:id/preferences/extract` - Extract preferences from natural language
- `GET /profiles/:id/preferences` - Get structured preferences

## Integration Points
- **Travel Assistant Service**: For natural language processing
- **Itinerary Service**: Provides preferences for itinerary generation
- **Auth Service**: User authentication and authorization

## Key Constraints
- Preferences must be validated against operational constraints before use
- Hard constraints (budget, dates, accessibility) are non-negotiable
- Profile data must be encrypted at rest
- Audit trail for all profile changes