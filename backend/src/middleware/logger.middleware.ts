import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { serverConfig } from '../config';

// ============================================
// Structured JSON Logger with Request Tracing
// ============================================

const LOG_LEVELS = { error: 0, warn: 1, info: 2, http: 3, debug: 4 };
const currentLevel = LOG_LEVELS[serverConfig.logging.level as keyof typeof LOG_LEVELS] ?? 2;

function formatLog(level: string, message: string, meta: Record<string, any> = {}): string {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };

  if (serverConfig.logging.format === 'json') {
    return JSON.stringify(entry);
  }

  // Pretty format for development
  const color = {
    error: '\x1b[31m',
    warn: '\x1b[33m',
    info: '\x1b[36m',
    http: '\x1b[35m',
    debug: '\x1b[90m',
  }[level] || '\x1b[0m';

  const reset = '\x1b[0m';
  const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  return `${color}[${entry.timestamp}] ${level.toUpperCase()}${reset} ${message}${metaStr}`;
}

export const logger = {
  error: (message: string, meta?: Record<string, any>) => {
    if (currentLevel >= LOG_LEVELS.error) console.error(formatLog('error', message, meta));
  },
  warn: (message: string, meta?: Record<string, any>) => {
    if (currentLevel >= LOG_LEVELS.warn) console.warn(formatLog('warn', message, meta));
  },
  info: (message: string, meta?: Record<string, any>) => {
    if (currentLevel >= LOG_LEVELS.info) console.log(formatLog('info', message, meta));
  },
  http: (message: string, meta?: Record<string, any>) => {
    if (currentLevel >= LOG_LEVELS.http) console.log(formatLog('http', message, meta));
  },
  debug: (message: string, meta?: Record<string, any>) => {
    if (currentLevel >= LOG_LEVELS.debug) console.log(formatLog('debug', message, meta));
  },
};

// ============================================
// Request ID Middleware (inject before logging)
// ============================================
export function requestIdMiddleware(req: Request, _res: Response, next: NextFunction): void {
  req.requestId = (req.headers['x-request-id'] as string) || uuidv4();
  next();
}

// ============================================
// HTTP Request Logger Middleware
// ============================================
export function httpLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const meta = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration_ms: duration,
      request_id: req.requestId,
      ip: req.ip,
      user_id: req.user?.userId,
      role: req.user?.role,
    };

    if (res.statusCode >= 500) {
      logger.error(`HTTP ${res.statusCode}`, meta);
    } else if (res.statusCode >= 400) {
      logger.warn(`HTTP ${res.statusCode}`, meta);
    } else {
      logger.http(`HTTP ${res.statusCode}`, meta);
    }
  });

  next();
}
