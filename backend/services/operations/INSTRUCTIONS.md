# Operations Service - Instructions

## Purpose
The core dynamic adaptation engine that detects disruptions, analyzes impact, coordinates replanning, and manages the operational control tower for tour operators.

## Core Responsibilities
1. **Event Detection & Ingestion**
   - Ingest events from: vendors, weather APIs, transport providers, operators, travelers, availability sync
   - Event types: ACTIVITY_CANCELLED, ACTIVITY_DELAYED, TRANSPORT_DELAYED, TRANSPORT_CANCELLED, WEATHER_RISK, HOTEL_UNAVAILABLE, VENDOR_UNAVAILABLE, TRAVELER_CHANGE, AVAILABILITY_CHANGED
   - Event validation and deduplication
   - Event store for audit trail

2. **Impact Analysis**
   - Traverse dependency graph from affected itinerary item
   - Identify directly and indirectly affected items
   - Calculate: affected bookings, free time, transport changes, reservation timing, refunds, extra costs, travel time impact, next-day effects, preference impact, operator margin impact
   - Output structured impact analysis

3. **Disruption Alerting**
   - Real-time alerts to operators (control tower)
   - Traveler notifications for significant changes
   - Vendor notifications for schedule changes
   - Escalation for high-impact events

4. **Control Tower Dashboard**
   - Active tours overview
   - At-risk tours identification
   - Pending vendor confirmations
   - Pending traveler approvals
   - Upcoming departures
   - Disruption queue
   - Refund tracking
   - Margin impact summary

5. **Operational Coordination**
   - Coordinate with Dynamic Replanner for alternatives
   - Manage approval workflows
   - Synchronize approved changes across stakeholders
   - Version management

## Data Model
- **ChangeEvent**: id, source, type, payload, affected_itinerary_id, detected_at, processed_at, status
- **ImpactAnalysis**: id, change_event_id, affected_items[], free_time_minutes, transport_changes[], reservation_changes[], refund_estimate, extra_cost_estimate, travel_time_impact, next_day_effects, preference_impact, margin_impact, created_at
- **OperationalAlert**: id, itinerary_id, severity, message, acknowledged, acknowledged_by, acknowledged_at
- **ControlTowerView**: operator_id, active_tours[], at_risk_tours[], pending_confirmations[], pending_approvals[], upcoming_departures[], disruptions[], margin_alerts[]

## API Endpoints
- `POST /events` - Ingest change event
- `GET /events/:id` - Get event details
- `POST /events/:id/analyze` - Trigger impact analysis
- `GET /events/:id/impact` - Get impact analysis
- `GET /control-tower/:operatorId` - Get control tower dashboard
- `GET /alerts/:operatorId` - Get operational alerts
- `POST /alerts/:id/acknowledge` - Acknowledge alert
- `POST /itineraries/:id/disruption` - Handle disruption (orchestrates full flow)
- `GET /itineraries/:id/operational-status` - Get operational status

## Integration Points
- **Event Gateway**: Ingest external events
- **Change Impact Analyzer**: Detailed impact computation
- **Dynamic Replanner**: Generate replacement alternatives
- **Itinerary Service**: Apply approved changes, versioning
- **Approval Service**: Route approvals
- **Notification Service**: Stakeholder notifications
- **Booking Service**: Update bookings
- **Vendor Service**: Vendor communications
- **Payment Service**: Refund processing

## Key Constraints
- Event processing must be idempotent
- Impact analysis must traverse full dependency graph
- High-impact decisions require human approval
- All changes must propagate consistently
- Control tower must reflect real-time state
- Notification retry mechanism required