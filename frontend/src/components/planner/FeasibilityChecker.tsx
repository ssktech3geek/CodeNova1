import React from 'react';
import { CheckCircle2, Building, Compass, Car, Users, Zap } from 'lucide-react';
import { FeasibilityStatus } from '../../types/profile.types';

interface FeasibilityCheckerProps {
  status: FeasibilityStatus | null;
  isLoading: boolean;
}

export const FeasibilityChecker: React.FC<FeasibilityCheckerProps> = ({
  status,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-primary-light/40 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-2xl p-6 text-center animate-pulse">
        <div className="inline-flex p-3 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-bright mb-3">
          <Zap className="w-6 h-6 animate-spin" />
        </div>
        <h4 className="font-extrabold text-content-primary dark:text-dark-text text-sm mb-1">
          Feasibility Constraint Engine Running...
        </h4>
        <p className="text-xs text-content-secondary dark:text-dark-secondary max-w-md mx-auto">
          Querying Goa vendor network: verifying room availability at Santana Beach Resort, chauffeur sedan scheduling, backwater kayaking slots, and historian guides...
        </p>
      </div>
    );
  }

  if (!status) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-50/80 via-teal-50/40 to-surface dark:from-[#132221] dark:via-[#162121] dark:to-[#1A2226] rounded-2xl border border-emerald-200/80 dark:border-emerald-500/30 p-5 shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-100 dark:border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-content-primary dark:text-dark-text text-sm sm:text-base">
                Feasibility Verified Across Goa Vendor Network
              </h3>
              <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Score: {status.feasibilityScore}%
              </span>
            </div>
            <p className="text-xs text-content-secondary dark:text-dark-secondary mt-0.5">
              All hard operational constraints (routes, hotel check-ins, licensed guides, time buffers) satisfied.
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md">
            Zero Operational Conflicts
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
        <div className="bg-white/80 dark:bg-[#151D21] rounded-xl p-3 border border-gray-200/60 dark:border-white/5 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-primary dark:text-primary-bright">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-content-secondary dark:text-dark-secondary block">Hotels Verified</span>
            <span className="text-sm font-bold text-content-primary dark:text-dark-text">{status.hotelsAvailable} Available</span>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-[#151D21] rounded-xl p-3 border border-gray-200/60 dark:border-white/5 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-content-secondary dark:text-dark-secondary block">Activities Open</span>
            <span className="text-sm font-bold text-content-primary dark:text-dark-text">{status.experiencesAvailable} Curated</span>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-[#151D21] rounded-xl p-3 border border-gray-200/60 dark:border-white/5 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-content-secondary dark:text-dark-secondary block">Transport Fleets</span>
            <span className="text-sm font-bold text-content-primary dark:text-dark-text">{status.transportsAvailable} Fleets</span>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-[#151D21] rounded-xl p-3 border border-gray-200/60 dark:border-white/5 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-content-secondary dark:text-dark-secondary block">Licensed Guides</span>
            <span className="text-sm font-bold text-content-primary dark:text-dark-text">{status.guidesAvailable} On Standby</span>
          </div>
        </div>
      </div>
    </div>
  );
};
