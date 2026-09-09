import { query, withTransaction } from '../../lib/db';
import { v4 as uuidv4 } from 'uuid';
import { Itinerary, ItineraryItem, ItineraryStatus, PricedItem } from '../../types';
import { validateSchedule } from '../../utils/scheduleValidator.util';
import { calculateCustomerPrice } from '../../utils/priceCalculator.util';
import { isAcyclic } from '../../utils/dependencyGraph.util';

// ============================================
// Itinerary Service
// Core itinerary lifecycle management
// ============================================

export interface CreateItineraryInput {
  traveler_profile_id: string;
  operator_id: string;
  title: string;
  start_date: Date;
  end_date: Date;
  items: CreateItemInput[];
}

export interface CreateItemInput {
  day_number: number;
  start_time: Date;
  end_time: Date;
  item_type: ItineraryItem['item_type'];
  service_ref_id: string;
  vendor_id: string;
  title: string;
  price: number;
  supplier_cost: number;
  location: string;
  dependencies?: string[];
}

/**
 * Create a new itinerary draft with feasibility pre-check.
 */
export async function createItinerary(input: CreateItineraryInput): Promise<Itinerary> {
  const itineraryId = uuidv4();

  // Build provisional ItineraryItem objects for validation
  const provisionalItems: ItineraryItem[] = input.items.map((item, idx) => ({
    id: `temp-${idx}`,
    itinerary_id: itineraryId,
    ...item,
    dependencies: item.dependencies || [],
    is_disrupted: false,
  }));

  // 1. DAG Acyclicity Check
  if (!isAcyclic(provisionalItems)) {
    throw Object.assign(new Error('Itinerary items contain a circular dependency.'), {
      code: 'CIRCULAR_DEPENDENCY',
    });
  }

  // 2. Schedule Validation (overlaps + transit)
  const scheduleCheck = validateSchedule(provisionalItems);
  if (!scheduleCheck.is_feasible) {
    throw Object.assign(new Error('Itinerary has schedule violations.'), {
      code: 'SCHEDULE_VIOLATION',
      details: scheduleCheck.violations,
    });
  }

  // 3. Price Calculation
  const pricedItems: PricedItem[] = input.items.map((item, idx) => ({
    id: `temp-${idx}`,
    title: item.title,
    item_type: item.item_type,
    customer_price: item.price,
    supplier_cost: item.supplier_cost,
    quantity: 1,
  }));

  const priceBreakdown = calculateCustomerPrice(pricedItems);

  // 4. Persist to DB
  return withTransaction(async (client: any) => {
    const itineraryResult = await client.query(
      `INSERT INTO itineraries (
        id, version, parent_itinerary_id, traveler_profile_id, operator_id, title,
        status, start_date, end_date,
        total_customer_price, total_supplier_cost, total_taxes, total_discounts,
        operator_margin, operator_margin_percentage,
        preference_match_score, schedule_intensity_score,
        created_at, updated_at
      ) VALUES ($1,1,NULL,$2,$3,$4,'DRAFT',$5,$6,$7,$8,$9,$10,$11,$12,0,0,NOW(),NOW())
      RETURNING *`,
      [
        itineraryId,
        input.traveler_profile_id,
        input.operator_id,
        input.title,
        input.start_date,
        input.end_date,
        priceBreakdown.total_customer_price,
        priceBreakdown.total_supplier_cost,
        priceBreakdown.gst_amount,
        priceBreakdown.total_discounts,
        priceBreakdown.operator_margin,
        priceBreakdown.operator_margin_percentage,
      ]
    );

    // Insert all items
    for (const item of input.items) {
      const itemId = uuidv4();
      await client.query(
        `INSERT INTO itinerary_items (
          id, itinerary_id, day_number, start_time, end_time, item_type,
          service_ref_id, vendor_id, title, price, supplier_cost, location,
          dependencies, is_disrupted
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,false)`,
        [
          itemId, itineraryId, item.day_number,
          item.start_time, item.end_time, item.item_type,
          item.service_ref_id, item.vendor_id, item.title,
          item.price, item.supplier_cost, item.location,
          JSON.stringify(item.dependencies || []),
        ]
      );
    }

    return itineraryResult.rows[0];
  });
}

/**
 * Get an itinerary with all items.
 */
export async function getItineraryById(
  itineraryId: string
): Promise<(Itinerary & { items: ItineraryItem[] }) | null> {
  const itResult = await query<Itinerary>(
    `SELECT * FROM itineraries WHERE id = $1`,
    [itineraryId]
  );

  if (itResult.rowCount === 0) return null;

  const itemsResult = await query<ItineraryItem>(
    `SELECT * FROM itinerary_items WHERE itinerary_id = $1 ORDER BY day_number, start_time`,
    [itineraryId]
  );

  return { ...itResult.rows[0], items: itemsResult.rows };
}

/**
 * List itineraries for a traveler profile.
 */
export async function listItinerariesByProfile(
  profileId: string,
  page = 1,
  limit = 10
): Promise<{ itineraries: Itinerary[]; total: number }> {
  const offset = (page - 1) * limit;

  const countResult = await query<{ count: string }>(
    `SELECT COUNT(*) as count FROM itineraries WHERE traveler_profile_id = $1`,
    [profileId]
  );

  const result = await query<Itinerary>(
    `SELECT * FROM itineraries WHERE traveler_profile_id = $1
     ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [profileId, limit, offset]
  );

  return {
    itineraries: result.rows,
    total: parseInt(countResult.rows[0].count),
  };
}

/**
 * Transition itinerary status.
 */
export async function transitionStatus(
  itineraryId: string,
  newStatus: ItineraryStatus,
  actorUserId: string,
  actorRole: string
): Promise<Itinerary> {
  const result = await query<Itinerary>(
    `UPDATE itineraries SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [newStatus, itineraryId]
  );

  if (result.rowCount === 0) throw new Error('Itinerary not found.');

  // Audit
  await query(
    `INSERT INTO audit_logs (id, actor_user_id, actor_role, action, entity_type, entity_id, ip_address, request_id, occurred_at)
     VALUES ($1,$2,$3,$4,'ITINERARY',$5,'system','system',NOW())`,
    [uuidv4(), actorUserId, actorRole, `STATUS_CHANGED_TO_${newStatus}`, itineraryId]
  );

  return result.rows[0];
}

/**
 * Create a new version of an itinerary (for replanning).
 */
export async function createNewVersion(
  parentItineraryId: string,
  input: CreateItineraryInput
): Promise<Itinerary> {
  const parentResult = await query<Itinerary>(
    `SELECT version FROM itineraries WHERE id = $1`,
    [parentItineraryId]
  );

  if (parentResult.rowCount === 0) throw new Error('Parent itinerary not found.');
  const nextVersion = parentResult.rows[0].version + 1;

  const newItinerary = await createItinerary(input);

  // Update version and parent link
  const result = await query<Itinerary>(
    `UPDATE itineraries SET version = $1, parent_itinerary_id = $2 WHERE id = $3 RETURNING *`,
    [nextVersion, parentItineraryId, newItinerary.id]
  );

  return result.rows[0];
}
