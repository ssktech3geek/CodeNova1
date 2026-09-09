# Destination Service - Instructions

## Purpose
Manages destination data, service catalog (hotels, experiences, restaurants, transport, guides), and availability information.

## Core Responsibilities
1. **Destination Management**
   - CRUD operations for destinations
   - Store destination metadata (location, attractions, weather patterns, seasons)

2. **Service Catalog**
   - Hotels: types, amenities, pricing, capacity, check-in/out times
   - Experiences: activities, duration, weather dependency, capacity, ratings
   - Restaurants: cuisine, pricing, capacity, hours, dietary options
   - Transport: modes, capacity, routes, pricing, schedules
   - Guides: languages, specialties, availability, ratings
   - Wellness/Cultural/Adventure services

3. **Availability & Search**
   - Real-time availability checking
   - Filtering by dates, group size, budget, accessibility, opening hours
   - Weather-dependent service flagging
   - Integration with external provider APIs

## Data Model
- **Destination**: id, name, location, metadata, timezone
- **Hotel**: id, destination_id, type, amenities, pricing, capacity, policies
- **Experience**: id, destination_id, type, duration, weather_dependent, capacity, rating
- **Restaurant**: id, destination_id, cuisine, pricing, hours, capacity
- **Transport**: id, destination_id, mode, capacity, routes, pricing, schedule
- **Guide**: id, destination_id, languages, specialties, rating, availability
- **Availability**: service_id, date, slots_available, price_override

## API Endpoints
- `GET /destinations` - List destinations with filters
- `GET /destinations/:id` - Get destination details
- `GET /destinations/:id/hotels` - Search hotels with filters
- `GET /destinations/:id/experiences` - Search experiences with filters
- `GET /destinations/:id/restaurants` - Search restaurants
- `GET /destinations/:id/transport` - Search transport options
- `GET /destinations/:id/guides` - Search guides
- `POST /availability/check` - Bulk availability check
- `GET /services/:id/availability` - Get service availability for date range

## Integration Points
- **External APIs**: Hotel/activity provider APIs, weather APIs
- **Cache (Redis)**: Availability caching for performance
- **Search Index (Elasticsearch)**: Full-text search on services
- **Itinerary Service**: Provides candidate services for planning
- **Operations Service**: Real-time availability updates

## Key Constraints
- External availability is authoritative - never invent availability
- Cache TTL must be configurable per service type
- Weather-dependent services must be flagged
- Support pagination for large result sets