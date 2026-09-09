import { Pool, PoolClient } from 'pg';
import { dbConfig } from '../config';

// ============================================
// PostgreSQL Connection Pool
// ============================================
let pool: Pool | null = null;
let dbAvailable = false;
let connectionCheckDone = false;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      host: dbConfig.postgres.host,
      port: dbConfig.postgres.port,
      user: dbConfig.postgres.user,
      password: dbConfig.postgres.password,
      database: dbConfig.postgres.database,
      ssl: dbConfig.postgres.ssl as any,
      min: 0,
      max: 2, // Reduced pool size
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 1500, // Fast fail
    });

    pool.on('error', () => {
      // Suppress all errors silently
    });
  }
  return pool;
}

/**
 * Execute a query with optional parameters.
 */
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<{ rows: T[]; rowCount: number }> {
  if (!dbAvailable && connectionCheckDone) {
    // Return empty result if DB is known to be unavailable
    return { rows: [], rowCount: 0 };
  }

  try {
    const client = getPool();
    const result = await Promise.race([
      client.query(text, params),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Query timeout')), 2000)
      )
    ]);
    if (!dbAvailable) {
      dbAvailable = true;
      console.log('[PostgreSQL] Connected');
    }
    return { rows: result.rows as T[], rowCount: result.rowCount ?? 0 };
  } catch (err) {
    if (dbAvailable) {
      console.warn('[PostgreSQL] Connection lost:', (err as Error).message);
      dbAvailable = false;
    }
    return { rows: [], rowCount: 0 };
  }
}

/**
 * Execute operations inside a transaction.
 */
export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  if (!dbAvailable) {
    throw new Error('Database unavailable');
  }

  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Test the database connection on startup.
 */
export async function checkDbConnection(): Promise<boolean> {
  if (connectionCheckDone && !dbAvailable) {
    console.warn('[PostgreSQL] Using in-memory fallback.');
    return false;
  }

  try {
    const client = getPool();
    const result = await Promise.race([
      client.query('SELECT 1'),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout')), 3000)
      )
    ]);
    dbAvailable = true;
    connectionCheckDone = true;
    console.log('[PostgreSQL] Connected');
    return true;
  } catch (err) {
    dbAvailable = false;
    connectionCheckDone = true;
    console.warn('[PostgreSQL] Using in-memory fallback for catalog data.');
    return false;
  }
}

export function isDbAvailable(): boolean {
  return dbAvailable;
}

/**
 * Close the pool gracefully.
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end().catch(() => {});
    pool = null;
    dbAvailable = false;
    connectionCheckDone = false;
  }
}
