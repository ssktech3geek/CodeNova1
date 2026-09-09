# Shared Types - Instructions

## Purpose
TypeScript type definitions shared between frontend and backend for type-safe API contracts.

## Type Categories

### 1. Core Domain Types (`domain/`)
```typescript
// User & Auth
type UserRole = 'traveler' | 'operator' | 'vendor' | 'admin';
type UserStatus = 'active' | 'suspended' | 'pending_verification';

interface User {
  id: string; // UUID
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string;
  lastLoginAt: string | null;
}

interface TravelerProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string; // encrypted
  preferences: TravelPreferences;
  accessibilityNeeds: string[];
  dietaryRestrictions: string[];
  emergencyContact: EmergencyContact;
  createdAt: string;
  updatedAt: string;
}

// Travel Preferences
interface TravelPreferences {
  destination?: string;
  startDate?: string;
  endDate?: string;
  durationDays?: number;
  travelerCount: number;
  budget?: number;
  currency: string;
  interests: string[];
  accommodationType?: string;
  transportPreference?: string;
  pace: 'relaxed' | 'moderate' | 'packed';
  foodPreferences: string[];
  accessibilityNeeds: string[];
  adventureLevel: 'low' | 'medium' | 'high';
  preferredActivityTimes: 'morning' | 'afternoon' | 'evening' | 'any';
  activitiesToAvoid: string[];
  hardConstraints: string[]; // non-negotiable
  softPreferences: Record<string, number>; // weighted
}

// Operator
interface Operator {
  id: string;
  userId: string;
  companyName: string;
  licenseNumber: string;
  gstNumber: string;
  address: Address;
  contactPerson: string;
  contactPhone: string;
  commissionRate: number;
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
  updatedAt: string;
}

// Vendor
interface Vendor {
  id: string;
  operatorId: string;
  name: string;
  type: VendorType;
  contactInfo: ContactInfo;
  address: Address;
  certifications: string[];
  commissionRate: number;
  status: 'active' | 'suspended' | 'pending_verification';
  rating: number;
  totalBookings: number;
  createdAt: string;
  updatedAt: string;
}

type VendorType = 'hotel' | 'experience' | 'transport' | 'guide' | 'restaurant' | 'wellness';

// Destination
interface Destination {
  id: string;
  name: string;
  country: string;
  state: string;
  city: string;
  coordinates: Coordinates;
  timezone: string;
  metadata: DestinationMetadata;
  createdAt: string;
  updatedAt: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface DestinationMetadata {
  attractions: string[];
  seasons: SeasonInfo[];
  weatherPatterns: WeatherPattern[];
}
```

### 2. Service Types (`services/`)
```typescript
// Base Service
interface BaseService {
  id: string;
  vendorId: string;
  destinationId: string;
  type: VendorType;
  name: string;
  description: string;
  images: string[];
  basePrice: number;
  currency: string;
  capacity: number;
  policies: ServicePolicies;
  status: 'active' | 'inactive' | 'seasonal';
  createdAt: string;
  updatedAt: string;
}

interface ServicePolicies {
  cancellation: CancellationPolicy;
  modification: ModificationPolicy;
  checkIn?: CheckInPolicy;
  ageRestriction?: AgeRestriction;
}

// Hotel Service
interface HotelService extends BaseService {
  type: 'hotel';
  hotelType: 'budget' | 'boutique' | 'luxury' | 'resort';
  amenities: string[];
  checkInTime: string; // HH:mm
  checkOutTime: string; // HH:mm
  roomTypes: RoomType[];
}

interface RoomType {
  id: string;
  name: string;
  capacity: number;
  pricePerNight: number;
  amenities: string[];
}

// Experience Service
interface ExperienceService extends BaseService {
  type: 'experience';
  experienceType: 'adventure' | 'cultural' | 'wellness' | 'food' | 'nature';
  durationMinutes: number;
  weatherDependent: boolean;
  difficultyLevel: 'easy' | 'moderate' | 'hard';
  minAge: number;
  maxGroupSize: number;
  includedItems: string[];
  excludedItems: string[];
  meetingPoint: Location;
}

// Transport Service
interface TransportService extends BaseService {
  type: 'transport';
  transportMode: 'car' | 'van' | 'bus' | 'train' | 'flight' | 'boat';
  vehicleType: string;
  driverIncluded: boolean;
  fuelPolicy: string;
  routeConstraints: RouteConstraints;
}

interface RouteConstraints {
  maxDistance?: number;
  allowedRegions?: string[];
  restrictedAreas?: string[];
}

// Guide Service
interface GuideService extends BaseService {
  type: 'guide';
  languages: string[];
  specialties: string[];
  rating: number;
  availability: GuideAvailability[];
}

interface GuideAvailability {
  dayOfWeek: number; // 0-6
  startTime: string;
  endTime: string;
}

// Availability
interface Availability {
  id: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  slotsTotal: number;
  slotsAvailable: number;
  priceOverride: number | null;
  status: 'available' | 'full' | 'blocked' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}
```

### 3. Itinerary Types (`itinerary/`)
```typescript
// Itinerary
type ItineraryStatus = 
  | 'draft' 
  | 'feasibility_check' 
  | 'quote' 
  | 'customer_approval' 
  | 'payment' 
  | 'confirmed' 
  | 'active' 
  | 'completed' 
  | 'cancelled';

interface Itinerary {
  id: string;
  travelerId: string;
  operatorId: string;
  version: number;
  status: ItineraryStatus;
  title: string;
  destinationId: string;
  startDate: string;
  endDate: string;
  travelerCount: number;
  totalCustomerPrice: number;
  totalSupplierCost: number;
  operatorMargin: number;
  preferenceScore: number;
  createdAt: string;
  updatedAt: string;
  confirmedAt: string | null;
}

// Itinerary Item
type ItineraryItemType = 'hotel' | 'experience' | 'transport' | 'guide' | 'meal' | 'free_time';

interface ItineraryItem {
  id: string;
  itineraryId: string;
  day: number; // 1-based
  sequence: number;
  type: ItineraryItemType;
  serviceId: string | null; // null for free_time
  title: string;
  description: string;
  location: Location;
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
  travelTimeMinutes: number;
  bufferMinutes: number;
  dependencies: string[]; // other item IDs
  status: 'planned' | 'booked' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'changed';
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

interface Location {
  name: string;
  address: string;
  coordinates: Coordinates;
}

// Itinerary Option (for comparison)
interface ItineraryOption {
  id: string;
  itineraryId: string;
  name: string;
  description: string;
  totalCost: number;
  preferenceMatch: number; // 0-100
  scheduleIntensity: 'relaxed' | 'moderate' | 'packed';
  items: ItineraryItem[];
  highlights: string[];
  tradeoffs: Tradeoff[];
}

interface Tradeoff {
  aspect: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
}
```

### 4. Booking Types (`booking/`)
```typescript
type BookingStatus = 
  | 'discovered' 
  | 'selected' 
  | 'quoted' 
  | 'pending_approval' 
  | 'approved' 
  | 'payment_pending' 
  | 'confirmed' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'refund_pending' 
  | 'refunded' 
  | 'change_requested' 
  | 'rescheduled';

interface Booking {
  id: string;
  itineraryId: string;
  itineraryItemId: string;
  travelerId: string;
  vendorId: string;
  serviceId: string;
  status: BookingStatus;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  specialRequests: string;
  confirmedAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BookingItem {
  id: string;
  bookingId: string;
  serviceId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialRequests: string;
}
```

### 5. Pricing Types (`pricing/`)
```typescript
interface PricingBreakdown {
  hotel: number;
  transport: number;
  activities: number;
  guides: number;
  meals: number;
  taxes: number;
  platformCharges: number;
  discounts: number;
  total: number;
  currency: string;
}

interface SupplierCostBreakdown {
  hotel: number;
  transport: number;
  activities: number;
  guides: number;
  meals: number;
  total: number;
  currency: string;
}

interface MarginCalculation {
  customerPrice: number;
  supplierCost: number;
  discounts: number;
  refunds: number;
  operationalCharges: number;
  operatorMargin: number;
  marginPercentage: number;
  currency: string;
}

interface RefundEstimate {
  bookingId: string;
  cancellationPolicy: CancellationPolicy;
  daysUntilService: number;
  refundPercentage: number;
  refundAmount: number;
  currency: string;
  nonRefundableItems: string[];
}

interface CancellationPolicy {
  freeCancellationUntilHours: number;
  partialRefundTiers: RefundTier[];
  nonRefundable: boolean;
}

interface RefundTier {
  hoursBeforeService: number;
  refundPercentage: number;
}
```

### 6. Operations Types (`operations/`)
```typescript
type ChangeEventSource = 'vendor' | 'weather' | 'transport' | 'operator' | 'traveler' | 'availability_sync';
type ChangeEventType = 
  | 'activity_cancelled' 
  | 'activity_delayed' 
  | 'transport_delayed' 
  | 'transport_cancelled' 
  | 'weather_risk' 
  | 'hotel_unavailable' 
  | 'vendor_unavailable' 
  | 'traveler_change' 
  | 'availability_changed';

interface ChangeEvent {
  id: string;
  itineraryId: string;
  source: ChangeEventSource;
  type: ChangeEventType;
  payload: Record<string, unknown>;
  affectedItemId: string;
  detectedAt: string;
  processedAt: string | null;
  status: 'new' | 'analyzing' | 'analyzed' | 'replanning' | 'awaiting_approval' | 'approved' | 'applied' | 'rejected';
}

interface ImpactAnalysis {
  id: string;
  changeEventId: string;
  affectedItems: AffectedItem[];
  freeTimeMinutes: number;
  transportChanges: TransportChange[];
  reservationChanges: ReservationChange[];
  refundEstimate: number;
  extraCostEstimate: number;
  travelTimeImpactMinutes: number;
  nextDayEffects: NextDayEffect[];
  preferenceImpact: number; // -100 to 100
  marginImpact: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
}

interface AffectedItem {
  itemId: string;
  impactType: 'cancelled' | 'delayed' | 'relocated' | 'rescheduled' | 'dependency_broken';
  description: string;
  originalStartTime: string;
  originalEndTime: string;
  newStartTime?: string;
  newEndTime?: string;
}

interface TransportChange {
  fromItemId: string;
  toItemId: string;
  originalMode: string;
  newMode?: string;
  originalDuration: number;
  newDuration: number;
  costDelta: number;
}

interface ReservationChange {
  itemId: string;
  reservationType: 'hotel' | 'restaurant' | 'activity' | 'transport';
  originalTime: string;
  newTime?: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'modified';
}

interface NextDayEffect {
  day: number;
  description: string;
  affectedItems: string[];
}

interface Alternative {
  id: string;
  impactAnalysisId: string;
  name: string;
  description: string;
  type: 'reschedule' | 'substitute_similar' | 'substitute_different' | 'remove_compress' | 'add_buffer';
  replacementItems: ItineraryItem[];
  removedItemIds: string[];
  costDelta: number;
  preferenceMatch: number; // 0-100
  travelImpactMinutes: number;
  scheduleImpact: ScheduleImpact;
  weatherRisk: 'low' | 'medium' | 'high';
  operationalImpact: OperationalImpact;
  approvalRequired: ApprovalRequirement;
  explanation: AlternativeExplanation;
}

interface ScheduleImpact {
  affectedDays: number[];
  totalTimeDeltaMinutes: number;
  rippleEffects: string[];
}

interface OperationalImpact {
  vendorChanges: VendorChange[];
  marginDelta: number;
  newBookingsRequired: number;
  cancellationsRequired: number;
}

interface VendorChange {
  vendorId: string;
  changeType: 'new_booking' | 'cancellation' | 'modification';
  serviceId: string;
  details: string;
}

interface ApprovalRequirement {
  traveler: boolean;
  operator: boolean;
  reason: string;
}

interface AlternativeExplanation {
  whySelected: string[];
  preferenceMatch: Record<string, unknown>;
  costChange: { amount: number; reason: string };
  travelChange: { minutes: number; reason: string };
  scheduleChange: { description: string; items: string[] };
  operationalEffect: { description: string; vendors: string[] };
  approvalRequired: ApprovalRequirement;
}
```

### 7. API Types (`api/`)
```typescript
// Standard API Response
interface ApiResponse<T> {
  data: T;
  meta?: ResponseMeta;
}

interface ResponseMeta {
  requestId: string;
  timestamp: string;
  version: string;
}

// Pagination
interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Error
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  requestId: string;
  statusCode: number;
}

// Request/Response for key endpoints
interface CreateItineraryRequest {
  preferences: TravelPreferences;
  optionsCount?: number; // default 3
}

interface CreateItineraryResponse {
  itineraryId: string;
  options: ItineraryOption[];
}

interface CustomizeItineraryRequest {
  itineraryId: string;
  changes: ItineraryChange[];
}

interface ItineraryChange {
  type: 'replace_hotel' | 'replace_activity' | 'replace_transport' | 'change_meal' | 'adjust_pace' | 'adjust_budget' | 'change_dates' | 'change_duration' | 'add_destination' | 'remove_destination' | 'change_start_time';
  itemId?: string;
  newValue: unknown;
  reason?: string;
}
```

### 8. Common Types (`common/`)
```typescript
interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: Coordinates;
}

interface ContactInfo {
  email: string;
  phone: string;
  website?: string;
  whatsapp?: string;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

interface SeasonInfo {
  name: string;
  months: number[]; // 1-12
  description: string;
  peakSeason: boolean;
}

interface WeatherPattern {
  month: number;
  avgTempMin: number;
  avgTempMax: number;
  rainfallMm: number;
  humidityPercent: number;
}
```

## Usage Guidelines
- **Single Source of Truth**: Types defined once, imported by both frontend/backend
- **Versioning**: Types versioned with API version
- **Validation**: Runtime validation with Zod schemas matching types
- **Generation**: Consider generating from OpenAPI spec
- **Naming**: PascalCase for interfaces, camelCase for properties
- **Documentation**: JSDoc comments for complex types

## Key Constraints
- No circular dependencies between type files
- Export all types from index.ts barrel file
- Keep types in sync with backend models
- Use `type` for unions, `interface` for objects
- Discriminated unions for polymorphic types