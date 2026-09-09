import { Request, Response, NextFunction } from 'express';
import { businessConfig } from '../config';

// ============================================
// In-Memory Sliding Window Rate Limiter
// (Fallback when Redis is unavailable)
// ============================================

interface RateLimitRecord {
  timestamps: number[];
}

const memoryStore = new Map<string, RateLimitRecord>();

function cleanMemoryStore(): void {
  const now = Date.now();
  for (const [key, record] of memoryStore.entries()) {
    const windowStart = now - businessConfig.rateLimiting.globalWindowMs;
    record.timestamps = record.timestamps.filter((t) => t > windowStart);
    if (record.timestamps.length === 0) {
      memoryStore.delete(key);
    }
  }
}

// Clean up every 5 minutes
setInterval(cleanMemoryStore, 5 * 60 * 1000);

/**
 * Factory that creates a rate-limit middleware.
 * @param max - Maximum requests allowed within window.
 * @param windowMs - Window size in milliseconds.
 * @param keyFn - Function to extract the rate-limit key from request.
 */
export function rateLimit(
  max: number,
  windowMs: number,
  keyFn: (req: Request) => string = (req) => req.ip || 'unknown'
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = `rl:${keyFn(req)}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!memoryStore.has(key)) {
      memoryStore.set(key, { timestamps: [] });
    }

    const record = memoryStore.get(key)!;
    record.timestamps = record.timestamps.filter((t) => t > windowStart);

    if (record.timestamps.length >= max) {
      const oldestTimestamp = record.timestamps[0];
      const retryAfterMs = oldestTimestamp + windowMs - now;

      res.set({
        'X-RateLimit-Limit': String(max),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(Math.ceil((now + retryAfterMs) / 1000)),
        'Retry-After': String(Math.ceil(retryAfterMs / 1000)),
      });

      res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Too many requests. Limit: ${max} per ${windowMs / 1000}s. Try again in ${Math.ceil(retryAfterMs / 1000)}s.`,
          request_id: req.requestId,
        },
      });
      return;
    }

    record.timestamps.push(now);

    res.set({
      'X-RateLimit-Limit': String(max),
      'X-RateLimit-Remaining': String(max - record.timestamps.length),
    });

    next();
  };
}

// ============================================
// Preconfigured Rate Limiters
// ============================================
export const globalRateLimiter = rateLimit(
  businessConfig.rateLimiting.globalMax,
  businessConfig.rateLimiting.globalWindowMs
);

export const aiRateLimiter = rateLimit(
  businessConfig.rateLimiting.aiMax,
  businessConfig.rateLimiting.globalWindowMs,
  (req) => req.user?.userId || req.ip || 'unknown'
);

export const paymentRateLimiter = rateLimit(
  businessConfig.rateLimiting.paymentMax,
  businessConfig.rateLimiting.globalWindowMs,
  (req) => req.user?.userId || req.ip || 'unknown'
);
