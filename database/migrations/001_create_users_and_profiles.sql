-- ===========================================================================
-- File: 001_create_users_and_profiles.sql
-- Module: database/migrations
-- Description: Initial migration to create core identity and profile tables.
-- ===========================================================================

-- 1. Create Enum Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('TRAVELER', 'OPERATOR', 'VENDOR', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'TRAVELER',
    phone_number VARCHAR(20),
    full_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 3. Create Traveler Profiles Table
CREATE TABLE IF NOT EXISTS traveler_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    destination_interest VARCHAR(255),
    duration_days INT DEFAULT 3,
    travelers_count INT DEFAULT 1,
    budget_limit DECIMAL(12,2) DEFAULT 0,
    interests JSONB DEFAULT '[]'::jsonb,
    accommodation_preference VARCHAR(100) DEFAULT 'STANDARD',
    transport_preference VARCHAR(100) DEFAULT 'ANY',
    pace VARCHAR(20) DEFAULT 'MODERATE',
    food_preferences JSONB DEFAULT '[]'::jsonb,
    accessibility_needs JSONB DEFAULT '[]'::jsonb,
    adventure_level INT DEFAULT 3,
    preferred_activity_times JSONB DEFAULT '[]'::jsonb,
    activities_to_avoid JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_traveler_profiles_user_id ON traveler_profiles(user_id);
