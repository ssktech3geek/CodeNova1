/**
 * @file logger.middleware.ts
 * @module backend/middleware
 * @description Instructions for Request/Response Structured Logging and Distributed Tracing Middleware.
 *
 * PURPOSE:
 * Provide observability for every API request. Generate unique request IDs for correlation
 * across services (supports FR-20 Auditability and Brain section 30 Observability).
 *
 * FUNCTIONS TO IMPLEMENT (no code here):
 *
 * 1. requestId(req, res, next):
 *    - Generate UUID v4 request ID.
 *    - Attach to req.requestId.
 *    - Set X-Request-ID response header.
 *
 * 2. requestLogger(req, res, next):
 *    - Log: method, path, user_id, role, request_id, body_size, timestamp.
 *    - Log response: status_code, response_time_ms, request_id.
 *    - Use structured JSON logging (e.g. Winston / Pino).
 *    - NEVER log: passwords, payment card data, JWT secrets.
 *
 * 3. errorLogger(err, req, res, next):
 *    - Centralized error handler.
 *    - Log error stack + request_id.
 *    - Return standardized error JSON (see API INSTRUCTIONS error format).
 *    - Map known operational errors to appropriate HTTP codes.
 */
