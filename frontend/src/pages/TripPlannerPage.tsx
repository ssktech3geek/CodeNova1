import React, { useState } from 'react';
import { NaturalLanguageInput } from '../components/planner/NaturalLanguageInput';
import { FeasibilityChecker } from '../components/planner/FeasibilityChecker';
import { ExtractedPreferences } from '../components/planner/ExtractedPreferences';
import { useItinerary } from '../contexts/ItineraryContext';
import { itineraryService } from '../services/itinerary.service';
import { FeasibilityStatus } from '../types/profile.types';
import { optimizeTrip, type PipelineResult } from '../services/pipeline.api';

interface TripPlannerPageProps {
  onNavigateToOptions: () => void;
}

export const TripPlannerPage: React.FC<TripPlannerPageProps> = ({ onNavigateToOptions }) => {
  const { preferences, setPreferences } = useItinerary();
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [feasibility, setFeasibility] = useState<FeasibilityStatus | null>(null);
  const [pipelineResult, setPipelineResult] = useState<PipelineResult | null>(null);

  const handleExtract = async (prompt: string) => {
    setIsExtracting(true);
    try {
      const extracted = await itineraryService.extractPreferences(prompt);
      setPreferences(extracted);

      const feasStatus = await itineraryService.checkFeasibility(extracted);
      setFeasibility(feasStatus);

      const apiBase = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/+$/, '');
      const tokenResponse = await fetch(`${apiBase}/auth/dev-token`);
      if (!tokenResponse.ok) throw new Error('Unable to authenticate with the local backend.');
      const tokenPayload = await tokenResponse.json();
      const result = await optimizeTrip({
        token: tokenPayload.data.accessToken,
        budget: extracted.budgetLimit,
        interests: extracted.interests,
        pace: extracted.pace === 'FAST_PACED' ? 'FAST' : extracted.pace,
        adventureLevel: 3,
        travelersCount: extracted.travelersCount,
      });
      setPipelineResult(result);
    } catch (err) {
      console.error('Error extracting preferences', err);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Subtle Background Glow Mesh */}
      <div className="absolute top-0 inset-x-0 h-96 hero-glow-light dark:hero-glow-dark pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 animate-fade-in">
        {/* Hero Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-primary dark:text-primary-bright bg-primary-light dark:bg-primary/20 px-3 py-1 rounded-full border border-primary/20 dark:border-primary/30">
            Step 1 · Traveler Intent & Constraint Engine
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-content-primary dark:text-dark-text tracking-tight">
            Personalized Dynamic Tour Orchestration
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary dark:text-dark-secondary leading-relaxed max-w-2xl mx-auto">
            Describe your journey in natural language. Our platform extracts logistics, coordinates real-world vendor availability, and builds resilient itineraries that adapt when reality changes.
          </p>
        </div>

        {/* Natural Language Prompt Input */}
        <NaturalLanguageInput onExtract={handleExtract} isLoading={isExtracting} />

        {/* Feasibility Check Card */}
        {(isExtracting || feasibility) && (
          <FeasibilityChecker status={feasibility} isLoading={isExtracting} />
        )}

        {/* Extracted Structured Chips & Parameter Summary */}
        {preferences && (
          <ExtractedPreferences
            preferences={preferences}
            onProceed={onNavigateToOptions}
          />
        )}

        {pipelineResult && (
          <section className="rounded-2xl border border-primary/20 bg-primary-light/40 dark:bg-primary/10 p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-content-primary dark:text-dark-text">
                Live ML plan
              </h2>
              <span className="text-xs font-bold text-primary dark:text-primary-bright">
                {pipelineResult.model.replace(/_/g, ' ')} · {pipelineResult.optimizer.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {pipelineResult.itinerary.map((item) => (
                <div key={item.id} className="rounded-xl bg-white/70 dark:bg-black/20 p-3 text-xs">
                  <div className="font-bold text-content-primary dark:text-dark-text">{item.name}</div>
                  <div className="text-content-secondary dark:text-dark-secondary">
                    {item.start_min}–{item.end_min} · ₹{item.cost.toLocaleString('en-IN')} · {item.suitability_score}% fit
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
