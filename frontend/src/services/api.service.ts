/**
 * @file api.service.ts
 * @module frontend/src/services
 * @description Centralized API client adapter with single USE_MOCK switch point.
 * All components and services route through this module.
 */

import { TravelerPreferences, FeasibilityStatus } from '../types/profile.types';
import { Itinerary, ItineraryPlanSummary, ItineraryItem } from '../types/itinerary.types';
import { DisruptionEvent, AlternativeProposal, NotificationItem } from '../types/disruption.types';
import { initialGoaItinerary } from '../mock/goaTripData.mock';
import { mockItineraryOptions } from '../mock/itineraryOptions.mock';
import { mockKayakingDisruptionEvent } from '../mock/disruptionScenarios.mock';
import { reconcileDisruptionPricing } from '../utils/pricing.util';

// SINGLE ADAPTER SWITCH POINT
// When false, routes to real backend API endpoints.
export const USE_MOCK = true;
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/+$/, '');

// Local storage key for persistent prototype state across page refreshes
const STORAGE_KEY_ITINERARY = 'codenova_active_itinerary_v2';
const STORAGE_KEY_NOTIFICATIONS = 'codenova_notifications_v2';
const STORAGE_KEY_DISRUPTIONS = 'codenova_disruptions_v2';
const STORAGE_KEY_ADAPTATION_STATE = 'codenova_adaptation_state_v1';

interface PersistedAdaptationState {
  itinerary: Itinerary;
  disruption: DisruptionEvent;
  notifications: NotificationItem[];
}

function getPersistedAdaptationState(): PersistedAdaptationState | null {
  const saved = localStorage.getItem(STORAGE_KEY_ADAPTATION_STATE);
  if (!saved) return null;

  try {
    return JSON.parse(saved) as PersistedAdaptationState;
  } catch (error) {
    console.error('Failed to parse saved adaptation state', error);
    return null;
  }
}

/**
 * Helper to simulate network latency for realistic demo feel
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiService = {
  /**
   * 1. Extract structured preferences from natural-language prompt
   * MOCK — replace with API call to POST /api/v1/profiles/preferences/extract
   */
  async extractPreferences(prompt: string): Promise<TravelerPreferences> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/profiles/preferences/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      return res.json();
    }

    // Realistic processing delay for AI parsing
    await delay(650);

    return {
      destination: "Goa",
      startDate: "2026-11-12",
      durationDays: 4,
      travelersCount: 2,
      budgetLimit: 45000,
      interests: ["Beaches", "Local Food", "Light Adventure", "Heritage"],
      accommodationPreference: "BOUTIQUE",
      transportPreference: "PRIVATE_CAR",
      foodPreference: "Authentic Goan Seafood & Konkan Thali",
      pace: "RELAXED",
      exclusions: ["No Nightlife", "No Crowded Party Beaches"],
      originalPrompt: prompt,
    };
  },

  /**
   * 2. Feasibility check across available inventory
   * MOCK — replace with API call to POST /api/v1/itineraries/feasibility-check
   */
  async checkFeasibility(_preferences: TravelerPreferences): Promise<FeasibilityStatus> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/itineraries/feasibility-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(_preferences),
      });
      return res.json();
    }

    await delay(500);

    return {
      hotelsAvailable: 4,
      experiencesAvailable: 8,
      transportsAvailable: 3,
      guidesAvailable: 6,
      isFeasible: true,
      feasibilityScore: 98,
    };
  },

  /**
   * 3. Generate 3 multi-tier itinerary comparison options
   * MOCK — replace with API call to GET /api/v1/itineraries/options
   */
  async getItineraryOptions(_preferences?: TravelerPreferences): Promise<ItineraryPlanSummary[]> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/itineraries/options`);
      return res.json();
    }

    await delay(600);
    return mockItineraryOptions;
  },

  /**
   * 4. Fetch full day-wise itinerary by ID with localStorage rehydration
   * MOCK — replace with API call to GET /api/v1/itineraries/:id
   */
  async getItineraryById(id: string = "itin-goa-2026-4d"): Promise<Itinerary> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/itineraries/${id}`);
      return res.json();
    }

    await delay(300);

    // A completed adaptation is written as one localStorage snapshot so its
    // itinerary version, price, disruption status, and notifications restore together.
    const adaptationState = getPersistedAdaptationState();
    if (adaptationState) return adaptationState.itinerary;

    // Backwards-compatible persistence check for earlier prototype sessions.
    const saved = localStorage.getItem(STORAGE_KEY_ITINERARY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved itinerary from localStorage", e);
      }
    }

    return initialGoaItinerary;
  },

  /**
   * 5. Fetch active disruption event for an itinerary
   * MOCK — replace with API call to GET /api/v1/operations/disruptions?itinerary_id=:id
   */
  async getDisruptionEvent(_itineraryId: string): Promise<DisruptionEvent | null> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/operations/disruptions?itinerary_id=${_itineraryId}`);
      return res.json();
    }

    const adaptationState = getPersistedAdaptationState();
    if (adaptationState) return adaptationState.disruption;

    const savedDisruption = localStorage.getItem(STORAGE_KEY_DISRUPTIONS);
    if (savedDisruption) {
      try {
        return JSON.parse(savedDisruption);
      } catch (e) {
        console.error("Failed to parse saved disruption", e);
      }
    }

    return mockKayakingDisruptionEvent;
  },

  /**
   * 6. Trigger disruption simulation
   * MOCK — replace with API call to POST /api/v1/operations/disruptions/simulate
   */
  async simulateDisruption(itineraryId: string): Promise<DisruptionEvent> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/operations/disruptions/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itinerary_id: itineraryId, event_type: 'WEATHER_RISK' }),
      });
      return res.json();
    }

    await delay(400);
    const event = { ...mockKayakingDisruptionEvent, status: 'ACTIVE' as const };
    localStorage.setItem(STORAGE_KEY_DISRUPTIONS, JSON.stringify(event));
    return event;
  },

  /**
   * 7. Accept Alternative Proposal and advance Itinerary to v2.0
   * MOCK — replace with API call to POST /api/v1/operations/proposals/:id/accept
   */
  async applyAlternativeProposal(
    itinerary: Itinerary,
    proposalId: string
  ): Promise<{ updatedItinerary: Itinerary; newNotifications: NotificationItem[] }> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/operations/proposals/${proposalId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itinerary_id: itinerary.id }),
      });
      return res.json();
    }

    await delay(700);

    const proposal =
      mockKayakingDisruptionEvent.proposals.find(p => p.id === proposalId) ||
      mockKayakingDisruptionEvent.proposals[0];

    // Build replacement item for Day 2 14:00 - 17:00
    const replacementItem: ItineraryItem = {
      id: `item-d2-3-replaced-${proposal.id}`,
      dayNumber: 2,
      startTime: "14:00",
      endTime: "17:00",
      title: proposal.title,
      description: proposal.description,
      category: proposal.id === 'prop-cooking-masterclass'
        ? 'ACTIVITY'
        : proposal.id === 'prop-resort-leisure'
          ? 'LEISURE'
          : 'ACTIVITY',
      vendorName: proposal.vendorName,
      vendorType: proposal.category,
      location: proposal.id === 'prop-cooking-masterclass'
        ? "Fontainhas Latin Quarter, Panaji"
        : proposal.id === 'prop-portuguese-museum'
          ? "Old Goa Museum Complex"
          : "Candolim Beachfront Resort",
      coordinates: { lat: 15.4989, lng: 73.8322 },
      cost: proposal.newActivityCost,
      supplierCost: Math.round(proposal.newActivityCost * 0.8),
      status: "CONFIRMED",
      weatherDependent: proposal.weatherRisk !== 'NONE',
      requiresGuide: false,
      disruptionNote: `Replaced cancelled Kayaking (+₹${proposal.costDelta} net delta)`,
      tags: ["Adapted Alternative", proposal.category, "100% Weatherproof"]
    };

    // Shared pricing reconciliation keeps displayed and committed totals identical.
    const reconciled = reconcileDisruptionPricing(itinerary.pricing, itinerary.margins, proposal);
    const newTotal = reconciled.pricing.total;

    const updatedDays = itinerary.days.map((day) => {
      if (day.dayNumber !== 2) return day;
      const updatedItems = day.items.map((item) => {
        if (item.id === 'item-d2-3') {
          return replacementItem;
        }
        return item;
      });
      return {
        ...day,
        items: updatedItems,
        dayRunningCost: day.dayRunningCost + proposal.costDelta,
      };
    });

    const changeLogEntry = {
      version: "v2.0",
      timestamp: new Date().toISOString(),
      authorRole: "TRAVELER" as const,
      changeReason: "Weather Disruption (High Tide on Kayaking) resolved by Traveler Approval",
      appliedAlternativeTitle: proposal.title,
      costDelta: proposal.costDelta,
      notes: `Replaced Sal Backwater Kayaking with ${proposal.title}. Cost delta: ₹${proposal.costDelta >= 0 ? '+' : ''}${proposal.costDelta}. Auto-refund ₹2,400 applied.`,
    };

    const updatedItinerary: Itinerary = {
      ...itinerary,
      version: "v2.0 (Weather Adapted)",
      status: "ADAPTED",
      pricing: {
        ...itinerary.pricing,
        ...reconciled.pricing,
      },
      margins: reconciled.margins,
      days: updatedDays,
      changeLog: [changeLogEntry, ...itinerary.changeLog],
    };

    const transportVendorName = 'Goa Express Cabs (Chauffeur)';
    const relevantVendorName = proposal.vendorName || 'Selected Experience Partner';

    // Stakeholder notifications
    const newNotifications: NotificationItem[] = [
      {
        id: `notif-${Date.now()}-1`,
        timestamp: 'Just now',
        recipientRole: 'TRAVELER',
        stakeholderName: 'Alex Traveler',
        title: 'Itinerary Updated to v2.0',
        message: `Itinerary updated: Day 2 kayaking replaced with ${proposal.title} — awaiting your acknowledgment. Total trip price adjusted to ₹${newTotal.toLocaleString('en-IN')}.`,
        type: 'SUCCESS',
        read: false,
      },
      {
        id: `notif-${Date.now()}-2`,
        timestamp: 'Just now',
        recipientRole: 'OPERATOR',
        stakeholderName: 'Horizon Tour Operations',
        title: 'Disruption Resolved · v2.0 Published',
        message: `Traveler approved ${proposal.title}. Kayaking booking cancelled with Goa Water Sports and the operator ledger was rebalanced for the revised routing.`,
        type: 'INFO',
        read: false,
      },
      {
        id: `notif-${Date.now()}-3`,
        timestamp: 'Just now',
        recipientRole: 'VENDOR',
        stakeholderName: transportVendorName,
        title: 'Transit Route Updated for Day 2',
        message: `Pickup at 13:30 re-routed from South Goa jetty to ${proposal.title.includes('Museum') ? 'Old Goa heritage zone' : 'Fontainhas Latin Quarter'}. Delivery remains on time and avoids the high-tide corridor.`,
        type: 'INFO',
        read: false,
      },
      {
        id: `notif-${Date.now()}-4`,
        timestamp: 'Just now',
        recipientRole: 'VENDOR',
        stakeholderName: relevantVendorName,
        title: 'Booking Confirmed for 2 Guests',
        message: `Itinerary updated: Day 2 kayaking replaced with ${proposal.title} — awaiting your acknowledgment. Vendor reservation has been registered and voucher queue synced.`,
        type: 'SUCCESS',
        read: false,
      },
    ];

    const resolvedDisruption: DisruptionEvent = {
      ...mockKayakingDisruptionEvent,
      status: 'RESOLVED'
    };

    // One write makes the completed adaptation an atomic persisted snapshot.
    localStorage.setItem(STORAGE_KEY_ADAPTATION_STATE, JSON.stringify({
      itinerary: updatedItinerary,
      disruption: resolvedDisruption,
      notifications: newNotifications,
    } satisfies PersistedAdaptationState));

    return { updatedItinerary, newNotifications };
  },

  /**
   * 8. Fetch stored notifications or default notifications
   * MOCK — replace with API call to GET /api/v1/notifications
   */
  async getNotifications(): Promise<NotificationItem[]> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/notifications`);
      return res.json();
    }

    const adaptationState = getPersistedAdaptationState();
    if (adaptationState) return adaptationState.notifications;

    const saved = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved notifications", e);
      }
    }

    return [
      {
        id: "notif-init-1",
        timestamp: "2 hours ago",
        recipientRole: "ALL",
        title: "Itinerary Confirmed · v1.0",
        message: "All 4 tour components verified with vendors. Booking code: #GOA-45K-2026.",
        type: "SUCCESS",
        read: true,
      },
      {
        id: "notif-init-2",
        timestamp: "1 hour ago",
        recipientRole: "OPERATOR",
        title: "Digital Vouchers Issued",
        message: "Hotels, private transport sedan, and backwater kayaking passes synced.",
        type: "INFO",
        read: true,
      }
    ];
  },

  /**
   * 9. Reset Itinerary back to clean v1.0
   */
  async resetItinerary(): Promise<Itinerary> {
    localStorage.removeItem(STORAGE_KEY_ITINERARY);
    localStorage.removeItem(STORAGE_KEY_NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEY_DISRUPTIONS);
    localStorage.removeItem(STORAGE_KEY_ADAPTATION_STATE);
    return initialGoaItinerary;
  }
};
