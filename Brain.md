# Brain.md

# Dynamic Tour Orchestration Platform Brain

This document describes the reasoning model, system logic, state
transitions, dependency model, and decision-making behavior behind the
Personalized Dynamic Tour Planning & Tour Operations Platform.

The product source describes the platform as a **constraint-aware,
event-driven replanning engine for multi-vendor tour operations**. The
central idea is that an itinerary is not a static list of places. It is
a connected operational system whose components depend on one another.

------------------------------------------------------------------------

# 1. The Core Mental Model

Think of the trip as a living graph.

``` text
Traveler Intent
      │
      ▼
Structured Preferences
      │
      ▼
Candidate Services
      │
      ▼
Feasible Itinerary
      │
      ├───────────────┐
      ▼               ▼
Bookings          Dependencies
      │               │
      └───────┬───────┘
              ▼
        Live Tour State
              │
              ▼
        External Event
              │
              ▼
       Impact Analysis
              │
              ▼
       Alternative Plans
              │
              ▼
        Approval Logic
              │
              ▼
       New Itinerary Version
              │
              ▼
       Stakeholder Sync
```

The system therefore has two major modes:

1.  **Plan mode:** create the best feasible journey.
2.  **Adapt mode:** keep an existing journey feasible when something
    changes.

The second mode is the key differentiator.

------------------------------------------------------------------------

# 2. Brain Architecture

``` text
┌─────────────────────────────────────────────────────────────┐
│                        TRAVELER INTENT                      │
│ destination, dates, budget, interests, pace, constraints   │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    AI UNDERSTANDING LAYER                   │
│ natural language → structured preferences                   │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  CANDIDATE GENERATION                       │
│ hotels / activities / transport / restaurants / guides     │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  CONSTRAINT ENGINE                          │
│ hard constraints → reject invalid candidates                │
│ soft constraints → score and optimize                       │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  ITINERARY OPTIMIZER                        │
│ schedule + route + cost + preference + fatigue + margin    │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    LIVE ITINERARY                           │
│ items + bookings + dependencies + versions + stakeholders  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                        event occurs
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  EVENT / DISRUPTION ENGINE                  │
│ cancellation / delay / weather / availability / user      │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    IMPACT ANALYZER                          │
│ affected bookings, timing, transport, refunds, margin      │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  REPLANNING ENGINE                          │
│ generate → constrain → score → rank alternatives           │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  EXPLANATION + APPROVAL                     │
│ trade-offs + correct human approval                         │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                VERSION + SYNCHRONIZATION                    │
│ itinerary update → stakeholders → audit trail              │
└─────────────────────────────────────────────────────────────┘
```

------------------------------------------------------------------------

# 3. Principle: AI Is Not the Source of Truth

The AI layer is responsible for: - understanding natural language; -
extracting preferences; - recommending experiences; - drafting
itineraries; - explaining decisions; - summarizing updates; -
translating; - answering itinerary questions.

The operational system is responsible for: - validating availability; -
validating schedules; - validating capacity; - calculating prices; -
calculating refunds; - calculating margins; - enforcing constraints; -
recording approvals; - committing booking changes.

### Rule

``` text
AI proposes
     ↓
Backend validates
     ↓
Human approves when required
     ↓
System commits
```

This is essential because the source explicitly requires: - no invented
prices; - no invented availability; - backend validation; - human
approval for high-impact decisions.

------------------------------------------------------------------------

# 4. Traveler Intent Processing

## Input

A traveler can express requirements conversationally.

Example:

``` text
Plan a relaxed four-day Goa trip for two people
under ₹45,000 with beaches, local food, light adventure,
a boutique hotel, private transport, and no nightlife.
```

## Extraction

The AI converts this into structured state:

``` json
{
  "destination": "Goa",
  "duration_days": 4,
  "travelers": 2,
  "budget": 45000,
  "interests": [
    "beaches",
    "local food",
    "light adventure"
  ],
  "accommodation": "boutique hotel",
  "transport": "private car",
  "pace": "relaxed",
  "nightlife": false
}
```

Additional fields supported by the product include: - dates; - age
group; - food preferences; - accessibility; - adventure level; -
preferred activity times; - activities to avoid.

------------------------------------------------------------------------

# 5. Preference Model

Separate preferences into three classes.

## Hard Preferences / Constraints

These are requirements that must not be violated when they are treated
as hard constraints.

Examples: - approved budget; - required dates; - accessibility
requirement; - activity to avoid; - valid departure schedule.

## Soft Preferences

These should influence ranking but can be traded off.

Examples: - shorter travel; - lower fatigue; - higher preference
match; - better vendor ratings; - sustainable transport; - less crowded
locations.

## Contextual Preferences

These can influence the planner without necessarily being absolute.

Examples: - desired pace; - activity timing; - destination count; -
style of experience.

------------------------------------------------------------------------

# 6. Candidate Generation

Candidate services come from the supported travel ecosystem.

``` text
Destination
 ├── Hotels
 ├── Experiences
 ├── Restaurants
 ├── Transport
 ├── Guides
 ├── Wellness
 └── Cultural / Adventure Activities
```

Every candidate should carry enough operational metadata to be
evaluated.

Conceptually:

``` json
{
  "service_id": "...",
  "type": "activity",
  "availability": true,
  "capacity": 4,
  "duration_minutes": 120,
  "opening_hours": "...",
  "price": 1200,
  "weather_dependent": true,
  "location": "...",
  "rating": 4.6
}
```

The exact external provider schema is not defined by the source and
should be treated as an implementation detail.

------------------------------------------------------------------------

# 7. Constraint Brain

The constraint system has two layers.

## Layer A: Hard Constraint Filter

``` text
candidate itinerary
      │
      ├── overlap? ────────> reject
      ├── outside hours? ──> reject
      ├── travel impossible? -> reject
      ├── unavailable? ────> reject
      ├── capacity exceeded? -> reject
      ├── budget exceeded? -> reject
      ├── check-in invalid? -> reject
      └── departure conflict? -> reject
```

Only surviving plans are considered feasible.

## Layer B: Soft Constraint Ranking

A feasible plan can then be scored using factors such as:

``` text
Preference Match
Travel Efficiency
Waiting Time
Fatigue
Vendor Quality
Sustainability
Crowding
Operator Margin
```

The source does not prescribe exact weights or a mathematical scoring
formula. Those weights should therefore be configurable rather than
hard-coded as source facts.

------------------------------------------------------------------------

# 8. Itinerary as a Dependency Graph

The most important internal representation is a graph.

``` text
Hotel
  │
  ├── check-in
  │
  ▼
Transport ─────► Activity
                    │
                    ├────► Guide
                    ├────► Pickup
                    └────► Meal
                              │
                              ▼
                         Next Activity
                              │
                              ▼
                           Hotel
```

An `ItineraryItem` should therefore not be treated as an isolated
record.

It may depend on: - another itinerary item; - a booking; - a transport
service; - a guide; - a vendor; - a reservation; - weather; - operating
hours; - capacity.

This dependency graph is what allows the platform to answer:

> "If this activity disappears, what else breaks?"

------------------------------------------------------------------------

# 9. Event Model

A disruption is represented as a `ChangeEvent`.

Potential sources: - vendor; - weather API; - transport provider; -
operator; - traveler; - availability synchronization.

Examples:

``` text
ACTIVITY_CANCELLED
ACTIVITY_DELAYED
TRANSPORT_DELAYED
TRANSPORT_CANCELLED
WEATHER_RISK
HOTEL_UNAVAILABLE
VENDOR_UNAVAILABLE
TRAVELER_CHANGE
AVAILABILITY_CHANGED
```

The exact event taxonomy is an implementation decision. The source
establishes the need for event detection and identifies the possible
event sources.

------------------------------------------------------------------------

# 10. Impact Analysis

When an event arrives:

``` text
EVENT
  ↓
Find affected itinerary item
  ↓
Traverse dependency graph
  ↓
Collect directly affected items
  ↓
Collect indirectly affected items
  ↓
Recalculate operational consequences
```

For a cancelled kayaking activity, the source explicitly identifies: -
kayaking booking; - pickup vehicle; - guide; - lunch reservation; -
afternoon schedule; - refund; - customer notification; - operator
margin.

The analyzer should therefore calculate:

``` text
Affected Items
Free Time
Transport Changes
Reservation Timing
Refund
Extra Cost
Travel Time
Next-Day Effects
Preference Impact
Operator Margin Impact
```

------------------------------------------------------------------------

# 11. Change Propagation

Use dependency traversal rather than manually hard-coding every possible
consequence.

Conceptually:

``` python
def analyze_change(event, itinerary):
    impacted = set()

    root = find_item_causing_event(event)
    impacted.add(root)

    queue = [root]

    while queue:
        current = queue.pop()

        for dependency in current.dependencies:
            if dependency not in impacted:
                impacted.add(dependency)
                queue.append(dependency)

    return calculate_impacts(impacted, itinerary)
```

The exact implementation may use relational dependency tables, an event
graph, or an optional graph database such as Neo4j. The source lists
Neo4j as optional.

------------------------------------------------------------------------

# 12. Replanning Brain

After impact analysis, generate replacement plans.

``` text
Current Plan
    │
    ▼
Affected region
    │
    ▼
Free time + available services
    │
    ▼
Candidate alternatives
    │
    ▼
Hard constraint validation
    │
    ▼
Soft constraint scoring
    │
    ▼
Price + margin calculation
    │
    ▼
Rank alternatives
```

Possible replacements from the source include: - rescheduled kayaking; -
cooking workshop; - spice plantation; - indoor cultural experience.

------------------------------------------------------------------------

# 13. Alternative Scoring

Each alternative should be evaluated against at least:

``` text
Cost Impact
Preference Match
Travel Impact
Schedule Impact
Weather Risk
Operational Impact
Approval Requirement
```

Example:

``` json
{
  "alternative": "Cooking workshop",
  "cost_delta": 700,
  "preference_match": "high",
  "travel_delta_minutes": 10,
  "approval": ["traveler"]
}
```

The exact numerical scoring formula is not defined in the source.

------------------------------------------------------------------------

# 14. Trade-Off Explanation

The system should not simply say:

``` text
Recommended: Cooking workshop
```

It should explain:

``` text
Cooking workshop
+ ₹700
High preference match
+10 minutes travel
Fits remaining schedule
Indoor / lower weather dependency
Traveler approval required
```

The explanation layer exists because travelers and operators need to
understand why a replacement is being suggested.

------------------------------------------------------------------------

# 15. Approval Brain

Approval depends on impact.

``` text
Proposed Change
      │
      ├── low operational impact ──> traveler approval
      │
      ├── margin / operational impact ──> traveler + operator
      │
      └── high-impact decision ──> human approval mandatory
```

The source explicitly demonstrates: - rescheduled kayaking: traveler +
operator; - cooking workshop: traveler; - spice plantation: traveler +
operator; - indoor cultural experience: traveler.

The final approval matrix should be configurable.

------------------------------------------------------------------------

# 16. Itinerary Versioning

Never silently overwrite the operational history.

Instead:

``` text
Itinerary v1
     │
     │ disruption
     ▼
Change Proposal
     │
     │ approved
     ▼
Itinerary v2
```

Maintain: - previous state; - proposed state; - event that caused
change; - impact analysis; - approval; - timestamp; - actor; -
notifications; - resulting bookings.

This aligns with the source requirement for versioning and audit
history.

------------------------------------------------------------------------

# 17. Booking State

A useful conceptual lifecycle is:

``` text
DISCOVERED
    ↓
SELECTED
    ↓
QUOTED
    ↓
PENDING_APPROVAL
    ↓
APPROVED
    ↓
PAYMENT_PENDING
    ↓
CONFIRMED
    ↓
IN_PROGRESS
    ↓
COMPLETED
```

Exceptional states:

``` text
CANCELLED
REFUND_PENDING
REFUNDED
CHANGE_REQUESTED
RESCHEDULED
```

These state names are implementation suggestions derived from the
workflow described in the source, not a source-defined enumeration.

------------------------------------------------------------------------

# 18. Operational State Machine

For an itinerary:

``` text
DRAFT
  ↓
FEASIBILITY_CHECK
  ↓
QUOTE
  ↓
CUSTOMER_APPROVAL
  ↓
PAYMENT
  ↓
CONFIRMED
  ↓
ACTIVE
  │
  ├── no event ──────────────> ACTIVE
  │
  └── disruption
          ↓
      IMPACT_ANALYSIS
          ↓
      ALTERNATIVES
          ↓
      APPROVAL
          ↓
      NEW VERSION
          ↓
        ACTIVE
```

------------------------------------------------------------------------

# 19. Pricing Brain

Pricing must be deterministic and backed by actual service data.

``` text
Service Costs
   │
   ├── Hotel
   ├── Transport
   ├── Activities
   ├── Guides
   └── Meals
        +
Taxes
        +
Platform Charges
        -
Discounts
        ↓
Customer Price
```

Then:

``` text
Customer Price
   -
Supplier Cost
   -
Discounts
   -
Refunds
   -
Operational Charges
   ↓
Operator Margin
```

Every itinerary modification must recalculate both customer economics
and operator economics.

------------------------------------------------------------------------

# 20. Dynamic Change Example

## Initial State

``` text
Morning: Beach
Afternoon: Kayaking
Evening: Local dinner
Transport: Private car
Guide: Assigned
```

## Event

``` text
Weather API
    ↓
Unsafe weather
    ↓
Kayaking cancelled
```

## Impact

``` text
Kayaking
  ├── Guide affected
  ├── Pickup affected
  ├── Lunch timing affected
  ├── Afternoon schedule affected
  ├── Refund affected
  ├── Customer notification required
  └── Operator margin affected
```

## Alternatives

``` text
A. Reschedule kayaking
B. Cooking workshop
C. Spice plantation
D. Indoor cultural experience
```

## Decision

Each alternative is checked for: - feasibility; - schedule; - travel; -
preference; - cost; - refund; - margin; - approval.

Then the selected alternative becomes a new itinerary version.

------------------------------------------------------------------------

# 21. AI Tool-Calling Boundary

The AI assistant can conceptually call capabilities such as:

``` text
extract_preferences()
search_services()
get_availability()
calculate_route()
check_constraints()
calculate_price()
analyze_change_impact()
generate_alternatives()
explain_tradeoffs()
request_approval()
summarize_update()
```

However:

``` text
LLM
 ↓
Tool / Service
 ↓
Authoritative data
 ↓
Validation
 ↓
Result
```

The LLM should not directly fabricate an operational result.

------------------------------------------------------------------------

# 22. Event-Driven Architecture

The dynamic engine should be event-driven.

Conceptual flow:

``` text
Vendor / Weather / Transport / Traveler
                 │
                 ▼
            Event Gateway
                 │
                 ▼
             Event Store
                 │
                 ▼
         Operations Service
                 │
                 ▼
          Impact Analyzer
                 │
                 ▼
         Replanning Engine
                 │
                 ▼
          Change Proposal
                 │
                 ▼
          Approval Service
                 │
                 ▼
       Itinerary Version Store
                 │
                 ▼
         Notification Service
```

This structure makes the platform suitable for asynchronous operational
changes.

------------------------------------------------------------------------

# 23. Data Brain

## Primary Entities

``` text
User
TravelerProfile
Operator
Vendor
Destination
Hotel
Experience
Transport
Itinerary
ItineraryItem
Booking
Payment
TourGroup
Coordinator
ChangeEvent
ChangeProposal
Notification
Review
```

## Important Graph Relationships

``` text
Itinerary
 ├── contains → ItineraryItem
 ├── has → Booking
 ├── affected_by → ChangeEvent
 └── evolves_to → Itinerary Version

ItineraryItem
 ├── depends_on → ItineraryItem
 ├── fulfilled_by → Vendor
 ├── uses → Transport
 ├── requires → Guide
 └── associated_with → Reservation
```

------------------------------------------------------------------------

# 24. Consistency Rules

When an itinerary changes, the system must keep these aligned:

``` text
Itinerary
Booking
Payment
Refund
Vendor Schedule
Transport Schedule
Guide Schedule
Traveler View
Operator View
Notifications
Audit History
```

An approved change is incomplete until affected stakeholders and
relevant operational records are synchronized.

------------------------------------------------------------------------

# 25. Failure Handling

The source emphasizes resilience.

A practical failure strategy is:

``` text
External update
      │
      ├── valid ───────> process
      │
      ├── duplicate ───> ignore / idempotent handling
      │
      ├── temporary failure
      │        ↓
      │     retry
      │
      └── uncertain state
               ↓
         human/operator review
```

Notifications should be retryable.

Booking updates should be safe and validated before commitment.

------------------------------------------------------------------------

# 26. Security Brain

The source requires:

-   role-based access;
-   authentication;
-   authorization;
-   encrypted data;
-   secure payment handling;
-   audit logs;
-   traveler consent;
-   backend validation;
-   limited vendor access;
-   human approval for high-impact decisions.

## Access Boundary

``` text
Traveler
   ↓
Own profile + own itinerary

Operator
   ↓
Assigned customers + tours + vendors + operational data

Vendor
   ↓
Assigned bookings/services only
```

------------------------------------------------------------------------

# 27. Offline Brain

The traveler experience includes offline assistance.

Offline mode should prioritize information that is already known and
safe to display:

``` text
Live itinerary snapshot
Booking details
Digital vouchers
Important contacts
Basic schedule
Approved changes
```

The source does not specify the exact offline synchronization protocol,
so implementation details should be decided separately.

------------------------------------------------------------------------

# 28. Notification Brain

Potential notification recipients:

``` text
Traveler
Operator
Vendor
Driver
Guide
Coordinator
```

A disruption notification should communicate:

1.  What changed.
2.  Why it changed, when known.
3.  What parts of the itinerary are affected.
4.  Available alternatives.
5.  Cost impact.
6.  Schedule impact.
7.  Required approval.
8.  What happens after approval.

------------------------------------------------------------------------

# 29. Control Tower

The operator dashboard should provide a high-level operational view.

Conceptually:

``` text
TODAY
──────────────────────────────
Active Tours
At-Risk Tours
Pending Vendor Confirmations
Pending Traveler Approvals
Upcoming Departures
Disruptions
Refunds
Margin Impact
──────────────────────────────
```

This is an implementation interpretation of the source's "control
tower", alerts, margin tracking, and analytics capabilities.

------------------------------------------------------------------------

# 30. Observability

The platform should be able to answer:

``` text
What happened?
When did it happen?
Who reported it?
Which itinerary was affected?
Which dependencies were affected?
What alternatives were generated?
Why was an option ranked higher?
Who approved the change?
What changed?
Who was notified?
What was the cost/margin impact?
```

This is the operational meaning of maintaining audit history and
explainable recommendations.

------------------------------------------------------------------------

# 31. Recommendation Brain

Recommendation quality should combine:

``` text
Traveler Preferences
        +
Availability
        +
Budget
        +
Opening Hours
        +
Group Size
        +
Accessibility
        +
Travel Style
        +
Weather Dependency
        +
Operational Feasibility
```

A highly preferred activity should not be recommended as feasible if its
operational constraints cannot be satisfied.

------------------------------------------------------------------------

# 32. Route and Schedule Brain

A schedule is valid only if the traveler can physically move through it.

For consecutive items:

``` text
Activity A ends at T1
       +
Travel(A → B)
       +
Buffer
       ≤
Activity B start
```

The exact buffer policy is not defined by the source and should be
configurable.

The engine should account for: - travel distance; - transport mode; -
activity duration; - opening hours; - pickup timing; - hotel check-in; -
departure constraints.

------------------------------------------------------------------------

# 33. Fatigue and Pace

The source identifies: - schedule intensity; - fatigue; - relaxed
pace; - travel distance; - waiting time.

Therefore the optimizer should avoid treating the itinerary as a pure
shortest-path problem.

Two schedules may be equally feasible while one is much more tiring.

Conceptually:

``` text
Plan Score =
Preference
+ Feasibility
+ Travel Efficiency
+ Comfort
+ Vendor Quality
+ Sustainability
+ Margin Protection
```

The exact formula remains configurable.

------------------------------------------------------------------------

# 34. Margin Protection

The platform has two simultaneous objectives:

``` text
Traveler Experience
        ↕
Operator Economics
```

A replacement can be attractive to the traveler but harmful to the
operator.

Therefore the system should expose:

``` text
Customer Price
Supplier Cost
Refund
Additional Cost
Operator Margin
```

and use these values during alternative comparison.

------------------------------------------------------------------------

# 35. Explainability Contract

Every generated alternative should be explainable using structured
fields:

``` json
{
  "why_selected": [],
  "preference_match": {},
  "cost_change": {},
  "travel_change": {},
  "schedule_change": {},
  "operational_effect": {},
  "approval_required": {}
}
```

This keeps explanations tied to actual calculated values.

------------------------------------------------------------------------

# 36. Recommended Internal Service Boundaries

Based directly on the architecture described in the source:

``` text
Profile Service
Destination Service
Itinerary Service
Pricing Service
Booking Service
Vendor Service
Operations Service
Payment Service
Notification Service
Review Service
Analytics Service
```

AI/optimization capabilities:

``` text
Recommendation Engine
Constraint Checker
Route Optimizer
Dynamic Replanner
Change-Impact Analyzer
Travel Assistant
```

------------------------------------------------------------------------

# 37. Storage Strategy

The source recommends:

``` text
PostgreSQL / MySQL
Redis
Search Index
Event Store
Optional Neo4j
```

A practical conceptual split:

``` text
Relational DB
→ users, bookings, payments, itineraries, vendors

Redis
→ cache, temporary state, fast availability lookups

Search Index
→ destinations, hotels, activities, vendors

Event Store
→ operational events and change history

Graph DB (optional)
→ complex itinerary dependencies
```

The final storage design should be determined by implementation
requirements.

------------------------------------------------------------------------

# 38. End-to-End Brain Loop

The whole platform can be reduced to this loop:

``` text
UNDERSTAND
    ↓
SEARCH
    ↓
FILTER
    ↓
PLAN
    ↓
VALIDATE
    ↓
OPTIMIZE
    ↓
PRICE
    ↓
EXPLAIN
    ↓
APPROVE
    ↓
BOOK
    ↓
MONITOR
    ↓
DETECT
    ↓
ANALYZE
    ↓
REPLAN
    ↓
EXPLAIN
    ↓
APPROVE
    ↓
VERSION
    ↓
SYNC
    │
    └───────────────► MONITOR
```

This loop is the core "brain" of the product.

------------------------------------------------------------------------

# 39. What Makes the Product Different

The key distinction is not merely AI-generated personalization.

It is the combination of:

``` text
Personalization
       +
Operational Feasibility
       +
Vendor Coordination
       +
Booking / Payment
       +
Dependency Awareness
       +
Event Detection
       +
Dynamic Replanning
       +
Human Approval
       +
Explainability
       +
Margin Protection
```

The source's competitive comparison rates the proposed platform highly
across: - destination discovery; - traveler personalization; - itinerary
building; - supplier management; - vendor confirmation; - operator
dashboard; - booking/payments; - margin visibility; - change-impact
analysis; - alternative replanning; - traveler approval; - vendor
collaboration; - shared live itinerary; - dynamic replanning; -
explainable recommendations; - offline assistance.

------------------------------------------------------------------------

# 40. Final Mental Model

Do not think of the system as:

``` text
User → AI → Itinerary
```

Think of it as:

``` text
              ┌───────────────┐
              │    Traveler   │
              └───────┬───────┘
                      │ intent
                      ▼
              ┌───────────────┐
              │      AI       │
              └───────┬───────┘
                      │ proposals
                      ▼
              ┌───────────────┐
              │ Constraint +  │
              │ Optimization  │
              └───────┬───────┘
                      │ feasible plan
                      ▼
              ┌───────────────┐
              │   Operations  │
              └───────┬───────┘
                      │
             ┌────────┴────────┐
             ▼                 ▼
        Vendors/Services    Traveler
             │                 │
             └────────┬────────┘
                      │ real world
                      ▼
                  EVENT
                      │
                      ▼
              ┌───────────────┐
              │    Impact     │
              │    Graph      │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │   Replanner   │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │ Alternatives  │
              └───────┬───────┘
                      │
                      ▼
                APPROVAL
                      │
                      ▼
               NEW VERSION
                      │
                      ▼
               SYNCHRONIZE
                      │
                      └──────────► REAL WORLD
```

The platform's defining behavior is therefore:

> **When reality changes, the system does not stop at detecting the
> problem. It computes the consequences, finds feasible alternatives,
> explains the trade-offs, obtains the correct approval, and keeps the
> journey operational.**
