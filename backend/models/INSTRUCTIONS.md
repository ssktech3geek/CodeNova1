# Data Models - Instructions

## Purpose
Defines the core data models/entities for the platform, their relationships, and database schema guidelines.

## Core Entities (from PRD & Brain)

### 1. User & Authentication
```typescript
User {
  id: UUID
  email: string (unique)
  phone: string
  passwordHash: string
  role: 'traveler' | 'operator' | 'vendor' | 'admin'
  status: 'active' | 'suspended' | 'pending_verification'
  emailVerified: boolean
  phoneVerified: boolean
  createdAt: DateTime
  updatedAt: DateTime
  lastLoginAt: DateTime
}
```

### 2. Traveler Profile
```typescript
TravelerProfile {
  id: UUID
  userId: UUID (FK)
  firstName: string
  lastName: string
  dateOfBirth: Date
  nationality: string
  passportNumber: string (encrypted)
  preferences: JSON (structured preferences)
  accessibilityNeeds: string[]
  dietaryRestrictions: string[]
  emergencyContact: JSON
  createdAt: DateTime
  updatedAt: DateTime
}
```

### 3. Operator
```typescript
Operator {
  id: UUID
  userId: UUID (FK)
  companyName: string
  licenseNumber: string
  gstNumber: string
  address: JSON
  contactPerson: string
  contactPhone: string
  commissionRate: Decimal
  status: 'active' | 'suspended' | 'pending'
  createdAt: DateTime
  updatedAt: DateTime
}
```

### 4. Vendor
```typescript
Vendor {
  id: UUID
  operatorId: UUID (FK) - managing operator
  name: string
  type: 'hotel' | 'experience' | 'transport' | 'guide' | 'restaurant' | 'wellness'
  contactInfo: JSON
  address: JSON
  certifications: string[]
  commissionRate: Decimal
  status: 'active' | 'suspended' | 'pending_verification'
  rating: Decimal
  totalBookings: Integer
  createdAt: DateTime
  updatedAt: DateTime
}
```

### 5. Destination
```typescript
Destination {
  id: UUID
  name: string
  country: string
  state: string
  city: string
  coordinates: JSON {lat, lng}
  timezone: string
  metadata: JSON (attractions, seasons, weather patterns)
  createdAt: DateTime
  updatedAt: DateTime
}
```

### 6. Services (Polymorphic)
```typescript
// Base service fields
Service {
  id: UUID
  vendorId: UUID (FK)
  destinationId: UUID (FK)
  type: 'hotel' | 'experience' | 'transport' | 'guide' | 'restaurant' | 'wellness'
  name: string
  description: string
  images: string[]
  basePrice: Decimal
  currency: string
  capacity: Integer
  policies: JSON
  status: 'active' | 'inactive' | 'seasonal'
  createdAt: DateTime
  updatedAt: DateTime
}

// Hotel-specific
HotelService extends Service {
  hotelType: 'budget' | 'boutique' | 'luxury' | 'resort'
  amenities: string[]
  checkInTime: Time
  checkOutTime: Time
  roomTypes: JSON[]
}

// Experience-specific
ExperienceService extends Service {
  experienceType: 'adventure' | 'cultural' | 'wellness' | 'food' | 'nature'
  durationMinutes: Integer
  weatherDependent: boolean
  difficultyLevel: 'easy' | 'moderate' | 'hard'
  minAge: Integer
  maxGroupSize: Integer
  includedItems: string[]
  excludedItems: string[]
}

// Transport-specific
TransportService extends Service {
  transportMode: 'car' | 'van' | 'bus' | 'train' | 'flight' | 'boat'
  vehicleType: string
  driverIncluded: boolean
  fuelPolicy: string
  routeConstraints: JSON
}
```

### 7. Availability
```typescript
Availability {
  id: UUID
  serviceId: UUID (FK)
  date: Date
  startTime: Time
  endTime: Time
  slotsTotal: Integer
  slotsAvailable: Integer
  priceOverride: Decimal (nullable)
  status: 'available' | 'full' | 'blocked' | 'maintenance'
  createdAt: DateTime
  updatedAt: DateTime
}
```

### 8. Itinerary
```typescript
Itinerary {
  id: UUID
  travelerId: UUID (FK)
  operatorId: UUID (FK)
  version: Integer
  status: 'draft' | 'feasibility_check' | 'quote' | 'customer_approval' | 'payment' | 'confirmed' | 'active' | 'completed' | 'cancelled'
  title: string
  destinationId: UUID (FK)
  startDate: Date
  endDate: Date
  travelerCount: Integer
  totalCustomerPrice: Decimal
  totalSupplierCost: Decimal
  operatorMargin: Decimal
  preferenceScore: Decimal
  createdAt: DateTime
  updatedAt: DateTime
  confirmedAt: DateTime
}
```

### 9. Itinerary Item
```typescript
ItineraryItem {
  id: UUID
  itineraryId: UUID (FK)
  day: Integer (1-based)
  sequence: Integer
  type: 'hotel' | 'experience' | 'transport' | 'guide' | 'meal' | 'free_time'
  serviceId: UUID (FK, nullable for free_time)
  title: string
  description: string
  location: JSON {name, address, coordinates}
  startTime: DateTime
  endTime: DateTime
  travelTimeMinutes: Integer (from previous item)
  bufferMinutes: Integer
  dependencies: UUID[] (other item IDs)
  status: 'planned' | 'booked' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'changed'
  metadata: JSON
  createdAt: DateTime
  updatedAt: DateTime
}
```

### 10. Booking
```typescript
Booking {
  id: UUID
  itineraryId: UUID (FK)
  itineraryItemId: UUID (FK)
  travelerId: UUID (FK)
  vendorId: UUID (FK)
  serviceId: UUID (FK)
  status: 'discovered' | 'selected' | 'quoted' | 'pending_approval' | 'approved' | 'payment_pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'refund_pending' | 'refunded' | 'change_requested' | 'rescheduled'
  quantity: Integer
  unitPrice: Decimal
  totalPrice: Decimal
  currency: string
  specialRequests: string
  confirmedAt: DateTime
  cancelledAt: DateTime
  cancellationReason: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

### 11. Payment
```typescript
Payment {
  id: UUID
  bookingId: UUID (FK)
  travelerId: UUID (FK)
  amount: Decimal
  currency: string
  method: 'card' | 'upi' | 'netbanking' | 'wallet' | 'bank_transfer'
  gateway: 'razorpay' | 'stripe'
  gatewayTransactionId: string
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded' | 'partially_refunded'
  failureReason: string
  metadata: JSON
  processedAt: DateTime
  createdAt: DateTime
}
```

### 12. Change Event & Impact
```typescript
ChangeEvent {
  id: UUID
  itineraryId: UUID (FK)
  source: 'vendor' | 'weather' | 'transport' | 'operator' | 'traveler' | 'availability_sync'
  type: 'activity_cancelled' | 'activity_delayed' | 'transport_delayed' | 'transport_cancelled' | 'weather_risk' | 'hotel_unavailable' | 'vendor_unavailable' | 'traveler_change' | 'availability_changed'
  payload: JSON
  affectedItemId: UUID (FK)
  detectedAt: DateTime
  processedAt: DateTime
  status: 'new' | 'analyzing' | 'analyzed' | 'replanning' | 'awaiting_approval' | 'approved' | 'applied' | 'rejected'
}

ImpactAnalysis {
  id: UUID
  changeEventId: UUID (FK)
  affectedItems: JSON[]
  freeTimeMinutes: Integer
  transportChanges: JSON[]
  reservationChanges: JSON[]
  refundEstimate: Decimal
  extraCostEstimate: Decimal
  travelTimeImpactMinutes: Integer
  nextDayEffects: JSON
  preferenceImpact: Decimal
  marginImpact: Decimal
  severity: 'low' | 'medium' | 'high' | 'critical'
  createdAt: DateTime
}
```

### 13. Change Proposal & Approval
```typescript
ChangeProposal {
  id: UUID
  impactAnalysisId: UUID (FK)
  itineraryId: UUID (FK)
  alternativeId: UUID (FK)
  description: string
  costDelta: Decimal
  scheduleDelta: JSON
  preferenceDelta: Decimal
  approvalRequired: JSON {traveler: boolean, operator: boolean}
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'expired'
  createdAt: DateTime
  expiresAt: DateTime
}

Approval {
  id: UUID
  changeProposalId: UUID (FK)
  approverId: UUID (FK)
  approverType: 'traveler' | 'operator'
  decision: 'approved' | 'rejected'
  comments: string
  decidedAt: DateTime
}
```

### 14. Itinerary Version
```typescript
ItineraryVersion {
  id: UUID
  itineraryId: UUID (FK)
  versionNumber: Integer
  changeEventId: UUID (FK)
  changeProposalId: UUID (FK)
  approvalId: UUID (FK)
  snapshot: JSON (full itinerary state)
  createdAt: DateTime
  createdBy: UUID
}
```

### 15. Notification
```typescript
Notification {
  id: UUID
  recipientId: UUID
  recipientType: 'traveler' | 'operator' | 'vendor' | 'guide' | 'driver' | 'coordinator'
  channel: 'email' | 'sms' | 'whatsapp' | 'push' | 'in_app'
  templateId: UUID
  payload: JSON
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'read'
  sentAt: DateTime
  deliveredAt: DateTime
  readAt: DateTime
  retryCount: Integer
  error: string
}
```

### 16. Review
```typescript
Review {
  id: UUID
  bookingId: UUID (FK)
  travelerId: UUID (FK)
  serviceId: UUID (FK)
  vendorId: UUID (FK)
  overallRating: Integer (1-5)
  qualityRating: Integer (1-5)
  valueRating: Integer (1-5)
  communicationRating: Integer (1-5)
  locationRating: Integer (1-5)
  textContent: string
  photos: string[]
  status: 'pending' | 'published' | 'flagged' | 'removed'
  verified: boolean
  submittedAt: DateTime
  publishedAt: DateTime
}
```

## Relationship Diagram
```
User
├── TravelerProfile (1:1)
├── Operator (1:1)
└── Vendor (1:1, via operator)

Operator
├── Customers (TravelerProfile) (1:M)
├── Vendors (1:M)
├── Tours/Itineraries (1:M)
└── Coordinators (1:M)

Itinerary
├── ItineraryItems (1:M)
├── Bookings (1:M)
├── ChangeEvents (1:M)
└── Versions (1:M)

ItineraryItem
├── Service (Hotel/Experience/Transport/Guide/Meal) (M:1)
├── Dependencies (M:M self-referential)
└── Booking (1:1)

ChangeEvent
└── ImpactAnalysis (1:1)
     └── ChangeProposal (1:M)
          └── Approval (1:M)
               └── ItineraryVersion (1:1)
```

## Database Guidelines
- Use UUIDs for all primary keys
- Timestamps with timezone (timestamptz)
- Soft deletes with `deletedAt` column
- Indexes on all foreign keys and query fields
- JSONB for flexible metadata fields
- Partitioning for high-volume tables (Availability, Notifications)
- Read replicas for analytics queries
- Row-level security for multi-tenant data