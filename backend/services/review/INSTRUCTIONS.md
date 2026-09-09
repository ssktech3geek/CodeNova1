# Review Service - Instructions

## Purpose
Manages traveler reviews and ratings for services (hotels, experiences, transport, guides, restaurants) and vendor responses.

## Core Responsibilities
1. **Review Collection**
   - Post-trip review requests
   - Multi-dimensional ratings (overall, quality, value, communication, location)
   - Text reviews with photos
   - Verified booking requirement

2. **Review Management**
   - Moderation workflow (auto-approve, flag, manual review)
   - Vendor response to reviews
   - Review editing/deletion by traveler (time-limited)
   - Report inappropriate reviews

3. **Review Analytics**
   - Aggregate ratings per service/vendor
   - Trend analysis over time
   - Sentiment analysis on text reviews
   - Quality flags identification

4. **Review Display**
   - Public review pages
   - Integration with service listings
   - Filtering and sorting options
   - Response display

## Data Model
- **Review**: id, booking_id, traveler_id, service_id, vendor_id, overall_rating, quality_rating, value_rating, communication_rating, location_rating, text_content, photos[], status, submitted_at, verified
- **ReviewResponse**: id, review_id, vendor_id, response_text, responded_at
- **ReviewModeration**: id, review_id, moderator_id, action, reason, timestamp
- **AggregateRating**: id, service_id, period, review_count, avg_overall, avg_quality, avg_value, avg_communication, avg_location, sentiment_score

## API Endpoints
- `POST /reviews` - Submit review
- `GET /reviews/:id` - Get review details
- `GET /reviews/service/:serviceId` - Get reviews for service
- `GET /reviews/vendor/:vendorId` - Get reviews for vendor
- `PUT /reviews/:id` - Update review (time-limited)
- `DELETE /reviews/:id` - Delete review
- `POST /reviews/:id/response` - Vendor response
- `POST /reviews/:id/report` - Report review
- `GET /reviews/aggregate/:serviceId` - Get aggregate ratings
- `POST /reviews/moderate` - Moderate review (admin)

## Integration Points
- **Booking Service**: Verify completed bookings for review eligibility
- **Vendor Service**: Vendor responses, performance metrics
- **Destination Service**: Display ratings on service listings
- **Notification Service**: Review request notifications
- **Analytics Service**: Review trends and sentiment

## Key Constraints
- Only verified bookings can leave reviews
- Reviews must be tied to actual service consumption
- Vendor responses are public and permanent
- Moderation must be fair and transparent
- Review data influences vendor performance metrics