import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { query, closePool } from '../lib/db';
import { logger } from '../middleware/logger.middleware';

async function runMigrationsAndSeeds(): Promise<void> {
  const rootDir = path.resolve(__dirname, '../../../database');
  const migrationsDir = path.join(rootDir, 'migrations');
  const seedFile = path.join(rootDir, 'seeds/seed_destinations_and_vendors.sql');

  logger.info('📦 Starting CodeNova Database Migration & Seeding...');

  const migrationFiles = [
    '001_create_users_and_profiles.sql',
    '002_create_vendors_destinations_services.sql',
    '003_create_itineraries_and_items.sql',
    '004_create_bookings_payments_events.sql',
  ];

  try {
    // 1. Run migrations in sequential order
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      if (!fs.existsSync(filePath)) {
        logger.error(`Migration file missing: ${filePath}`);
        process.exit(1);
      }
      logger.info(`⚡ Running migration: ${file}`);
      const sql = fs.readFileSync(filePath, 'utf-8');
      await query(sql);
      logger.info(`✅ Applied migration: ${file}`);
    }

    // 2. Run seed script if present
    if (fs.existsSync(seedFile)) {
      logger.info('🌱 Running seed script: seed_destinations_and_vendors.sql');
      const seedSql = fs.readFileSync(seedFile, 'utf-8');
      await query(seedSql);
      logger.info('✅ Seed data inserted successfully!');
    } else {
      logger.warn(`Seed file not found: ${seedFile}`);
    }

    logger.info('🎉 Database migrations & seeding completed successfully!');
  } catch (err: any) {
    logger.error('❌ Migration error:', { error: err.message, stack: err.stack });
    process.exit(1);
  } finally {
    await closePool();
  }
}

runMigrationsAndSeeds();
