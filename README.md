# CodeNova: Personalized Dynamic Tour Planning & Tour Operations Platform

## Overview
**CodeNova** is an end-to-end, event-driven, constraint-aware personalized tour planning and operational execution platform designed for travelers, tour operators, vendors, and coordinators. 

Unlike traditional static booking sites or unconstrained AI itinerary generators, CodeNova follows a strict **"Feasible Before Fancy"** design philosophy:
- **AI Capabilities** (intent extraction, candidate scoring, draft generation, trade-off explanation) are completely isolated from operational truth.
- **Operational Logic & Validation** (hard constraint checking, pricing calculation, margin validation, inventory tracking, dependency graph traversal) are strictly executed deterministically by backend services.
- **Human Approval & Oversight** are enforced for all high-impact operational changes and cost-impacting replanning proposals.

## Local ML Development

The local ML demo can run without Docker. The Python pipeline uses the isolated environment at `ai-ml/pipeline_service/.venv`, the backend uses PostgreSQL on port `55432`, and the frontend runs on port `5173`.

```powershell
$env:DB_HOST = "localhost"
$env:DB_PORT = "55432"
$env:DB_USER = "codenova_user"
$env:DB_PASSWORD = ""
$env:DB_NAME = "codenova_db"
npm --prefix backend run dev
```

Start the ML service with:

```powershell
& .\ai-ml\pipeline_service\.venv\Scripts\python.exe -m uvicorn main:app --app-dir ai-ml/pipeline_service --host 127.0.0.1 --port 8000
```

The frontend obtains a development JWT automatically. The development database must be initialized from `database/migrations` and `database/seeds/seed_destinations_and_vendors.sql` before using catalog-backed recommendations.

---

## High-Level Architecture & Principles

```
  ┌────────────────────────────────────────────────────────┐
  │              Traveler / Operator / Vendor UI           │
  └──────────────────────────┬─────────────────────────────┘
                             │ REST / WebSockets / SSE
  ┌──────────────────────────▼─────────────────────────────┐
  │                 API Gateway & Middleware               │
  │     (Auth, RBAC, Validation, Rate Limiting, Logging)   │
  └──────────┬─────────────────────────────────┬───────────┘
             │                                 │
  ┌──────────▼──────────┐           ┌──────────▼──────────┐
  │   AI / ML Services  │           │   Backend Services  │
  │ (Intent Extraction, │           │ (Constraint Engine, │
  │ Candidate Scoring,  │           │ Replanning Engine,  │
  │ Trade-Off Explainer)│           │  Pricing & Margins, │
  └──────────┬──────────┘           │ Operational State)  │
             │                      └──────────┬──────────┘
             │ Tool-Calling API                │
             └─────────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            │       Persistence Layer             │
            │ (PostgreSQL, Redis, Event Store)    │
            └─────────────────────────────────────┘
```

### Core Architecture Pillars
1. **Feasible Before Fancy**: Hard constraints (schedule overlaps, budget, vendor capacity, opening hours) can never be bypassed by AI proposals.
2. **Deterministic Financials**: Prices and margins are always computed from real vendor catalog rates and contract terms—never invented by LLMs.
3. **Graph-Based Itinerary Management**: Itineraries are modeled as Directed Acyclic Graphs (DAGs) of dependent items (transport, hotels, activities, guides). Disruption impact propagates transitively down the dependency graph.
4. **Immutable Versioning**: Every approved replanning change creates a new itinerary version record with parent-child audit links.
5. **Role-Based Operational Matrix**: Clear separation of responsibilities for `TRAVELER`, `OPERATOR`, `VENDOR`, and `ADMIN`.

---

## Comprehensive Repository Structure

```
CodeNova/
├── PRD.md                             # Product Requirements Document & Specifications
├── Brain.md                           # System Brain Architecture & Mental Models
├── README.md                          # Project Documentation & Architecture Blueprint
│
├── backend/                           # Core Node.js / TypeScript Backend
│   ├── api/
│   │   └── INSTRUCTIONS.md            # API Layer Conventions & Error Specifications
│   ├── config/                        # Service & System Configuration Modules
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
│   ├── services/                      # Microservice / Domain Business Logic Services
│   │   ├── profile/INSTRUCTIONS.md    # Traveler Profile & Preferences Service
│   │   ├── constraint-checker/        # Hard & Soft Constraint Engine Service
│   │   │   └── INSTRUCTIONS.md
│   │   ├── dynamic-replanner/         # Change Impact Analyzer & Replanner Service
│   │   │   └── INSTRUCTIONS.md
│   │   ├── booking/INSTRUCTIONS.md    # Booking Lifecycle & Vendor Voucher Service
│   │   ├── pricing/INSTRUCTIONS.md    # Financial Calculation & Margin Engine Service
│   │   └── notification/              # Multi-channel Dispatch & Retry Service
│   │       └── INSTRUCTIONS.md
│   ├── middleware/                    # HTTP Request Pipeline Middleware
│   │   ├── auth.middleware.ts         # JWT Verification & RBAC Guards
│   │   ├── validation.middleware.ts   # Request Schema Sanitization & Validation
│   │   ├── rateLimiter.middleware.ts  # Redis Sliding-Window Rate Limiting
│   │   └── logger.middleware.ts       # Structured JSON Logging & Request ID Tracing
│   └── utils/                         # Core Algorithmic & Traversal Utilities
│       ├── priceCalculator.util.ts    # Deterministic Price & Margin Calculator
│       ├── dependencyGraph.util.ts    # Itinerary Graph Traversal (BFS/DFS)
│       ├── scheduleValidator.util.ts  # Schedule Overlap & Travel Feasibility
│       └── approvalRouter.util.ts     # Impact-Based Approval Routing Engine
│
├── ai-ml/                             # AI/ML Orchestration & Tool Integration
│   ├── services/
│   │   ├── preferenceExtractor.service.ts  # Natural Language Intent Parser
│   │   ├── recommendationEngine.service.ts # Weighted Multi-Factor Candidate Scorer
│   │   ├── itineraryDraftGenerator.service.ts # Draft Option Generator
│   │   └── tradeoffExplainer.service.ts    # Structured Trade-Off Explainer
│   ├── prompts/
│   │   ├── preferenceExtraction.prompt.md  # Intent Extraction System Prompt
│   │   ├── disruptionExplanation.prompt.md # Disruption Narrative System Prompt
│   │   └── travelAssistantChat.prompt.md   # Conversational Guide System Prompt
│   ├── models/
│   │   ├── toolSchemas.model.ts       # Enforced JSON Tool Schemas for LLM
│   │   └── preferenceTypes.model.ts   # TypeScript Preference & Constraint Types
│   └── utils/
│       └── llmClient.util.ts          # LLM API Client with Backoff & JSON Mode
│
├── database/                          # Persistence & Database Specs
│   ├── migrations/
│   │   ├── 001_create_users_and_profiles.sql
│   │   ├── 002_create_vendors_destinations_services.sql
│   │   ├── 003_create_itineraries_and_items.sql
│   │   └── 004_create_bookings_payments_events.sql
│   ├── schemas/
│   │   └── main_schema.sql            # Canonical ERD & Schema Blueprint
│   └── seeds/
│       └── seed_destinations_and_vendors.sql # Realistic Dev Seed Data
│
├── frontend/                          # React + TypeScript Frontend Platform
│   ├── public/
│   │   └── manifest.json              # PWA App Manifest & Offline Config
│   └── src/
│       ├── components/
│       │   ├── INSTRUCTIONS.md        # UI Architecture & Component Guidelines
│       │   └── COMPONENT_SPEC.md      # Detailed Spec for Common, Itinerary & Disruption UI
│       ├── pages/
│       │   ├── INSTRUCTIONS.md        # Page Architecture Guidelines
│       │   └── PAGE_SPEC.md           # Spec for Traveler, Operator & Vendor Pages
│       ├── hooks/
│       │   ├── useItinerary.hook.ts   # Itinerary State & Customization Hook
│       │   ├── useAuth.hook.ts        # Auth & Role-Based Guard Hook
│       │   └── useDisruption.hook.ts  # Real-Time SSE/WebSocket Disruption Hook
│       ├── contexts/
│       │   ├── AuthContext.tsx        # Global Authentication State Context
│       │   └── ItineraryContext.tsx   # Global Itinerary State Context
│       ├── services/
│       │   └── api.service.ts         # Axios HTTP Client with Interceptors
│       ├── utils/
│       │   ├── priceFormatter.util.ts # INR Currency Formatting Utilities
│       │   └── dateTime.util.ts       # Date/Time & Duration Formatting Utilities
│       └── styles/
│           └── global.css             # Design Tokens & CSS Custom Properties
│
├── shared/                            # Cross-Layer Universal Types & Constants
│   ├── types/
│   │   └── index.types.ts             # Shared Domain TypeScript Interfaces
│   ├── constants/
│   │   └── index.constants.ts          # Shared Business Constants & Thresholds
│   └── utils/
│       └── index.utils.ts             # Shared Formatting & Retry Helpers
│
└── tests/                             # Comprehensive Test Suites
    ├── unit/
    │   └── UNIT_TEST_SPEC.md          # Specs for Utility & Business Logic Unit Tests
    ├── integration/
    │   └── INTEGRATION_TEST_SPEC.md   # Specs for Integration & End-to-End API Workflows
    └── e2e/
        ├── INSTRUCTIONS.md            # E2E Test Strategy & Guidelines
        └── E2E_TEST_SPEC.md           # Playwright Specs for PRD Acceptance Criteria
```

---

## Detailed File Specifications Summary

### Backend Configurations (`backend/config/`)
- **`database.config.ts`**: Specifies connection settings, connection pools, SSL config, and environment variables for PostgreSQL, Redis, Event Store, and Neo4j.
- **`ai.config.ts`**: Configures primary/fast LLM model choices, strict vs creative temperatures, context window bounds, tool-calling permissions, and safety policies.
- **`integrations.config.ts`**: Parameters for Maps/Routing APIs, Weather APIs, Payment Gateways (Razorpay/Stripe), and Notification providers (Twilio/SendGrid).
- **`auth.config.ts`**: Configures JWT secrets, token expiration periods, bcrypt salt rounds, PII AES-256-GCM encryption keys, and role-based access permission rules.

### Domain Models (`backend/models/`)
All models define complete schema fields, data types, primary/foreign keys, enum values, indexes, and relational mappings:
- **`User.model.ts`**: Identity entity supporting `TRAVELER`, `OPERATOR`, `VENDOR`, and `ADMIN`.
- **`TravelerProfile.model.ts`**: Stores structured traveler budget, interests, pace, and accessibility constraints.
- **`Operator.model.ts`**: Tour operator business entity, target margin percentages, and assigned regions.
- **`Vendor.model.ts`**: Vendor registry, business type (hotel/experience/transport/guide), rating, and cancellation policy.
- **`Destination.model.ts`**: Geographic destination info, coordinates, climate data, and popular attraction tags.
- **`Hotel.model.ts`**: Accommodation candidates, room pricing, check-in/out rules, and amenities.
- **`Experience.model.ts`**: Activity candidates, pricing, opening hours, capacity, and indoor/outdoor/weather flags.
- **`Transport.model.ts`**: Vehicle options, per-km rates, flat base rates, and capacity limits.
- **`Itinerary.model.ts`**: Itinerary version header, total customer price, supplier costs, operator margin, and status.
- **`ItineraryItem.model.ts`**: Graph nodes representing day activities, start/end times, and array of precursor dependency UUIDs.
- **`Booking.model.ts`**: Full operational booking lifecycle (`DISCOVERED` to `CONFIRMED` / `CANCELLED`), voucher codes.
- **`Payment.model.ts`**: Ledger for customer payments, supplier payouts, platform fees, and partial/full refunds.
- **`TourGroup.model.ts`**: Group trip instances, tour coordinator assignment, capacity limits.
- **`ChangeEvent.model.ts`**: Disruption records in event store detailing event type, source, and affected items.
- **`ChangeProposal.model.ts`**: Replanner alternative options, cost deltas, travel time deltas, preference match scores, and required approvers.
- **`Notification.model.ts`**: Multi-channel notification queue with retry count and delivery status.
- **`Review.model.ts`**: Verified traveler ratings and reviews for services and vendors.
- **`AuditLog.model.ts`**: Append-only security audit log for high-impact actions, approvals, and financial transactions.

### Core Business Services & Middleware (`backend/services/`, `backend/middleware/`)
- **Profile Service**: CRUD for traveler profiles, natural language intent extraction pipeline.
- **Constraint Checker Service**: Hard constraint validation (overlaps, budget, hours, capacity) and soft constraint scoring.
- **Dynamic Replanner Service**: Change impact analysis via dependency graph traversal, alternative proposal generation, trade-off explanation.
- **Booking & Pricing Services**: Financial calculations, margin protection, voucher generation, split ledger payments.
- **Middleware**: JWT authentication (`auth.middleware.ts`), Zod/Joi request validation (`validation.middleware.ts`), Redis sliding-window rate limiter (`rateLimiter.middleware.ts`), and request tracing logger (`logger.middleware.ts`).

### Algorithmic Utilities (`backend/utils/`)
- **`priceCalculator.util.ts`**: Deterministic sum of customer prices, supplier costs, taxes, platform fees, and operator margins.
- **`dependencyGraph.util.ts`**: In-memory DAG creation, BFS/DFS traversal for disruption impact propagation, circular dependency detection.
- **`scheduleValidator.util.ts`**: Evaluates travel time matrices, buffer windows, overlap conflicts, opening hours compliance, and fatigue scoring.
- **`approvalRouter.util.ts`**: Determines required approval roles (`TRAVELER`, `OPERATOR`, `ADMIN`) based on cost, schedule, or margin impact thresholds.

### AI/ML Orchestration (`ai-ml/`)
- **Services**: Preference extraction, candidate scoring, multi-tier itinerary draft generation, and trade-off explanation.
- **Prompts**: Markdown system prompts with strict rules preventing price/availability fabrication.
- **Models & Utils**: JSON tool-calling schemas (`toolSchemas.model.ts`), preference type contracts (`preferenceTypes.model.ts`), and LLM API client wrapper (`llmClient.util.ts`) with backoff and retry handling.

### Database Layer (`database/`)
- **Migrations 001–004**: Sequential SQL schema creation scripts for PostgreSQL with enum types and indexes.
- **`main_schema.sql`**: Full ERD documentation and index strategy.
- **`seed_destinations_and_vendors.sql`**: Seed data instructions featuring real Indian tourist destinations (Goa, Kerala, Rajasthan) and service catalog candidates.

### Frontend Specifications (`frontend/`)
- **Component & Page Specs**: Detailed UI guidelines for common elements, itinerary day views, disruption banners, alternative comparison cards, and control tower dashboards.
- **Hooks & Contexts**: Custom React hooks (`useItinerary`, `useAuth`, `useDisruption`) and global contexts (`AuthContext`, `ItineraryContext`).
- **Styles & PWA**: Global CSS design tokens (`global.css`) featuring deep ocean teal and alert orange palettes, and `manifest.json` for offline capability.

### Shared Layer & Test Specs (`shared/`, `tests/`)
- **Shared Modules**: Universal TypeScript interfaces (`index.types.ts`), application constants (`index.constants.ts`), and shared helpers (`index.utils.ts`).
- **Test Specs**: Specifications for Unit testing (`UNIT_TEST_SPEC.md`), API Integration testing (`INTEGRATION_TEST_SPEC.md`), and Playwright E2E testing (`E2E_TEST_SPEC.md`) covering PRD Scenarios A & B.

---

## Instructions for Implementation

When implementing code for any service, model, configuration, or utility in this workspace:

1. **Do not write ad-hoc code without checking the instruction file first.** Each file contains detailed specifications, function signatures, error handling requirements, and architectural boundaries.
2. **Respect the AI/Backend boundary.** AI services must never directly modify operational state or invent pricing/availability data.
3. **Follow the dependency graph rules.** Any change to an itinerary item must trigger the dependency graph utility to evaluate downstream impact.
4. **Ensure auditability.** Every high-impact action, approval, or disruption event must be recorded in `AuditLog.model.ts` and `ChangeEvent.model.ts`.
5. **Run tests against the provided test specs.** Verify implementation against unit, integration, and E2E specifications before marking features complete.
