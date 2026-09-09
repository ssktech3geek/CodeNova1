import React, { useState } from 'react';
import { Sparkles, ArrowRight, Wand2, Compass } from 'lucide-react';

interface NaturalLanguageInputProps {
  onExtract: (prompt: string) => void;
  isLoading: boolean;
}

const SAMPLE_PROMPT =
  "Plan a relaxed four-day Goa trip for two people under ₹45,000 with beaches, local food, light adventure, a boutique hotel, private transport, and no nightlife.";

export const NaturalLanguageInput: React.FC<NaturalLanguageInputProps> = ({
  onExtract,
  isLoading,
}) => {
  const [prompt, setPrompt] = useState(SAMPLE_PROMPT);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onExtract(prompt);
  };

  return (
    <div className="bg-surface dark:bg-[#1A2226] rounded-2xl shadow-card hover:shadow-card-hover border border-gray-200/80 dark:border-white/10 p-6 md:p-8 transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary-light dark:bg-primary/20 text-primary dark:text-primary-bright">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-content-primary dark:text-dark-text">
              Natural Language Intent Parser
            </h2>
            <p className="text-xs text-content-secondary dark:text-dark-secondary">
              Describe your journey in plain English — our constraint engine resolves operational feasibility.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setPrompt(SAMPLE_PROMPT)}
          className="self-start sm:self-auto text-xs font-semibold text-primary dark:text-primary-bright bg-primary-light dark:bg-primary/20 hover:bg-primary/15 px-3 py-1.5 rounded-lg border border-primary/20 dark:border-primary/30 flex items-center gap-1.5 transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Load Hackathon Prompt</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Plan a 4-day trip to Goa for 2 travelers under ₹45,000 with private car, boutique hotel, seafood, light adventure, and no nightlife..."
            className="w-full rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#13191D] text-content-primary dark:text-dark-text focus:border-primary dark:focus:border-primary-bright focus:ring-2 focus:ring-primary/20 p-4 text-sm placeholder:text-content-tertiary dark:placeholder:text-gray-500 shadow-inner transition-all resize-none leading-relaxed focus-visible:outline-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 text-xs text-content-secondary dark:text-dark-secondary">
            <Compass className="w-4 h-4 text-primary dark:text-primary-bright shrink-0" />
            <span className="text-[11px] sm:text-xs">
              Resolves: Budget Cap, Transport Mode, Hotel Category, Pace & Exclusions
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="px-6 py-3 bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Checking Feasibility across Vendors...</span>
              </>
            ) : (
              <>
                <span>Extract Preferences & Verify Feasibility</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
