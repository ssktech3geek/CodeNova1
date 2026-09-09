import { query, withTransaction } from '../../lib/db';
import { v4 as uuidv4 } from 'uuid';
import { Booking, BookingStatus } from '../../types';

// ============================================
// Booking Service
// Manages booking lifecycle from DISCOVERED → COMPLETED
// ============================================

export interface CreateBookingInput {
  itinerary_id: string;
  itinerary_item_id: string;
  vendor_id: string;
  quantity: number;
  total_price: number;
  supplier_cost: number;
  scheduled_start: Date;
  scheduled_end: Date;
  cancellation_deadline?: Date;
}

/**
 * Create a new booking in DISCOVERED state.
 */
export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const bookingId = uuidv4();

  const result = await query<Booking>(
    `INSERT INTO bookings (
      id, itinerary_id, itinerary_item_id, vendor_id, status,
      confirmation_code, quantity, total_price, supplier_cost,
      scheduled_start, scheduled_end, cancellation_deadline, created_at, updated_at
    ) VALUES ($1,$2,$3,$4,'DISCOVERED',NULL,$5,$6,$7,$8,$9,$10,NOW(),NOW())
    RETURNING *`,
    [
      bookingId,
      input.itinerary_id,
      input.itinerary_item_id,
      input.vendor_id,
      input.quantity,
      input.total_price,
      input.supplier_cost,
      input.scheduled_start,
      input.scheduled_end,
      input.cancellation_deadline ?? null,
    ]
  );

  return result.rows[0];
}

/**
 * Get a booking by ID.
 */
export async function getBookingById(bookingId: string): Promise<Booking | null> {
  const result = await query<Booking>('SELECT * FROM bookings WHERE id = $1', [bookingId]);
  return result.rowCount > 0 ? result.rows[0] : null;
}

/**
 * List bookings for an itinerary.
 */
export async function listBookingsByItinerary(itineraryId: string): Promise<Booking[]> {
  const result = await query<Booking>(
    `SELECT * FROM bookings WHERE itinerary_id = $1 ORDER BY scheduled_start`,
    [itineraryId]
  );
  return result.rows;
}

/**
 * Transition a booking's status.
 */
export async function transitionBookingStatus(
  bookingId: string,
  newStatus: BookingStatus,
  confirmationCode?: string
): Promise<Booking> {
  const result = await query<Booking>(
    `UPDATE bookings
     SET status = $1, confirmation_code = COALESCE($2, confirmation_code), updated_at = NOW()
     WHERE id = $3 RETURNING *`,
    [newStatus, confirmationCode ?? null, bookingId]
  );

  if (result.rowCount === 0) throw new Error('Booking not found.');
  return result.rows[0];
}

/**
 * Cancel a booking and trigger refund calculation.
 */
export async function cancelBooking(
  bookingId: string,
  reason: string,
  actorUserId: string,
  actorRole: string
): Promise<Booking> {
  const booking = await getBookingById(bookingId);
  if (!booking) throw new Error('Booking not found.');

  const terminableStatuses: BookingStatus[] = ['DISCOVERED', 'SELECTED', 'QUOTED', 'PENDING_APPROVAL', 'APPROVED', 'CONFIRMED'];
  if (!terminableStatuses.includes(booking.status)) {
    throw Object.assign(new Error(`Cannot cancel booking in ${booking.status} status.`), {
      code: 'INVALID_BOOKING_STATUS',
    });
  }

  return withTransaction(async (client: any) => {
    const updated = await client.query(
      `UPDATE bookings SET status = 'CANCELLED', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [bookingId]
    );

    await client.query(
      `INSERT INTO audit_logs (id, actor_user_id, actor_role, action, entity_type, entity_id, ip_address, request_id, occurred_at)
       VALUES ($1,$2,$3,'BOOKING_CANCELLED','BOOKING',$4,'system','system',NOW())`,
      [uuidv4(), actorUserId, actorRole, bookingId]
    );

    return updated.rows[0];
  });
}

/**
 * Confirm a booking with a vendor confirmation code.
 */
export async function confirmBooking(bookingId: string, confirmationCode: string): Promise<Booking> {
  return transitionBookingStatus(bookingId, 'CONFIRMED', confirmationCode);
}
