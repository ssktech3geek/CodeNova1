/**
 * @file ItineraryContext.tsx
 * @module frontend/src/contexts
 * @description Central Itinerary & Disruption State Provider
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Itinerary, ItineraryPlanSummary } from '../types/itinerary.types';
import { DisruptionEvent, NotificationItem } from '../types/disruption.types';
import { TravelerPreferences } from '../types/profile.types';
import { itineraryService } from '../services/itinerary.service';

interface ItineraryContextType {
  itinerary: Itinerary | null;
  isLoading: boolean;
  selectedPlan: ItineraryPlanSummary | null;
  preferences: TravelerPreferences | null;
  activeDisruption: DisruptionEvent | null;
  isSimulatingDisruption: boolean;
  isApplyingAlternative: boolean;
  setPreferences: (pref: TravelerPreferences) => void;
  setSelectedPlan: (plan: ItineraryPlanSummary) => void;
  loadItinerary: (id?: string) => Promise<void>;
  triggerDisruption: () => Promise<void>;
  acceptProposal: (proposalId: string) => Promise<void>;
  resetToOriginal: () => Promise<void>;
  dismissDisruptionBanner: () => void;
  isBannerVisible: boolean;
}

const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);

export const ItineraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPlan, setSelectedPlan] = useState<ItineraryPlanSummary | null>(null);
  const [preferences, setPreferences] = useState<TravelerPreferences | null>(null);
  const [activeDisruption, setActiveDisruption] = useState<DisruptionEvent | null>(null);
  const [isSimulatingDisruption, setIsSimulatingDisruption] = useState<boolean>(false);
  const [isApplyingAlternative, setIsApplyingAlternative] = useState<boolean>(false);
  const [isBannerVisible, setIsBannerVisible] = useState<boolean>(false);

  // Load initial itinerary with refresh persistence
  useEffect(() => {
    async function init() {
      try {
        setIsLoading(true);
        const data = await itineraryService.getItinerary();
        setItinerary(data);

        // If it was already adapted or disrupted in storage, restore state
        if (data.status === 'ADAPTED') {
          const disruptionData = await itineraryService.getDisruption(data.id);
          setActiveDisruption(disruptionData);
          setIsBannerVisible(false);
        }
      } catch (err) {
        console.error("Failed to load itinerary", err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const loadItinerary = async (id?: string) => {
    setIsLoading(true);
    try {
      const data = await itineraryService.getItinerary(id);
      setItinerary(data);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerDisruption = async () => {
    if (!itinerary) return;
    setIsSimulatingDisruption(true);
    try {
      const event = await itineraryService.simulateDisruption(itinerary.id);
      setActiveDisruption(event);
      setIsBannerVisible(true);

      // Mark the affected item in the itinerary as DISRUPTED
      setItinerary((prev) => {
        if (!prev) return null;
        const updatedDays = prev.days.map((day) => ({
          ...day,
          items: day.items.map((item) =>
            item.id === event.affectedItemId
              ? {
                  ...item,
                  status: 'DISRUPTED' as const,
                  disruptionNote: '⚠️ CANCELLED by vendor: Unsafe weather & high tide warning.',
                }
              : item
          ),
        }));
        return {
          ...prev,
          status: 'DISRUPTED',
          days: updatedDays,
        };
      });
    } finally {
      setIsSimulatingDisruption(false);
    }
  };

  const acceptProposal = async (proposalId: string) => {
    if (!itinerary) return;
    setIsApplyingAlternative(true);
    try {
      const { updatedItinerary } = await itineraryService.acceptProposal(itinerary, proposalId);
      setItinerary(updatedItinerary);
      setIsBannerVisible(false);
      if (activeDisruption) {
        setActiveDisruption({ ...activeDisruption, status: 'RESOLVED' });
      }
    } finally {
      setIsApplyingAlternative(false);
    }
  };

  const resetToOriginal = async () => {
    setIsLoading(true);
    try {
      const original = await itineraryService.resetItinerary();
      setItinerary(original);
      setActiveDisruption(null);
      setIsBannerVisible(false);
    } finally {
      setIsLoading(false);
    }
  };

  const dismissDisruptionBanner = () => {
    setIsBannerVisible(false);
  };

  return (
    <ItineraryContext.Provider
      value={{
        itinerary,
        isLoading,
        selectedPlan,
        preferences,
        activeDisruption,
        isSimulatingDisruption,
        isApplyingAlternative,
        setPreferences,
        setSelectedPlan,
        loadItinerary,
        triggerDisruption,
        acceptProposal,
        resetToOriginal,
        dismissDisruptionBanner,
        isBannerVisible,
      }}
    >
      {children}
    </ItineraryContext.Provider>
  );
};

export const useItinerary = () => {
  const context = useContext(ItineraryContext);
  if (!context) {
    throw new Error('useItinerary must be used within an ItineraryProvider');
  }
  return context;
};
