# Notification Service - Instructions

## Purpose
Delivers real-time notifications to all stakeholders (travelers, operators, vendors, guides, drivers, coordinators) via multiple channels.

## Core Responsibilities
1. **Multi-Channel Delivery**
   - Email (transactional, marketing)
   - SMS (critical alerts, OTP)
   - WhatsApp (rich media, interactive)
   - Push notifications (mobile app)
   - In-app notifications (real-time)

2. **Notification Types**
   - Booking confirmations
   - Itinerary changes/approvals
   - Disruption alerts
   - Payment confirmations/reminders
   - Vendor assignments/updates
   - Travel reminders (check-in, departure)
   - Emergency communications
   - Review requests

3. **Notification Orchestration**
   - Template management with localization
   - Channel preference per user
   - Delivery scheduling (immediate, delayed, batched)
   - Retry logic with exponential backoff
   - Dead letter queue for failed deliveries

4. **Disruption Communication**
   - Structured disruption notifications per Brain doc requirements:
     1. What changed
     2. Why it changed
     3. Affected itinerary parts
     4. Available alternatives
     5. Cost impact
     6. Schedule impact
     7. Required approval
     8. Next steps after approval

5. **Delivery Tracking**
   - Delivery status per channel
   - Open/click tracking (email)
   - Read receipts (WhatsApp)
   - Delivery analytics

## Data Model
- **Notification**: id, recipient_id, recipient_type, channel, template_id, payload, status, sent_at, delivered_at, failed_at, retry_count
- **NotificationTemplate**: id, name, channel, subject, body_template, variables[], localization_map
- **NotificationPreference**: id, user_id, user_type, channel, enabled, frequency, quiet_hours
- **DeliveryLog**: id, notification_id, channel, provider_response, status, timestamp

## API Endpoints
- `POST /notifications` - Send notification
- `POST /notifications/bulk` - Bulk send
- `GET /notifications/:id` - Get notification status
- `GET /notifications/user/:userId` - Get user notifications
- `POST /templates` - Create template
- `GET /templates/:id` - Get template
- `PUT /preferences/:userId` - Update notification preferences
- `GET /preferences/:userId` - Get notification preferences
- `POST /notifications/disruption` - Send structured disruption notification
- `GET /analytics/delivery` - Delivery analytics

## Integration Points
- **All Services**: Trigger notifications for events
- **Operations Service**: Disruption notifications
- **Booking Service**: Booking confirmations, changes
- **Payment Service**: Payment confirmations, refunds
- **Itinerary Service**: Itinerary updates, approvals
- **Auth Service**: User preferences

## Key Constraints
- Notifications must be retryable
- Critical alerts (disruptions, emergencies) must use multiple channels
- Respect user preferences and quiet hours
- Template variables must be validated
- PII must not be logged in notification payloads
- Rate limiting per channel/provider