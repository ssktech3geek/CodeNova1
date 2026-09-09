-- ===========================================================================
-- File: 004_create_bookings_payments_events.sql
-- Module: database/migrations
-- Description: Create bookings, payments, change_events, change_proposals, notifications, audit_logs.
-- ===========================================================================

-- 1. Enum Types
DO $$ BEGIN
    CREATE TYPE booking_status_enum AS ENUM (
        'DISCOVERED', 'SELECTED', 'QUOTED', 'PENDING_APPROVAL', 'APPROVED',
        'PAYMENT_PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REFUNDED', 'RESCHEDULED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status_enum AS ENUM (
        'INITIATED', 'PENDING', 'SUCCESS', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
    itinerary_item_id UUID NOT NULL REFERENCES itinerary_items(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    status booking_status_enum NOT NULL DEFAULT 'DISCOVERED',
    confirmation_code VARCHAR(100) UNIQUE,
    quantity INT NOT NULL DEFAULT 1,
    total_price DECIMAL(12,2) NOT NULL DEFAULT 0,
    supplier_cost DECIMAL(12,2) NOT NULL DEFAULT 0,
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ NOT NULL,
    cancellation_deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_itinerary ON bookings(itinerary_id);
CREATE INDEX IF NOT EXISTS idx_bookings_vendor ON bookings(vendor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_itinerary_status ON bookings(itinerary_id, status);

-- 3. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    transaction_type VARCHAR(50) NOT NULL DEFAULT 'CHARGE',
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    gateway_name VARCHAR(100) DEFAULT 'RAZORPAY',
    gateway_transaction_id VARCHAR(255),
    status payment_status_enum NOT NULL DEFAULT 'INITIATED',
    refund_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_itinerary ON payments(itinerary_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);

-- 4. Change Events Table
CREATE TABLE IF NOT EXISTS change_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
    affected_item_id UUID NOT NULL REFERENCES itinerary_items(id) ON DELETE CASCADE,
    source VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    reported_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_change_events_itinerary ON change_events(itinerary_id);
CREATE INDEX IF NOT EXISTS idx_change_events_reported ON change_events(reported_at);

-- 5. Change Proposals Table
CREATE TABLE IF NOT EXISTS change_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    change_event_id UUID NOT NULL REFERENCES change_events(id) ON DELETE CASCADE,
    itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
    operator_id UUID NOT NULL REFERENCES users(id),
    proposal_type VARCHAR(50) NOT NULL,
    cost_delta DECIMAL(12,2) DEFAULT 0,
    preference_match DECIMAL(5,2) DEFAULT 100,
    travel_delta_minutes INT DEFAULT 0,
    approval_required JSONB DEFAULT '{"traveler": true, "operator": false, "admin": false}'::jsonb,
    explanation JSONB DEFAULT '{"summary": "", "tradeOffs": [], "recommendation": ""}'::jsonb,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_change_proposals_itinerary ON change_proposals(itinerary_id);

-- 6. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_role VARCHAR(50) NOT NULL,
    channel VARCHAR(50) NOT NULL DEFAULT 'EMAIL',
    notification_type VARCHAR(100) NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(50) DEFAULT 'PENDING',
    retry_count INT DEFAULT 0,
    max_retries INT DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_user_id, status);

-- 7. Audit Logs Table (Append-only)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    previous_state JSONB,
    new_state JSONB,
    ip_address VARCHAR(45) NOT NULL DEFAULT '0.0.0.0',
    request_id VARCHAR(255) NOT NULL DEFAULT 'system',
    occurred_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_occurred ON audit_logs(occurred_at);
