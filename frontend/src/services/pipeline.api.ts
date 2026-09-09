export interface Activity {
  id: string;
  name: string;
  tag: string;
  cost: number;
  duration_min: number;
  intensity: number;
  open_min: number;
  close_min: number;
  available: boolean;
}

export interface PipelineResult {
  recommendations: Array<{ id: string; name: string; score: number }>;
  itinerary: Array<{ id: string; name: string; cost: number; suitability_score: number; start_min: number; end_min: number }>;
  model: string;
  optimizer: string;
}

const activities: Activity[] = [
  { id: 'ACT_01', name: 'Alpine Peak Hike', tag: 'hiking', cost: 45, duration_min: 240, intensity: 4, open_min: 480, close_min: 1020, available: true },
  { id: 'ACT_02', name: '5-Star Roof Dining', tag: 'dining', cost: 220, duration_min: 120, intensity: 1, open_min: 1080, close_min: 1380, available: true },
  { id: 'ACT_03', name: 'National Museum Tour', tag: 'museum', cost: 25, duration_min: 180, intensity: 1, open_min: 540, close_min: 1020, available: true },
  { id: 'ACT_04', name: 'Wildlife Safari Trek', tag: 'wildlife', cost: 110, duration_min: 300, intensity: 3, open_min: 480, close_min: 960, available: true },
  { id: 'ACT_05', name: 'City Theme Park Pass', tag: 'family', cost: 85, duration_min: 360, intensity: 3, open_min: 600, close_min: 1200, available: true },
  { id: 'ACT_06', name: 'Historic Art Gallery', tag: 'art', cost: 30, duration_min: 90, intensity: 1, open_min: 540, close_min: 1020, available: true },
  { id: 'ACT_08', name: 'Thermal Spa Day Pass', tag: 'spa', cost: 180, duration_min: 180, intensity: 1, open_min: 540, close_min: 1260, available: true },
];

export const demoActivities = activities;
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/+$/, '');

async function loadActivities(token: string): Promise<Activity[]> {
  const response = await fetch(`${API_BASE_URL}/ml/activities`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Catalog request failed (${response.status})`);
  const payload = await response.json();
  return payload.data.activities;
}

export async function optimizeTrip(input: {
  token: string;
  budget: number;
  interests: string[];
  pace: string;
  adventureLevel: number;
  travelersCount: number;
  excludedActivityIds?: string[];
  lockedActivityIds?: string[];
}): Promise<PipelineResult> {
  let candidateActivities = activities;
  try {
    const catalogActivities = await loadActivities(input.token);
    if (catalogActivities.length > 0) candidateActivities = catalogActivities;
  } catch {
    // Keep the demo catalog available when the database is not running locally.
  }

  const response = await fetch(`${API_BASE_URL}/ml/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${input.token}` },
    body: JSON.stringify({
      traveler: { budget: input.budget, interests: input.interests, pace: input.pace, adventure_level: input.adventureLevel, travelers_count: input.travelersCount },
      activities: candidateActivities.filter((activity) => !input.excludedActivityIds?.includes(activity.id)),
      max_budget: input.budget,
      travel_time_gap: 30,
      locked_activity_ids: input.lockedActivityIds || [],
      excluded_activity_ids: input.excludedActivityIds || [],
    }),
  });
  if (!response.ok) throw new Error(`Planner request failed (${response.status})`);
  const payload = await response.json();
  return payload.data;
}
