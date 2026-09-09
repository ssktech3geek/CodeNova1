# Middleware - Instructions

## Purpose
Reusable middleware components for authentication, validation, logging, error handling, and cross-cutting concerns.

## Core Middleware Components

### 1. Authentication Middleware
- `authenticate()` - Validate JWT, attach user to request
- `authorize(roles[])` - Check role permissions
- `optionalAuth()` - Attach user if token present
- `serviceAuth()` - Validate service-to-service tokens

### 2. Validation Middleware
- `validateBody(schema)` - Validate request body against schema
- `validateQuery(schema)` - Validate query parameters
- `validateParams(schema)` - Validate URL parameters
- `sanitizeInput()` - XSS/SQL injection prevention

### 3. Logging & Monitoring
- `requestLogger()` - Structured request/response logging
- `errorLogger()` - Error capturing with context
- `metricsCollector()` - Latency, error rates, throughput
- `tracingMiddleware()` - Distributed trace propagation

### 4. Error Handling
- `errorHandler()` - Centralized error processing
- `notFoundHandler()` - 404 handling
- `asyncHandler()` - Wrapper for async route handlers

### 5. Rate Limiting
- `rateLimiter(windowMs, maxRequests)` - Per-IP/user limiting
- `strictRateLimiter()` - For sensitive endpoints

### 6. Security
- `helmetConfig()` - Security headers
- `corsConfig()` - CORS policy
- `csrfProtection()` - CSRF tokens for forms

### 7. Request Processing
- `requestId()` - Generate/propagate request IDs
- `compression()` - Response compression
- `timeout(ms)` - Request timeout enforcement

## Usage Pattern
```javascript
app.use(requestId());
app.use(requestLogger());
app.use(helmetConfig());
app.use(corsConfig());

app.post('/api/v1/itineraries',
  authenticate(),
  authorize(['traveler', 'operator']),
  validateBody(createItinerarySchema),
  asyncHandler(createItineraryController)
);

app.use(errorHandler());
app.use(notFoundHandler());
```

## Key Constraints
- Middleware order matters - security first, logging early
- All middleware must be stateless
- Error middleware must be last
- Async errors must be caught and passed to next()
- Request ID must propagate to all downstream services