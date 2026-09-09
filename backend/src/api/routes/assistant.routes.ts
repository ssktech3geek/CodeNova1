import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticateToken, requireRole } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { extractPreferences } from '../../services/ai/preferenceExtraction.service';

const router = Router();
router.use(authenticateToken);

const extractionSchema = z.object({
  natural_language: z.string().trim().min(1).max(4000),
});

router.post('/extract-preferences', requireRole('TRAVELER', 'OPERATOR', 'ADMIN'), validate(extractionSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const preferences = await extractPreferences(req.body.natural_language);
    res.json({ success: true, data: { preferences }, request_id: req.requestId });
  } catch (error) {
    next(error);
  }
});

export default router;