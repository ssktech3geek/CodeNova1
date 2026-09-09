import { createApp } from './app';
import { serverConfig } from './config';
import { checkDbConnection, closePool } from './lib/db';
import { checkRedisConnection, closeRedis } from './lib/redis';
import { logger } from './middleware/logger.middleware';

// ============================================
// Server Bootstrap
// ============================================
async function bootstrap(): Promise<void> {
  logger.info('🚀 CodeNova Backend starting...', {
    env: serverConfig.nodeEnv,
    port: serverConfig.port,
    apiVersion: serverConfig.apiVersion,
  });

  // ── Health checks on startup ──────────────
  const [dbOk, redisOk] = await Promise.all([
    checkDbConnection(),
    checkRedisConnection(),
  ]);

  if (!dbOk) {
    logger.warn('⚠️  PostgreSQL not available — DB operations will fail. Start PostgreSQL to enable full functionality.');
  }

  if (!redisOk) {
    logger.warn('⚠️  Redis not available — rate limiting uses in-memory fallback.');
  }

  // ── Start server ──────────────────────────
  const app = createApp();
  const server = app.listen(serverConfig.port, () => {
    logger.info(`✅ Server running at http://localhost:${serverConfig.port}/api/${serverConfig.apiVersion}`);
    logger.info(`📋 Health check: http://localhost:${serverConfig.port}/api/${serverConfig.apiVersion}/health`);
  });

  // ── Graceful Shutdown ─────────────────────
  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`\n[${signal}] Graceful shutdown initiated...`);

    server.close(async () => {
      logger.info('HTTP server closed.');
      await closePool();
      await closeRedis();
      logger.info('All connections closed. Goodbye. 👋');
      process.exit(0);
    });

    // Force exit after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Promise Rejection:', { reason: String(reason) });
  });

  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', { message: err.message, stack: err.stack });
    process.exit(1);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal bootstrap error:', err);
  process.exit(1);
});
