// MOCK — replace with API call to /api/v1/itineraries/generate-options
import { ItineraryPlanSummary } from '../types/itinerary.types';

export const mockItineraryOptions: ItineraryPlanSummary[] = [
  {
    id: "plan-budget-explorer",
    tier: "BUDGET",
    title: "Budget Explorer",
    tagline: "Backpacker vibes, beach hops & two-wheeler coastal freedom",
    budgetCachedLimit: 45000,
    estimatedPrice: 26800,
    perPersonPrice: 13400,
    preferenceMatchScore: 78,
    hotelCategory: "Zostel Anjuna (Private Ensuite)",
    transportType: "Rental Scooters (Honda Activa 125cc)",
    highlights: [
      "Beachfront hostel community & private room",
      "Self-paced coastal scooter touring",
      "Authentic local street food & beach shacks",
      "Public museum & heritage church entry"
    ],
    feasibilityVerified: true,
    isRecommended: false,
  },
  {
    id: "plan-comfort-balance",
    tier: "COMFORT",
    title: "Comfort Balance",
    tagline: "Boutique beachfront resort, private sedan & curated local experiences",
    budgetCachedLimit: 45000,
    estimatedPrice: 35328,
    perPersonPrice: 17664,
    preferenceMatchScore: 96,
    hotelCategory: "Santana Beach Resort Boutique (Candolim)",
    transportType: "Dedicated Private Chauffeur Sedan (AC Dzire/Etios)",
    highlights: [
      "Boutique beachfront resort with pool & breakfast",
      "Dedicated AC private car & chauffeur all 4 days",
      "Sal backwater guided mangrove kayaking",
      "Organic spice plantation tour with traditional lunch",
      "Zero nightlife, strictly relaxed & scenic pace"
    ],
    feasibilityVerified: true,
    isRecommended: true,
  },
  {
    id: "plan-premium-relaxed",
    tier: "PREMIUM",
    title: "Premium Relaxed",
    tagline: "Luxury 5-star heritage resort, private yacht cruise & fine dining",
    budgetCachedLimit: 45000,
    estimatedPrice: 58000,
    perPersonPrice: 29000,
    preferenceMatchScore: 89,
    hotelCategory: "Taj Fort Aguada Resort & Spa (Sea View)",
    transportType: "Chauffeured Luxury SUV (Toyota Innova Crysta)",
    highlights: [
      "5-star cliffside heritage resort & private beach access",
      "Private catamaran sunset cruise with champagne",
      "Ayurvedic wellness massage & spa hydrotherapy",
      "Chef's curated Goan-Portuguese fine dining degustation"
    ],
    feasibilityVerified: true,
    isRecommended: false,
  }
];
