# CodeNova Frontend — Hack Celestial Prototype

Personalized Dynamic Tour Planning & Operations Platform prototype built for **Hack Celestial 2026**.

This prototype provides an end-to-end traveler flow from natural-language trip generation to day-wise scheduling, multi-tier plan comparisons, transparent pricing breakdowns, and a live **Dynamic Adaptation Engine** demonstrating real-world replanning (kayaking cancelled due to weather) with multi-node cascade impacts and versioned updates.

---

## 🚀 Quick Start (Running Locally)

The frontend is a standalone React 18 + Vite + TypeScript application located in `frontend/`.

### Prerequisites
- Node.js `v18+` (tested on Node `v22.12.0` / npm `10.9.0`)

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏗️ Architecture & Single Mock/API Adapter

All frontend services communicate through a **single adapter interface** in `src/services/api.service.ts`:

```typescript
// src/services/api.service.ts
export const USE_MOCK = true; // Set to false to route to real backend endpoints
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
```

Every service method is cleanly annotated with `// MOCK — replace with API call to <endpoint>` so backend integration is effortless:

| Frontend Function | MOCK Status | Target Backend Endpoint |
|---|---|---|
| `apiService.extractPreferences(prompt)` | Mocked with realistic AI delay | `POST /api/v1/profiles/preferences/extract` |
| `apiService.checkFeasibility(prefs)` | Mocked against Goa inventory | `POST /api/v1/itineraries/feasibility-check` |
| `apiService.getItineraryOptions()` | Mocked (3 Tiers: Budget, Comfort, Premium) | `GET /api/v1/itineraries/options` |
| `apiService.getItineraryById(id)` | Mocked (Goa 4D/3N with localStorage) | `GET /api/v1/itineraries/:id` |
| `apiService.simulateDisruption(id)` | Mocked (Kayaking high tide warning) | `POST /api/v1/operations/disruptions/simulate` |
| `apiService.applyAlternativeProposal(id, propId)` | Mocked (Reconciles v2.0 & pricing) | `POST /api/v1/operations/proposals/:id/accept` |
| `apiService.getNotifications()` | Mocked (Multi-stakeholder feed) | `GET /api/v1/notifications` |

---

## 🎨 Screens Implemented

1. **Step 1: Trip Request & Profile Input (`TripPlannerPage.tsx`)**:
   - Natural language input box pre-loaded with the Goa prompt.
   - Animated feasibility check verifying 4 hotels, 8 activities, 3 transport fleets, and 6 guides.
   - Interactive structured preference chips (Destination, Budget Cap, Stay, Transport, Pace, Exclusions).
2. **Step 2: Itinerary Options Comparison (`ItineraryComparisonPage.tsx`)**:
   - 3 side-by-side configurations (*Budget Explorer* ₹26,800, *Comfort Balance* ₹35,328 / 96% match, *Premium Relaxed* ₹58,000).
   - Reconciled display: `Budget Cap: ₹45,000 · Estimated: ₹35,328 (Saves ₹9,672)`.
3. **Step 3: Day-Wise Itinerary View (`ItineraryDetailPage.tsx`)**:
   - Interactive Day 1 to Day 4 tabs with running day totals.
   - Individual item cards with vendor details, timings, category badges, and pricing.
4. **Step 4: Pricing Breakdown Panel (`PricingBreakdownPanel.tsx`)**:
   - Full line-item breakdown (Hotels + Transport + Activities + Guides + Meals + Taxes − Discounts = ₹35,328).
   - Operator Margin toggle showing supplier cost (-₹27,420) and healthy gross margin (22.4% / ₹7,908).
5. **Step 5: Dynamic Adaptation Engine (`ImpactCascadeModal.tsx`)**:
   - "⚠️ Simulate: Kayaking Cancelled" trigger button.
   - Visual 5-node domino cascade traversal (Activity ➔ Pickup Sedan ➔ Guide ➔ Lunch table ➔ Escrow refund).
   - 4 Trade-off proposal cards (Cooking Masterclass, Reschedule, Portuguese Museum, Resort Leisure).
   - Applying proposal updates the itinerary to `v2.0 (Weather Adapted)`, reconciles total to **₹35,928**, updates Day 2 timeline, and logs an audit entry.
6. **Step 6: Stakeholder Notification Feed (`NotificationFeed.tsx`)**:
   - Synchronized notification drawer for Traveler, Operator, Chauffeur, and Culinary Vendor.
   - Full state persistence via `localStorage` on hard refresh.
