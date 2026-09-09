import React, { useState } from 'react';
import { Receipt, ShieldCheck, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { PriceBreakdown, MarginBreakdown } from '../../types/itinerary.types';

interface PricingBreakdownPanelProps {
  pricing: PriceBreakdown;
  margins: MarginBreakdown;
  budgetCap: number;
  showOperatorView?: boolean;
}

export const PricingBreakdownPanel: React.FC<PricingBreakdownPanelProps> = ({
  pricing,
  margins,
  budgetCap,
  showOperatorView = false,
}) => {
  const [activeTab, setActiveTab] = useState<'CUSTOMER' | 'OPERATOR'>(
    showOperatorView ? 'OPERATOR' : 'CUSTOMER'
  );

  return (
    <div className="bg-surface dark:bg-[#1A2226] rounded-2xl shadow-card border border-gray-200/80 dark:border-white/10 p-5 md:p-6 space-y-5 transition-colors duration-200">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary-light dark:bg-primary/20 text-primary dark:text-primary-bright">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-content-primary dark:text-dark-text">
              Pricing & Economics
            </h3>
            <span className="text-[11px] text-content-secondary dark:text-dark-secondary">
              Verified transparent line-item breakdown
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-gray-100 dark:bg-[#141A1E] p-0.5 rounded-lg text-xs self-start sm:self-auto border border-gray-200 dark:border-white/10">
          <button
            onClick={() => setActiveTab('CUSTOMER')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
              activeTab === 'CUSTOMER'
                ? 'bg-white dark:bg-[#253036] text-primary dark:text-primary-bright shadow-xs'
                : 'text-content-secondary dark:text-dark-secondary hover:text-content-primary dark:hover:text-dark-text'
            }`}
          >
            Customer Price
          </button>
          <button
            onClick={() => setActiveTab('OPERATOR')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
              activeTab === 'OPERATOR'
                ? 'bg-white dark:bg-[#253036] text-teal-800 dark:text-teal-300 shadow-xs'
                : 'text-content-secondary dark:text-dark-secondary hover:text-content-primary dark:hover:text-dark-text'
            }`}
          >
            Operator Margins
          </button>
        </div>
      </div>

      {/* Customer Price Breakdown Tab */}
      {activeTab === 'CUSTOMER' ? (
        <div className="space-y-4">
          {/* Main Total Highlight */}
          <div className="bg-surface-muted dark:bg-[#141B1F] p-4 rounded-xl border border-gray-100 dark:border-white/5 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold text-content-secondary dark:text-dark-secondary uppercase tracking-wider block">
                Total Package Price (2 Pax)
              </span>
              <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
                <span className="text-2xl sm:text-3xl font-black text-content-primary dark:text-dark-text tracking-tight">
                  ₹{pricing.total.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-content-secondary dark:text-dark-secondary font-medium">
                  (₹{(pricing.total / 2).toLocaleString('en-IN')}/person)
                </span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-content-secondary dark:text-dark-secondary block uppercase">Budget Limit</span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                ₹{budgetCap.toLocaleString('en-IN')} cap
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-1">
                ✓ Saves ₹{(budgetCap - pricing.total).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-gray-50 dark:border-white/5">
              <span className="text-content-secondary dark:text-dark-secondary">
                Hotel (3 Nights Boutique Resort)
              </span>
              <span className="font-bold text-content-primary dark:text-dark-text">
                ₹{pricing.hotel.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-gray-50 dark:border-white/5">
              <span className="text-content-secondary dark:text-dark-secondary">
                Transport (4 Days Private AC Sedan)
              </span>
              <span className="font-bold text-content-primary dark:text-dark-text">
                ₹{pricing.transport.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-gray-50 dark:border-white/5">
              <span className="text-content-secondary dark:text-dark-secondary">
                Curated Activities & Experiences
              </span>
              <span className="font-bold text-content-primary dark:text-dark-text">
                ₹{pricing.activities.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-gray-50 dark:border-white/5">
              <span className="text-content-secondary dark:text-dark-secondary">
                Certified Heritage & Safety Guides
              </span>
              <span className="font-bold text-content-primary dark:text-dark-text">
                ₹{pricing.guides.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-gray-50 dark:border-white/5">
              <span className="text-content-secondary dark:text-dark-secondary">
                Pre-reserved Meals & Tastings
              </span>
              <span className="font-bold text-content-primary dark:text-dark-text">
                ₹{pricing.meals.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-gray-50 dark:border-white/5">
              <span className="text-content-secondary dark:text-dark-secondary">
                Government Taxes (GST 5%)
              </span>
              <span className="font-semibold text-content-primary dark:text-dark-text">
                ₹{pricing.taxes.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-gray-50 dark:border-white/5">
              <span className="text-content-secondary dark:text-dark-secondary">
                Platform Concierge & Safety Fee (3%)
              </span>
              <span className="font-semibold text-content-primary dark:text-dark-text">
                ₹{pricing.platformCharges.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50/70 dark:bg-emerald-950/60 px-2 rounded">
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                Early Bird Bundle Discount
              </span>
              <span>-₹{pricing.discounts.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      ) : (
        /* Operator Margin Tab */
        <div className="space-y-4">
          <div className="bg-teal-900 dark:bg-[#122A2A] text-white p-4 rounded-xl shadow-xs space-y-3 border border-teal-800/40">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-teal-200">
                Gross Operator Margin
              </span>
              <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                Target Healthy ({margins.marginPercentage}%)
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black tracking-tight">
                ₹{margins.margin.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-teal-300">
                on ₹{margins.customerPrice.toLocaleString('en-IN')} gross
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-white/5">
              <span className="text-content-secondary dark:text-dark-secondary">Total Customer Revenue</span>
              <span className="font-bold text-content-primary dark:text-dark-text">
                ₹{margins.customerPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-white/5">
              <span className="text-content-secondary dark:text-dark-secondary">Supplier Base Cost</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">
                -₹{margins.supplierCost.toLocaleString('en-IN')}
              </span>
            </div>

            {margins.refunds > 0 && (
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-white/5 text-amber-700 dark:text-amber-400">
                <span className="font-medium">Escrow Reallocation / Refund</span>
                <span className="font-bold">₹{margins.refunds.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-white/5">
              <span className="text-content-secondary dark:text-dark-secondary">Promotional Discounts Borne</span>
              <span className="font-medium text-content-primary dark:text-dark-text">
                -₹{margins.discounts.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-[#141B1F] border border-gray-200 dark:border-white/5 flex items-center gap-2 text-[11px] text-content-secondary dark:text-dark-secondary mt-2">
              <ShieldCheck className="w-4 h-4 text-primary dark:text-primary-bright shrink-0" />
              <span>
                Automated constraint prevents proposals dropping operator margins below 15% without operator override.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
