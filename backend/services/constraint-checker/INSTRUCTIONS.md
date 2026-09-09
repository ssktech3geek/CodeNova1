# Constraint Checker - Instructions

## Purpose
Validates hard constraints and scores soft constraints for itineraries and individual services.

## Core Responsibilities
1. **Hard Constraint Validation (Layer A)**
   - No overlapping activities (temporal)
   - Valid operating hours for all services
   - Feasible travel time between consecutive items (travel + buffer ≤ gap)
   - Service availability confirmed
   - Capacity not exceeded
   - Budget not exceeded
   - Valid hotel check-in/check-out times
   - Departure-compatible schedule (last activity ends before departure)

2. **Soft Constraint Scoring (Layer B)**
   - Preference match score
   - Travel efficiency (distance, time, mode)
   - Waiting time minimization
   - Fatigue estimation (activity intensity, travel, pace)
   - Vendor quality (ratings, reliability)
   - Sustainability score (transport mode, local sourcing)
   - Crowding avoidance (popular times, capacity utilization)
   - Operator margin protection

3. **Constraint Configuration**
   - Configurable constraint definitions
   - Weight management for soft constraints
   - Per-destination/per-service-type rules
   - Buffer time policies

4. **Validation Output**
   - Pass/fail for hard constraints with specific violations
   - Numerical scores for soft constraints
   - Detailed violation explanations
   - Repair suggestions for failed hard constraints

## Hard Constraint Categories
- **Temporal**: Overlaps, operating hours, travel feasibility, check-in/out
- **Resource**: Availability, capacity, guide/vehicle assignment
- **Financial**: Budget, pricing validity
- **Logistical**: Location compatibility, transfer feasibility

## Soft Constraint Weights (Configurable)
- Preference Match: 30%
- Travel Efficiency: 20%
- Fatigue/Comfort: 15%
- Vendor Quality: 15%
- Sustainability: 10%
- Margin Protection: 10%

## API Endpoints
- `POST /constraints/validate-hard` - Validate hard constraints
- `POST /constraints/score-soft` - Score soft constraints
- `POST /constraints/validate-full` - Full validation with scores
- `GET /constraints/rules` - Get constraint rules
- `POST /constraints/rules` - Update constraint rules
- `POST /constraints/suggest-repairs` - Suggest repairs for violations

## Integration Points
- **Itinerary Service**: Validate generated itineraries
- **Dynamic Replanner**: Validate alternatives
- **Route Optimizer**: Travel time calculations
- **Destination Service**: Availability and operating hours
- **Pricing Service**: Budget validation

## Key Constraints
- Hard constraints are non-negotiable - must reject/ repair
- Soft constraint weights must be configurable (not hardcoded)
- Validation must be fast (< 100ms for typical itinerary)
- All violations must be explainable
- Support for custom operator-defined constraints