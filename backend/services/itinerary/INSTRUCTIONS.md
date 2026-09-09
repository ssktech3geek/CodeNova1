# Itinerary Service - Instructions

## Purpose
Core service for itinerary generation, validation, optimization, versioning, and lifecycle management. This is the central operational object of the platform.

## Core Responsibilities
1. **Itinerary Generation**
   - Generate multiple itinerary alternatives from candidate services
   - Day-wise scheduling with start/end times, travel distance, transport mode
   - Apply hard constraints (no overlaps, valid hours, feasible travel, availability, capacity, budget)
   - Optimize soft constraints (travel efficiency, fatigue, preference match, vendor quality, sustainability, margin)

2. **Itinerary Validation**
   - Hard constraint validation before marking feasible
   - Schedule feasibility: travel time + buffer ≤ next activity start
   - Dependency graph validation

3. **Itinerary Optimization**
   - Score alternatives using configurable weights
   - Factors: preference match, travel efficiency, waiting time, fatigue, vendor quality, sustainability, crowding, operator margin
   - Return ranked alternatives with scores

4. **Itinerary Lifecycle Management**
   - States: DRAFT → FEASIBILITY_CHECK → QUOTE → CUSTOMER_APPROVAL → PAYMENT → CONFIRMED → ACTIVE
   - Disruption handling: ACTIVE → IMPACT_ANALYSIS → ALTERNATIVES → APPROVAL → NEW_VERSION → ACTIVE
   - Version control: maintain history of all versions with change events, proposals, approvals

5. **Customization & Recalculation**
   - Handle traveler/operator changes (hotels, activities, transport, meals, pace, budget, duration)
   - Recalculate: price, schedule, travel distance, availability, preference score, fatigue, dependencies, operator margin

## Data Model
- **Itinerary**: id, traveler_id, operator_id, version, status, total_cost, preference_score, margin
- **ItineraryItem**: id, itinerary_id, day, sequence, type (hotel/experience/transport/guide/meal), service_id, start_time, end_time, location, dependencies[]
- **ItineraryVersion**: id, itinerary_id, version_number, change_event_id, change_proposal_id, approval_id, created_at
- **DependencyGraph**: item_id, depends_on_item_id, dependency_type (temporal/logistical/resource)

## API Endpoints
- `POST /itineraries` - Create draft itinerary from preferences
- `GET /itineraries/:id` - Get itinerary with items
- `GET /itineraries/:id/alternatives` - Get generated alternatives
- `POST /itineraries/:id/validate` - Validate hard constraints
- `POST /itineraries/:id/optimize` - Re-optimize with current constraints
- `POST /itineraries/:id/customize` - Apply customization and recalculate
- `POST /itineraries/:id/approve` - Approve itinerary (traveler/operator)
- `GET /itineraries/:id/versions` - Get version history
- `GET /itineraries/:id/version/:version` - Get specific version
- `POST /itineraries/:id/disruption` - Handle disruption event

## Integration Points
- **Profile Service**: Get traveler preferences
- **Destination Service**: Get candidate services and availability
- **Constraint Checker**: Validate hard/soft constraints
- **Route Optimizer**: Calculate travel times and routes
- **Pricing Service**: Calculate costs and margins
- **Booking Service**: Convert confirmed itinerary to bookings
- **Operations Service**: Handle disruptions and replanning
- **Change Impact Analyzer**: Analyze disruption impact
- **Dynamic Replanner**: Generate alternatives after disruption

## Key Constraints
- Hard constraints MUST never be violated
- Every material change triggers full recalculation
- Itinerary is a living operational object, not a static document
- Version history must be immutable
- All changes must be explainable with trade-offs