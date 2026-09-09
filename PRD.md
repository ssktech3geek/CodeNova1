# PRD.md

# Personalized Dynamic Tour Planning & Tour Operations Platform

## 1. Product Definition

### Product Name

**Personalized Dynamic Tour Planning & Tour Operations Platform**

### Product Type

A **Dynamic Tour Orchestration Platform** that combines traveler
personalization, itinerary generation, booking, tour operations, vendor
coordination, payments, and real-time disruption handling.

### Product Vision

Build a resilient travel operating system that can create personalized
journeys, coordinate the real-world services required to execute them,
and continuously adapt the journey when reality changes.

> **Core message:** We do not just plan trips; we keep them working.

### Core USP

**Personalization without operational chaos.**

The platform is not merely: - an AI trip planner, - a booking system,
or - a tour-operator dashboard.

It is an **event-driven, constraint-aware replanning system for
multi-vendor tour operations**.

------------------------------------------------------------------------

# 2. Problem Statement

## 2.1 Traveler Problems

Travelers often know the kind of experience they want but struggle to
turn that intent into an operationally feasible trip.

Typical difficulties include: - combining hotels, activities, routes,
transport, budget, and time; - comparing multiple feasible trip
configurations; - coordinating bookings across disconnected services; -
understanding what other bookings are affected when one service
changes; - dealing with cancellations or delays during the trip; -
receiving consistent information across booking, communication, maps,
payments, and itinerary tools.

## 2.2 Tour Operator Problems

Operators must coordinate: - customers; - hotels; - transport
providers; - activity vendors; - guides; - drivers; - restaurants; -
coordinators; - payments; - refunds; - schedules; - vendor availability.

Today, changes may require calls, messages, spreadsheets, and repeated
manual updates.

A single cancellation or delay can cascade into: - transport changes; -
guide changes; - restaurant/reservation changes; - refunds; - schedule
changes; - customer communication; - vendor communication; - margin
changes.

Operators therefore need a unified view of: - customer requirements; -
availability; - bookings; - costs; - margins; - operational risk; -
changes; - approvals.

------------------------------------------------------------------------

# 3. Product Goals

## Primary Goals

1.  Convert natural-language traveler requirements into structured
    travel preferences.
2.  Generate personalized and bookable itinerary options.
3.  Ensure itineraries satisfy hard operational constraints.
4.  Optimize soft preferences such as travel distance, fatigue, ratings,
    sustainability, and preference match.
5.  Provide transparent pricing and operator-margin visibility.
6.  Allow travelers and operators to customize and approve itineraries.
7.  Detect real-world disruptions.
8.  Determine the impact of disruptions across the complete itinerary.
9.  Generate feasible replacement options.
10. Explain cost, schedule, travel, and preference trade-offs.
11. Obtain the appropriate traveler/operator approval.
12. Synchronize updated itinerary information across affected
    stakeholders.
13. Preserve itinerary versions and an audit history.

## Secondary Goals

-   Provide offline assistance to travelers.
-   Support emergency communication.
-   Enable vendor collaboration.
-   Give operators a control-tower view of tours.
-   Provide reporting and analytics.
-   Make AI recommendations explainable rather than opaque.

------------------------------------------------------------------------

# 4. Non-Goals

The source solution does not define the following as independent product
goals:

-   Building a proprietary maps platform.
-   Building proprietary weather infrastructure.
-   Replacing every external hotel/activity provider.
-   Fully autonomous approval of high-impact changes.
-   Inventing prices or availability when external data is unavailable.
-   Removing the need for human operator oversight.

High-impact decisions explicitly require human approval.

------------------------------------------------------------------------

# 5. Target Users

## 5.1 Traveler

### Needs

-   Personalized trip planning.
-   Destination and experience discovery.
-   Budget control.
-   Easy comparison.
-   Booking and payment.
-   A live itinerary.
-   Clear disruption explanations.
-   Approval of important changes.
-   Digital vouchers.
-   AI assistance.
-   Offline access.

### Core Actions

-   Create profile.
-   Enter trip requirements.
-   Explore recommendations.
-   Compare itinerary options.
-   Customize itinerary.
-   Approve changes.
-   Book.
-   Pay.
-   View documents.
-   Receive notifications.
-   Review services.

------------------------------------------------------------------------

## 5.2 Tour Operator

### Needs

-   CRM.
-   Lead and quote management.
-   Itinerary approval.
-   Booking coordination.
-   Vendor management.
-   Contract/rate management.
-   Group and coordinator management.
-   Payment/refund tracking.
-   Margin visibility.
-   Operational alerts.
-   Control tower.
-   Reports and analytics.

### Core Actions

-   Review traveler requirements.
-   Validate itinerary.
-   Validate vendors and pricing.
-   Send quote.
-   Confirm services after customer approval/payment.
-   Monitor tour operations.
-   Handle disruptions.
-   Approve high-impact changes.
-   Track refunds and margin impact.

------------------------------------------------------------------------

## 5.3 Vendor / Guide / Driver / Coordinator

### Needs

-   Assigned service visibility.
-   Availability management.
-   Schedule updates.
-   Cancellation/delay reporting.
-   Booking confirmation.
-   Invoice upload.
-   Operator communication.

### Core Actions

-   Confirm assigned service.
-   Update availability.
-   Report delay/cancellation.
-   Receive revised schedule.
-   Upload invoice.
-   Mark service completion.

------------------------------------------------------------------------

# 6. Core User Journey

## Step 1: Traveler Creates a Profile

The traveler provides: - destination; - dates; - duration; - number of
travelers; - age group; - budget; - interests; - accommodation
preference; - transport preference; - food preference; - pace; -
accessibility needs; - adventure level; - preferred activity times; -
activities to avoid.

Natural-language input is converted by AI into structured travel
preferences.

### Example

> "Plan a relaxed four-day Goa trip for two people under ₹45,000 with
> beaches, local food, light adventure, a boutique hotel, private
> transport, and no nightlife."

The resulting preference record can contain:

``` text
Budget: ₹45,000
Duration: 4 days
Travelers: 2
Interests: beaches, local food, light adventure
Accommodation: boutique hotel
Transport: private car
Pace: relaxed
Nightlife: false
```

------------------------------------------------------------------------

# 7. Recommendation Engine

The system searches and evaluates: - hotels; - beaches; - activities; -
restaurants; - transport providers; - guides; - cultural experiences; -
wellness services; - adventure activities.

## Filtering Dimensions

Recommendations should consider: - destination; - dates; - budget; -
opening hours; - availability; - group size; - accessibility; - travel
style; - weather dependency.

------------------------------------------------------------------------

# 8. Itinerary Generation

The platform should generate multiple itinerary alternatives rather than
forcing a single plan.

### Example Options

  -------------------------------------------------------------------------
  Plan            Description                     Cost     Preference Match
  --------------- --------------- -------------------- --------------------
  Budget Explorer Affordable                   ₹34,500                  78%
                  hotel, public                        
                  transport,                           
                  local                                
                  activities                           

  Comfort Balance Boutique hotel,              ₹45,000                  91%
                  private car,                         
                  balanced                             
                  activities                           

  Premium Relaxed Premium hotel,               ₹59,000                  94%
                  private                              
                  transfers,                           
                  fewer                                
                  activities                           
  -------------------------------------------------------------------------

Each itinerary should expose: - day-wise activities; - start/end
times; - travel distance; - transport mode; - hotel details; - activity
duration; - estimated cost; - preference match; - schedule intensity; -
cancellation conditions; - availability status.

------------------------------------------------------------------------

# 9. Constraint and Feasibility Engine

This is a core product requirement.

## 9.1 Hard Constraints

Hard constraints must never be violated.

Examples: - no overlapping activities; - valid operating hours; -
feasible travel time; - available hotel; - available transport; -
sufficient capacity; - approved budget; - valid hotel check-in; -
departure-compatible schedule.

A candidate itinerary that violates a hard constraint must be rejected
or repaired before being presented as feasible.

## 9.2 Soft Constraints

Soft constraints are optimized where possible.

Examples: - shorter travel distance; - less waiting; - lower fatigue; -
higher preference match; - better-rated vendors; - sustainable
transport; - less crowded locations; - protected operator margin.

------------------------------------------------------------------------

# 10. Pricing

## Customer Price

``` text
Customer Price =
    Hotel
  + Transport
  + Activities
  + Guides
  + Meals
  + Taxes
  + Platform Charges
  - Discounts
```

## Operator Margin

``` text
Operator Margin =
    Customer Price
  - Supplier Cost
  - Discounts
  - Refunds
  - Operational Charges
```

## Traveler Visibility

Travelers should see: - total customer price; - payment schedule; -
taxes; - discounts; - cancellation charges; - refund estimates.

## Operator Visibility

Operators should additionally see: - supplier cost; - vendor payments; -
margin; - refund impact.

------------------------------------------------------------------------

# 11. Customization and Approval

Travelers can change: - hotels; - activities; - transport; - meals; -
pace; - budget; - number of destinations; - duration; - start time.

Every material customization triggers recalculation of: - price; -
schedule; - travel distance; - availability; - preference score; -
fatigue; - affected dependencies; - operator margin.

The operator then: 1. reviews the itinerary; 2. validates vendors; 3.
validates pricing; 4. sends a quote; 5. confirms services after customer
approval and payment.

------------------------------------------------------------------------

# 12. Dynamic Adaptation Engine

## Product Differentiator

The platform must not merely report that something became unavailable.

It must understand how that event affects the complete journey.

## Example: Activity Cancellation

Suppose kayaking is cancelled because of unsafe weather.

The system identifies affected dependencies such as: - activity
booking; - pickup vehicle; - guide; - lunch reservation; - afternoon
schedule; - refund; - traveler notification; - operator margin.

## Replanning Workflow

1.  Detect event.
2.  Identify affected itinerary items using the dependency graph.
3.  Calculate free time.
4.  Recalculate transport requirements.
5.  Recalculate reservation timing.
6.  Calculate refund impact.
7.  Calculate additional cost.
8.  Calculate travel-time impact.
9.  Check next-day effects.
10. Re-evaluate traveler preferences.
11. Recalculate operator margin.
12. Generate replacement options.
13. Explain trade-offs.
14. Determine required approval.
15. Update itinerary version.
16. Notify affected stakeholders.

### Event Sources

Events may originate from: - vendor; - weather API; - transport
provider; - operator; - traveler; - availability synchronization.

------------------------------------------------------------------------

# 13. Replacement Option Model

Example:

  -------------------------------------------------------------------------
  Alternative         Cost Impact Preference    Travel Impact Approval
  ------------- ----------------- ------------- ------------- -------------
  Reschedule                   ₹0 Very high     May change    Traveler +
  kayaking                                      departure     operator
                                                schedule      

  Cooking                   +₹700 High          +10 min       Traveler
  workshop                                                    

  Spice                     -₹500 Medium-high   +20 min       Traveler +
  plantation                                                  operator

  Indoor                    +₹300 High          Low weather   Traveler
  cultural                                      risk          
  experience                                                  
  -------------------------------------------------------------------------

The platform should explain why an option is being proposed instead of
simply presenting an unexplained replacement.

------------------------------------------------------------------------

# 14. Approval Rules

Approval depends on impact.

### Example

-   Low-impact change: traveler approval.
-   Change affecting operator margin or operational commitments:
    traveler + operator.
-   High-impact operational decision: human approval is mandatory.

The system should never silently commit a high-impact replanning
decision.

------------------------------------------------------------------------

# 15. Main Product Modules

## Traveler Experience

-   Registration
-   Profile
-   Discovery
-   Recommendations
-   Itinerary builder
-   Cost estimator
-   Comparison
-   Booking
-   Payment
-   Digital vouchers
-   Live itinerary
-   AI assistant
-   Emergency support
-   Offline access
-   Reviews
-   Feedback

## Operator Management

-   CRM
-   Leads
-   Quotes
-   Itinerary approval
-   Bookings
-   Vendor database
-   Contracts
-   Rates
-   Availability
-   Groups
-   Coordinators
-   Payments
-   Refunds
-   Margin tracking
-   Alerts
-   Control tower
-   Reports
-   Analytics

## Vendor Management

-   Registration
-   Service listing
-   Availability calendar
-   Capacity
-   Rates
-   Booking confirmation
-   Cancellation updates
-   Invoice upload
-   Completion status
-   Operator communication

## AI Assistant

-   Request understanding
-   Preference extraction
-   Recommendation
-   Itinerary drafting
-   Decision explanation
-   Update summarization
-   Translation
-   Itinerary Q&A

## Dynamic Operations

-   Event detection
-   Disruption alerts
-   Dependency mapping
-   Impact analysis
-   Alternative generation
-   Price recalculation
-   Schedule recalculation
-   Approval workflow
-   Vendor notification
-   Versioning
-   Audit history

------------------------------------------------------------------------

# 16. Functional Requirements

## FR-01: Traveler Profile

The system shall store structured travel preferences extracted from
forms or natural-language input.

## FR-02: Recommendation

The system shall return recommendations filtered against traveler
requirements and operational data.

## FR-03: Multi-Option Planning

The system shall generate multiple itinerary configurations with cost
and preference-match information.

## FR-04: Feasibility

The system shall validate hard constraints before an itinerary is marked
feasible.

## FR-05: Optimization

The system shall score and optimize soft constraints.

## FR-06: Pricing

The system shall calculate customer price, supplier cost, refunds,
discounts, and operator margin.

## FR-07: Customization

The system shall recalculate affected itinerary properties after a
traveler or operator changes a plan.

## FR-08: Booking

The system shall support service booking and confirmation.

## FR-09: Payments

The system shall support payment schedules, payment status, refunds, and
cancellation impacts.

## FR-10: Vendor Coordination

The system shall allow vendors to confirm services and communicate
changes.

## FR-11: Event Detection

The system shall ingest operational change events from supported
sources.

## FR-12: Dependency Analysis

The system shall identify itinerary elements affected by a change.

## FR-13: Dynamic Replanning

The system shall generate feasible alternatives after a disruption.

## FR-14: Explainability

The system shall explain cost, schedule, preference, and operational
trade-offs.

## FR-15: Approval

The system shall route changes to the appropriate traveler/operator
approval workflow.

## FR-16: Synchronization

The system shall propagate approved itinerary changes to relevant
stakeholders.

## FR-17: Versioning

The system shall maintain itinerary versions and change history.

## FR-18: Notifications

The system shall deliver relevant updates through supported notification
channels.

## FR-19: Offline Assistance

The traveler application should provide useful itinerary information
when connectivity is unavailable.

## FR-20: Auditability

The platform shall maintain audit logs for security-sensitive and
operationally important actions.

------------------------------------------------------------------------

# 17. Non-Functional Requirements

## Reliability

The system should continue to provide a coherent itinerary even when
individual services become unavailable.

## Consistency

Booking, itinerary, payment, refund, and stakeholder state must remain
synchronized after approved changes.

## Security

Required mechanisms include: - role-based access; - authentication; -
authorization; - encrypted data; - secure payment handling; - audit
logs; - backend validation.

## Access Control

Vendor access must be limited to assigned bookings/services.

## AI Safety

The platform must: - avoid invented prices; - avoid invented
availability; - validate AI-produced actions against backend data; -
require human approval for high-impact decisions.

## Notification Reliability

Notifications should be retryable.

## Scalability

The architecture should support multiple travelers, operators, vendors,
tours, and concurrent itinerary changes.

------------------------------------------------------------------------

# 18. Roles and Permissions

  Capability                       Traveler             Operator   Vendor/Guide/Driver
  -------------------------------- -------------------- ---------- --------------------------
  Manage own profile               Yes                  No         No
  Create itinerary                 Yes                  Yes        No
  Modify itinerary                 Limited              Yes        Assigned-service updates
  View supplier cost               No                   Yes        Limited
  View operator margin             No                   Yes        No
  Book services                    Yes                  Yes        No
  Confirm assigned service         No                   Yes        Yes
  Report cancellation/delay        Yes for own issue    Yes        Yes
  Approve traveler-impact change   Yes                  Yes        No
  Manage vendors                   No                   Yes        No
  Upload invoice                   No                   Yes        Yes
  View assigned schedule           Relevant itinerary   Yes        Yes
  Access audit history             Limited              Yes        Limited

------------------------------------------------------------------------

# 19. Data Model

Core entities:

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

## Key Relationships

``` text
User
 └── TravelerProfile

Operator
 ├── Customers
 ├── Vendors
 ├── Tours / Itineraries
 └── Coordinators

Itinerary
 ├── ItineraryItems
 ├── Bookings
 ├── ChangeEvents
 └── ChangeProposals

ItineraryItem
 ├── Hotel / Experience / Transport / Guide / Meal
 ├── Dependencies
 └── Booking

ChangeEvent
 └── Impact Analysis
      └── ChangeProposal
           └── Approval
                └── New Itinerary Version
```

------------------------------------------------------------------------

# 20. High-Level Architecture

``` text
                    ┌───────────────────────┐
                    │ Traveler Application  │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │   API Gateway / Auth   │
                    └───────────┬───────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
┌─────────▼─────────┐ ┌─────────▼─────────┐ ┌────────▼─────────┐
│ Operator Dashboard│ │   Vendor Portal   │ │ AI / Optimization│
└─────────┬─────────┘ └─────────┬─────────┘ └────────┬─────────┘
          │                     │                    │
          └─────────────────────┼────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │     Core Services     │
                    │ Profile               │
                    │ Destination           │
                    │ Itinerary             │
                    │ Pricing               │
                    │ Booking               │
                    │ Vendor                │
                    │ Operations            │
                    │ Payment               │
                    │ Notification          │
                    │ Review                │
                    │ Analytics             │
                    └───────────┬───────────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
      ┌───────▼───────┐ ┌───────▼────────┐ ┌─────▼────────────┐
      │ PostgreSQL/   │ │ Redis / Search │ │ Event Store /    │
      │ MySQL         │ │ Index          │ │ Optional Neo4j   │
      └───────────────┘ └────────────────┘ └──────────────────┘
                                │
                  ┌─────────────▼─────────────┐
                  │ External Integrations     │
                  │ Maps / Weather            │
                  │ Payment                   │
                  │ Hotel/Activity APIs       │
                  │ Email / SMS / WhatsApp    │
                  └───────────────────────────┘
```

------------------------------------------------------------------------

# 21. Recommended Technology Stack

  -----------------------------------------------------------------------
  Area                                Recommended Technologies
  ----------------------------------- -----------------------------------
  Frontend                            React or Next.js

  Styling                             Tailwind CSS

  Client                              Responsive PWA

  Charts                              Recharts or Chart.js

  Backend                             Node.js + Express/NestJS or
                                      Python + FastAPI

  API                                 REST or GraphQL

  Primary DB                          PostgreSQL or MySQL

  Cache                               Redis

  Search                              Elasticsearch/OpenSearch

  Event Store                         Event store

  Graph DB                            Optional Neo4j

  AI                                  LLM + recommendation engine +
                                      constraint planner + dynamic
                                      replanning + function calling

  Maps                                Google Maps / Mapbox / OSM

  Weather                             Weather API

  Payments                            Razorpay / Stripe

  Notifications                       Email / SMS / WhatsApp

  Deployment                          Vercel / Render / Railway / AWS /
                                      Azure

  Packaging                           Docker

  Source Control                      GitHub
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 22. External Integrations

The architecture anticipates integrations for: - maps and routing; -
weather; - payments; - hotel availability; - activity availability; -
email; - SMS; - WhatsApp.

External availability should be treated as authoritative operational
input rather than something the AI is allowed to invent.

------------------------------------------------------------------------

# 23. MVP Scope

A practical first release should prioritize the platform's
differentiator rather than attempting every listed feature
simultaneously.

### MVP Traveler

-   Registration/profile.
-   Natural-language trip request.
-   Structured preference extraction.
-   Destination/service discovery.
-   Three itinerary alternatives.
-   Cost estimation.
-   Itinerary comparison.
-   Itinerary customization.
-   Approval.
-   Live itinerary.

### MVP Operator

-   Customer/lead management.
-   Itinerary review.
-   Vendor/service management.
-   Quote generation.
-   Booking state.
-   Margin view.
-   Operational alerts.

### MVP Vendor

-   Assigned-service dashboard.
-   Availability.
-   Confirmation.
-   Cancellation/delay reporting.

### MVP Dynamic Engine

-   Event ingestion.
-   Dependency graph.
-   Impact analysis.
-   Alternative generation.
-   Cost/schedule recalculation.
-   Approval workflow.
-   Itinerary versioning.
-   Notifications.

------------------------------------------------------------------------

# 24. Success Metrics

The source document does not specify numeric business targets. The
following are therefore **recommended product metrics**, not
source-defined targets.

## Planning

-   Time from trip request to first feasible itinerary.
-   Percentage of generated itineraries satisfying all hard constraints.
-   Traveler preference-match score.
-   Percentage of itineraries requiring manual correction.

## Operations

-   Time from disruption detection to proposed replacement.
-   Percentage of affected dependencies correctly identified.
-   Percentage of disruptions resolved without manual itinerary
    reconstruction.
-   Vendor confirmation rate.

## Business

-   Quote-to-booking conversion.
-   Operator margin retained after changes.
-   Refund processing time.
-   Booking completion rate.

## Experience

-   Traveler approval rate.
-   Itinerary change acceptance rate.
-   Traveler satisfaction.
-   Support requests per trip.

------------------------------------------------------------------------

# 25. Acceptance Criteria

A release should not be considered successful unless the core flow can
demonstrate:

### Scenario A: Normal Planning

1.  Traveler enters natural-language preferences.
2.  System extracts structured preferences.
3.  System produces multiple itinerary options.
4.  Each option contains schedule, cost, availability, and preference
    information.
5.  Hard constraints are satisfied.
6.  Traveler customizes an option.
7.  System recalculates affected values.
8.  Operator reviews and approves the quote.
9.  Traveler pays.
10. Services are confirmed.

### Scenario B: Disruption

1.  An activity cancellation event arrives.
2.  System identifies affected itinerary dependencies.
3.  System calculates schedule, travel, reservation, refund, and margin
    impacts.
4.  System generates multiple feasible alternatives.
5.  Alternatives include trade-off explanations.
6.  Required approval is requested.
7.  Approved change creates a new itinerary version.
8.  Affected stakeholders receive the updated information.

------------------------------------------------------------------------

# 26. Competitive Position

The source compares three categories:

### Consumer Travel Platforms

Strong in discovery, ratings, recommendations, and booking, but weaker
in supplier coordination, operator workflows, margin visibility, and
complete change-impact management.

### Tour Operator Software

Strong in customer/booking management, supplier contracts, operations,
payments, accounting, and reporting, but potentially less interactive in
traveler personalization, what-if planning, AI recommendations, live
approval, and dependency-based replanning.

### Generic AI Trip Planners

Strong in natural-language interaction, rapid itinerary generation, and
personalized recommendations, but potentially lacking verified
availability, realistic schedules, vendor management, payments, refunds,
operator margins, live changes, and operational execution.

### Proposed Platform

The proposed platform combines these capabilities and differentiates
primarily through **dynamic replanning and operational orchestration**.

------------------------------------------------------------------------

# 27. Product Principles

1.  **Feasible before fancy.**
2.  **Reality beats generated content.**
3.  **Every important change has an impact analysis.**
4.  **AI recommends; the system validates.**
5.  **High-impact decisions require humans.**
6.  **Traveler experience and operator economics are both first-class
    constraints.**
7.  **Every operational change should be explainable.**
8.  **Approved changes must propagate consistently.**
9.  **No invented availability or pricing.**
10. **The itinerary is a living operational object, not a static
    document.**

------------------------------------------------------------------------

# 28. Final Product Statement

The platform is a resilient travel operating system for personalized
tours.

It allows travelers to design trips around preferences, budget,
duration, and travel style. It allows operators to coordinate hotels,
transport, activities, vendors, payments, guides, schedules, and
customers from one platform.

When reality changes, the platform understands the impact across the
itinerary, generates safe and feasible alternatives, explains
trade-offs, obtains the appropriate approval, and synchronizes the
updated journey across stakeholders.

> **We do not just plan trips; we keep them working.**
