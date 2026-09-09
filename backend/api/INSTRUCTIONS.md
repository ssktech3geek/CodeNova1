# API Layer - Instructions

## Purpose
Unified API gateway handling routing, authentication, rate limiting, and request/response transformation for all backend services.

## Core Responsibilities
1. **API Gateway**
   - Route requests to appropriate services
   - API versioning (v1, v2)
   - Request/response validation
   - OpenAPI/Swagger documentation

2. **Authentication & Authorization**
   - JWT token validation
   - Role-based access control (Traveler, Operator, Vendor, Admin)
   - Service-to-service authentication
   - Token refresh and revocation

3. **Rate Limiting & Throttling**
   - Per-user rate limits
   - Per-endpoint limits
   - Burst handling
   - DDoS protection

4. **Request/Response Handling**
   - Input validation and sanitization
   - Response formatting and standardization
   - Error handling and mapping
   - Request/response logging

5. **Cross-Cutting Concerns**
   - CORS configuration
   - Request ID propagation
   - Distributed tracing headers
   - Health checks and readiness probes

## API Structure
```
/api/v1/
  /auth/           - Authentication endpoints
  /profiles/       - Profile Service
  /destinations/   - Destination Service
  /itineraries/    - Itinerary Service
  /pricing/        - Pricing Service
  /bookings/       - Booking Service
  /vendors/        - Vendor Service
  /operations/     - Operations Service
  /payments/       - Payment Service
  /notifications/  - Notification Service
  /reviews/        - Review Service
  /analytics/      - Analytics Service
  /assistant/      - Travel Assistant
```

## Role-Based Access Matrix
| Endpoint | Traveler | Operator | Vendor | Admin |
|----------|----------|----------|--------|-------|
| /profiles/me | R/W | R | - | R/W |
| /itineraries | R/W | R/W | R(assigned) | R/W |
| /bookings | R/W | R/W | R/W(assigned) | R/W |
| /vendors | R | R/W | R/W(own) | R/W |
| /operations | - | R/W | R(assigned) | R/W |
| /payments | R | R/W | R(own) | R/W |
| /analytics | - | R | R(own) | R/W |

## Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": {},
    "request_id": "uuid"
  }
}
```

## Key Constraints
- All responses must include request_id for tracing
- Consistent error codes across services
- API versioning in URL path
- Deprecation policy for breaking changes
- Request/response size limits
- Timeout configuration per endpoint type