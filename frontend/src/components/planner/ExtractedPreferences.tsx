import React from 'react';
import { MapPin, Calendar, Users, IndianRupee, Bed, Car, Utensils, Gauge, Ban, Sparkles, ArrowRight } from 'lucide-react';
import { TravelerPreferences } from '../../types/profile.types';
import { Badge } from '../common/Badge';

interface ExtractedPreferencesProps {
  preferences: TravelerPreferences;
  onProceed: () => void;
  onUpdate?: (updated: TravelerPreferences) => void;
}

export const ExtractedPreferences: React.FC<ExtractedPreferencesProps> = ({
  preferences,
  onProceed,
}) => {
  return (
    <div className="bg-surface dark:bg-[#1A2226] rounded-2xl shadow-card hover:shadow-card-hover border border-gray-200/80 dark:border-white/10 p-6 md:p-8 space-y-6 transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-white/10">
        <div>
          <h3 className="text-base font-extrabold text-content-primary dark:text-dark-text flex items-center gap-2">
            <span>Structured Travel Constraints</span>
            <Badge variant="primary" size="sm">
              <Sparkles className="w-3 h-3" />
              AI Extracted
            </Badge>
          </h3>
          <p className="text-xs text-content-secondary dark:text-dark-secondary mt-0.5">
            Parameters normalized from your natural language description into hard & soft constraints.
          </p>
        </div>

        <button
          onClick={onProceed}
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          <span>Compare Itinerary Options</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Destination & Duration */}
        <div className="bg-surface-muted/60 dark:bg-[#151D21] p-3.5 rounded-xl border border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-2 text-content-secondary dark:text-dark-secondary text-xs mb-1">
            <MapPin className="w-3.5 h-3.5 text-primary dark:text-primary-bright" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">Destination</span>
          </div>
          <div className="text-sm font-bold text-content-primary dark:text-dark-text">
            {preferences.destination}
          </div>
          <div className="text-xs text-content-secondary dark:text-dark-secondary mt-0.5 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-content-tertiary dark:text-gray-500" />
            <span>{preferences.durationDays} Days / 3 Nights</span>
          </div>
        </div>

        {/* Travelers & Budget */}
        <div className="bg-surface-muted/60 dark:bg-[#151D21] p-3.5 rounded-xl border border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-2 text-content-secondary dark:text-dark-secondary text-xs mb-1">
            <IndianRupee className="w-3.5 h-3.5 text-primary dark:text-primary-bright" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">Budget Cap</span>
          </div>
          <div className="text-sm font-bold text-content-primary dark:text-dark-text">
            ₹{preferences.budgetLimit.toLocaleString('en-IN')} max
          </div>
          <div className="text-xs text-content-secondary dark:text-dark-secondary mt-0.5 flex items-center gap-1">
            <Users className="w-3 h-3 text-content-tertiary dark:text-gray-500" />
            <span>{preferences.travelersCount} Adult Travelers</span>
          </div>
        </div>

        {/* Accommodation & Transport */}
        <div className="bg-surface-muted/60 dark:bg-[#151D21] p-3.5 rounded-xl border border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-2 text-content-secondary dark:text-dark-secondary text-xs mb-1">
            <Bed className="w-3.5 h-3.5 text-primary dark:text-primary-bright" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">Stay & Transit</span>
          </div>
          <div className="text-sm font-bold text-content-primary dark:text-dark-text">
            {preferences.accommodationPreference === 'BOUTIQUE' ? 'Boutique Beach Resort' : preferences.accommodationPreference}
          </div>
          <div className="text-xs text-content-secondary dark:text-dark-secondary mt-0.5 flex items-center gap-1">
            <Car className="w-3 h-3 text-content-tertiary dark:text-gray-500" />
            <span>Private Dedicated Sedan</span>
          </div>
        </div>

        {/* Pace & Exclusions */}
        <div className="bg-surface-muted/60 dark:bg-[#151D21] p-3.5 rounded-xl border border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-2 text-content-secondary dark:text-dark-secondary text-xs mb-1">
            <Gauge className="w-3.5 h-3.5 text-primary dark:text-primary-bright" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">Pace & Exclusions</span>
          </div>
          <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
            {preferences.pace} Pace
          </div>
          <div className="text-xs text-rose-600 dark:text-rose-400 mt-0.5 flex items-center gap-1">
            <Ban className="w-3 h-3 text-rose-500" />
            <span>{preferences.exclusions.join(', ')}</span>
          </div>
        </div>
      </div>

      {/* Interests & Food Chips */}
      <div className="pt-2">
        <span className="text-[11px] font-semibold text-content-secondary dark:text-dark-secondary uppercase tracking-wider block mb-2">
          Experience Priorities & Food Preferences:
        </span>
        <div className="flex flex-wrap gap-2">
          {preferences.interests.map((interest, idx) => (
            <span
              key={idx}
              className="bg-primary-light dark:bg-primary/15 text-primary dark:text-primary-bright text-xs font-semibold px-3 py-1 rounded-lg border border-primary/20 dark:border-primary/30"
            >
              ✓ {interest}
            </span>
          ))}
          <span className="bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-semibold px-3 py-1 rounded-lg border border-amber-200 dark:border-amber-800/60 flex items-center gap-1">
            <Utensils className="w-3 h-3" />
            {preferences.foodPreference}
          </span>
        </div>
      </div>
    </div>
  );
};
