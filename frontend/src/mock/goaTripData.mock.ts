// MOCK — replace with API call to /api/v1/itineraries/:id
import { Itinerary } from '../types/itinerary.types';

export const initialGoaItinerary: Itinerary = {
  id: "itin-goa-2026-4d",
  version: "v1.0 (Original Confirmed)",
  title: "Relaxed 4-Day Goa Coastal & Cultural Escape",
  destination: "Goa, India",
  durationDays: 4,
  travelersCount: 2,
  budgetCap: 45000,
  status: "ACTIVE",
  changeLog: [
    {
      version: "v1.0",
      timestamp: "2026-09-05T09:00:00Z",
      authorRole: "SYSTEM",
      changeReason: "Initial Itinerary Feasibility Lock & Vendor Confirmations",
      appliedAlternativeTitle: "Original Feasible Itinerary",
      costDelta: 0,
      notes: "4 vendors confirmed: Santana Beach Resort, Goa Express Cabs, Goa Water Sports, Sahakari Spice Farm."
    }
  ],
  pricing: {
    hotel: 9000,          // 3 nights @ ₹3,000 (Santana Beach Resort Boutique)
    transport: 10800,     // 4 days private sedan + airport transfers
    activities: 4600,     // Kayaking (₹2,400) + Spice Walk (₹1,400) + Heritage Entry (₹800)
    guides: 3200,         // Certified Heritage & Backwater Kayak Guides
    meals: 6500,          // Curated tastings & pre-reserved dining
    taxes: 1705,          // GST 5% on travel components
    platformCharges: 1023,// 3% concierge platform fee
    discounts: 1500,      // Early bird & package bundle discount
    total: 35328,         // Exactly ₹35,328 (under ₹45,000 budget cap)
  },
  margins: {
    customerPrice: 35328,
    supplierCost: 27420,
    operationalCharges: 0,
    discounts: 1500,
    refunds: 0,
    margin: 7908,
    marginPercentage: 22.4,
  },
  days: [
    {
      dayNumber: 1,
      date: "Day 1 · Arrival & Sunset Relaxation",
      theme: "Coastal Welcome & Candolim Sunset",
      dayRunningCost: 13000,
      items: [
        {
          id: "item-d1-1",
          dayNumber: 1,
          startTime: "10:00",
          endTime: "11:30",
          title: "Private Airport Pickup (Sedan Dzire/Etios)",
          description: "Chauffeured pickup from Dabolim Airport with welcome coconut water and private transit to hotel.",
          category: "TRANSPORT",
          vendorName: "Goa Express Cabs",
          vendorType: "Chauffeur Transport",
          location: "Dabolim Airport → Candolim",
          coordinates: { lat: 15.3808, lng: 73.8313 },
          cost: 2500,
          supplierCost: 2000,
          status: "CONFIRMED",
          weatherDependent: false,
          requiresGuide: false,
          tags: ["Private Transport", "AC Sedan"]
        },
        {
          id: "item-d1-2",
          dayNumber: 1,
          startTime: "12:00",
          endTime: "13:30",
          title: "Check-in at Santana Beach Resort Boutique",
          description: "Premium Garden View Suite, beachfront access, complimentary welcome beverage and resort briefing.",
          category: "HOTEL",
          vendorName: "Goa Palms & Santana Resorts Ltd",
          vendorType: "Boutique Resort",
          location: "Candolim Beach Road, North Goa",
          coordinates: { lat: 15.5186, lng: 73.7667 },
          cost: 9000,
          supplierCost: 7350,
          status: "CONFIRMED",
          weatherDependent: false,
          requiresGuide: false,
          tags: ["Boutique Hotel", "Breakfast Included", "Pool Access"]
        },
        {
          id: "item-d1-3",
          dayNumber: 1,
          startTime: "16:30",
          endTime: "18:30",
          title: "Candolim Beach Sunset Stroll & Leisure",
          description: "Gentle sunset beach walk along the golden sands of Candolim with relaxing coastal breeze.",
          category: "LEISURE",
          vendorName: "Self-Guided Experience",
          vendorType: "Beach Activity",
          location: "Candolim Shoreline",
          coordinates: { lat: 15.5144, lng: 73.7632 },
          cost: 0,
          supplierCost: 0,
          status: "CONFIRMED",
          weatherDependent: true,
          requiresGuide: false,
          tags: ["Relaxation", "Scenic Sunset"]
        },
        {
          id: "item-d1-4",
          dayNumber: 1,
          startTime: "19:30",
          endTime: "21:30",
          title: "Coastal Seafood Dinner at Fisherman's Wharf",
          description: "Curated Goan-Portuguese coastal dining featuring Kingfish Peri-Peri and authentic Poi bread.",
          category: "MEAL",
          vendorName: "The Fisherman's Wharf Candolim",
          vendorType: "Fine Casual Dining",
          location: "Candolim Beach Road",
          coordinates: { lat: 15.5211, lng: 73.7689 },
          cost: 1500,
          supplierCost: 1200,
          status: "CONFIRMED",
          weatherDependent: false,
          requiresGuide: false,
          tags: ["Authentic Cuisine", "Pre-reserved Table"]
        }
      ]
    },
    {
      dayNumber: 2,
      date: "Day 2 · Heritage & Backwater Adventure",
      theme: "Old Goa Heritage & Mangrove Kayaking",
      dayRunningCost: 20400,
      items: [
        {
          id: "item-d2-1",
          dayNumber: 2,
          startTime: "09:00",
          endTime: "11:30",
          title: "Old Goa Portuguese Heritage Basilica Walk",
          description: "Guided architectural walk through Basilica of Bom Jesus and Sé Cathedral with certified heritage historian.",
          category: "ACTIVITY",
          vendorName: "Goa Heritage Circle Guides",
          vendorType: "Licensed Guide Bureau",
          location: "Old Goa Historic Quarter",
          coordinates: { lat: 15.5009, lng: 73.9116 },
          cost: 1600,
          supplierCost: 1200,
          status: "CONFIRMED",
          weatherDependent: false,
          requiresGuide: true,
          dependencies: ["item-d2-2"],
          tags: ["Heritage", "Culture", "Certified Guide"]
        },
        {
          id: "item-d2-2",
          dayNumber: 2,
          startTime: "12:00",
          endTime: "13:30",
          title: "Chauffeured Transfer & Riverside Lunch at Sal Oasis",
          description: "Comfort sedan transit to Sal river basin followed by traditional Konkan Thali pre-reserved dining.",
          category: "TRANSPORT",
          vendorName: "Goa Express Cabs & Sal Oasis Restobar",
          vendorType: "Transport & Dining",
          location: "Sal Backwaters Jetty, South Goa",
          coordinates: { lat: 15.1611, lng: 73.9512 },
          cost: 1800,
          supplierCost: 1400,
          status: "CONFIRMED",
          weatherDependent: false,
          requiresGuide: false,
          dependencies: ["item-d2-3"],
          tags: ["Transport Pickup", "Lunch Reservation"]
        },
        {
          id: "item-d2-3",
          dayNumber: 2,
          startTime: "14:30",
          endTime: "17:00",
          title: "Sal Backwater Kayaking Tour",
          description: "Guided 2.5-hour mangrove kayaking tour through serene backwater channels with certified water safety guide.",
          category: "ACTIVITY",
          vendorName: "Goa Water Sports & Expeditions",
          vendorType: "Water Sports Vendor",
          location: "Sal River Backwaters, Mobor",
          coordinates: { lat: 15.1583, lng: 73.9489 },
          cost: 2400, // 2 persons @ ₹1,200
          supplierCost: 1900,
          status: "SCHEDULED",
          weatherDependent: true,
          requiresGuide: true,
          dependencies: ["item-d2-2", "item-d2-4"],
          disruptionNote: undefined,
          tags: ["Water Sports", "Light Adventure", "Nature"]
        },
        {
          id: "item-d2-4",
          dayNumber: 2,
          startTime: "17:30",
          endTime: "19:00",
          title: "Scenic Coastal Drive back to Candolim",
          description: "Dedicated private sedan return trip along the palm-fringed coast of South to North Goa.",
          category: "TRANSPORT",
          vendorName: "Goa Express Cabs",
          vendorType: "Chauffeur Transport",
          location: "Mobor → Candolim",
          coordinates: { lat: 15.3500, lng: 73.8500 },
          cost: 0,
          supplierCost: 0,
          status: "CONFIRMED",
          weatherDependent: false,
          requiresGuide: false,
          tags: ["Chauffeured Transfer"]
        }
      ]
    },
    {
      dayNumber: 3,
      date: "Day 3 · Spice Plantations & Cliff Sunset",
      theme: "Tropical Spices & Vagator Sunset Vibe",
      dayRunningCost: 28900,
      items: [
        {
          id: "item-d3-1",
          dayNumber: 3,
          startTime: "09:30",
          endTime: "13:30",
          title: "Sahakari Spice Plantation Guided Walk & Traditional Buffet",
          description: "Tour of organic spice farm with vanilla, cardamom and pepper groves, herbal welcome tea and banana leaf buffet lunch.",
          category: "ACTIVITY",
          vendorName: "Sahakari Spice Plantation",
          vendorType: "Farm & Heritage Experience",
          location: "Ponda, Central Goa",
          coordinates: { lat: 15.4055, lng: 74.0201 },
          cost: 2600,
          supplierCost: 2000,
          status: "CONFIRMED",
          weatherDependent: false,
          requiresGuide: true,
          tags: ["Eco Tourism", "Buffet Lunch Included", "Cultural"]
        },
        {
          id: "item-d3-2",
          dayNumber: 3,
          startTime: "15:00",
          endTime: "17:00",
          title: "Fontainhas Latin Quarter Stroll & Heritage Bakeries",
          description: "Explore pastel Portuguese colonial villas, art galleries, and historic 31st January Bakery in Panaji.",
          category: "LEISURE",
          vendorName: "Panaji Heritage Walk",
          vendorType: "Cultural Trail",
          location: "Fontainhas, Panaji",
          coordinates: { lat: 15.4989, lng: 73.8322 },
          cost: 600,
          supplierCost: 400,
          status: "CONFIRMED",
          weatherDependent: false,
          requiresGuide: false,
          tags: ["Architecture", "Pastry Tasting"]
        },
        {
          id: "item-d3-3",
          dayNumber: 3,
          startTime: "18:00",
          endTime: "21:00",
          title: "Thalassa Sunset Cliff Lounge & Mediterranean Dinner",
          description: "Iconic clifftop open-air sunset views overlooking Vagator beach with relaxed acoustic lounge music.",
          category: "MEAL",
          vendorName: "Thalassa Clifftop Lounge",
          vendorType: "Premium Lounge & Restaurant",
          location: "Vagator Cliffs, North Goa",
          coordinates: { lat: 15.6022, lng: 73.7344 },
          cost: 2000,
          supplierCost: 1500,
          status: "CONFIRMED",
          weatherDependent: true,
          requiresGuide: false,
          tags: ["Sunset View", "Mediterranean Dining"]
        }
      ]
    },
    {
      dayNumber: 4,
      date: "Day 4 · Leisure, Souvenirs & Departure",
      theme: "Boutique Leisure & Safe Departure",
      dayRunningCost: 35328,
      items: [
        {
          id: "item-d4-1",
          dayNumber: 4,
          startTime: "09:00",
          endTime: "11:30",
          title: "Santana Resort Poolside Breakfast & Leisure Check-out",
          description: "Late check-out arrangement, poolside relaxation, tropical breakfast spread and luggage storage.",
          category: "HOTEL",
          vendorName: "Goa Palms & Santana Resorts Ltd",
          vendorType: "Boutique Resort",
          location: "Candolim Beach Road",
          coordinates: { lat: 15.5186, lng: 73.7667 },
          cost: 0,
          supplierCost: 0,
          status: "CONFIRMED",
          weatherDependent: false,
          requiresGuide: false,
          tags: ["Resort Leisure", "Late Checkout"]
        },
        {
          id: "item-d4-2",
          dayNumber: 4,
          startTime: "12:00",
          endTime: "13:30",
          title: "Local Cashew, Spice & Feni Souvenir Tasting",
          description: "Curated stop at government-authorized Goan handicrafts and cashew co-operative market.",
          category: "LEISURE",
          vendorName: "Goan Craft Co-op",
          vendorType: "Artisan Co-op",
          location: "Panaji Market",
          coordinates: { lat: 15.4967, lng: 73.8278 },
          cost: 0,
          supplierCost: 0,
          status: "CONFIRMED",
          weatherDependent: false,
          requiresGuide: false,
          tags: ["Souvenirs", "Handicrafts"]
        },
        {
          id: "item-d4-3",
          dayNumber: 4,
          startTime: "14:00",
          endTime: "15:30",
          title: "Private Airport Departure Transfer (AC Sedan)",
          description: "Seamless drop-off to Dabolim International Airport with driver luggage assistance.",
          category: "TRANSPORT",
          vendorName: "Goa Express Cabs",
          vendorType: "Chauffeur Transport",
          location: "Panaji → Dabolim Airport",
          coordinates: { lat: 15.3808, lng: 73.8313 },
          cost: 0, // covered in bundled private sedan transport
          supplierCost: 0,
          status: "CONFIRMED",
          weatherDependent: false,
          requiresGuide: false,
          tags: ["Airport Transfer", "On-Time Guarantee"]
        }
      ]
    }
  ]
};
