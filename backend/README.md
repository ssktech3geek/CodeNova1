# CodeNova Backend — 100% Integrated

**Personalized Dynamic Tour Planning & Operations Platform — Backend & ML**

This is the complete production-ready backend with full ML integration, implementing every feature described in the CodeNova PRD.

---

## ✅ What's Built (100% PDF Coverage)

### Backend API (`/backend`)

| Feature | Status | Routes |
|---|---|---|
| **Auth (JWT)** | ✅ | `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/me`, `/auth/dev-token` |
| **Traveler Profile** | ✅ | `/profiles/:userId` |
| **AI Assistant (NL→Preferences)** | ✅ | `/assistant/extract-preferences` (OpenRouter/Gemini) |
| **Destinations Catalog** | ✅ | `/destinations` |
| **Vendors** | ✅ | `/vendors` |
| **ML Activities** | ✅ | `/ml/activities` (catalog) |
| **ML Optimize** | ✅ | `/ml/optimize` (LightGBM + OR-Tools) |
| **Itinerary CRUD** | ✅ | `/itineraries` |
| **Bookings** | ✅ | `/bookings` |
| **Disruptions** | ✅ | `/disruptions/report`, `/disruptions?itinerary_id=` |
| **Dynamic Replanning** | ✅ | Dependency graph, change impact, alternative proposals |
| **Pricing Engine** | ✅ | Customer price, operator margin, GST, platform fee |
| **Schedule Validation** | ✅ | DAG acyclicity, time-overlap, transit feasibility |
| **Approval Routing** | ✅ | Auto-route by impact level (LOW/MEDIUM/HIGH) |
| **Audit Logging** | ✅ | Append-only `audit_logs` table |

### ML Service (`/ai-ml/pipeline_service`)

| Feature | Status |
|---|---|
| **LightGBM LambdaRank** | ✅ Learns from grouped traveler interactions |
| **OR-Tools CP-SAT Scheduler** | ✅ Constraint optimization (budget, time, windows) |
| **Synthetic Data Generator** | ✅ 400 users, 9,917 interactions |
| **Content-Based Fallback** | ✅ Tag/pace/adventure/budget-fit scoring |
| **Excluded/Locked Activities** | ✅ Disruption replanning support |
| **Docker Support** | ✅ `Dockerfile` + docker-compose |

---

## 🚀 Quick Start

### Option 1: With PostgreSQL + Redis (full production setup)

```bash
# 1. Install dependencies
cd backend && npm install
cd ../ai-ml/pipeline_service && python -m venv .venv && .venv/Scripts/activate
pip install -r requirements.txt

# 2. Configure environment
cd ../../backend
cp .env.example .env  # Edit DB credentials
# Update .env with your PostgreSQL password and OpenRouter API key

# 3. Run database migrations
npm run db:migrate
# This runs all 4 migrations and seeds Goa demo data

# 4. Start ML service
cd ../ai-ml/pipeline_service
.venv/Scripts/uvicorn main:app --host 0.0.0.0 --port 8000

# 5. Start backend (in another terminal)
cd ../../backend
npm run dev
```

### Option 2: Without PostgreSQL (in-memory fallback mode)

The backend **automatically falls back** to in-memory mock data when PostgreSQL is unavailable. This is perfect for demos and frontend development.

```bash
# 1. Install Python dependencies for ML service
cd ai-ml/pipeline_service
python -m venv .venv && .venv/Scripts/activate
pip install -r requirements.txt

# 2. Generate synthetic ML training data
python generate_synthetic_data.py

# 3. Start ML service (Terminal 1)
.venv/Scripts/uvicorn main:app --host 0.0.0.0 --port 8000

# 4. Start backend (Terminal 2)
cd ../../backend
npm install
npm run dev
```

That's it! No DB or Redis required.

### Option 3: Docker Compose (full stack)

```bash
docker compose up -d --build
```

This starts: PostgreSQL, Redis, ML service, and backend.

---

## 🧪 Verifying the Stack

### 1. Health checks
```bash
curl http://localhost:5000/api/v1/health
curl http://localhost:8000/health
```

### 2. Get a dev JWT token (development only)
```bash
curl http://localhost:5000/api/v1/auth/dev-token
```

### 3. Extract travel preferences from natural language (OpenRouter LLM)
```bash
TOKEN=$(curl -s http://localhost:5000/api/v1/auth/dev-token | jq -r .data.accessToken)
curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  http://localhost:5000/api/v1/assistant/extract-preferences \
  -d '{"natural_language":"Plan a relaxed 4-day Goa trip for 2 people under 45000 with beaches, local food, light adventure, boutique hotel, private transport, and no nightlife"}'
```

### 4. Get ML-ranked activities
```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/v1/ml/activities
```

### 5. Run ML optimization (LightGBM + OR-Tools)
```bash
curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  http://localhost:5000/api/v1/ml/optimize \
  -d '{
    "traveler": {"budget": 45000, "interests": ["BEACHES","HERITAGE","CULINARY"], "pace": "MODERATE", "adventure_level": 3, "travelers_count": 2},
    "activities": [
      {"id":"e1","name":"Kayaking","tag":"WATER_SPORTS","cost":1200,"duration_min":120,"intensity":4,"open_min":480,"close_min":1080,"available":true},
      {"id":"e2","name":"Cooking","tag":"CULINARY","cost":900,"duration_min":180,"intensity":2,"open_min":600,"close_min":960,"available":true}
    ],
    "max_budget": 45000,
    "travel_time_gap": 30
  }'
```

### 6. List destinations
```bash
curl http://localhost:5000/api/v1/destinations
```

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│              FRONTEND (USE_MOCK = false later)           │
└──────────────────────────┬───────────────────────────────┘
                           │ REST
                           ▼
┌──────────────────────────────────────────────────────────┐
│           BACKEND (Express + TypeScript)                 │
│  ┌─────────────────┐  ┌────────────────────────┐        │
│  │  AI Services    │  │  Business Services     │        │
│  │  - preferences  │  │  - itinerary           │        │
│  │  - llmClient    │  │  - booking             │        │
│  │  (OpenRouter)   │  │  - changeImpact        │        │
│  └────────┬────────┘  │  - vendor catalog      │        │
│           │           │  - destination catalog │        │
│           │           └────────────────────────┘        │
│           │           ┌────────────────────────┐        │
│           │           │  ML Pipeline Client    │        │
│           │           │  (with TypeScript      │        │
│           │           │   fallback if offline) │        │
│           │           └────────────┬───────────┘        │
└───────────┼────────────────────────┼────────────────────┘
            │                        │
            │ HTTPS                  │ HTTP
            ▼                        ▼
   ┌─────────────────┐    ┌─────────────────────┐
   │   OpenRouter    │    │   ML Pipeline       │
   │   (Gemini 2.0)  │    │   (FastAPI)         │
   │                 │    │  - LightGBM Ranker  │
   └─────────────────┘    │  - OR-Tools CP-SAT  │
                          └─────────────────────┘
                                   │
                                   ▼
                          ┌─────────────────────┐
                          │  PostgreSQL + Redis │
                          │  (or in-memory)     │
                          └─────────────────────┘
```

---

## 📊 Database Schema (PostgreSQL)

All entities from the PRD are implemented:

- **users** + **traveler_profiles** (1:1)
- **operators** + **vendors**
- **destinations** + **hotels** + **experiences** + **transports**
- **itineraries** + **itinerary_items** (with dependency graph)
- **bookings** (lifecycle: DISCOVERED → COMPLETED)
- **payments** (with refunds)
- **change_events** + **change_proposals** (dynamic replanning)
- **notifications** (multi-stakeholder, retryable)
- **audit_logs** (append-only)

Migrations: `database/migrations/001_*.sql` through `004_*.sql`

Seed data: `database/seeds/seed_destinations_and_vendors.sql` (Goa, Kerala, etc.)

---

## 🔧 Configuration

### Environment Variables (`.env`)

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | 5000 | Backend port |
| `DB_HOST` | localhost | PostgreSQL host |
| `DB_USER` | postgres | Database user |
| `DB_PASSWORD` | (empty) | Database password |
| `DB_NAME` | codenova_db | Database name |
| `REDIS_URL` | redis://localhost:6379 | Redis URL |
| `ANTHROPIC_AUTH_TOKEN` | (from settings.json) | OpenRouter API key |
| `ANTHROPIC_BASE_URL` | https://openrouter.ai/api | OpenRouter base |
| `ANTHROPIC_MODEL` | google/gemini-2.0-flash-001 | LLM model |
| `ML_SERVICE_URL` | http://localhost:8000 | ML service URL |
| `ML_SERVICE_TIMEOUT_MS` | 8000 | ML service timeout |
| `JWT_SECRET` | dev-secret-... | JWT signing key |
| `FRONTEND_URL` | http://localhost:3000 | CORS origin |

### In-Memory Fallback Mode

When PostgreSQL is unavailable, the backend:
1. Returns realistic mock data for destinations, vendors, hotels, experiences, transports
2. Continues to call the ML service normally
3. Gracefully degrades persistence (in-memory only)
4. Logs a warning but keeps the server running

This makes development frictionless.

---

## 🧬 ML Service Details

### Architecture
- **FastAPI** Python service on port 8000
- **LightGBM LambdaRank** for activity ranking (when ≥20 historical interactions available)
- **Content-based fallback** scoring for new users
- **OR-Tools CP-SAT** for constraint optimization:
  - Budget cap
  - Opening hours (`open_min` / `close_min`)
  - Activity duration
  - Travel time gaps between activities
  - Locked/excluded activities (for disruption replanning)

### Synthetic Data
- 400 simulated users across 5 personas (budget_adventure, luxury_leisure, family_convenience, culture_enthusiast, nature_focused)
- ~25 interactions per user (9,917 total)
- Realistic behavior: bookings, favorites, skips, rejections

### Features (9 dimensions)
- `act_cost`, `act_duration_min`, `act_intensity`
- `user_budget`, `cost_to_budget_ratio`
- `tag_match`, `pace_match`, `adventure_match`
- `party_size`

---

## 🛡️ Security & Reliability

- **JWT authentication** with access + refresh tokens
- **Role-based access control** (TRAVELER, OPERATOR, VENDOR, ADMIN)
- **Rate limiting** (Redis-backed with in-memory fallback)
- **Helmet** security headers
- **CORS** allowlist
- **Audit logging** for all state-changing operations
- **Graceful shutdown** on SIGTERM/SIGINT
- **No invented prices or availability** (LLM never fabricates data)
- **Input validation** with Zod schemas
- **Bcrypt** password hashing (12 rounds)

---

## 📝 Next Steps for Frontend

1. Set `USE_MOCK = false` in `frontend/src/services/api.service.ts`
2. Use these real backend endpoints (already implemented):

```typescript
// Replace mocks in api.service.ts with:

// 1. Extract preferences (LLM)
POST /api/v1/assistant/extract-preferences
Body: { natural_language: "..." }
Returns: { data: { preferences: TravelerPreference } }

// 2. Feasibility check (DB query)
POST /api/v1/itineraries/feasibility-check
Body: { destination, dates, budget, travelers, interests, ... }

// 3. Generate itinerary options (ML + OR-Tools)
POST /api/v1/ml/optimize
Body: { traveler, activities, max_budget, travel_time_gap }
Returns: { recommendations, itinerary, model, optimizer }

// 4. Create itinerary
POST /api/v1/itineraries
Body: { traveler_profile_id, operator_id, title, start_date, end_date, items: [...] }

// 5. Report disruption
POST /api/v1/disruptions/report
Body: { itinerary_id, affected_item_id, source, event_type, payload }

// 6. Apply alternative proposal (with auto-replan)
POST /api/v1/itineraries/:id/replan
Body: { proposal_id }
```

All endpoints are already implemented and tested. The frontend can switch from `USE_MOCK=true` to `USE_MOCK=false` with zero changes to the calling code.

---

## 🐛 Troubleshooting

### "PostgreSQL connection failed"
→ The backend uses in-memory fallback. Start PostgreSQL if you need persistence.

### "ML service unavailable"
→ The backend uses a deterministic TypeScript fallback for itinerary generation. Start the ML service for LightGBM + OR-Tools.

### "OpenRouter returned invalid JSON"
→ Check `ANTHROPIC_AUTH_TOKEN` in `.env` and `settings.json`. Some models return markdown-wrapped JSON; the LLM client handles this automatically.

### Port 5000 already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /F /PID <pid>
```

### ML model returns "content_based_fallback" instead of "lightgbm_lambdarank"
→ Run `python generate_synthetic_data.py` first to produce enough historical interactions (≥20) for the ranker to train.

---

## 📜 Scripts

```bash
npm run dev          # Start with ts-node + hot reload
npm run typecheck    # TypeScript validation
npm run db:migrate   # Run all 4 migrations + seed data
npm run build        # Compile to dist/
npm start            # Run compiled output
```

---

**Status: 100% Complete for Backend + ML Integration**
Frontend integration is ready (just flip `USE_MOCK = false`).
