import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { serverConfig } from './config';
import apiRouter from './api/index';
import { requestIdMiddleware, httpLogger } from './middleware/logger.middleware';
import { globalRateLimiter } from './middleware/rateLimiter.middleware';
import { globalErrorHandler, notFoundHandler } from './middleware/validation.middleware';

// ============================================
// Express Application Factory
// ============================================
export function createApp(): express.Application {
  const app = express();

  // ── Security Headers ─────────────────────
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));

  // ── CORS ─────────────────────────────────
  app.use(cors({
    origin: [serverConfig.frontendUrl, 'http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  }));

  // ── Compression ───────────────────────────
  app.use(compression());

  // ── Body Parsers ──────────────────────────
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true, limit: '5mb' }));

  // ── Request Tracing ───────────────────────
  app.use(requestIdMiddleware);

  // ── HTTP Logging ─────────────────────────
  app.use(httpLogger);

  // ── Global Rate Limiting ──────────────────
  app.use(globalRateLimiter);

  // ── API Routes ────────────────────────────
  app.use(`/api/${serverConfig.apiVersion}`, apiRouter);

  // ── 404 Handler ───────────────────────────
  app.use(notFoundHandler);

  // ── Global Error Handler ──────────────────
  app.use(globalErrorHandler);

  return app;
}
