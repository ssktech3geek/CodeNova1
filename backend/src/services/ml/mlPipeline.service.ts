import { serverConfig } from '../../config';

export class MLPipelineRequestError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'MLPipelineRequestError';
    this.statusCode = statusCode;
  }
}

export interface MLPipelineTraveler {
  budget: number;
  interests: string[];
  pace?: string;
  adventure_level?: number;
  travelers_count?: number;
}

export interface MLPipelineActivity {
  id: string;
  name: string;
  tag: string;
  cost: number;
  duration_min: number;
  intensity: number;
  open_min?: number;
  close_min?: number;
  available?: boolean;
}

export interface MLPipelineInteraction {
  user_id: string;
  activity_id: string;
  user_budget: number;
  interests: string[];
  pace?: string;
  adventure_level?: number;
  party_size?: number;
  act_tag: string;
  act_cost: number;
  act_duration_min: number;
  act_intensity: number;
  action: string;
}

export interface OptimizePipelineInput {
  traveler: MLPipelineTraveler;
  activities: MLPipelineActivity[];
  historical_interactions?: MLPipelineInteraction[];
  max_budget: number;
  travel_time_gap?: number;
  excluded_activity_ids?: string[];
  locked_activity_ids?: string[];
}

export interface OptimizePipelineResult {
  recommendations: Array<{ id: string; name: string; score: number }>;
  itinerary: Array<{
    id: string;
    name: string;
    cost: number;
    suitability_score: number;
    start_min: number;
    end_min: number;
  }>;
  model: string;
  optimizer: string;
}

function fallbackOptimize(input: OptimizePipelineInput): OptimizePipelineResult {
  const excluded = new Set(input.excluded_activity_ids || []);
  const locked = new Set(input.locked_activity_ids || []);
  const interests = new Set(input.traveler.interests.map((interest) => interest.toLowerCase()));
  const candidates = input.activities
    .filter((activity) => activity.available !== false && !excluded.has(activity.id))
    .map((activity) => {
      const tagMatch = interests.has(activity.tag.toLowerCase()) ? 0.45 : 0;
      const budgetFit = 0.25 / (1 + activity.cost / input.traveler.budget);
      const paceTarget = { SLOW: 1, RELAXED: 1, MODERATE: 3, BALANCED: 3, FAST: 5, INTENSE: 5 }[
        (input.traveler.pace || 'MODERATE').toUpperCase()
      ] || 3;
      const paceMatch = Math.abs(paceTarget - activity.intensity) <= 1 ? 0.15 : 0;
      const adventureMatch = Math.abs((input.traveler.adventure_level || 3) - activity.intensity) <= 1 ? 0.15 : 0;
      return {
        activity,
        score: tagMatch + budgetFit + paceMatch + adventureMatch,
      };
    })
    .sort((left, right) => {
      const lockedDifference = Number(locked.has(right.activity.id)) - Number(locked.has(left.activity.id));
      return lockedDifference || right.score - left.score;
    });

  const itinerary: OptimizePipelineResult['itinerary'] = [];
  let remainingBudget = input.max_budget;
  let cursor = 480;
  for (const candidate of candidates) {
    if (candidate.activity.cost > remainingBudget) continue;
    const start = Math.max(cursor, candidate.activity.open_min || 480);
    const end = start + candidate.activity.duration_min;
    if (end > (candidate.activity.close_min || 1440)) continue;
    itinerary.push({
      id: candidate.activity.id,
      name: candidate.activity.name,
      cost: candidate.activity.cost,
      suitability_score: Math.round(candidate.score * 10000) / 100,
      start_min: start,
      end_min: end,
    });
    remainingBudget -= candidate.activity.cost;
    cursor = end + (input.travel_time_gap || 30);
  }

  return {
    recommendations: candidates.map(({ activity, score }) => ({
      id: activity.id,
      name: activity.name,
      score: Math.round(score * 10000) / 100,
    })),
    itinerary,
    model: 'content_based_fallback',
    optimizer: 'typescript_fallback',
  };
}

export async function optimizePipeline(input: OptimizePipelineInput): Promise<OptimizePipelineResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), serverConfig.ml.timeoutMs);

  try {
    const response = await fetch(`${serverConfig.ml.baseUrl}/pipeline/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: controller.signal,
    });

    if (!response.ok) {
      if (response.status >= 400 && response.status < 500) {
        throw new MLPipelineRequestError(`ML service rejected the itinerary constraints (HTTP ${response.status}).`, response.status);
      }
      throw new Error(`ML service returned HTTP ${response.status}`);
    }
    return await response.json() as OptimizePipelineResult;
  } catch (error) {
    if (error instanceof MLPipelineRequestError) throw error;
    if (serverConfig.nodeEnv !== 'test') {
      console.warn('[ML] Pipeline unavailable; using deterministic fallback.', String(error));
    }
    return fallbackOptimize(input);
  } finally {
    clearTimeout(timeout);
  }
}