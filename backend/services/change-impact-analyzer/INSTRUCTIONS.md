# Change Impact Analyzer - Instructions

## Purpose
Analyzes the impact of disruption events on itineraries by traversing dependency graphs and calculating operational consequences.

## Core Responsibilities
1. **Event Processing**
   - Receive change events from Operations Service
   - Identify root affected itinerary item
   - Validate event data and context

2. **Dependency Graph Traversal**
   - Build/traverse itinerary dependency graph
   - Identify directly affected items (downstream dependencies)
   - Identify indirectly affected items (cascading effects)
   - Track dependency types: temporal, logistical, resource, financial

3. **Impact Calculation**
   - **Affected Items**: List of all impacted itinerary items with impact type
   - **Free Time**: Gaps created in schedule (minutes)
   - **Transport Changes**: Required transport modifications
   - **Reservation Timing**: Check-in/out, dining, activity reservation shifts
   - **Refund Estimate**: Based on cancellation policies and timing
   - **Extra Cost Estimate**: Replacement services, rebooking fees
   - **Travel Time Impact**: Additional travel distance/time
   - **Next-Day Effects**: Cascade to following days
   - **Preference Impact**: Traveler preference match degradation
   - **Operator Margin Impact**: Revenue vs cost changes

4. **Structured Output**
   - Machine-readable impact analysis for replanner
   - Human-readable summary for operators/travelers
   - Severity classification (low/medium/high/critical)

## Dependency Types
- **Temporal**: Item B starts after Item A ends + travel
- **Logistical**: Item B requires transport from Item A location
- **Resource**: Item B shares guide/vehicle/venue with Item A
- **Financial**: Item B cost depends on Item A (package deals)
- **Conditional**: Item B only if Item A completes (weather-dependent)

## Impact Analysis Algorithm
```
1. Find root item from event
2. BFS/DFS traversal of dependency graph
3. For each affected item, calculate:
   - Direct impact (cancelled, delayed, relocated)
   - Cascading impact on dependents
4. Aggregate financial, temporal, preference impacts
5. Classify severity
6. Output structured analysis
```

## API Endpoints
- `POST /impact/analyze` - Analyze event impact
- `GET /impact/:eventId` - Get cached impact analysis
- `POST /impact/dependencies/build` - Build dependency graph for itinerary
- `GET /impact/dependencies/:itineraryId` - Get dependency graph
- `POST /impact/severity` - Classify impact severity

## Integration Points
- **Operations Service**: Trigger analysis on events
- **Dynamic Replanner**: Provide impact analysis for replanning
- **Itinerary Service**: Access itinerary items and dependencies
- **Booking Service**: Check booking statuses and policies
- **Pricing Service**: Calculate refund and cost impacts
- **Route Optimizer**: Calculate travel time impacts

## Key Constraints
- Must identify ALL affected dependencies (not just direct)
- Real-time calculation for active tours
- Results must be deterministic and auditable
- Support for partial dependency graphs
- Configurable severity thresholds