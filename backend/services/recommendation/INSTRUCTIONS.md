# Recommendation Engine - Instructions

## Purpose
AI-powered service recommendation combining traveler preferences, availability, budget, operational feasibility, and contextual factors.

## Core Responsibilities
1. **Preference-Based Filtering**
   - Filter candidates by: destination, dates, budget, opening hours, availability, group size, accessibility, travel style, weather dependency
   - Apply hard constraints from traveler profile
   - Rank by soft preference match

2. **Collaborative & Content-Based Filtering**
   - Similar traveler preferences
   - Service similarity (amenities, type, location)
   - Historical booking patterns

3. **Contextual Recommendations**
   - Time-of-day appropriate activities
   - Weather-aware suggestions
   - Seasonal availability
   - Local events/festivals

4. **Explainable Recommendations**
   - Why this service was recommended
   - Preference match breakdown
   - Trade-offs vs alternatives
   - Confidence scores

## Algorithm Approach
- **Hybrid**: Content-based + Collaborative + Constraint-aware
- **Two-Stage**: Candidate generation (recall) → Ranking (precision)
- **Constraint-First**: Hard constraints filter before ranking
- **Real-time**: Availability and pricing from live data

## Data Inputs
- Traveler structured preferences (from Profile Service)
- Service catalog with operational metadata (from Destination Service)
- Real-time availability and pricing
- Historical booking and review data
- Weather forecasts
- Operator margin targets

## API Endpoints
- `POST /recommendations/hotels` - Hotel recommendations
- `POST /recommendations/experiences` - Experience recommendations
- `POST /recommendations/restaurants` - Restaurant recommendations
- `POST /recommendations/transport` - Transport recommendations
- `POST /recommendations/guides` - Guide recommendations
- `POST /recommendations/complete` - Full day/itinerary recommendations
- `GET /recommendations/explain/:recommendationId` - Get explanation

## Integration Points
- **Profile Service**: Traveler preferences
- **Destination Service**: Service catalog and availability
- **Constraint Checker**: Validate recommendations
- **Itinerary Service**: Feed candidates for itinerary generation
- **Analytics Service**: Recommendation performance tracking

## Key Constraints
- Never recommend unavailable services
- Operational feasibility is a hard filter
- Recommendations must be explainable
- No invented availability or pricing
- Diversity in recommendations (not just top-rated)
- Configurable recommendation weights