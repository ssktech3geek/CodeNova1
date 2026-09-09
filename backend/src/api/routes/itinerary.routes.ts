import { Router, Request, Response } from 'express';
import { z } from 'zod';
import * as itineraryService from '../../services/itinerary/itinerary.service';
import { authenticateToken, requireRole } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';

const router = Router();
router.use(authenticateToken);

const createItinerarySchema = z.object({
  traveler_profile_id: z.string().uuid(),
  operator_id: z.string().uuid(),
  title: z.string().min(3),
  start_date: z.string().datetime().transform((v) => new Date(v)),
  end_date: z.string().datetime().transform((v) => new Date(v)),
  items: z.array(z.object({
    day_number: z.number().int().positive(),
    start_time: z.string().datetime().transform((v) => new Date(v)),
    end_time: z.string().datetime().transform((v) => new Date(v)),
    item_type: z.enum(['HOTEL', 'EXPERIENCE', 'TRANSPORT', 'GUIDE', 'RESTAURANT']),
    service_ref_id: z.string().uuid(),
    vendor_id: z.string().uuid(),
    title: z.string().min(2),
    price: z.number().nonnegative(),
    supplier_cost: z.number().nonnegative(),
    location: z.string().min(2),
    dependencies: z.array(z.string().uuid()).optional(),
  })).min(1),
});

const statusTransitionSchema = z.object({
  status: z.enum([
    'DRAFT', 'FEASIBILITY_CHECK', 'QUOTE', 'CUSTOMER_APPROVAL',
    'PAYMENT_PENDING', 'CONFIRMED', 'ACTIVE', 'DISRUPTED', 'COMPLETED'
  ]),
});

// ============================================
// POST /itineraries
// ============================================
router.post('/', requireRole('OPERATOR', 'ADMIN'), validate(createItinerarySchema), async (req: Request, res: Response) => {
  try {
    const itinerary = await itineraryService.createItinerary(req.body);
    res.status(201).json({ success: true, data: { itinerary }, request_id: req.requestId });
  } catch (err: any) {
    if (err.code === 'SCHEDULE_VIOLATION') {
      res.status(422).json({
        success: false,
        error: {
          code: 'SCHEDULE_VIOLATION',
          message: err.message,
          details: { violations: err.details },
          request_id: req.requestId,
        },
      });
    } else if (err.code === 'CIRCULAR_DEPENDENCY') {
      res.status(422).json({
        success: false,
        error: { code: 'CIRCULAR_DEPENDENCY', message: err.message, request_id: req.requestId },
      });
    } else {
      throw err;
    }
  }
});

// ============================================
// GET /itineraries/:id
// ============================================
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const itinerary = await itineraryService.getItineraryById(req.params.id);
    if (!itinerary) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Itinerary not found.', request_id: req.requestId },
      });
      return;
    }
    res.json({ success: true, data: { itinerary }, request_id: req.requestId });
  } catch (err) { throw err; }
});

// ============================================
// GET /itineraries — List by profile
// ============================================
router.get('/', async (req: Request, res: Response) => {
  try {
    const profileId = req.query.profile_id as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

    if (!profileId) {
      res.status(400).json({
        success: false,
        error: { code: 'MISSING_PARAM', message: 'profile_id query parameter is required.', request_id: req.requestId },
      });
      return;
    }

    const result = await itineraryService.listItinerariesByProfile(profileId, page, limit);
    res.json({
      success: true,
      data: { itineraries: result.itineraries },
      meta: { page, limit, total: result.total, totalPages: Math.ceil(result.total / limit) },
      request_id: req.requestId,
    });
  } catch (err) { throw err; }
});

// ============================================
// PATCH /itineraries/:id/status
// ============================================
router.patch('/:id/status', requireRole('OPERATOR', 'ADMIN'), validate(statusTransitionSchema), async (req: Request, res: Response) => {
  try {
    const itinerary = await itineraryService.transitionStatus(
      req.params.id,
      req.body.status,
      req.user!.userId,
      req.user!.role
    );
    res.json({ success: true, data: { itinerary }, request_id: req.requestId });
  } catch (err: any) {
    if (err.message === 'Itinerary not found.') {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: err.message, request_id: req.requestId },
      });
    } else {
      throw err;
    }
  }
});

export default router;
