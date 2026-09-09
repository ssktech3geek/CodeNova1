import { query, withTransaction } from '../../lib/db';
import { v4 as uuidv4 } from 'uuid';
import { ChangeEvent, ChangeProposal, ItineraryItem } from '../../types';
import { analyzeDisruption } from '../../utils/dependencyGraph.util';
import { routeApproval } from '../../utils/approvalRouter.util';
import { recalculatePriceAfterChange } from '../../utils/priceCalculator.util';

// ============================================
// Change Impact Analyzer Service
// Detects and propagates disruption events
// ============================================

export interface ReportDisruptionInput {
  itinerary_id: string;
  affected_item_id: string;
  source: ChangeEvent['source'];
  event_type: string;
  payload: Record<string, any>;
}

/**
 * Report an external disruption event and analyze its impact.
 */
export async function reportDisruption(
  input: ReportDisruptionInput,
  reportedBy: string
): Promise<{
  changeEvent: ChangeEvent;
  impactedItemIds: string[];
  freeTimeMinutes: number;
}> {
  // 1. Load all itinerary items
  const itemsResult = await query<ItineraryItem>(
    `SELECT * FROM itinerary_items WHERE itinerary_id = $1`,
    [input.itinerary_id]
  );

  const items = itemsResult.rows.map((item: any) => ({
    ...item,
    start_time: new Date(item.start_time),
    end_time: new Date(item.end_time),
    dependencies: Array.isArray(item.dependencies)
      ? item.dependencies
      : JSON.parse((item.dependencies as any) || '[]'),
  }));

  // 2. BFS disruption analysis
  const impact = analyzeDisruption(input.affected_item_id, items);

  // 3. Mark impacted items as disrupted
  await withTransaction(async (client: any) => {
    if (impact.impactedItemIds.length > 0) {
      await client.query(
        `UPDATE itinerary_items SET is_disrupted = true
         WHERE id = ANY($1::uuid[])`,
        [impact.impactedItemIds]
      );
    }

    // Mark root item as disrupted too
    await client.query(
      `UPDATE itinerary_items SET is_disrupted = true WHERE id = $1`,
      [input.affected_item_id]
    );

    // Update itinerary status to DISRUPTED
    await client.query(
      `UPDATE itineraries SET status = 'DISRUPTED', updated_at = NOW() WHERE id = $1`,
      [input.itinerary_id]
    );
  });

  // 4. Create ChangeEvent record
  const eventId = uuidv4();
  const eventResult = await query<ChangeEvent>(
    `INSERT INTO change_events (
      id, itinerary_id, affected_item_id, source, event_type, payload, reported_at, processed_at
    ) VALUES ($1,$2,$3,$4,$5,$6,NOW(),NULL) RETURNING *`,
    [
      eventId,
      input.itinerary_id,
      input.affected_item_id,
      input.source,
      input.event_type,
      JSON.stringify(input.payload),
    ]
  );

  return {
    changeEvent: eventResult.rows[0],
    impactedItemIds: [input.affected_item_id, ...impact.impactedItemIds],
    freeTimeMinutes: impact.freeTimeMinutes,
  };
}

/**
 * Get all change events for an itinerary.
 */
export async function getChangeEvents(itineraryId: string): Promise<ChangeEvent[]> {
  const result = await query<ChangeEvent>(
    `SELECT * FROM change_events WHERE itinerary_id = $1 ORDER BY reported_at DESC`,
    [itineraryId]
  );
  return result.rows;
}

/**
 * Mark a change event as processed.
 */
export async function markEventProcessed(eventId: string): Promise<void> {
  await query(
    `UPDATE change_events SET processed_at = NOW() WHERE id = $1`,
    [eventId]
  );
}
