# CodeNova: Complete Master Project Knowledge Base & System Architecture

---

## 1. Executive Summary & Design Philosophy

**CodeNova** is an enterprise-grade, event-driven, constraint-aware personalized tour planning and operational execution platform. It serves four distinct stakeholders: **Travelers**, **Tour Operators**, **Vendors**, and **Field Coordinators**.

### The Core Architectural Motto: *"Feasible Before Fancy"*
Unlike typical AI itinerary generators that can invent non-existent flights, unverified prices, or physically impossible travel schedules, CodeNova strictly separates AI capabilities from operational authority:

1. **AI / ML Layer (Creative & Analytic)**:
   - Responsible *only* for natural language intent extraction, preference mapping, candidate scoring, multi-tier draft generation, and human-readable trade-off explanations.
   - Operates strictly under **JSON tool-calling boundaries**. The AI cannot commit data, invent prices, or bypass validation.

2. **Backend Engine (Deterministic & Authoritative)**:
   - Enforces **hard physical constraints** (schedule overlaps, transit buffers, vendor opening hours, capacity limits, weather safety).
   - Computes **exact financial pricing and operator margins** from real vendor catalog contracts and rates.
   - Manages itineraries as **Directed Acyclic Graphs (DAGs)** to analyze downstream disruption cascades.
   - Maintains an **immutable event store and version chain** for every itinerary modification.

3. **Human-in-the-Loop Governance**:
   - Enforces approval gates (`TRAVELER`, `OPERATOR`, `ADMIN`) based on cost delta, schedule shift, or margin impact thresholds.
   - High-impact operational decisions can **never** be auto-approved by the system.

---

## 2. Stakeholder Roles & Access Matrix (RBAC)

The platform supports 4 distinct user roles defined in `shared/types/index.types.ts`:

| Role | Primary Responsibilities | Authorized Actions |
|---|---|---|
| **`TRAVELER`** | End user taking the trip | Create trip requests, view options, customize activities, approve low/medium proposal changes, access digital vouchers, live AI assistant chat. |
| **`OPERATOR`** | Tour agency manager / planner | Oversee active tours in Control Tower, review/approve pricing & margins, approve high-impact replanning proposals, manage vendor contracts. |
| **`VENDOR`** | Hotel, experience, transport, guide provider | Manage service listings, real-time slot availability, confirm/reject bookings, report delay or cancellation events. |
| **`ADMIN`** | System & security administrator | Manage global system parameters, resolve high-margin disputes, review append-only security audit logs, manage user accounts. |

---

## 3. End-to-End Operational Architecture & Data Flow

```
                               ┌────────────────────────────────────────────────────────┐
                               │       Client Layer (React / PWA / WebSockets)          │
                               │  Traveler Web UI | Operator Control Tower | Vendor App │
                               └──────────────────────────┬─────────────────────────────┘
                                                          │ HTTPS / WSS
                               ┌──────────────────────────▼─────────────────────────────┐
                               │           API Gateway & Pipeline Middleware            │
                               │  - JWT Auth Guard      - Zod/Joi Validation            │
                               │  - Redis Rate Limiter  - Request ID Structured Logging │
                               └──────────┬─────────────────────────────────┬───────────┘
                                          │                                 │
                 ┌────────────────────────▼────────────┐       ┌────────────▼────────────────────────┐
                 │       AI / ML Subsystem             │       │      Backend Operational Services   │
                 │ - Natural Language Intent Extractor │       │ - Hard & Soft Constraint Engine     │
                 │ - Candidate Scorer (Multi-factor)   │       │ - Pricing & Margin Calculator       │
                 │ - Multi-Tier Draft Generator        │◄─────►│ - Dynamic Replanning & DAG Engine  │
                 │ - Structured Trade-Off Explainer    │ Tool  │ - Booking Lifecycle & Vouchers      │
                 └─────────────────────────────────────┘ Calls │ - Multi-Channel Notification Engine │
                                                               └────────────┬────────────────────────┘
                                                                            │
                               ┌────────────────────────────────────────────▼────────────────────────┐
                               │                 Persistence & Event Infrastructure                  │
                               │ - PostgreSQL (Relational Schemas & Indexes)                         │
                               │ - Redis (Sliding Window Rate Limiting & Session Caching)           │
                               │ - Event Store (ChangeEvent Disruption Audit Trail)                  │
                               │ - Neo4j (Optional Production Graph Engine for Dependency Traversal) │
                               └─────────────────────────────────────────────────────────────────────┘
```

---

## 4. State Machines & Lifecycle Specifications

### 4.1 Itinerary Lifecycle States (`Itinerary.model.ts`)
```
[DRAFT] ──► [FEASIBILITY_CHECK] ──► [QUOTE] ──► [CUSTOMER_APPROVAL] ──► [PAYMENT_PENDING]
                                                                               │
[COMPLETED] ◄── [ACTIVE] ◄── [CONFIRMED] ◄─────────────────────────────────────┘
     ▲              │
     │              ▼
     └─────── [DISRUPTED] ──► (Replanning Engine) ──► New Version Record Created
```

- **`DRAFT`**: Initial proposal draft generated by AI/system.
- **`FEASIBILITY_CHECK`**: Verified by backend constraint checker (no overlaps, travel buffer valid).
- **`QUOTE`**: Financial calculator has finalized customer price, supplier costs, and operator margin.
- **`CUSTOMER_APPROVAL`**: Pending traveler sign-off.
- **`PAYMENT_PENDING`**: Payment initiated via gateway.
- **`CONFIRMED`**: All bookings confirmed by vendors.
- **`ACTIVE`**: Trip currently in progress.
- **`DISRUPTED`**: External disruption reported; triggering Change Impact Analyzer.
- **`COMPLETED`**: Trip successfully concluded.

### 4.2 Booking Lifecycle States (`Booking.model.ts`)
```
[DISCOVERED] ──► [SELECTED] ──► [QUOTED] ──► [PENDING_APPROVAL] ──► [APPROVED]
                                                                         │
[COMPLETED] ◄── [IN_PROGRESS] ◄── [CONFIRMED] ◄── [PAYMENT_PENDING] ◄────┘
     ▲
     └── [CANCELLED] / [REFUNDED] / [RESCHEDULED]
```

---

## 5. Dependency Graph Model & Disruption Propagation

Itineraries are represented as **Directed Acyclic Graphs (DAGs)** of `ItineraryItem` nodes.

### Dependency Types:
1. **Time-Sequential Dependency**: Activity B start time depends on Activity A end time + travel time.
2. **Resource Dependency**: Activity depends on Transport Item (e.g., private car pickup) or Guide Assignment.
3. **Location Dependency**: Hotel check-in determines morning departure origin.

```
 [Hotel Day 1] ──► [Private Car Transfer] ──► [Kayaking Activity] ──► [Guide Booking] ──► [Lunch Reservation]
                                                   │ (DISRUPTED)
                                                   ▼
                                        (Impact Transitive Cascade)
                                    [Guide] & [Lunch] Flagged Impacted
```

### Disruption Algorithm (BFS Traversal in `dependencyGraph.util.ts`):
1. **Identify Root Disruption**: Node `X` (e.g., Kayaking cancelled due to high tide).
2. **Traverse Adjacency Map**: BFS collects all nodes transitively reachable from `X`.
3. **Flag Impacted Items**: Mark items as `is_disrupted = true`.
4. **Extract Free Time Slot**: Compute available time window from `X.startTime` to last impacted item's `endTime`.
5. **Query Candidates**: Fetch replacement candidates matching destination, free time window, budget, and indoor/outdoor weather constraints.

---

## 6. Complete Data Models & Database Schemas

### 6.1 Users & Profiles (`001_create_users_and_profiles.sql`)
- **`users`**: `id` (UUID), `email` (Unique), `password_hash`, `role` (`TRAVELER`|`OPERATOR`|`VENDOR`|`ADMIN`), `phone_number`, `full_name`, `is_active`, `created_at`, `updated_at`.
- **`traveler_profiles`**: `id` (UUID), `user_id` (FK->users), `destination_interest`, `duration_days`, `travelers_count`, `budget_limit` (DECIMAL), `interests` (JSONB), `accommodation_preference`, `transport_preference`, `pace`, `food_preferences` (JSONB), `accessibility_needs` (JSONB), `adventure_level`, `preferred_activity_times` (JSONB), `activities_to_avoid` (JSONB).

### 6.2 Service Catalog & Vendors (`002_create_vendors_destinations_services.sql`)
- **`operators`**: `id` (UUID), `user_id` (FK), `agency_name`, `license_number`, `operating_regions` (JSONB), `target_margin_percentage` (DECIMAL).
- **`vendors`**: `id` (UUID), `user_id` (FK), `business_name`, `vendor_type` (`HOTEL`|`EXPERIENCE`|`TRANSPORT`|`GUIDE`|`RESTAURANT`), `location`, `geo_coordinates` (POINT), `rating`, `cancellation_policy` (JSONB).
- **`destinations`**: `id` (UUID), `name`, `state`, `country`, `coordinates` (POINT), `popular_interests` (JSONB), `climate_info` (JSONB).
- **`hotels`**: `id` (UUID), `vendor_id` (FK), `name`, `category`, `price_per_night`, `supplier_cost_per_night`, `check_in_time`, `check_out_time`, `amenities` (JSONB), `available_rooms`.
- **`experiences`**: `id` (UUID), `vendor_id` (FK), `title`, `category`, `price_per_person`, `supplier_cost_per_person`, `duration_minutes`, `opening_hours` (JSONB), `capacity_per_slot`, `weather_dependent` (BOOL), `indoor_outdoor` (`INDOOR`|`OUTDOOR`|`MIXED`).
- **`transports`**: `id` (UUID), `vendor_id` (FK), `transport_mode`, `vehicle_type`, `capacity`, `base_flat_rate`, `rate_per_km`, `supplier_cost_base`.

### 6.3 Itineraries & Operations (`003` & `004_create_bookings_payments_events.sql`)
- **`itineraries`**: `id` (UUID), `version` (INT), `parent_itinerary_id` (FK->itineraries), `traveler_profile_id` (FK), `operator_id` (FK), `title`, `status`, `start_date`, `end_date`, `total_customer_price`, `total_supplier_cost`, `total_taxes`, `total_discounts`, `operator_margin`, `operator_margin_percentage`, `preference_match_score`, `schedule_intensity_score`.
- **`itinerary_items`**: `id` (UUID), `itinerary_id` (FK), `day_number`, `start_time`, `end_time`, `item_type`, `service_ref_id`, `vendor_id`, `title`, `price`, `supplier_cost`, `location`, `dependencies` (JSONB UUIDs), `is_disrupted`.
- **`bookings`**: `id` (UUID), `itinerary_id`, `itinerary_item_id`, `vendor_id`, `status`, `confirmation_code`, `quantity`, `total_price`, `supplier_cost`, `scheduled_start`, `scheduled_end`, `cancellation_deadline`.
- **`payments`**: `id` (UUID), `itinerary_id`, `booking_id`, `user_id`, `transaction_type`, `amount`, `currency`, `gateway_name`, `gateway_transaction_id`, `status`, `refund_reason`.
- **`change_events`**: `id` (UUID), `itinerary_id`, `affected_item_id`, `source`, `event_type`, `payload` (JSONB), `reported_at`, `processed_at`.
- **`change_proposals`**: `id` (UUID), `change_event_id`, `itinerary_id`, `operator_id`, `proposal_type`, `cost_delta`, `preference_match`, `travel_delta_minutes`, `approval_required` (JSONB), `explanation` (JSONB), `status`.
- **`notifications`**: `id` (UUID), `recipient_user_id`, `recipient_role`, `channel`, `notification_type`, `payload` (JSONB), `status`, `retry_count`, `max_retries`.
- **`audit_logs`**: `id` (UUID), `actor_user_id`, `actor_role`, `action`, `entity_type`, `entity_id`, `previous_state` (JSONB), `new_state` (JSONB), `ip_address`, `request_id`, `occurred_at` (Immutable, Append-Only).

---

## 7. Deterministic Pricing & Financial Rules (`priceCalculator.util.ts`)

```
Customer Total Price = Sum(Item Customer Prices) + Taxes (GST 18%) + Platform Fee (5%) - Discounts
Supplier Total Cost  = Sum(Item Supplier Costs) + Vendor Operational Charges
Operator Margin      = Customer Total Price - Supplier Total Cost - Taxes - Platform Fee
Operator Margin %    = (Operator Margin / Customer Total Price) * 100
```

### Financial Protection Rules:
1. **No AI Price Fabrication**: Prices MUST be read directly from vendor item database records.
2. **Margin Floor Safeguard**: If a proposed replanning change reduces the operator margin below `MIN_OPERATOR_MARGIN_PERCENTAGE` (default: 10%), the proposal MUST require `OPERATOR` + `ADMIN` approval.
3. **Itemized Transparency**: Financial outputs must return a full breakdown object (`PriceBreakdown`), never just a single float.

---

## 8. Hard & Soft Constraint Engine Specifications

### 8.1 Hard Constraints (Must NEVER be Violated)
- **Schedule Overlaps**: No two itinerary items for the same traveler can overlap in time.
- **Transit Feasibility**: `ItemA.endTime` + `travelTime(A→B)` + `buffer` (default 15m) ≤ `ItemB.startTime`.
- **Opening Hours**: `Item.startTime` and `Item.endTime` must fall within `Service.openingHours`.
- **Budget Ceiling**: `Itinerary.total_customer_price` ≤ `TravelerProfile.budget_limit`.
- **Vendor Capacity**: Booked quantity ≤ `Service.capacity_per_slot`.

### 8.2 Soft Constraints (Optimized for Scoring)
- **Preference Match Score**: Weighted alignment with traveler interests, pace, and accommodation style.
- **Fatigue Score**: Penalizes long travel durations, insufficient rest windows, or excessive activity density per day.
- **Weather Risk Score**: Evaluates outdoor activities against seasonal/forecast weather risk levels.
- **Sustainability Bonus**: Rewards eco-friendly transport modes and certified local vendors.

---

## 9. AI Subsystem & Tool-Calling Safety Guardrails

### 9.1 Temperature & Model Assignment (`ai.config.ts`)
- **Intent Extraction**: Model = `GEMINI_3_FLASH` / `FAST`, Temperature = `0.1` (Strict JSON).
- **Candidate Scoring**: Model = `GEMINI_3_PRO` / `PRIMARY`, Temperature = `0.2` (Analytic).
- **Draft Generation**: Model = `GEMINI_3_PRO`, Temperature = `0.3` (Structured option drafting).
- **Trade-Off Explainer**: Model = `GEMINI_3_PRO`, Temperature = `0.4` (Empathetic narrative generation).
- **Travel Assistant Chat**: Model = `GEMINI_3_FLASH`, Temperature = `0.6` (Conversational Q&A).

### 9.2 Prompts & Enforced Tool Schemas
All prompts are stored under `ai-ml/prompts/`:
- `preferenceExtraction.prompt.md`: Structured JSON conversion of raw traveler text.
- `disruptionExplanation.prompt.md`: Empathetic narration using pre-computed backend numbers.
- `travelAssistantChat.prompt.md`: Itinerary-aware live Q&A assistant.

Tool Schemas in `ai-ml/models/toolSchemas.model.ts`:
- `extract_preferences`, `search_services`, `get_availability`, `calculate_route`, `check_constraints`, `calculate_price`, `analyze_change_impact`, `generate_alternatives`, `request_approval`, `summarize_update`.

---

## 10. Dynamic Replanning Workflow & Approval Matrix

When an external disruption occurs (e.g. Activity cancelled, driver delayed, weather alert):

```
Disruption Event Reported (ChangeEvent)
                 │
                 ▼
    Impact Traversal Engine (BFS)
                 │
                 ▼
   Identify Affected Itinerary Nodes
                 │
                 ▼
 Dynamic Replanner Engine (ai-ml + backend)
                 │
                 ▼
  Generate 4 Alternative Proposals (ChangeProposal)
                 │
                 ▼
    Approval Router Utility Evaluation
```

### Approval Matrix Rules (`approvalRouter.util.ts`):
- **LOW Impact** (Zero cost delta, schedule shift < 30m, same preference tier):
  - Required Approval: `TRAVELER` only.
  - Can auto-approve if traveler explicitly enabled auto-accept for low impact.
- **MEDIUM Impact** (Cost delta ≠ 0, schedule shift 30m–60m, vendor swap):
  - Required Approval: `TRAVELER` + `OPERATOR`.
- **HIGH Impact** (Margin drop > 5%, multi-day ripple, schedule shift > 60m):
  - Required Approval: `TRAVELER` + `OPERATOR` + `ADMIN`.
  - **Auto-approval is strictly FORBIDDEN.**

---

## 11. Multi-Channel Notification Engine & Idempotency (`Notification.model.ts`)

- **Supported Channels**: `EMAIL`, `SMS`, `WHATSAPP`, `IN_APP`, `PUSH`.
- **Stakeholder Dispatch**: Every disruption dispatches tailored alerts to all affected actors:
  - *Traveler*: Explanation + alternative selection link.
  - *Operator*: Impact score + margin delta + approval toggle.
  - *Vendor / Guide / Driver*: Schedule update or booking cancellation notice.
- **Retry Mechanism**: Exponential backoff (base 1000ms, max 3 retries). Idempotency keys prevent duplicate notifications.

---

## 12. Security, PII Encryption & Auditability Specs

- **Authentication**: JWT access tokens (15m validity, stored in memory) + Refresh tokens (7d validity, stored in HttpOnly, SameSite cookies).
- **Role Guards**: Middleware `auth.middleware.ts` enforces role permissions on every route.
- **PII Protection**: AES-256-GCM encryption for personal identification, phone numbers, and payment details at rest.
- **Rate Limiting**: Redis sliding window (`rateLimiter.middleware.ts`):
  - Global API: 200 req/min per IP.
  - AI Tool Endpoints: 20 req/min per authenticated user.
  - Payment Endpoints: 5 req/min per authenticated user.
- **Audit Logs**: `audit_logs` table is append-only. Database triggers prevent `UPDATE` or `DELETE` operations on audit logs.

---

## 13. System Directory Map & Specification Files

```
CodeNova/
├── PRD.md                             # Product Requirements Document
├── Brain.md                           # Core Brain Mental Models & Systems Blueprint
├── README.md                          # Project Documentation & Architecture Blueprint
├── PROJECT_KNOWLEDGE_BASE.md          # Master Knowledge Base & System Specifications
│
├── backend/                           # Backend Node.js / TypeScript Core
│   ├── api/INSTRUCTIONS.md            # API REST Standards & Error Specifications
│   ├── config/                        # Service Configurations
│   │   ├── database.config.ts         # PostgreSQL, Redis, Event Store & Neo4j Config
│   │   ├── ai.config.ts               # LLM Provider, Temperature & Safety Policies
│   │   ├── integrations.config.ts     # Maps, Weather, Payment & Notification Config
│   │   └── auth.config.ts             # JWT, Encryption, Password Hashing & RBAC Rules
│   ├── models/                        # Domain Models & Database Schemas
│   │   ├── User.model.ts              # Core User Identity & Role Entity
│   │   ├── TravelerProfile.model.ts   # Traveler Preferences & Constraints Entity
│   │   ├── Operator.model.ts          # Tour Operator Agency & Manager Entity
│   │   ├── Vendor.model.ts            # Vendor, Guide & Provider Entity
│   │   ├── Destination.model.ts       # Geographic Destination Entity
│   │   ├── Hotel.model.ts             # Accommodation Service Entity
│   │   ├── Experience.model.ts        # Activity & Attraction Entity
│   │   ├── Transport.model.ts         # Transport Service Entity
│   │   ├── Itinerary.model.ts         # Operational Itinerary Header & Version State
│   │   ├── ItineraryItem.model.ts     # Individual Itinerary Node & Graph Dependencies
│   │   ├── Booking.model.ts           # Service Booking Lifecycle & Status Entity
│   │   ├── Payment.model.ts           # Ledger, Split Payments & Refund Entity
│   │   ├── TourGroup.model.ts         # Group Tour & Coordinator Assignment Entity
│   │   ├── ChangeEvent.model.ts       # Event Store Disruption & Event Record
│   │   ├── ChangeProposal.model.ts     # Alternative Proposal & Trade-off Entity
│   │   ├── Notification.model.ts      # Multi-Channel Notification Record
│   │   ├── Review.model.ts            # Service & Vendor Review Entity
│   │   └── AuditLog.model.ts          # Immutable Audit Trail Entity
│   ├── services/                      # Microservice Domain Logic
│   │   ├── profile/INSTRUCTIONS.md
│   │   ├── constraint-checker/INSTRUCTIONS.md
│   │   ├── dynamic-replanner/INSTRUCTIONS.md
│   │   ├── booking/INSTRUCTIONS.md
│   │   ├── pricing/INSTRUCTIONS.md
│   │   └── notification/INSTRUCTIONS.md
│   ├── middleware/                    # HTTP Request Middleware Pipeline
│   │   ├── auth.middleware.ts         # JWT Verification & RBAC Guards
│   │   ├── validation.middleware.ts   # Request Schema Sanitization & Validation
│   │   ├── rateLimiter.middleware.ts  # Redis Sliding-Window Rate Limiting
│   │   └── logger.middleware.ts       # Structured JSON Logging & Request Tracing
│   └── utils/                         # Core Algorithmic Utilities
│       ├── priceCalculator.util.ts    # Deterministic Price & Margin Calculator
│       ├── dependencyGraph.util.ts    # Itinerary Graph Traversal (BFS/DFS)
│       ├── scheduleValidator.util.ts  # Schedule Overlap & Travel Feasibility
│       └── approvalRouter.util.ts     # Impact-Based Approval Routing Engine
│
├── ai-ml/                             # AI/ML Layer & LLM Tooling
│   ├── services/                      # Preference Extraction, Recommendation & Drafting
│   ├── prompts/                       # Markdown Prompt Templates
│   ├── models/                        # Tool Schemas & TypeScript Types
│   └── utils/                         # LLM API Client Wrapper & Backoff Logic
│
├── database/                          # Migration & Schema Blueprint
│   ├── migrations/ (001–004)          # SQL Schema Migrations
│   ├── schemas/main_schema.sql        # Canonical ERD Specification
│   └── seeds/seed_destinations_and_vendors.sql # Realistic Dev Seed Data
│
├── frontend/                          # React + TypeScript Web Platform
│   ├── public/manifest.json           # PWA & Offline Config
│   └── src/                           # Components, Pages, Hooks, Contexts & Styles
│
├── shared/                            # Universal Cross-Layer Types & Constants
│   ├── types/index.types.ts           # Single Source of Truth TypeScript Interfaces
│   ├── constants/index.constants.ts   # System Constants & Thresholds
│   └── utils/index.utils.ts           # Universal Utilities
│
└── tests/                             # Unit, Integration & E2E Test Specifications
    ├── unit/UNIT_TEST_SPEC.md
    ├── integration/INTEGRATION_TEST_SPEC.md
    └── e2e/E2E_TEST_SPEC.md
```

---

## 14. Testing Matrix & PRD Acceptance Criteria

The system verification is divided into three test layers documented in `tests/`:

1. **Unit Tests (`tests/unit/UNIT_TEST_SPEC.md`)**:
   - Algorithmic coverage for `priceCalculator`, `dependencyGraph`, `scheduleValidator`, and `approvalRouter`. Target: ≥ 80% code coverage.
2. **Integration Tests (`tests/integration/INTEGRATION_TEST_SPEC.md`)**:
   - End-to-end API workflows: Intent Extraction → Itinerary Generation, Hard Constraint Violation Rejection, Booking Lifecycle, Disruption Events, Operator Margin Protection.
3. **End-to-End Tests (`tests/e2e/E2E_TEST_SPEC.md`)**:
   - **Scenario A (Normal Planning Flow)**: Traveler submits prompt → Reviews 3 drafts → Customizes activity → Operator approves quote → Payment confirmed → Vouchers generated.
   - **Scenario B (Disruption Handling Flow)**: External event injected → Dependency graph identifies impacted items → Replanner generates 4 trade-off alternatives → Traveler approves replacement → Version 2 created → All stakeholders notified.
