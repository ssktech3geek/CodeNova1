/**
 * @file validation.middleware.ts
 * @module backend/middleware
 * @description Instructions for Request Body / Query Validation and Sanitization Middleware.
 *
 * PURPOSE:
 * Validate and sanitize all incoming HTTP requests before they reach service handlers.
 * Use a schema validation library (e.g. Zod or Joi) for structured validation.
 *
 * FUNCTIONS TO IMPLEMENT (no code here):
 *
 * 1. validateBody(schema):
 *    - Factory middleware that accepts a Zod/Joi schema.
 *    - Parse and validate req.body against schema.
 *    - Strip unknown fields to prevent injection.
 *    - Return 422 Unprocessable Entity with field-level errors on failure.
 *
 * 2. validateParams(schema):
 *    - Validate URL path parameters (e.g. :id must be a valid UUID).
 *
 * 3. validateQuery(schema):
 *    - Validate query string parameters with type coercion (e.g. page=1 as integer).
 *
 * RESPONSE FORMAT ON VALIDATION FAILURE:
 * {
 *   "error": {
 *     "code": "VALIDATION_ERROR",
 *     "message": "Validation failed",
 *     "details": [{ "field": "budget", "message": "Must be a positive number" }],
 *     "request_id": "uuid"
 *   }
 * }
 *
 * KEY CONSTRAINTS:
 * - Never allow unvalidated data to reach service layer.
 * - Must handle both JSON body and multipart form-data.
 */
