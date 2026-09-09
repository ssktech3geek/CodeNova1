import { Router, Request, Response } from 'express';
import { z } from 'zod';
import * as bookingService from '../../services/booking/booking.service';
import { authenticateToken, requireRole } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { paymentRateLimiter } from '../../middleware/rateLimiter.middleware';

const router = Router();
router.use(authenticateToken);

const createBookingSchema = z.object({
  itinerary_id: z.string().uuid(),
  itinerary_item_id: z.string().uuid(),
  vendor_id: z.string().uuid(),
  quantity: z.number().int().positive(),
  total_price: z.number().positive(),
  supplier_cost: z.number().nonnegative(),
  scheduled_start: z.string().datetime().transform((v) => new Date(v)),
  scheduled_end: z.string().datetime().transform((v) => new Date(v)),
  cancellation_deadline: z.string().datetime().transform((v) => new Date(v)).optional(),
});

const confirmSchema = z.object({
  confirmation_code: z.string().min(4),
});

const cancelSchema = z.object({
  reason: z.string().min(5),
});

// ============================================
// POST /bookings
// ============================================
router.post('/', requireRole('OPERATOR', 'ADMIN'), validate(createBookingSchema), async (req: Request, res: Response) => {
  try {
    const booking = await bookingService.createBooking(req.body);
    res.status(201).json({ success: true, data: { booking }, request_id: req.requestId });
  } catch (err) { throw err; }
});

// ============================================
// GET /bookings/:id
// ============================================
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    if (!booking) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Booking not found.', request_id: req.requestId },
      });
      return;
    }
    res.json({ success: true, data: { booking }, request_id: req.requestId });
  } catch (err) { throw err; }
});

// ============================================
// GET /bookings?itinerary_id=xxx
// ============================================
router.get('/', async (req: Request, res: Response) => {
  try {
    const itineraryId = req.query.itinerary_id as string;
    if (!itineraryId) {
      res.status(400).json({
        success: false,
        error: { code: 'MISSING_PARAM', message: 'itinerary_id is required.', request_id: req.requestId },
      });
      return;
    }
    const bookings = await bookingService.listBookingsByItinerary(itineraryId);
    res.json({ success: true, data: { bookings }, request_id: req.requestId });
  } catch (err) { throw err; }
});

// ============================================
// POST /bookings/:id/confirm
// ============================================
router.post('/:id/confirm', requireRole('VENDOR', 'OPERATOR', 'ADMIN'), validate(confirmSchema), async (req: Request, res: Response) => {
  try {
    const booking = await bookingService.confirmBooking(req.params.id, req.body.confirmation_code);
    res.json({ success: true, data: { booking }, request_id: req.requestId });
  } catch (err: any) {
    if (err.message === 'Booking not found.') {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: err.message, request_id: req.requestId },
      });
    } else { throw err; }
  }
});

// ============================================
// POST /bookings/:id/cancel
// ============================================
router.post('/:id/cancel', validate(cancelSchema), async (req: Request, res: Response) => {
  try {
    const booking = await bookingService.cancelBooking(
      req.params.id,
      req.body.reason,
      req.user!.userId,
      req.user!.role
    );
    res.json({ success: true, data: { booking }, request_id: req.requestId });
  } catch (err: any) {
    if (err.code === 'INVALID_BOOKING_STATUS') {
      res.status(409).json({
        success: false,
        error: { code: err.code, message: err.message, request_id: req.requestId },
      });
    } else if (err.message === 'Booking not found.') {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: err.message, request_id: req.requestId },
      });
    } else { throw err; }
  }
});

export default router;
