import React, { useEffect, useState } from 'react';
import { ItineraryPlanCard } from '../components/comparison/ItineraryPlanCard';
import { useItinerary } from '../contexts/ItineraryContext';
import { itineraryService } from '../services/itinerary.service';
import { ItineraryPlanSummary } from '../types/itinerary.types';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

interface ItineraryComparisonPageProps {
  onNavigateBack: () => void;
  onSelectPlan: (plan: ItineraryPlanSummary) => void;
}

export const ItineraryComparisonPage: React.FC<ItineraryComparisonPageProps> = ({
  onNavigateBack,
  onSelectPlan,
}) => {
  const { preferences, setSelectedPlan } = useItinerary();
  const [plans, setPlans] = useState<ItineraryPlanSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const options = await itineraryService.getOptions(preferences || undefined);
        setPlans(options);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [preferences]);

  const handleSelect = (plan: ItineraryPlanSummary) => {
    setSelectedPlan(plan);
    onSelectPlan(plan);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onNavigateBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-content-secondary dark:text-dark-secondary hover:text-primary dark:hover:text-primary-bright mb-2 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Trip Preferences</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-content-primary dark:text-dark-text tracking-tight">
            Compare Generated Itinerary Configurations
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary dark:text-dark-secondary mt-1">
            3 distinct operational tiers generated for your 4-day Goa journey. Verified for vendor capacity & price stability.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-surface dark:bg-[#1A2226] px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shadow-xs self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Feasibility Guarantee Active</span>
        </div>
      </div>

      {/* 3 Side-by-Side Plans - Stacks vertically on mobile */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 bg-gray-200/70 dark:bg-[#1A2226] rounded-2xl border border-gray-100 dark:border-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((plan) => (
            <ItineraryPlanCard
              key={plan.id}
              plan={plan}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};
