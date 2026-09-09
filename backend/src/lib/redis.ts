import Redis from 'ioredis';
import { dbConfig } from '../config';

let redisClient: Redis | null = null;
let redisAvailable = false;
const memoryStore = new Map<string, { value: string; expiresAt?: number }>();

export function getRedis(): Redis {
  if (!redisClient) {
    redisClient = new Redis(dbConfig.redis.url, {
      keyPrefix: dbConfig.redis.keyPrefix,
      lazyConnect: true,
      retryStrategy: (times) => {
        if (times > 3) return null; // Stop retrying after 3 attempts
        return Math.min(times * 200, 2000);
      },
    });

    redisClient.on('connect', () => {
      console.log('[Redis] Connected successfully.');
    });

    redisClient.on('error', (err) => {
      console.warn('[Redis] Connection error (non-fatal):', err.message);
    });
  }
  return redisClient;
}

export async function checkRedisConnection(): Promise<boolean> {
  try {
    const client = getRedis();
    await client.connect();
    await client.ping();
    redisAvailable = true;
    console.log('[Redis] Health check passed.');
    return true;
  } catch (err) {
    redisAvailable = false;
    console.warn('[Redis] Not available — rate limiting and caching will be degraded:', (err as Error).message);
    return false;
  }
}

export async function closeRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    console.log('[Redis] Connection closed.');
  }
  redisAvailable = false;
  memoryStore.clear();
}

// ============================================
// Typed Redis Helpers
// ============================================
export async function redisSet(key: string, value: string, ttlSeconds?: number): Promise<void> {
  if (redisAvailable) {
    const client = getRedis();
    if (ttlSeconds) {
      await client.setex(key, ttlSeconds, value);
    } else {
      await client.set(key, value);
    }
    return;
  }
  memoryStore.set(key, { value, expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined });
}

export async function redisGet(key: string): Promise<string | null> {
  if (!redisAvailable) {
    const entry = memoryStore.get(key);
    if (!entry) return null;
    if (entry.expiresAt && entry.expiresAt <= Date.now()) {
      memoryStore.delete(key);
      return null;
    }
    return entry.value;
  }
  try {
    return await getRedis().get(key);
  } catch {
    return null;
  }
}

export async function redisDel(key: string): Promise<void> {
  if (!redisAvailable) {
    memoryStore.delete(key);
    return;
  }
  try {
    await getRedis().del(key);
  } catch {
    // non-fatal
  }
}
