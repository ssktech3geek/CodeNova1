# Analytics Service - Instructions

## Purpose
Provides reporting, analytics, and business intelligence for operators, platform admins, and vendors.

## Core Responsibilities
1. **Planning Metrics**
   - Time from trip request to first feasible itinerary
   - Percentage of itineraries satisfying hard constraints
   - Traveler preference-match score distribution
   - Percentage requiring manual correction

2. **Operations Metrics**
   - Time from disruption detection to proposed replacement
   - Percentage of affected dependencies correctly identified
   - Percentage of disruptions resolved without manual reconstruction
   - Vendor confirmation rate

3. **Business Metrics**
   - Quote-to-booking conversion rate
   - Operator margin retained after changes
   - Refund processing time
   - Booking completion rate

4. **Experience Metrics**
   - Traveler approval rate
   - Itinerary change acceptance rate
   - Traveler satisfaction (NPS, CSAT)
   - Support requests per trip

5. **Operational Dashboards**
   - Operator control tower metrics
   - Vendor performance dashboards
   - Financial reports (revenue, margins, payouts)
   - Tour performance reports

6. **Data Export & Integration**
   - Scheduled report generation
   - API for custom queries
   - Data warehouse sync

## Data Model
- **MetricDefinition**: id, name, category, formula, dimensions, filters, refresh_interval
- **MetricValue**: id, metric_id, dimension_values, value, timestamp
- **Report**: id, name, type, schedule, recipients, format, filters
- **Dashboard**: id, name, owner_type, owner_id, widgets[], layout
- **Widget**: id, dashboard_id, metric_id, visualization_type, config

## API Endpoints
- `GET /metrics/planning` - Planning metrics
- `GET /metrics/operations` - Operations metrics
- `GET /metrics/business` - Business metrics
- `GET /metrics/experience` - Experience metrics
- `GET /dashboards/:id` - Get dashboard
- `POST /dashboards` - Create dashboard
- `GET /reports/:id` - Get report
- `POST /reports` - Create report
- `GET /reports/:id/download` - Download report
- `GET /vendors/:id/performance` - Vendor performance
- `GET /operators/:id/performance` - Operator performance

## Integration Points
- **All Services**: Event streaming for metrics computation
- **Event Store**: Source of truth for operational events
- **Notification Service**: Scheduled report delivery
- **Data Warehouse**: Long-term analytics storage

## Key Constraints
- Metrics must be computable from event stream
- Real-time dashboards for operational metrics
- Historical data retention per compliance
- PII protection in analytics
- Configurable metric definitions (not hardcoded)