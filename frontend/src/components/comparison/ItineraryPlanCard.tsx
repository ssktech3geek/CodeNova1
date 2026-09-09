import React from 'react';
import { Check, Star, ShieldCheck, Sparkles, Bed, Car, ArrowRight } from 'lucide-react';
import { ItineraryPlanSummary } from '../../types/itinerary.types';

interface ItineraryPlanCardProps {
  plan: ItineraryPlanSummary;
  onSelect: (plan: ItineraryPlanSummary) => void;
  isSelected?: boolean;
}

export const ItineraryPlanCard: React.FC<ItineraryPlanCardProps> = ({
  plan,
  onSelect,
}) => {
  const isRecommended = plan.isRecommended;

  return (
    <div
      className={`relative rounded-2xl transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 ${
        isRecommended
          ? 'bg-surface dark:bg-[#1A2226] border-2 border-primary dark:border-primary-bright shadow-lg ring-4 ring-primary/10 dark:ring-primary/20 hover:shadow-xl'
          : 'bg-surface dark:bg-[#1A2226] border border-gray-200 dark:border-white/10 shadow-card hover:shadow-card-hover'
      }`}
    >
      {/* Recommended Ribbon */}
      {isRecommended && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-teal-700 dark:from-primary dark:to-teal-600 text-white text-[11px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-full shadow-md flex items-center gap-1.5 z-10 whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Recommended Match</span>
        </div>
      )}

      <div className="p-6 md:p-7 space-y-5">
        {/* Header & Match Score */}
        <div className="flex items-start justify-between gap-3 pt-1">
          <div>
            <h3 className="text-xl font-extrabold text-content-primary dark:text-dark-text tracking-tight">
              {plan.title}
            </h3>
            <p className="text-xs text-content-secondary dark:text-dark-secondary mt-1 line-clamp-2">
              {plan.tagline}
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-extrabold text-xs px-2.5 py-1 rounded-lg">
              <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
              <span>{plan.preferenceMatchScore}% Match</span>
            </div>
          </div>
        </div>

        {/* Pricing Reconciliation Display */}
        <div className="bg-surface-muted/90 dark:bg-[#141B1F] rounded-xl p-4 border border-gray-100 dark:border-white/5">
          <div className="text-[11px] font-semibold text-content-secondary dark:text-dark-secondary uppercase tracking-wider mb-1">
            Budget Cap: ₹{plan.budgetCachedLimit.toLocaleString('en-IN')}
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <span className="text-2xl lg:text-3xl font-black text-content-primary dark:text-dark-text tracking-tight">
                ₹{plan.estimatedPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-content-secondary dark:text-dark-secondary font-medium ml-1.5">
                total (2 pax)
              </span>
            </div>
            <span className="text-xs font-semibold text-content-secondary dark:text-dark-secondary bg-white dark:bg-[#1E272C] px-2 py-0.5 rounded border border-gray-200 dark:border-white/10">
              ₹{plan.perPersonPrice.toLocaleString('en-IN')}/person
            </span>
          </div>

          {plan.budgetCachedLimit > plan.estimatedPrice ? (
            <div className="mt-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Saves ₹{(plan.budgetCachedLimit - plan.estimatedPrice).toLocaleString('en-IN')} under your budget</span>
            </div>
          ) : plan.estimatedPrice > plan.budgetCachedLimit ? (
            <div className="mt-2 text-xs font-semibold text-amber-700 dark:text-amber-400">
              +₹{(plan.estimatedPrice - plan.budgetCachedLimit).toLocaleString('en-IN')} above stated budget
            </div>
          ) : null}
        </div>

        {/* Stay & Transport Specs */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 text-content-secondary dark:text-dark-secondary">
            <Bed className="w-4 h-4 text-primary dark:text-primary-bright shrink-0" />
            <span className="font-medium text-content-primary dark:text-dark-text">{plan.hotelCategory}</span>
          </div>
          <div className="flex items-center gap-2 text-content-secondary dark:text-dark-secondary">
            <Car className="w-4 h-4 text-primary dark:text-primary-bright shrink-0" />
            <span className="font-medium text-content-primary dark:text-dark-text">{plan.transportType}</span>
          </div>
        </div>

        {/* Highlights List */}
        <div className="pt-2 border-t border-gray-100 dark:border-white/10">
          <span className="text-[10px] font-bold text-content-secondary dark:text-dark-secondary uppercase tracking-wider block mb-2">
            Plan Inclusions:
          </span>
          <ul className="space-y-2">
            {plan.highlights.map((h, i) => (
              <li key={i} className="text-xs text-content-primary dark:text-dark-text flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer & Select Action */}
      <div className="p-6 md:p-7 pt-0">
        <div className="flex items-center justify-between gap-2 mb-3 text-[11px] text-content-secondary dark:text-dark-secondary">
          <span className="flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Feasibility 100% Verified
          </span>
          <span>4 Days / 3 Nights</span>
        </div>

        <button
          onClick={() => onSelect(plan)}
          className={`w-full py-3 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
            isRecommended
              ? 'bg-primary hover:bg-primary-hover dark:bg-primary-bright dark:hover:bg-teal-400 text-white dark:text-slate-900 hover:shadow-md'
              : 'bg-content-primary hover:bg-black dark:bg-[#2A343A] dark:hover:bg-[#344047] text-white'
          }`}
        >
          <span>Select & Explore Day-wise Plan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
