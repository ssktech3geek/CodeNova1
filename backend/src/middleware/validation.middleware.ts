import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

// ============================================
// Zod-based Request Validation Middleware
// ============================================

type ValidationTarget = 'body' | 'query' | 'params';

/**
 * Factory that returns an Express middleware which validates a specific
 * part of the request (body, query, params) against a Zod schema.
 * On failure it returns a structured 400 error with field-level details.
 */
export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[target]);

      // Replace the original with the parsed (coerced/transformed) values
      if (target === 'body') req.body = parsed;
      else if (target === 'query') (req as any).query = parsed;
      else if (target === 'params') (req as any).params = parsed;

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details: Record<string, string[]> = {};
        for (const issue of err.issues) {
          const field = issue.path.join('.');
          if (!details[field]) details[field] = [];
          details[field].push(issue.message);
        }

        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Request validation failed. Please check the provided fields.',
            details,
            request_id: req.requestId,
          },
        });
      } else {
        next(err);
      }
    }
  };
}

// ============================================
// Global Error Handler
// ============================================
export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(`[ERROR] ${err.message}`, {
    stack: err.stack,
    request_id: req.requestId,
    path: req.path,
  });

  const statusCode = (err as any).statusCode;
  if (typeof statusCode === 'number' && statusCode >= 400 && statusCode < 600) {
    res.status(statusCode).json({
      success: false,
      error: {
        code: 'REQUEST_REJECTED',
        message: err.message,
        request_id: req.requestId,
      },
    });
    return;
  }

  // Handle known error types
  if ((err as any).code === '23505') {
    // PostgreSQL unique constraint
    res.status(409).json({
      success: false,
      error: {
        code: 'CONFLICT',
        message: 'A resource with the same unique identifier already exists.',
        request_id: req.requestId,
      },
    });
    return;
  }

  if ((err as any).code === '23503') {
    // PostgreSQL foreign key constraint
    res.status(400).json({
      success: false,
      error: {
        code: 'FOREIGN_KEY_VIOLATION',
        message: 'Referenced resource does not exist.',
        request_id: req.requestId,
      },
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred. Please try again later.',
      request_id: req.requestId,
    },
  });
}

// ============================================
// 404 Handler
// ============================================
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found.`,
      request_id: req.requestId,
    },
  });
}
