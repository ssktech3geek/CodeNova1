-- ===========================================================================
-- File: seed_destinations_and_vendors.sql
-- Module: database/seeds
-- Description: Seed data for development and testing environments.
-- ===========================================================================

-- 1. Insert Test Users
INSERT INTO users (id, email, password_hash, role, phone_number, full_name, is_active)
VALUES 
  ('11111111-1111-4111-a111-111111111111', 'traveler@test.com', '$2a$12$e0MYzXyjpJS7Pd0RVvHwHe9h3/b.b4XvF6HhNq4dG/zZ5v9J8eUiy', 'TRAVELER', '+919876543210', 'Alex Traveler', true),
  ('22222222-2222-4222-a222-222222222222', 'operator@test.com', '$2a$12$e0MYzXyjpJS7Pd0RVvHwHe9h3/b.b4XvF6HhNq4dG/zZ5v9J8eUiy', 'OPERATOR', '+919876543211', 'Horizon Tour Operations', true),
  ('33333333-3333-4333-a333-333333333333', 'hotel_vendor@test.com', '$2a$12$e0MYzXyjpJS7Pd0RVvHwHe9h3/b.b4XvF6HhNq4dG/zZ5v9J8eUiy', 'VENDOR', '+919876543212', 'Goa Stays Ltd', true),
  ('44444444-4444-4444-a444-444444444444', 'exp_vendor@test.com', '$2a$12$e0MYzXyjpJS7Pd0RVvHwHe9h3/b.b4XvF6HhNq4dG/zZ5v9J8eUiy', 'VENDOR', '+919876543213', 'Goa Adventure Club', true)
ON CONFLICT (email) DO NOTHING;

-- 2. Insert Traveler Profile for Test Traveler
INSERT INTO traveler_profiles (id, user_id, destination_interest, duration_days, travelers_count, budget_limit, interests, accommodation_preference, transport_preference, pace, adventure_level)
VALUES (
  '55555555-5555-4555-a555-555555555555',
  '11111111-1111-4111-a111-111111111111',
  'Goa',
  3,
  2,
  25000.00,
  '["BEACHES", "WATER_SPORTS", "FOOD", "CULTURE"]'::jsonb,
  'BOUTIQUE',
  'CAR',
  'MODERATE',
  4
) ON CONFLICT (user_id) DO NOTHING;

-- 3. Insert Destinations
INSERT INTO destinations (id, name, state, country, coordinates, popular_interests, climate_info)
VALUES 
  ('a1111111-1111-4111-a111-111111111111', 'Goa', 'Goa', 'India', '{"lat": 15.2993, "lng": 74.1240}'::jsonb, '["BEACHES", "NIGHTLIFE", "WATER_SPORTS", "HERITAGE"]'::jsonb, '{"season": "Tropical", "bestMonths": ["Nov", "Dec", "Jan", "Feb"]}'::jsonb),
  ('a2222222-2222-4222-a222-222222222222', 'Munnar', 'Kerala', 'India', '{"lat": 10.0889, "lng": 77.0595}'::jsonb, '["NATURE", "TEA_GARDENS", "TREKKING", "RELAXATION"]'::jsonb, '{"season": "Hill Station", "bestMonths": ["Sep", "Oct", "Nov", "Mar"]}'::jsonb),
  ('a3333333-3333-4333-a333-333333333333', 'Jaipur', 'Rajasthan', 'India', '{"lat": 26.9124, "lng": 75.7873}'::jsonb, '["FORT_CULTURE", "HERITAGE", "PALACES", "SHOPPING"]'::jsonb, '{"season": "Arid", "bestMonths": ["Oct", "Nov", "Dec", "Jan", "Feb"]}'::jsonb),
  ('a4444444-4444-4444-a444-444444444444', 'Manali', 'Himachal Pradesh', 'India', '{"lat": 32.2432, "lng": 77.1892}'::jsonb, '["SNOW_SPORTS", "MOUNTAIN_VIEWS", "ADVENTURE", "HIKING"]'::jsonb, '{"season": "Alpine", "bestMonths": ["Dec", "Jan", "Feb", "May"]}'::jsonb),
  ('a5555555-5555-4555-a555-555555555555', 'Ooty', 'Tamil Nadu', 'India', '{"lat": 11.4102, "lng": 76.6950}'::jsonb, '["NATURE", "LAKES", "BOTANICAL_GARDENS", "TOY_TRAIN"]'::jsonb, '{"season": "Mild", "bestMonths": ["Oct", "Nov", "Apr", "May"]}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Vendors
INSERT INTO vendors (id, user_id, business_name, vendor_type, location, geo_coordinates, rating, is_verified)
VALUES
  ('b1111111-1111-4111-a111-111111111111', '33333333-3333-4333-a333-333333333333', 'Goa Palms Beach Resort', 'HOTEL', 'North Goa', '{"lat": 15.5494, "lng": 73.7535}'::jsonb, 4.70, true),
  ('b2222222-2222-4222-a222-222222222222', '44444444-4444-4444-a444-444444444444', 'Goa Water Sports & Expeditions', 'EXPERIENCE', 'Calangute, Goa', '{"lat": 15.5438, "lng": 73.7553}'::jsonb, 4.85, true),
  ('b3333333-3333-4333-a333-333333333333', NULL, 'Goa Express Cabs', 'TRANSPORT', 'Panaji, Goa', '{"lat": 15.4989, "lng": 73.8278}'::jsonb, 4.60, true)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Hotels (for Goa)
INSERT INTO hotels (id, vendor_id, name, category, price_per_night, supplier_cost_per_night, check_in_time, check_out_time, amenities, rating, available_rooms)
VALUES
  ('c1111111-1111-4111-a111-111111111111', 'b1111111-1111-4111-a111-111111111111', 'Zostel Anjuna Hostel', 'BUDGET', 800.00, 650.00, '13:00', '11:00', '["WiFi", "AC", "Shared Pool", "Lockers"]'::jsonb, 4.50, 15),
  ('c2222222-2222-4222-a222-222222222222', 'b1111111-1111-4111-a111-111111111111', 'Santana Beach Resort Boutique', 'BOUTIQUE', 3000.00, 2450.00, '14:00', '11:00', '["Pool", "Beachfront", "Breakfast Included", "Bar"]'::jsonb, 4.70, 8),
  ('c3333333-3333-4333-a333-333333333333', 'b1111111-1111-4111-a111-111111111111', 'Taj Fort Aguada Resort & Spa', 'LUXURY', 7500.00, 6000.00, '15:00', '12:00', '["Private Beach", "Infinity Pool", "Spa", "Fine Dining"]'::jsonb, 4.90, 5)
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Experiences (for Goa)
INSERT INTO experiences (id, vendor_id, title, category, price_per_person, supplier_cost_per_person, duration_minutes, opening_hours, capacity_per_slot, weather_dependent, indoor_outdoor, minimum_age, rating)
VALUES
  ('e1111111-1111-4111-a111-111111111111', 'b2222222-2222-4222-a222-222222222222', 'Sal Backwater Kayaking Tour', 'WATER_SPORTS', 1200.00, 950.00, 120, '{"mon":{"open":"07:00","close":"18:00"},"tue":{"open":"07:00","close":"18:00"},"wed":{"open":"07:00","close":"18:00"},"thu":{"open":"07:00","close":"18:00"},"fri":{"open":"07:00","close":"18:00"},"sat":{"open":"07:00","close":"18:00"},"sun":{"open":"07:00","close":"18:00"}}'::jsonb, 12, true, 'OUTDOOR', 10, 4.80),
  ('e2222222-2222-4222-a222-222222222222', 'b2222222-2222-4222-a222-222222222222', 'Authentic Goan Cooking Masterclass', 'CULINARY', 900.00, 720.00, 180, '{"mon":{"open":"10:00","close":"16:00"},"tue":{"open":"10:00","close":"16:00"},"wed":{"open":"10:00","close":"16:00"},"thu":{"open":"10:00","close":"16:00"},"fri":{"open":"10:00","close":"16:00"},"sat":{"open":"10:00","close":"16:00"},"sun":null}'::jsonb, 8, false, 'INDOOR', 12, 4.90),
  ('e3333333-3333-4333-a333-333333333333', 'b2222222-2222-4222-a222-222222222222', 'Sahakari Spice Plantation Guided Walk', 'HERITAGE', 700.00, 560.00, 150, '{"mon":{"open":"09:00","close":"17:00"},"tue":{"open":"09:00","close":"17:00"},"wed":{"open":"09:00","close":"17:00"},"thu":{"open":"09:00","close":"17:00"},"fri":{"open":"09:00","close":"17:00"},"sat":{"open":"09:00","close":"17:00"},"sun":{"open":"09:00","close":"17:00"}}'::jsonb, 30, false, 'OUTDOOR', 0, 4.65),
  ('e4444444-4444-4444-a444-444444444444', 'b2222222-2222-4222-a222-222222222222', 'Old Goa Portuguese Museum & Art Gallery', 'CULTURE', 800.00, 640.00, 90, '{"mon":null,"tue":{"open":"10:00","close":"18:00"},"wed":{"open":"10:00","close":"18:00"},"thu":{"open":"10:00","close":"18:00"},"fri":{"open":"10:00","close":"18:00"},"sat":{"open":"10:00","close":"18:00"},"sun":{"open":"10:00","close":"18:00"}}'::jsonb, 50, false, 'INDOOR', 0, 4.70),
  ('e5555555-5555-4555-a555-555555555555', 'b2222222-2222-4222-a222-222222222222', 'Thalassa Sunset Beach Club Lounge', 'RELAXATION', 500.00, 400.00, 240, '{"mon":{"open":"16:00","close":"23:59"},"tue":{"open":"16:00","close":"23:59"},"wed":{"open":"16:00","close":"23:59"},"thu":{"open":"16:00","close":"23:59"},"fri":{"open":"16:00","close":"23:59"},"sat":{"open":"16:00","close":"23:59"},"sun":{"open":"16:00","close":"23:59"}}'::jsonb, 100, true, 'OUTDOOR', 18, 4.75)
ON CONFLICT (id) DO NOTHING;

-- 7. Insert Transport Options (for Goa)
INSERT INTO transports (id, vendor_id, transport_mode, vehicle_type, capacity, base_flat_rate, rate_per_km, supplier_cost_base, rating)
VALUES
  ('f1111111-1111-4111-a111-111111111111', 'b3333333-3333-4333-a333-333333333333', 'PRIVATE_CAR', 'Sedan (Dzire/Etios)', 4, 2500.00, 12.00, 2000.00, 4.60),
  ('f2222222-2222-4222-a222-222222222222', 'b3333333-3333-4333-a333-333333333333', 'SHARED_SHUTTLE', 'Tempo Traveller AC', 8, 300.00, 5.00, 240.00, 4.40),
  ('f3333333-3333-4333-a333-333333333333', 'b3333333-3333-4333-a333-333333333333', 'RENTAL_SCOOTER', 'Honda Activa 125cc', 2, 400.00, 0.00, 320.00, 4.80)
ON CONFLICT (id) DO NOTHING;
