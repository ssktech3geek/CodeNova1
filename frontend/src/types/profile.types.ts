export type AccommodationPreference = 'BUDGET' | 'BOUTIQUE' | 'LUXURY' | 'RESORT';
export type TransportPreference = 'PRIVATE_CAR' | 'SHARED_SHUTTLE' | 'RENTAL_SCOOTER' | 'PUBLIC';
export type TripPace = 'RELAXED' | 'MODERATE' | 'FAST_PACED';

export interface TravelerPreferences {
  destination: string;
  startDate: string;
  durationDays: number;
  travelersCount: number;
  budgetLimit: number;
  interests: string[];
  accommodationPreference: AccommodationPreference;
  transportPreference: TransportPreference;
  foodPreference: string;
  pace: TripPace;
  exclusions: string[];
  originalPrompt?: string;
}

export interface FeasibilityStatus {
  hotelsAvailable: number;
  experiencesAvailable: number;
  transportsAvailable: number;
  guidesAvailable: number;
  isFeasible: boolean;
  feasibilityScore: number; // 0 - 100
}
