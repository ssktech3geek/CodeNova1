import React, { useState } from 'react';
import { useItinerary } from '../contexts/ItineraryContext';
import { TimelineView } from '../components/itinerary/TimelineView';
import { PricingBreakdownPanel } from '../components/pricing/PricingBreakdownPanel';
import { DisruptionBanner } from '../components/disruption/DisruptionBanner';
import { ImpactCascadeModal } from '../components/disruption/ImpactCascadeModal';
import { Badge } from '../components/common/Badge';
import { VersionChangeLogEntry } from '../types/itinerary.types';
import { MapPin, Calendar, Users, History, ArrowLeft, ShieldCheck, ChevronUp, ChevronDown, Receipt } from 'lucide-react';

interface ItineraryDetailPageProps {
  onBackToOptions: () => void;
  activeRole: 'TRAVELER' | 'OPERATOR';
}

export const ItineraryDetailPage: React.FC<ItineraryDetailPageProps> = ({
  onBackToOptions,
  activeRole,
}) => {
  const { itinerary, activeDisruption, isLoading } = useItinerary();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isMobilePricingOpen, setIsMobilePricingOpen] = useState<boolean>(false);

  if (isLoading || !itinerary) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-bold text-content-secondary dark:text-dark-secondary">Loading Itinerary Timeline & Engine...</p>
      </div>
    );
  }

  const isAdapted = itinerary.status === 'ADAPTED';
  const isDisrupted = itinerary.status === 'DISRUPTED';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-fade-in">
      {/* Top Header Card */}
      <div className="bg-surface dark:bg-[#1A2226] rounded-2xl shadow-card border border-gray-200/80 dark:border-white/10 p-6 md:p-8 space-y-4 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-white/10">
          <div>
            <button
              onClick={onBackToOptions}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-content-secondary dark:text-dark-secondary hover:text-primary dark:hover:text-primary-bright mb-2 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Plan Options</span>
            </button>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-content-primary dark:text-dark-text tracking-tight">
                {itinerary.title}
              </h1>
              <Badge
                variant={isAdapted ? 'accent' : isDisrupted ? 'disruption' : 'primary'}
                size="md"
              >
                {itinerary.version}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-left sm:text-right">
              <span className="text-[10px] sm:text-[11px] font-bold text-content-secondary dark:text-dark-secondary block uppercase tracking-wider">
                Current Package Price
              </span>
              <span className="text-2xl sm:text-3xl font-black text-content-primary dark:text-dark-text tracking-tight">
                ₹{itinerary.pricing.total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Metadata Chips Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-content-secondary dark:text-dark-secondary pt-1">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="flex items-center gap-1 font-semibold text-content-primary dark:text-dark-text">
              <MapPin className="w-3.5 h-3.5 text-primary dark:text-primary-bright" />
              {itinerary.destination}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-content-tertiary dark:text-gray-500" />
              {itinerary.durationDays} Days / 3 Nights
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-content-tertiary dark:text-gray-500" />
              {itinerary.travelersCount} Travelers
            </span>
            <span>•</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              Budget Cap: ₹{itinerary.budgetCap.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Feasibility Locked</span>
          </div>
        </div>
      </div>

      {/* Disruption Engine Simulation / Alert Banner */}
      <DisruptionBanner onOpenEngine={() => setIsModalOpen(true)} />

      {/* Main 2-Column Content Layout (Desktop: 8/4, Mobile: Stacked) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Timeline View */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface dark:bg-[#1A2226] rounded-2xl shadow-card border border-gray-200/80 dark:border-white/10 p-5 sm:p-6 transition-colors duration-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-extrabold text-content-primary dark:text-dark-text">
                Day-by-Day Journey Timeline
              </h2>
              <span className="text-xs text-content-secondary dark:text-dark-secondary font-medium hidden sm:inline">
                Click any item to view details
              </span>
            </div>

            <TimelineView
              days={itinerary.days}
              activeDisruptedId={activeDisruption?.affectedItemId}
              onOpenDisruptionModal={() => setIsModalOpen(true)}
            />
          </div>
        </div>

        {/* Right 4 Cols: Pricing Breakdown & Audit History */}
        <div className="lg:col-span-4 space-y-6">
          {/* Pricing Breakdown Panel */}
          <PricingBreakdownPanel
            pricing={itinerary.pricing}
            margins={itinerary.margins}
            budgetCap={itinerary.budgetCap}
            showOperatorView={activeRole === 'OPERATOR'}
          />

          {/* Itinerary Version Audit History */}
          <div className="bg-surface dark:bg-[#1A2226] rounded-2xl shadow-card border border-gray-200/80 dark:border-white/10 p-5 space-y-4 transition-colors duration-200">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/10">
              <History className="w-4 h-4 text-primary dark:text-primary-bright" />
              <h3 className="font-bold text-sm text-content-primary dark:text-dark-text">
                Version & Change Audit Log
              </h3>
            </div>

            <div className="space-y-3">
              {itinerary.changeLog.map((log: VersionChangeLogEntry, index: number) => (
                <div
                  key={index}
                  className="bg-surface-muted dark:bg-[#141B1F] p-3.5 rounded-xl border border-gray-100 dark:border-white/5 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-primary dark:text-primary-bright bg-primary-light dark:bg-primary/20 px-2 py-0.5 rounded text-[10px]">
                      {log.version}
                    </span>
                    <span className="text-[10px] text-content-tertiary dark:text-gray-500">
                      {log.authorRole} • {log.timestamp.slice(0, 10)}
                    </span>
                  </div>
                  <h4 className="font-bold text-content-primary dark:text-dark-text text-xs pt-1">
                    {log.changeReason}
                  </h4>
                  <p className="text-[11px] text-content-secondary dark:text-dark-secondary leading-relaxed">
                    {log.notes}
                  </p>
                  {log.costDelta !== 0 && (
                    <div className="text-[10px] font-bold text-amber-800 dark:text-amber-300 pt-1">
                      Cost Adjustment: ₹{log.costDelta > 0 ? '+' : ''}{log.costDelta}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Disruption Cascade & Adaptation Modal */}
      <ImpactCascadeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        disruption={activeDisruption}
      />
    </div>
  );
};
