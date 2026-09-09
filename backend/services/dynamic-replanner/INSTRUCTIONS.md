# Dynamic Replanner - Instructions

## Purpose
Generates feasible replacement alternatives after disruptions, handling the complete replanning workflow from impact analysis to ranked alternatives.

## Core Responsibilities
1. **Replanning Trigger**
   - Receive impact analysis from Change Impact Analyzer
   - Identify affected itinerary region (time window + dependencies)
   - Calculate free time slots created by disruption

2. **Alternative Generation**
   - Search available services in affected time/location window
   - Filter by: type compatibility, traveler preferences, operational feasibility
   - Generate candidate alternatives:
     - Reschedule original service
     - Substitute with similar service
     - Substitute with different service type
     - Remove and compress schedule
     - Add buffer/free time

3. **Alternative Validation**
   - Hard constraint validation (via Constraint Checker)
   - Schedule feasibility (via Route Optimizer)
   - Availability confirmation (real-time)
   - Budget compliance

4. **Alternative Scoring & Ranking**
   - Cost impact (delta from original)
   - Preference match (traveler interests, pace, style)
   - Travel impact (additional distance/time)
   - Schedule impact (ripple effects on subsequent items)
   - Weather risk (for outdoor activities)
   - Operational impact (vendor changes, margin)
   - Approval requirements

5. **Trade-off Explanation**
   - Structured explanation per alternative
   - Why selected/rejected
   - Preference match breakdown
   - Cost change details
   - Travel change details
   - Operational effect
   - Required approvals

## Replanning Flow
```
Impact Analysis → Affected Region → Free Time + Available Services
                    ↓
            Candidate Alternatives
                    ↓
         Hard Constraint Validation
                    ↓
         Soft Constraint Scoring
                    ↓
         Price + Margin Calculation
                    ↓
         Rank Alternatives
                    ↓
         Generate Explanations
```

## Alternative Types (from PRD)
- Reschedule original (cost: 0, preference: very high, approval: traveler+operator)
- Similar substitute (cost: variable, preference: high, approval: traveler)
- Different experience (cost: variable, preference: medium-high, approval: traveler+operator)
- Indoor/weather-safe option (cost: variable, preference: high, approval: traveler)

## API Endpoints
- `POST /replan/generate` - Generate alternatives from impact analysis
- `POST /replan/validate` - Validate specific alternative
- `POST /replan/score` - Score and rank alternatives
- `POST /replan/explain` - Generate trade-off explanations
- `GET /replan/history/:itineraryId` - Get replanning history

## Integration Points
- **Change Impact Analyzer**: Input for replanning
- **Constraint Checker**: Validate alternatives
- **Route Optimizer**: Travel time for alternatives
- **Pricing Service**: Cost calculation for alternatives
- **Destination Service**: Available replacement services
- **Operations Service**: Orchestrate full replanning flow
- **Approval Service**: Determine approval requirements

## Key Constraints
- Alternatives must be feasible (validated)
- Must explain WHY each alternative is proposed
- Never silently commit high-impact decisions
- Human approval required for margin/operational impact
- Version control: every replanning creates new itinerary version
- Configurable scoring weights