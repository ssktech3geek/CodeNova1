-- ===========================================================================
-- File: 003_create_itineraries_and_items.sql
-- Module: database/migrations
-- Description: Create itinerary, itinerary_items, and dependency tracking tables.
-- ===========================================================================

-- 1. Create Enum Types
DO $$ BEGIN
    CREATE TYPE itinerary_status_enum AS ENUM (
        'DRAFT', 'FEASIBILITY_CHECK', 'QUOTE', 'CUSTOMER_APPROVAL',
        'PAYMENT_PENDING', 'CONFIRMED', 'ACTIVE', 'DISRUPTED', 'COMPLETED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE itinerary_item_type_enum AS ENUM (
        'HOTEL', 'EXPERIENCE', 'TRANSPORT', 'GUIDE', 'RESTAURANT'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Itineraries Table
CREATE TABLE IF NOT EXISTS itineraries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version INT DEFAULT 1,
    parent_itinerary_id UUID REFERENCES itineraries(id) ON DELETE SET NULL,
    traveler_profile_id UUID NOT NULL REFERENCES traveler_profiles(id) ON DELETE CASCADE,
    operator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    status itinerary_status_enum DEFAULT 'DRAFT',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_customer_price DECIMAL(12,2) DEFAULT 0,
    total_supplier_cost DECIMAL(12,2) DEFAULT 0,
    total_taxes DECIMAL(12,2) DEFAULT 0,
    total_discounts DECIMAL(12,2) DEFAULT 0,
    operator_margin DECIMAL(12,2) DEFAULT 0,
    operator_margin_percentage DECIMAL(5,2) DEFAULT 0,
    preference_match_score DECIMAL(5,2) DEFAULT 0,
    schedule_intensity_score DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_itineraries_traveler_profile ON itineraries(traveler_profile_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_operator ON itineraries(operator_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_status ON itineraries(status);
CREATE INDEX IF NOT EXISTS idx_itineraries_start_date ON itineraries(start_date);

-- 3. Create Itinerary Items Table
CREATE TABLE IF NOT EXISTS itinerary_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
    day_number INT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    item_type itinerary_item_type_enum NOT NULL,
    service_ref_id UUID NOT NULL,
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL DEFAULT 0,
    supplier_cost DECIMAL(12,2) NOT NULL DEFAULT 0,
    location VARCHAR(255) NOT NULL,
    geo_coordinates JSONB DEFAULT '{"lat": 0, "lng": 0}'::jsonb,
    dependencies JSONB DEFAULT '[]'::jsonb,
    depends_on_transport_id UUID REFERENCES itinerary_items(id) ON DELETE SET NULL,
    depends_on_guide_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    weather_risk_level VARCHAR(20) DEFAULT 'LOW',
    is_disrupted BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_itinerary_items_itinerary ON itinerary_items(itinerary_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_items_day ON itinerary_items(day_number);
CREATE INDEX IF NOT EXISTS idx_itinerary_items_disrupted ON itinerary_items(is_disrupted) WHERE is_disrupted = true;
