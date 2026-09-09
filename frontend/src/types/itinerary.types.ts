export type ItineraryItemType = 'HOTEL' | 'ACTIVITY' | 'TRANSPORT' | 'MEAL' | 'LEISURE';
export type ItineraryItemStatus = 'CONFIRMED' | 'SCHEDULED' | 'DISRUPTED' | 'REPLACED' | 'CANCELLED';

export interface ItineraryItem {
  id: string;
  dayNumber: number;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
  category: ItineraryItemType;
  vendorName: string;
  vendorType: string;
  location: string;
  coordinates: { lat: number; lng: number };
  cost: number;
  supplierCost: number;
  status: ItineraryItemStatus;
  weatherDependent: boolean;
  requiresGuide: boolean;
  dependencies?: string[];
  disruptionNote?: string;
  tags?: string[];
}

export interface DayPlan {
  dayNumber: number;
  date: string;
  theme: string;
  items: ItineraryItem[];
  dayRunningCost: number;
}

export interface PriceBreakdown {
  hotel: number;
  transport: number;
  activities: number;
  guides: number;
  meals: number;
  taxes: number;
  platformCharges: number;
  discounts: number;
  total: number;
}

export interface MarginBreakdown {
  customerPrice: number;
  supplierCost: number;
  operationalCharges: number;
  discounts: number;
  refunds: number;
  margin: number;
  marginPercentage: number;
}

export interface ItineraryPlanSummary {
  id: string;
  title: string;
  tier: 'BUDGET' | 'COMFORT' | 'PREMIUM';
  tagline: string;
  budgetCachedLimit: number;
  estimatedPrice: number;
  perPersonPrice: number;
  preferenceMatchScore: number;
  hotelCategory: string;
  transportType: string;
  highlights: string[];
  feasibilityVerified: boolean;
  isRecommended?: boolean;
}

export interface VersionChangeLogEntry {
  version: string;
  timestamp: string;
  authorRole: 'TRAVELER' | 'OPERATOR' | 'SYSTEM';
  changeReason: string;
  appliedAlternativeTitle: string;
  costDelta: number;
  notes: string;
}

export interface Itinerary {
  id: string;
  version: string;
  title: string;
  destination: string;
  durationDays: number;
  travelersCount: number;
  budgetCap: number;
  days: DayPlan[];
  pricing: PriceBreakdown;
  margins: MarginBreakdown;
  status: 'ACTIVE' | 'DISRUPTED' | 'ADAPTED' | 'COMPLETED';
  changeLog: VersionChangeLogEntry[];
}
