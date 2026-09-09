import { query, withTransaction } from '../../lib/db';
import { v4 as uuidv4 } from 'uuid';
import { TravelerProfile } from '../../types';

// ============================================
// Profile Service
// Manages TravelerProfile CRUD
// ============================================

export interface UpdateProfileInput {
  destination_interest?: string;
  duration_days?: number;
  travelers_count?: number;
  budget_limit?: number;
  interests?: string[];
  accommodation_preference?: string;
  transport_preference?: string;
  pace?: 'SLOW' | 'MODERATE' | 'FAST';
  food_preferences?: string[];
  accessibility_needs?: string[];
  adventure_level?: 1 | 2 | 3 | 4 | 5;
  preferred_activity_times?: string[];
  activities_to_avoid?: string[];
}

/**
 * Get the traveler profile for a given user.
 */
export async function getProfileByUserId(userId: string): Promise<TravelerProfile | null> {
  const result = await query<TravelerProfile>(
    `SELECT * FROM traveler_profiles WHERE user_id = $1`,
    [userId]
  );
  return result.rowCount > 0 ? result.rows[0] : null;
}

/**
 * Get a profile by its own ID.
 */
export async function getProfileById(profileId: string): Promise<TravelerProfile | null> {
  const result = await query<TravelerProfile>(
    `SELECT * FROM traveler_profiles WHERE id = $1`,
    [profileId]
  );
  return result.rowCount > 0 ? result.rows[0] : null;
}

/**
 * Create or update a traveler profile.
 */
export async function upsertProfile(
  userId: string,
  input: UpdateProfileInput
): Promise<TravelerProfile> {
  const existing = await getProfileByUserId(userId);

  if (existing) {
    return updateProfile(existing.id, input);
  }

  // Create new profile
  const profileId = uuidv4();
  const result = await query<TravelerProfile>(
    `INSERT INTO traveler_profiles (
      id, user_id, destination_interest, duration_days, travelers_count, budget_limit,
      interests, accommodation_preference, transport_preference, pace, food_preferences,
      accessibility_needs, adventure_level, preferred_activity_times, activities_to_avoid,
      created_at, updated_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15, NOW(), NOW())
    RETURNING *`,
    [
      profileId, userId,
      input.destination_interest ?? null,
      input.duration_days ?? null,
      input.travelers_count ?? 1,
      input.budget_limit ?? null,
      JSON.stringify(input.interests ?? []),
      input.accommodation_preference ?? null,
      input.transport_preference ?? null,
      input.pace ?? 'MODERATE',
      JSON.stringify(input.food_preferences ?? []),
      JSON.stringify(input.accessibility_needs ?? []),
      input.adventure_level ?? 3,
      JSON.stringify(input.preferred_activity_times ?? []),
      JSON.stringify(input.activities_to_avoid ?? []),
    ]
  );

  return result.rows[0];
}

/**
 * Update fields on an existing traveler profile.
 */
export async function updateProfile(
  profileId: string,
  input: UpdateProfileInput
): Promise<TravelerProfile> {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  const addField = (col: string, val: any, serialize = false) => {
    fields.push(`${col} = $${paramIndex++}`);
    values.push(serialize ? JSON.stringify(val) : val);
  };

  if (input.destination_interest !== undefined) addField('destination_interest', input.destination_interest);
  if (input.duration_days !== undefined) addField('duration_days', input.duration_days);
  if (input.travelers_count !== undefined) addField('travelers_count', input.travelers_count);
  if (input.budget_limit !== undefined) addField('budget_limit', input.budget_limit);
  if (input.interests !== undefined) addField('interests', input.interests, true);
  if (input.accommodation_preference !== undefined) addField('accommodation_preference', input.accommodation_preference);
  if (input.transport_preference !== undefined) addField('transport_preference', input.transport_preference);
  if (input.pace !== undefined) addField('pace', input.pace);
  if (input.food_preferences !== undefined) addField('food_preferences', input.food_preferences, true);
  if (input.accessibility_needs !== undefined) addField('accessibility_needs', input.accessibility_needs, true);
  if (input.adventure_level !== undefined) addField('adventure_level', input.adventure_level);
  if (input.preferred_activity_times !== undefined) addField('preferred_activity_times', input.preferred_activity_times, true);
  if (input.activities_to_avoid !== undefined) addField('activities_to_avoid', input.activities_to_avoid, true);

  if (fields.length === 0) {
    const existing = await getProfileById(profileId);
    if (!existing) throw new Error('Profile not found.');
    return existing;
  }

  fields.push(`updated_at = NOW()`);
  values.push(profileId);

  const result = await query<TravelerProfile>(
    `UPDATE traveler_profiles SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  if (result.rowCount === 0) throw new Error('Profile not found.');
  return result.rows[0];
}
