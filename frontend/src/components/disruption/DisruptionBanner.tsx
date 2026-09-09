import React from 'react';
import { AlertTriangle, Sparkles, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useItinerary } from '../../contexts/ItineraryContext';

interface DisruptionBannerProps {
  onOpenEngine: () => void;
}

export const DisruptionBanner: React.FC<DisruptionBannerProps> = ({ onOpenEngine }) => {
  const {
    itinerary,
    triggerDisruption,
    isSimulatingDisruption,
    isBannerVisible,
  } = useItinerary();

  const isAdapted = itinerary?.status === 'ADAPTED';
  const isDisrupted = itinerary?.status === 'DISRUPTED';

  // If already adapted to v2.0, show resolution success badge
  if (isAdapted) {
    return (
      <div className="bg-emerald-50 dark:bg-[#11221D] border border-emerald-300 dark:border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors duration-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm sm:text-base text-emerald-900 dark:text-emerald-300">
                Itinerary Synchronized to v2.0 (Weather Adapted)
              </h4>
              <span className="bg-emerald-200 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                Resolved
              </span>
            </div>
            <p className="text-xs text-emerald-800 dark:text-emerald-400 mt-0.5">
              Day 2 Kayaking replaced with Cooking Masterclass (+₹600 net). Pricing reconciled to ₹35,928. All 4 stakeholders notified.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenEngine}
          className="w-full sm:w-auto text-xs font-bold text-emerald-800 dark:text-emerald-200 hover:text-emerald-950 bg-white dark:bg-[#182C26] px-3.5 py-2 rounded-xl border border-emerald-200 dark:border-emerald-500/30 shadow-xs hover:shadow transition-all shrink-0 cursor-pointer active:scale-98 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none text-center"
        >
          View Adaptation Audit & Proposals
        </button>
      </div>
    );
  }

  // Active Disruption Alert
  if (isDisrupted && isBannerVisible) {
    return (
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100 dark:from-[#26170E] dark:via-[#2A190F] dark:to-[#22150D] border-2 border-disruption rounded-2xl p-4 sm:p-5 shadow-glow-disruption disruption-pulse">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-disruption text-white shrink-0 mt-0.5">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-disruption text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  ⚠️ Live Disruption Triggered
                </span>
                <span className="text-xs font-bold text-orange-950 dark:text-orange-300">
                  Day 2 · Sal Backwaters
                </span>
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-orange-950 dark:text-orange-200 mt-1">
                Sal Backwater Kayaking Cancelled due to High Tide Warning
              </h4>
              <p className="text-xs text-orange-900 dark:text-orange-300/90 mt-0.5 max-w-2xl">
                Vendor <em>Goa Water Sports & Expeditions</em> cancelled slot. Cascade analysis identified <strong>5 affected items</strong> (pickup sedan, naturalist guide, riverside lunch table, ₹2,400 escrow refund).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-stretch sm:self-auto">
            <button
              onClick={onOpenEngine}
              className="w-full sm:w-auto px-5 py-2.5 bg-disruption hover:bg-orange-700 text-white text-xs font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 focus-visible:ring-2 focus-visible:ring-disruption focus-visible:outline-none"
            >
              <span>Resolve in Dynamic Adaptation Engine</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Simulation Trigger Banner
  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-surface dark:from-[#1C1A16] dark:via-[#1E1C18] dark:to-[#1A2226] rounded-2xl border border-amber-300 dark:border-amber-500/30 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors duration-200">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-sm sm:text-base text-content-primary dark:text-dark-text">
              Dynamic Adaptation Engine (Hack Celestial Differentiator)
            </h4>
            <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
              Interactive Test
            </span>
          </div>
          <p className="text-xs text-content-secondary dark:text-dark-secondary mt-0.5">
            Demonstrate real-time replanning: simulate a sudden weather squall cancelling Day 2 kayaking and watch the platform orchestrate feasible alternatives with cost, schedule & preference trade-offs.
          </p>
        </div>
      </div>

      <button
        onClick={triggerDisruption}
        disabled={isSimulatingDisruption}
        className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-disruption to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shrink-0 active:scale-98 focus-visible:ring-2 focus-visible:ring-disruption focus-visible:outline-none"
      >
        {isSimulatingDisruption ? (
          <>
            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Simulating Weather Alert...</span>
          </>
        ) : (
          <>
            <span>⚠️ Simulate: Kayaking Cancelled (Weather)</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          </>
        )}
      </button>
    </div>
  );
};
