# Backend Utilities - Instructions

## Purpose
Shared utility functions and helpers used across backend services.

## Utility Categories

### 1. Date & Time Utilities
- `timezoneUtils` - Convert between timezones, handle DST
- `dateUtils` - Format, parse, add/subtract dates
- `scheduleUtils` - Check overlaps, calculate gaps, validate sequences
- `durationUtils` - Parse/format durations (ISO 8601, human-readable)

### 2. Geographic Utilities
- `geoUtils` - Distance calculations (Haversine), bounding boxes
- `locationUtils` - Geocoding, reverse geocoding, address formatting
- `routeUtils` - Polyline encoding/decoding, route matching

### 3. Financial Utilities
- `currencyUtils` - Conversion, formatting, rounding (banker's rounding)
- `taxUtils` - Tax calculation per jurisdiction
- `pricingUtils` - Price breakdown, discount application, margin calc
- `refundUtils` - Refund calculation per policy

### 4. Validation Utilities
- `schemaValidator` - JSON Schema validation with detailed errors
- `customValidators` - Business rule validators (budget, dates, capacity)
- `sanitization` - Input sanitization for XSS, SQL injection

### 5. Error Utilities
- `AppError` - Base application error class with codes
- `errorFactory` - Create standardized errors
- `errorCodes` - Centralized error code definitions

### 6. Cryptography Utilities
- `hashUtils` - Password hashing, token generation
- `encryptionUtils` - Field-level encryption for PII
- `jwtUtils` - Token creation, validation, refresh

### 7. Communication Utilities
- `emailTemplates` - Template rendering with Handlebars
- `smsTemplates` - SMS template rendering
- `whatsappTemplates` - WhatsApp template rendering
- `pushTemplates` - Push notification payloads

### 8. Data Transformation
- `dtoMapper` - Domain to DTO mapping
- `serialization` - JSON serialization with circular ref handling
- `pagination` - Cursor/offset pagination helpers

### 9. External Integration Helpers
- `httpClient` - Axios wrapper with retry, timeout, circuit breaker
- `queueClient` - Message queue producer/consumer helpers
- `cacheClient` - Redis wrapper with TTL, tags, invalidation
- `searchClient` - Elasticsearch query builders

### 10. Testing Utilities
- `testFixtures` - Factory functions for test data
- `mockServices` - Service mocks for unit tests
- `assertionHelpers` - Custom test assertions

## Key Constraints
- Pure functions where possible (no side effects)
- Comprehensive unit tests for all utilities
- TypeScript types for all public APIs
- No service-specific logic in shared utils
- Version utilities independently if needed