import { z } from 'zod';
import { aiConfig } from '../../config';
import { generateJson } from './llmClient.service';

const preferenceSchema = z.object({
  destination: z.string().nullable().default(null),
  duration_days: z.number().int().positive().nullable().default(null),
  travelers: z.number().int().positive().nullable().default(null),
  budget: z.number().positive().nullable().default(null),
  interests: z.array(z.string()).default([]),
  accommodation: z.string().nullable().default(null),
  transport: z.string().nullable().default(null),
  pace: z.enum(['relaxed', 'balanced', 'intense']).nullable().default(null),
  food_preferences: z.array(z.string()).default([]),
  accessibility_needs: z.array(z.string()).default([]),
  adventure_level: z.enum(['none', 'light', 'moderate', 'extreme']).nullable().default(null),
  nightlife: z.boolean().nullable().default(null),
  activities_to_avoid: z.array(z.string()).default([]),
  clarification_questions: z.array(z.string()).default([]),
});

export type TravelerPreference = z.infer<typeof preferenceSchema>;

const systemPrompt = `You are a travel preference extraction assistant. Analyze the user's natural language travel request and extract structured preferences.

Return ONLY a valid JSON object with these exact fields:
{
  "destination": string or null,
  "duration_days": number or null,
  "travelers": number or null,
  "budget": number or null,
  "interests": array of strings (e.g. ["beaches", "local food"]),
  "accommodation": string or null (e.g. "boutique", "luxury", "hostel"),
  "transport": string or null (e.g. "private car", "public transport"),
  "pace": "relaxed" | "balanced" | "intense" or null,
  "food_preferences": array of strings (ALWAYS an array, e.g. ["seafood", "vegetarian"]),
  "accessibility_needs": array of strings,
  "adventure_level": "none" | "light" | "moderate" | "extreme" or null,
  "nightlife": boolean or null,
  "activities_to_avoid": array of strings,
  "clarification_questions": array of strings for missing info
}

Important rules:
- Never invent prices, dates, or service names.
- Use null for missing scalar fields.
- All array fields must be arrays (never objects).
- Return ONLY the JSON object, no prose, no markdown.`;

export function validateExtractedPreferences(preferences: TravelerPreference): TravelerPreference {
  const questions = new Set(preferences.clarification_questions);
  if (!preferences.destination) questions.add('Where would you like to travel?');
  if (!preferences.duration_days) questions.add('How many days should the trip last?');
  if (!preferences.travelers) questions.add('How many travelers are going?');
  if (!preferences.budget) questions.add('What is your approximate trip budget?');
  return { ...preferences, clarification_questions: [...questions] };
}

/**
 * Normalize the LLM response, ensuring array fields are arrays and enums are valid.
 */
function normalize(raw: any): TravelerPreference {
  const toArray = (val: any): string[] => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') return [val];
    if (val && typeof val === 'object') {
      // Some models return objects like {0: "x", 1: "y"} — coerce to array
      return Object.values(val).filter(v => typeof v === 'string');
    }
    return [];
  };

  return {
    destination: typeof raw?.destination === 'string' ? raw.destination : null,
    duration_days: typeof raw?.duration_days === 'number' && raw.duration_days > 0 ? raw.duration_days : null,
    travelers: typeof raw?.travelers === 'number' && raw.travelers > 0 ? raw.travelers : null,
    budget: typeof raw?.budget === 'number' && raw.budget > 0 ? raw.budget : null,
    interests: toArray(raw?.interests),
    accommodation: typeof raw?.accommodation === 'string' ? raw.accommodation : null,
    transport: typeof raw?.transport === 'string' ? raw.transport : null,
    pace: ['relaxed', 'balanced', 'intense'].includes(raw?.pace) ? raw.pace : null,
    food_preferences: toArray(raw?.food_preferences),
    accessibility_needs: toArray(raw?.accessibility_needs),
    adventure_level: ['none', 'light', 'moderate', 'extreme'].includes(raw?.adventure_level) ? raw.adventure_level : null,
    nightlife: typeof raw?.nightlife === 'boolean' ? raw.nightlife : null,
    activities_to_avoid: toArray(raw?.activities_to_avoid),
    clarification_questions: toArray(raw?.clarification_questions),
  };
}

export async function extractPreferences(naturalLanguageInput: string): Promise<TravelerPreference> {
  const raw = await generateJson<unknown>({
    systemPrompt,
    userPrompt: naturalLanguageInput,
    temperature: aiConfig.openrouter.temperatures.intentExtraction,
  });
  const normalized = normalize(raw);
  return validateExtractedPreferences(preferenceSchema.parse(normalized));
}