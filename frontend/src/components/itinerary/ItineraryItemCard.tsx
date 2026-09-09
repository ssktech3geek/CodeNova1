import React from 'react';
import { Clock, MapPin, Building, AlertTriangle, CheckCircle, Car, Utensils, Compass, Bed, Sparkles } from 'lucide-react';
import { ItineraryItem } from '../../types/itinerary.types';
import { Badge } from '../common/Badge';

interface ItineraryItemCardProps {
  item: ItineraryItem;
  isDisruptedItem?: boolean;
  onSimulateClick?: () => void;
}

export const ItineraryItemCard: React.FC<ItineraryItemCardProps> = ({
  item,
  isDisruptedItem,
  onSimulateClick,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'HOTEL':
        return <Bed className="w-4 h-4" />;
      case 'TRANSPORT':
        return <Car className="w-4 h-4" />;
      case 'MEAL':
        return <Utensils className="w-4 h-4" />;
      case 'ACTIVITY':
        return <Compass className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const isCancelled = item.status === 'DISRUPTED';
  const isReplaced = item.id.includes('replaced');

  return (
    <div
      className={`relative rounded-xl transition-all duration-200 p-4 sm:p-5 border ${
        isCancelled
          ? 'bg-orange-50/80 dark:bg-[#26180F] border-disruption shadow-glow-disruption disruption-pulse'
          : isReplaced
          ? 'bg-emerald-50/70 dark:bg-[#12231E] border-emerald-300 dark:border-emerald-500/40 shadow-xs'
          : 'bg-surface dark:bg-[#1A2226] border-gray-200/80 dark:border-white/10 shadow-xs hover:shadow-card hover:-translate-y-0.5'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        {/* Left: Time & Icon & Details */}
        <div className="flex items-start gap-3.5">
          {/* Time & Category Icon Column */}
          <div className="flex flex-col items-center shrink-0">
            <div
              className={`p-2.5 rounded-xl flex items-center justify-center ${
                isCancelled
                  ? 'bg-disruption text-white'
                  : isReplaced
                  ? 'bg-emerald-600 text-white'
                  : 'bg-primary-light dark:bg-primary/20 text-primary dark:text-primary-bright'
              }`}
            >
              {isCancelled ? <AlertTriangle className="w-4 h-4" /> : getCategoryIcon(item.category)}
            </div>
            <span className="text-[11px] font-bold text-content-secondary dark:text-dark-secondary mt-1 flex items-center gap-0.5">
              <Clock className="w-3 h-3 text-content-tertiary dark:text-gray-500" />
              {item.startTime}
            </span>
          </div>

          {/* Main Item Content */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm sm:text-base font-bold text-content-primary dark:text-dark-text">
                {item.title}
              </h4>

              {isCancelled && (
                <span className="bg-disruption text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                  <AlertTriangle className="w-3 h-3" />
                  Disruption Event
                </span>
              )}

              {isReplaced && (
                <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  v2.0 Adapted Replacement
                </span>
              )}
            </div>

            <p className="text-xs text-content-secondary dark:text-dark-secondary leading-relaxed">
              {item.description}
            </p>

            {/* Vendor & Location Metadata */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-content-secondary dark:text-dark-secondary">
              <span className="flex items-center gap-1 font-medium text-content-primary dark:text-dark-text">
                <Building className="w-3 h-3 text-primary dark:text-primary-bright" />
                {item.vendorName}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-content-tertiary dark:text-gray-500" />
                {item.location}
              </span>
            </div>

            {/* Disruption Alert Note */}
            {item.disruptionNote && (
              <div
                className={`mt-2 p-2.5 rounded-lg text-xs font-medium flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
                  isCancelled
                    ? 'bg-orange-100 dark:bg-orange-950/70 text-orange-950 dark:text-orange-200 border border-orange-200 dark:border-orange-800'
                    : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                }`}
              >
                <span>{item.disruptionNote}</span>
                {isCancelled && onSimulateClick && (
                  <button
                    onClick={onSimulateClick}
                    className="shrink-0 bg-disruption hover:bg-orange-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-disruption focus-visible:outline-none"
                  >
                    View Cascade & Alternatives
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Cost & Status Badges */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-white/5">
          <div className="text-right">
            <span className="text-[10px] uppercase font-semibold text-content-secondary dark:text-dark-secondary block">Price</span>
            <span
              className={`text-sm sm:text-base font-extrabold ${
                isCancelled
                  ? 'text-disruption line-through'
                  : isReplaced
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-content-primary dark:text-dark-text'
              }`}
            >
              {item.cost === 0 ? 'Included' : `₹${item.cost.toLocaleString('en-IN')}`}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {isCancelled ? (
              <Badge variant="disruption" size="sm">
                Cancelled
              </Badge>
            ) : isReplaced ? (
              <Badge variant="success" size="sm">
                Confirmed (v2.0)
              </Badge>
            ) : (
              <Badge variant="neutral" size="sm">
                <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                Confirmed
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
