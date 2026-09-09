import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles, Layers, ArrowRight, Zap } from 'lucide-react';
import { DisruptionEvent } from '../../types/disruption.types';
import { useItinerary } from '../../contexts/ItineraryContext';
import { useNotifications } from '../../contexts/NotificationContext';

interface ImpactCascadeModalProps {
  isOpen: boolean;
  onClose: () => void;
  disruption: DisruptionEvent | null;
}

export const ImpactCascadeModal: React.FC<ImpactCascadeModalProps> = ({
  isOpen,
  onClose,
  disruption,
}) => {
  const { itinerary, acceptProposal, isApplyingAlternative } = useItinerary();
  const { refreshNotifications } = useNotifications();
  const [selectedProposalId, setSelectedProposalId] = useState<string>('prop-cooking-masterclass');
  const [showTradeoffsFor, setShowTradeoffsFor] = useState<string | null>(null);
  const [isSimulatingAnalysis, setIsSimulatingAnalysis] = useState<boolean>(true);

  // Brief initial loading moment when opening the modal for authentic hackathon feel
  useEffect(() => {
    if (isOpen) {
      setIsSimulatingAnalysis(true);
      const timer = setTimeout(() => {
        setIsSimulatingAnalysis(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen || !disruption) return null;

  const handleApply = async (proposalId: string) => {
    await acceptProposal(proposalId);
    await refreshNotifications();
    onClose();
  };

  const activeProposal = disruption.proposals.find(p => p.id === selectedProposalId) || disruption.proposals[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-5xl bg-surface dark:bg-[#1A2226] rounded-3xl shadow-modal border border-gray-200 dark:border-white/10 overflow-hidden my-4 sm:my-8 transition-colors duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-orange-600 via-disruption to-amber-600 text-white p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Dynamic Adaptation Engine
                </span>
                <span className="text-white/80 text-xs font-semibold">
                  Source: {disruption.triggerSource}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Disruption Impact Cascade & Replanning Engine
              </h2>
              <p className="text-xs sm:text-sm text-white/90 max-w-2xl leading-relaxed">
                {disruption.reason}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isSimulatingAnalysis ? (
          <div className="p-12 text-center space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-disruption/10 text-disruption animate-spin">
              <Zap className="w-8 h-8" />
            </div>
            <h4 className="font-extrabold text-content-primary dark:text-dark-text text-base">
              Executing Dependency Graph Traversal...
            </h4>
            <p className="text-xs text-content-secondary dark:text-dark-secondary">
              Resolving affected downstream pickups, guide allocation, and ranking trade-off alternatives...
            </p>
          </div>
        ) : (
          <div className="p-5 sm:p-8 space-y-8 max-h-[75vh] overflow-y-auto">
            {/* Section 1: 5-Node Domino Cascade Impact Analysis */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <h3 className="text-xs sm:text-sm font-extrabold text-content-primary dark:text-dark-text uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-disruption" />
                  <span>1. Multi-Vendor Impact Cascade (Domino Traversal)</span>
                </h3>
                <span className="text-xs font-bold text-disruption bg-orange-50 dark:bg-orange-950/60 px-2.5 py-1 rounded-md border border-orange-200 dark:border-orange-800 self-start sm:self-auto">
                  5 Operational Nodes Affected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                {disruption.cascadeItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="bg-surface-muted dark:bg-[#141B1F] p-3.5 rounded-xl border border-gray-200 dark:border-white/5 flex flex-col justify-between space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          item.severity === 'DIRECT'
                            ? 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300'
                            : item.severity === 'FINANCIAL'
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                            : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                        }`}
                      >
                        {item.severity}
                      </span>
                      <span className="text-[10px] font-bold text-content-secondary dark:text-dark-secondary">#{idx + 1}</span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-content-primary dark:text-dark-text leading-snug">
                        {item.name}
                      </h4>
                      <span className="text-[10px] text-content-secondary dark:text-dark-secondary block mt-0.5">
                        {item.vendor}
                      </span>
                    </div>

                    <div className="text-[10px] text-content-secondary dark:text-dark-secondary pt-1 border-t border-gray-100 dark:border-white/5">
                      <span className="font-semibold text-content-primary dark:text-dark-text">Action: </span>
                      {item.actionRequired}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: 4 Ranked Alternative Proposals */}
            <div>
              <div className="mb-3">
                <h3 className="text-xs sm:text-sm font-extrabold text-content-primary dark:text-dark-text uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary dark:text-primary-bright" />
                  <span>2. Feasible Alternative Replacement Options</span>
                </h3>
                <p className="text-xs text-content-secondary dark:text-dark-secondary">
                  Evaluated against cost delta, preference match, weather risk, travel time, and required approval role.
                </p>
              </div>

              {/* Stack vertically on mobile, 2 cols on md+ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {disruption.proposals.map((prop) => {
                  const isSelected = selectedProposalId === prop.id;

                  return (
                    <div
                      key={prop.id}
                      onClick={() => setSelectedProposalId(prop.id)}
                      className={`rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between space-y-4 hover:-translate-y-0.5 ${
                        isSelected
                          ? 'border-2 border-primary dark:border-primary-bright bg-primary-light/20 dark:bg-primary/10 shadow-md ring-2 ring-primary/10 dark:ring-primary/20'
                          : 'border-gray-200 dark:border-white/10 bg-surface dark:bg-[#151D21] hover:border-gray-300 dark:hover:border-white/20 shadow-xs'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-primary dark:border-primary-bright bg-primary dark:bg-primary-bright text-white dark:text-slate-900' : 'border-gray-300 dark:border-gray-600'
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </span>
                            <h4 className="text-sm font-bold text-content-primary dark:text-dark-text">
                              {prop.title}
                            </h4>
                          </div>

                          {prop.isRecommended && (
                            <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shrink-0">
                              Recommended
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-content-secondary dark:text-dark-secondary leading-relaxed pl-6">
                          {prop.description}
                        </p>

                        {/* Metrics Badges */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                          <div className="bg-white dark:bg-[#1A2226] p-2 rounded-lg border border-gray-100 dark:border-white/5">
                            <span className="text-[10px] text-content-secondary dark:text-dark-secondary block">Net Cost</span>
                            <span
                              className={`font-bold ${
                                prop.costDelta > 0
                                  ? 'text-amber-800 dark:text-amber-400'
                                  : prop.costDelta < 0
                                  ? 'text-emerald-700 dark:text-emerald-400'
                                  : 'text-content-primary dark:text-dark-text'
                              }`}
                            >
                              {prop.costDelta > 0 ? `+₹${prop.costDelta}` : prop.costDelta < 0 ? `-₹${Math.abs(prop.costDelta)}` : '₹0 delta'}
                            </span>
                          </div>

                          <div className="bg-white dark:bg-[#1A2226] p-2 rounded-lg border border-gray-100 dark:border-white/5">
                            <span className="text-[10px] text-content-secondary dark:text-dark-secondary block">Match Score</span>
                            <span className="font-bold text-emerald-700 dark:text-emerald-400">
                              {prop.preferenceMatchScore}% Match
                            </span>
                          </div>

                          <div className="bg-white dark:bg-[#1A2226] p-2 rounded-lg border border-gray-100 dark:border-white/5">
                            <span className="text-[10px] text-content-secondary dark:text-dark-secondary block">Weather Risk</span>
                            <span className="font-bold text-content-primary dark:text-dark-text">
                              {prop.weatherRisk === 'NONE' ? 'Zero (Indoor)' : prop.weatherRisk}
                            </span>
                          </div>

                          <div className="bg-white dark:bg-[#1A2226] p-2 rounded-lg border border-gray-100 dark:border-white/5">
                            <span className="text-[10px] text-content-secondary dark:text-dark-secondary block">Approval</span>
                            <span className="font-bold text-teal-800 dark:text-teal-300">
                              {prop.approvalRequired}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Tradeoffs Toggle */}
                      <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowTradeoffsFor(showTradeoffsFor === prop.id ? null : prop.id);
                          }}
                          className="text-xs font-semibold text-primary dark:text-primary-bright hover:underline cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded"
                        >
                          {showTradeoffsFor === prop.id ? 'Hide Trade-off Details' : 'View Trade-off Explainer ▾'}
                        </button>

                        <span className="text-[11px] text-content-secondary dark:text-dark-secondary">
                          {prop.timeSlot}
                        </span>
                      </div>

                      {/* Expanded Tradeoffs Details */}
                      {showTradeoffsFor === prop.id && (
                        <div className="bg-white dark:bg-[#11171A] p-3.5 rounded-xl border border-gray-200 dark:border-white/10 text-xs space-y-2 animate-fade-in">
                          <div>
                            <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">Pros:</span>
                            <ul className="list-disc pl-4 space-y-0.5 text-content-secondary dark:text-dark-secondary">
                              {prop.tradeoffs.pros.map((p, i) => (
                                <li key={i}>{p}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="font-bold text-amber-800 dark:text-amber-400 block mb-1">Trade-offs:</span>
                            <ul className="list-disc pl-4 space-y-0.5 text-content-secondary dark:text-dark-secondary">
                              {prop.tradeoffs.cons.map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="text-[11px] text-content-secondary dark:text-dark-secondary pt-1 border-t border-gray-100 dark:border-white/5">
                            <strong>Operational check:</strong> {prop.tradeoffs.operationalFeasibility}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="bg-surface-muted dark:bg-[#141B1F] p-4 sm:p-6 border-t border-gray-200 dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-xs text-content-secondary dark:text-dark-secondary">
            <span className="font-bold text-content-primary dark:text-dark-text block sm:inline mr-2">
              Selected: {activeProposal.title}
            </span>
            <span>
              New Itinerary Total: <strong>₹{(itinerary ? itinerary.pricing.total + activeProposal.costDelta : 35928).toLocaleString('en-IN')}</strong> (Reconciled from ₹35,328)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 text-xs font-semibold text-content-secondary dark:text-dark-secondary hover:text-content-primary dark:hover:text-dark-text bg-white dark:bg-[#1F292E] border border-gray-300 dark:border-white/10 rounded-xl transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              Cancel
            </button>

            <button
              onClick={() => handleApply(selectedProposalId)}
              disabled={isApplyingAlternative}
              className="w-1/2 sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary-hover dark:bg-primary-bright dark:hover:bg-teal-400 text-white dark:text-slate-900 text-xs font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              {isApplyingAlternative ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Publishing v2.0...</span>
                </>
              ) : (
                <>
                  <span>Approve & Apply to v2.0</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
