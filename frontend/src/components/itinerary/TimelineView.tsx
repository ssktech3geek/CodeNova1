import React, { useState } from 'react';
import { DayPlan } from '../../types/itinerary.types';
import { ItineraryItemCard } from './ItineraryItemCard';

interface TimelineViewProps {
  days: DayPlan[];
  activeDisruptedId?: string;
  onOpenDisruptionModal: () => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  days,
  activeDisruptedId,
  onOpenDisruptionModal,
}) => {
  const [selectedDay, setSelectedDay] = useState<number | 'ALL'>('ALL');

  const filteredDays = selectedDay === 'ALL' ? days : days.filter((d) => d.dayNumber === selectedDay);

  return (
    <div className="space-y-6">
      {/* Day Selector Tabs - Horizontally scrollable on mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setSelectedDay('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer ${
            selectedDay === 'ALL'
              ? 'bg-primary dark:bg-primary-bright text-white dark:text-slate-900 shadow-xs'
              : 'bg-surface dark:bg-[#1A2226] text-content-secondary dark:text-dark-secondary hover:bg-gray-100 dark:hover:bg-[#232D33] border border-gray-200 dark:border-white/10'
          }`}
        >
          All 4 Days
        </button>

        {days.map((d) => {
          const hasDisruption = d.items.some((i) => i.status === 'DISRUPTED');
          const isSelected = selectedDay === d.dayNumber;

          return (
            <button
              key={d.dayNumber}
              onClick={() => setSelectedDay(d.dayNumber)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 active:scale-95 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer ${
                isSelected
                  ? 'bg-primary dark:bg-primary-bright text-white dark:text-slate-900 shadow-xs'
                  : hasDisruption
                  ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border border-orange-300 dark:border-orange-800 font-extrabold animate-pulse'
                  : 'bg-surface dark:bg-[#1A2226] text-content-secondary dark:text-dark-secondary hover:bg-gray-100 dark:hover:bg-[#232D33] border border-gray-200 dark:border-white/10'
              }`}
            >
              <span>Day {d.dayNumber}</span>
              {hasDisruption && (
                <span className="w-2 h-2 rounded-full bg-disruption" />
              )}
            </button>
          );
        })}
      </div>

      {/* Day-by-Day Timeline Lists */}
      <div className="space-y-8">
        {filteredDays.map((day) => (
          <div key={day.dayNumber} className="space-y-4">
            {/* Day Header Banner with Running Total */}
            <div className="flex items-center justify-between bg-surface-muted/90 dark:bg-[#151D21] px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary dark:bg-primary-bright text-white dark:text-slate-900 flex items-center justify-center font-bold text-xs shrink-0">
                  {day.dayNumber}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-content-primary dark:text-dark-text">
                    {day.date}
                  </h4>
                  <p className="text-[11px] text-content-secondary dark:text-dark-secondary font-medium">
                    {day.theme}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-content-secondary dark:text-dark-secondary block uppercase tracking-wider">
                  Day Tally
                </span>
                <span className="text-xs font-bold text-content-primary dark:text-dark-text">
                  ₹{day.dayRunningCost.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Timeline Items with Connecting Line */}
            <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200 dark:before:bg-white/10">
              {day.items.map((item) => (
                <div key={item.id} className="relative">
                  {/* Timeline Dot Indicator */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-5 w-3 h-3 rounded-full border-2 border-white dark:border-[#0F1417] ${
                      item.status === 'DISRUPTED'
                        ? 'bg-disruption ring-4 ring-orange-200 dark:ring-orange-950 animate-ping'
                        : item.id.includes('replaced')
                        ? 'bg-emerald-600 ring-2 ring-emerald-200 dark:ring-emerald-950'
                        : 'bg-primary dark:bg-primary-bright'
                    }`}
                  />

                  <ItineraryItemCard
                    item={item}
                    isDisruptedItem={item.status === 'DISRUPTED'}
                    onSimulateClick={onOpenDisruptionModal}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
