// ============================================
// CodeNova - Shared TypeScript Types
// Single Source of Truth for all domain entities
// ============================================

export type Role = 'TRAVELER' | 'OPERATOR' | 'VENDOR' | 'ADMIN';

export type VendorType = 'HOTEL' | 'EXPERIENCE' | 'TRANSPORT' | 'GUIDE' | 'RESTAURANT';

export type ItineraryStatus =
  | 'DRAFT'
  | 'FEASIBILITY_CHECK'
  | 'QUOTE'
  | 'CUSTOMER_APPROVAL'
  | 'PAYMENT_PENDING'
  | 'CONFIRMED'
  | 'ACTIVE'
  | 'DISRUPTED'
  | 'COMPLETED';

export type BookingStatus =
  | 'DISCOVERED'
  | 'SELECTED'
  | 'QUOTED'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'PAYMENT_PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'RESCHEDULED';

export type PaymentStatus = 'INITIATED' | 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';

export type NotificationChannel = 'EMAIL' | 'SMS' | 'WHATSAPP' | 'IN_APP' | 'PUSH';

export type NotificationStatus = 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';

export type ItemType = 'HOTEL' | 'EXPERIENCE' | 'TRANSPORT' | 'GUIDE' | 'RESTAURANT';

export type IndoorOutdoor = 'INDOOR' | 'OUTDOOR' | 'MIXED';

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

export type ImpactLevel = 'LOW' | 'MEDIUM' | 'HIGH';

// ============================================
// User & Auth
// ============================================
export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: Role;
  phone_number: string;
  full_name: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AuthPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// ============================================
// Profiles
// ============================================
export interface TravelerProfile {
  id: string;
  user_id: string;
  destination_interest: string;
  duration_days: number;
  travelers_count: number;
  budget_limit: number;
  interests: string[];
  accommodation_preference: string;
  transport_preference: string;
  pace: 'SLOW' | 'MODERATE' | 'FAST';
  food_preferences: string[];
  accessibility_needs: string[];
  adventure_level: 1 | 2 | 3 | 4 | 5;
  preferred_activity_times: string[];
  activities_to_avoid: string[];
  created_at: Date;
  updated_at: Date;
}

export interface Operator {
  id: string;
  user_id: string;
  agency_name: string;
  license_number: string;
  operating_regions: string[];
  target_margin_percentage: number;
  created_at: Date;
}

export interface Vendor {
  id: string;
  user_id: string;
  business_name: string;
  vendor_type: VendorType;
  location: string;
  geo_coordinates: { lat: number; lng: number };
  rating: number;
  cancellation_policy: CancellationPolicy;
  created_at: Date;
}

// ============================================
// Services / Catalog
// ============================================
export interface Destination {
  id: string;
  name: string;
  state: string;
  country: string;
  coordinates: { lat: number; lng: number };
  popular_interests: string[];
  climate_info: Record<string, any>;
}

export interface Hotel {
  id: string;
  vendor_id: string;
  name: string;
  category: string;
  price_per_night: number;
  supplier_cost_per_night: number;
  check_in_time: string;
  check_out_time: string;
  amenities: string[];
  rating: number;
  available_rooms: number;
}

export interface Experience {
  id: string;
  vendor_id: string;
  title: string;
  category: string;
  price_per_person: number;
  supplier_cost_per_person: number;
  duration_minutes: number;
  opening_hours: OpeningHours;
  capacity_per_slot: number;
  weather_dependent: boolean;
  indoor_outdoor: IndoorOutdoor;
  minimum_age?: number;
  rating?: number;
}

export interface Transport {
  id: string;
  vendor_id: string;
  transport_mode: string;
  vehicle_type: string;
  capacity: number;
  base_flat_rate: number;
  rate_per_km: number;
  supplier_cost_base: number;
  rating: number;
}

export interface OpeningHours {
  [day: string]: { open: string; close: string } | null;
}

export interface CancellationPolicy {
  tiers: Array<{
    hoursBeforeService: number;
    refundPercentage: number;
  }>;
}

// ============================================
// Itinerary
// ============================================
export interface Itinerary {
  id: string;
  version: number;
  parent_itinerary_id: string | null;
  traveler_profile_id: string;
  operator_id: string;
  title: string;
  status: ItineraryStatus;
  start_date: Date;
  end_date: Date;
  total_customer_price: number;
  total_supplier_cost: number;
  total_taxes: number;
  total_discounts: number;
  operator_margin: number;
  operator_margin_percentage: number;
  preference_match_score: number;
  schedule_intensity_score: number;
  created_at: Date;
  updated_at: Date;
}

export interface ItineraryItem {
  id: string;
  itinerary_id: string;
  day_number: number;
  start_time: Date;
  end_time: Date;
  item_type: ItemType;
  service_ref_id: string;
  vendor_id: string;
  title: string;
  price: number;
  supplier_cost: number;
  location: string;
  dependencies: string[]; // array of ItineraryItem UUIDs
  is_disrupted: boolean;
}

// ============================================
// Bookings & Payments
// ============================================
export interface Booking {
  id: string;
  itinerary_id: string;
  itinerary_item_id: string;
  vendor_id: string;
  status: BookingStatus;
  confirmation_code: string | null;
  quantity: number;
  total_price: number;
  supplier_cost: number;
  scheduled_start: Date;
  scheduled_end: Date;
  cancellation_deadline: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface Payment {
  id: string;
  itinerary_id: string;
  booking_id: string | null;
  user_id: string;
  transaction_type: 'CHARGE' | 'REFUND';
  amount: number;
  currency: string;
  gateway_name: string;
  gateway_transaction_id: string | null;
  status: PaymentStatus;
  refund_reason: string | null;
  created_at: Date;
}

// ============================================
// Events & Disruptions
// ============================================
export interface ChangeEvent {
  id: string;
  itinerary_id: string;
  affected_item_id: string;
  source: 'VENDOR' | 'WEATHER' | 'SYSTEM' | 'OPERATOR';
  event_type: string;
  payload: Record<string, any>;
  reported_at: Date;
  processed_at: Date | null;
}

export interface ChangeProposal {
  id: string;
  change_event_id: string;
  itinerary_id: string;
  operator_id: string;
  proposal_type: string;
  cost_delta: number;
  preference_match: number;
  travel_delta_minutes: number;
  approval_required: {
    traveler: boolean;
    operator: boolean;
    admin: boolean;
  };
  explanation: {
    summary: string;
    tradeOffs: string[];
    recommendation: string;
  };
  status: ApprovalStatus;
  created_at: Date;
}

// ============================================
// Notifications & Audit
// ============================================
export interface Notification {
  id: string;
  recipient_user_id: string;
  recipient_role: Role;
  channel: NotificationChannel;
  notification_type: string;
  payload: Record<string, any>;
  status: NotificationStatus;
  retry_count: number;
  max_retries: number;
  created_at: Date;
  sent_at: Date | null;
}

export interface AuditLog {
  id: string;
  actor_user_id: string;
  actor_role: Role;
  action: string;
  entity_type: string;
  entity_id: string;
  previous_state: Record<string, any> | null;
  new_state: Record<string, any> | null;
  ip_address: string;
  request_id: string;
  occurred_at: Date;
}

// ============================================
// Financial Types
// ============================================
export interface PricedItem {
  id: string;
  title: string;
  item_type: ItemType;
  customer_price: number;
  supplier_cost: number;
  quantity: number;
}

export interface SupplierCost {
  vendor_id: string;
  amount: number;
  description: string;
}

export interface PriceBreakdown {
  subtotal: number;
  gst_amount: number;
  platform_fee_amount: number;
  total_discounts: number;
  total_customer_price: number;
  total_supplier_cost: number;
  operator_margin: number;
  operator_margin_percentage: number;
  line_items: Array<{
    id: string;
    title: string;
    customer_price: number;
    supplier_cost: number;
    quantity: number;
    subtotal: number;
  }>;
}

export interface MarginResult {
  margin: number;
  margin_percentage: number;
  is_below_floor: boolean;
  requires_admin_approval: boolean;
}

export interface RefundResult {
  refund_amount: number;
  refund_percentage: number;
  reason: string;
  is_full_refund: boolean;
}

export interface DeltaPrice {
  original_price: number;
  new_price: number;
  delta: number;
  delta_percentage: number;
  new_margin: number;
  new_margin_percentage: number;
}

// ============================================
// API Response Types
// ============================================
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
  request_id?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  request_id?: string;
}

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

// ============================================
// Constraint Engine Types
// ============================================
export interface ConstraintViolation {
  type: 'SCHEDULE_OVERLAP' | 'TRANSIT_INFEASIBLE' | 'OPENING_HOURS' | 'BUDGET_EXCEEDED' | 'CAPACITY_EXCEEDED';
  itemId: string;
  message: string;
  severity: 'ERROR' | 'WARNING';
}

export interface ConstraintCheckResult {
  is_feasible: boolean;
  violations: ConstraintViolation[];
  warnings: ConstraintViolation[];
}

export interface ScheduleSlot {
  start: Date;
  end: Date;
  itemId: string;
  location: string;
}
