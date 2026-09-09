// MOCK — replace with API call to /api/v1/operations/disruptions/:id
import { DisruptionEvent } from '../types/disruption.types';

export const mockKayakingDisruptionEvent: DisruptionEvent = {
  id: "disrupt-kayak-weather-01",
  eventType: "WEATHER_RISK",
  affectedItemId: "item-d2-3",
  affectedItemTitle: "Sal Backwater Kayaking Tour",
  dayNumber: 2,
  triggerSource: "Goa Maritime & Weather Bureau API (High Tide & Swell Warning)",
  reason: "Unsafe water turbulence, tidal surge and river squall warning issued for Sal Backwaters channel between 14:00 and 18:00.",
  status: "ACTIVE",
  detectedAt: "2026-09-05T10:15:00Z",
  cascadeItems: [
    {
      id: "cascade-1",
      type: "ACTIVITY",
      name: "Sal Backwater Kayaking Tour (Mobor)",
      vendor: "Goa Water Sports & Expeditions",
      impactDescription: "Water sports vendor officially halted operations due to red flag coastal warning.",
      severity: "DIRECT",
      actionRequired: "Cancel booking and initiate ₹2,400 vendor refund."
    },
    {
      id: "cascade-2",
      type: "TRANSPORT",
      name: "Private Car Transfer to South Goa (65 km)",
      vendor: "Goa Express Cabs",
      impactDescription: "Sedan route to Mobor Jetty unnecessary; driver can be re-routed to avoid South Goa traffic.",
      severity: "DOWNSTREAM",
      actionRequired: "Update pickup location and transit destination."
    },
    {
      id: "cascade-3",
      type: "GUIDE",
      name: "Water Safety & Mangrove Naturalist Guide",
      vendor: "Sal Backwater Kayak Guides",
      impactDescription: "Certified water guide Rahul Naik released from active afternoon duty.",
      severity: "RESOURCE",
      actionRequired: "De-allocate resource; stand-by notice issued."
    },
    {
      id: "cascade-4",
      type: "RESTAURANT",
      name: "Riverside Lunch Reservation at Sal Oasis",
      vendor: "Sal Oasis Restobar",
      impactDescription: "Pre-reserved 13:00 riverside table can be shifted closer to the new activity location.",
      severity: "DOWNSTREAM",
      actionRequired: "Reschedule or shift dining voucher."
    },
    {
      id: "cascade-5",
      type: "FINANCIAL",
      name: "Activity Fee Refund Ledger",
      vendor: "Platform Escrow",
      impactDescription: "₹2,400 escrow credit unlocked for instant alternative reallocation.",
      severity: "FINANCIAL",
      actionRequired: "Apply automated credit to new booking or traveler wallet."
    }
  ],
  proposals: [
    {
      id: "prop-cooking-masterclass",
      title: "Authentic Goan Cooking Masterclass & Spice Tasting",
      category: "Culinary & Culture",
      vendorName: "Goa Culinary Heritage Guild, Fontainhas",
      description: "3-hour indoor hands-on masterclass preparing Goan prawn/fish curry, vegetable caldin, and fresh traditional Poi bread with a master chef. Completely weatherproof and highly rated.",
      timeSlot: "14:00 - 17:00 (Day 2)",
      costDelta: 600, // Net +₹600
      refundFromCancelled: 2400,
      newActivityCost: 3000,
      preferenceMatchScore: 95,
      travelDeltaMinutes: 10,
      scheduleImpact: "Seamlessly fits the 14:00 - 17:00 afternoon window. Shortens the evening return drive to Candolim by 35 minutes.",
      weatherRisk: "NONE",
      approvalRequired: "TRAVELER",
      isRecommended: true,
      tradeoffs: {
        pros: [
          "100% Weatherproof (indoor heritage kitchen)",
          "Matches 'local food' & 'culture' preference at 95%",
          "Saves 35 minutes return travel time back to resort",
          "Includes chef-guided feast (no separate dinner needed)"
        ],
        cons: [
          "Small net cost addition (+₹600 total / ₹300 per person)"
        ],
        operationalFeasibility: "Pre-confirmed instant availability for 2 travelers with Chef Maria.",
        weatherProofRating: "Grade A (100% Indoor facility)"
      }
    },
    {
      id: "prop-reschedule-kayak",
      title: "Reschedule Kayaking to Day 3 Morning & Swap Spice Walk",
      category: "Water Sports Reschedule",
      vendorName: "Goa Water Sports & Sahakari Spice Farm",
      description: "Swap Day 2 afternoon Kayaking to Day 3 morning 09:30 AM when coastal tides are calm, shifting the Spice Plantation tour to Day 2 afternoon.",
      timeSlot: "Day 3 Morning (09:30 - 12:00)",
      costDelta: 0,
      refundFromCancelled: 2400,
      newActivityCost: 2400,
      preferenceMatchScore: 92,
      travelDeltaMinutes: 45,
      scheduleImpact: "Major route re-sequencing for driver. Day 3 evening sunset timing becomes tighter.",
      weatherRisk: "MEDIUM",
      approvalRequired: "BOTH",
      isRecommended: false,
      tradeoffs: {
        pros: [
          "Exact ₹0 cost delta (no budget change)",
          "Preserves the original kayaking activity"
        ],
        cons: [
          "Adds 45 minutes extra driving across Central and South Goa",
          "Requires Operator review and driver shift approval",
          "Day 3 morning weather still carries moderate tidal risk"
        ],
        operationalFeasibility: "Requires operator dispatch approval and vendor time-slot swap.",
        weatherProofRating: "Grade C (Still weather-dependent)"
      }
    },
    {
      id: "prop-portuguese-museum",
      title: "Old Goa Portuguese Museum & Art Gallery + High Tea",
      category: "Heritage & Relaxation",
      vendorName: "Archaeological Museum of Goa & Heritage Tea Room",
      description: "Air-conditioned walk through colonial portrait galleries, historic artifacts, followed by high tea at heritage cafe.",
      timeSlot: "14:30 - 17:00 (Day 2)",
      costDelta: -800, // Traveler saves ₹800!
      refundFromCancelled: 2400,
      newActivityCost: 1600,
      preferenceMatchScore: 88,
      travelDeltaMinutes: 0,
      scheduleImpact: "Located right next to morning Basilica tour. Zero additional travel required.",
      weatherRisk: "NONE",
      approvalRequired: "TRAVELER",
      isRecommended: false,
      tradeoffs: {
        pros: [
          "Traveler receives ₹800 credit refund",
          "Zero travel time after morning Old Goa walk",
          "Fully indoor and air-conditioned"
        ],
        cons: [
          "Contemplative pace; lower physical activity than kayaking"
        ],
        operationalFeasibility: "Open entry with pre-allocated fast-track passes.",
        weatherProofRating: "Grade A (100% Indoor)"
      }
    },
    {
      id: "prop-resort-leisure",
      title: "Santana Resort Private Beach Cabanas & Full Refund",
      category: "Leisure & Spa",
      vendorName: "Santana Beach Resort Boutique",
      description: "Return early to the resort for private pool cabanas, tropical mocktails, beachside reading, and full cash refund for the cancelled activity.",
      timeSlot: "14:00 - 18:00 (Day 2)",
      costDelta: -2400, // Full ₹2,400 refund
      refundFromCancelled: 2400,
      newActivityCost: 0,
      preferenceMatchScore: 80,
      travelDeltaMinutes: -50,
      scheduleImpact: "Free, unhurried afternoon at traveler's own pace.",
      weatherRisk: "LOW",
      approvalRequired: "TRAVELER",
      isRecommended: false,
      tradeoffs: {
        pros: [
          "Full ₹2,400 refund credited directly to traveler",
          "Relaxed, slow vacation afternoon with no time pressure",
          "Saves 50 minutes of afternoon road transit"
        ],
        cons: [
          "No structured adventure or culinary experience"
        ],
        operationalFeasibility: "Immediate access via existing resort room key.",
        weatherProofRating: "Grade B (Covered poolside cabanas)"
      }
    }
  ]
};
