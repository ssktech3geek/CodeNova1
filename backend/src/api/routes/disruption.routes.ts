import { Router, Request, Response } from 'express';
import { z } from 'zod';
import * as changeImpactService from '../../services/change-impact-analyzer/changeImpact.service';
import { authenticateToken, requireRole } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';

const router = Router();
router.use(authenticateToken);

const reportDisruptionSchema = z.object({
  itinerary_id: z.string().uuid(),
  affected_item_id: z.string().uuid(),
  source: z.enum(['VENDOR', 'WEATHER', 'SYSTEM', 'OPERATOR']),
  event_type: z.string().min(3),
  payload: z.record(z.any()),
});

// ============================================
// POST /disruptions/report
// ============================================
router.post('/report', requireRole('OPERATOR', 'VENDOR', 'ADMIN'), validate(reportDisruptionSchema), async (req: Request, res: Response) => {
  try {
    const result = await changeImpactService.reportDisruption(req.body, req.user!.userId);
    res.status(201).json({
      success: true,
      data: result,
      request_id: req.requestId,
    });
  } catch (err) { throw err; }
});

// ============================================
// GET /disruptions?itinerary_id=xxx
// ============================================
router.get('/', requireRole('OPERATOR', 'ADMIN'), async (req: Request, res: Response) => {
  try {
    const itineraryId = req.query.itinerary_id as string;
    if (!itineraryId) {
      res.status(400).json({
        success: false,
        error: { code: 'MISSING_PARAM', message: 'itinerary_id is required.', request_id: req.requestId },
      });
      return;
    }
    const events = await changeImpactService.getChangeEvents(itineraryId);
    res.json({ success: true, data: { events }, request_id: req.requestId });
  } catch (err) { throw err; }
});

export default router;
