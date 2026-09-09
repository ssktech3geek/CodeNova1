# Route Optimizer - Instructions

## Purpose
Calculates optimal routes, travel times, and distances between itinerary locations considering transport modes, traffic, and operational constraints.

## Core Responsibilities
1. **Route Calculation**
   - Point-to-point routing between all itinerary locations
   - Multi-stop route optimization (TSP with constraints)
   - Transport mode-specific routing (car, walk, public transit, flight)
   - Real-time traffic consideration

2. **Travel Time Estimation**
   - Base travel time + buffer policy
   - Mode-specific speed profiles
   - Pickup/dropoff time overhead
   - Wait time for shared transport

3. **Schedule Feasibility**
   - Validate: Activity A end + Travel(A→B) + Buffer ≤ Activity B start
   - Buffer policy: configurable per transport mode and context
   - Identify infeasible transitions

4. **Distance & Cost Calculation**
   - Distance for pricing (per km rates)
   - Fuel/energy cost estimation
   - Carbon footprint estimation

5. **Multi-Modal Optimization**
   - Combine transport modes optimally
   - Transfer point optimization
   - Inter-modal connection timing

## Algorithm Approach
- **Graph-based**: Locations as nodes, routes as weighted edges
- **Constraints**: Time windows, transport availability, capacity
- **Objective**: Minimize total travel time + cost + fatigue
- **Real-time**: Traffic API integration for dynamic updates

## Data Inputs
- Location coordinates (lat/lng) for all services
- Transport modes available per segment
- Traffic data (real-time + historical)
- Transport schedules (for public transit)
- Pickup/dropoff locations

## API Endpoints
- `POST /routes/calculate` - Calculate route between two points
- `POST /routes/optimize` - Optimize multi-stop route
- `POST /routes/validate-schedule` - Validate itinerary schedule feasibility
- `POST /routes/travel-time` - Get travel time for segment
- `GET /routes/modes/:origin/:destination` - Available transport modes
- `POST /routes/carbon` - Calculate carbon footprint

## Integration Points
- **Destination Service**: Service locations
- **Constraint Checker**: Schedule validation
- **Itinerary Service**: Route info for itinerary items
- **Dynamic Replanner**: Recalculate routes after disruptions
- **Pricing Service**: Distance-based pricing
- **External Maps API**: Google Maps / Mapbox / OSM

## Key Constraints
- Travel times must be realistic (not optimistic)
- Buffer policy must be configurable
- Must handle multi-modal journeys
- Real-time traffic for active tours
- Offline-capable cached routes for traveler app
- Carbon calculation for sustainability scoring