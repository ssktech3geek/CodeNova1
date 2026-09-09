-- ===========================================================================
-- File: 002_create_vendors_destinations_services.sql
-- Module: database/migrations
-- Description: Create vendor registry, destination, hotel, experience, and transport tables.
-- ===========================================================================

-- 1. Create Enum Types
DO $$ BEGIN
    CREATE TYPE vendor_type_enum AS ENUM ('HOTEL', 'EXPERIENCE', 'TRANSPORT', 'GUIDE', 'RESTAURANT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE indoor_outdoor_enum AS ENUM ('INDOOR', 'OUTDOOR', 'MIXED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Operators Table
CREATE TABLE IF NOT EXISTS operators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    agency_name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100),
    operating_regions JSONB DEFAULT '[]'::jsonb,
    target_margin_percentage DECIMAL(5,2) DEFAULT 15.00,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Vendors Table
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    business_name VARCHAR(255) NOT NULL,
    vendor_type vendor_type_enum NOT NULL,
    location VARCHAR(255) NOT NULL,
    geo_coordinates JSONB NOT NULL DEFAULT '{"lat": 0, "lng": 0}'::jsonb,
    rating DECIMAL(3,2) DEFAULT 4.50,
    is_verified BOOLEAN DEFAULT true,
    cancellation_policy JSONB NOT NULL DEFAULT '{"tiers": [{"hoursBeforeService": 24, "refundPercentage": 100}]}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vendors_vendor_type ON vendors(vendor_type);
CREATE INDEX IF NOT EXISTS idx_vendors_location ON vendors(location);

-- 4. Create Destinations Table
CREATE TABLE IF NOT EXISTS destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    coordinates JSONB NOT NULL DEFAULT '{"lat": 0, "lng": 0}'::jsonb,
    popular_interests JSONB DEFAULT '[]'::jsonb,
    climate_info JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_destinations_name ON destinations(name);
CREATE INDEX IF NOT EXISTS idx_destinations_state ON destinations(state);

-- 5. Create Hotels Table
CREATE TABLE IF NOT EXISTS hotels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'BOUTIQUE',
    price_per_night DECIMAL(12,2) NOT NULL,
    supplier_cost_per_night DECIMAL(12,2) NOT NULL,
    check_in_time VARCHAR(20) DEFAULT '14:00',
    check_out_time VARCHAR(20) DEFAULT '11:00',
    amenities JSONB DEFAULT '[]'::jsonb,
    rating DECIMAL(3,2) DEFAULT 4.50,
    available_rooms INT DEFAULT 10
);

CREATE INDEX IF NOT EXISTS idx_hotels_vendor_id ON hotels(vendor_id);
CREATE INDEX IF NOT EXISTS idx_hotels_category ON hotels(category);

-- 6. Create Experiences Table
CREATE TABLE IF NOT EXISTS experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price_per_person DECIMAL(12,2) NOT NULL,
    supplier_cost_per_person DECIMAL(12,2) NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 120,
    opening_hours JSONB DEFAULT '{}'::jsonb,
    capacity_per_slot INT DEFAULT 20,
    weather_dependent BOOLEAN DEFAULT false,
    indoor_outdoor indoor_outdoor_enum DEFAULT 'OUTDOOR',
    minimum_age INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 4.50
);

CREATE INDEX IF NOT EXISTS idx_experiences_vendor_id ON experiences(vendor_id);
CREATE INDEX IF NOT EXISTS idx_experiences_category ON experiences(category);

-- 7. Create Transports Table
CREATE TABLE IF NOT EXISTS transports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    transport_mode VARCHAR(100) NOT NULL,
    vehicle_type VARCHAR(100) NOT NULL,
    capacity INT DEFAULT 4,
    base_flat_rate DECIMAL(12,2) NOT NULL,
    rate_per_km DECIMAL(12,2) DEFAULT 0,
    supplier_cost_base DECIMAL(12,2) NOT NULL,
    rating DECIMAL(3,2) DEFAULT 4.50
);

CREATE INDEX IF NOT EXISTS idx_transports_vendor_id ON transports(vendor_id);
