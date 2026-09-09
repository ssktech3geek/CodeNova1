import { Router, Request, Response } from 'express';
import { z } from 'zod';
import * as profileService from '../../services/profile/profile.service';
import { authenticateToken, requireRole } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';

const router = Router();

// Apply auth to all profile routes
router.use(authenticateToken);

const updateProfileSchema = z.object({
  destination_interest: z.string().optional(),
  duration_days: z.number().int().positive().optional(),
  travelers_count: z.number().int().positive().optional(),
  budget_limit: z.number().positive().optional(),
  interests: z.array(z.string()).optional(),
  accommodation_preference: z.enum(['BUDGET', 'STANDARD', 'PREMIUM', 'LUXURY']).optional(),
  transport_preference: z.enum(['FLIGHT', 'TRAIN', 'BUS', 'CAR', 'ANY']).optional(),
  pace: z.enum(['SLOW', 'MODERATE', 'FAST']).optional(),
  food_preferences: z.array(z.string()).optional(),
  accessibility_needs: z.array(z.string()).optional(),
  adventure_level: z.number().int().min(1).max(5).optional(),
  preferred_activity_times: z.array(z.string()).optional(),
  activities_to_avoid: z.array(z.string()).optional(),
});

// ============================================
// GET /profiles/me
// ============================================
router.get('/me', requireRole('TRAVELER'), async (req: Request, res: Response) => {
  try {
    const profile = await profileService.getProfileByUserId(req.user!.userId);
    if (!profile) {
      res.status(404).json({
        success: false,
        error: { code: 'PROFILE_NOT_FOUND', message: 'Profile not found.', request_id: req.requestId },
      });
      return;
    }
    res.json({ success: true, data: { profile }, request_id: req.requestId });
  } catch (err) { throw err; }
});

// ============================================
// PUT /profiles/me
// ============================================
router.put('/me', requireRole('TRAVELER'), validate(updateProfileSchema), async (req: Request, res: Response) => {
  try {
    const profile = await profileService.upsertProfile(req.user!.userId, req.body);
    res.json({ success: true, data: { profile }, request_id: req.requestId });
  } catch (err) { throw err; }
});

// ============================================
// GET /profiles/:id — Admin/Operator access
// ============================================
router.get('/:id', requireRole('ADMIN', 'OPERATOR'), async (req: Request, res: Response) => {
  try {
    const profile = await profileService.getProfileById(req.params.id);
    if (!profile) {
      res.status(404).json({
        success: false,
        error: { code: 'PROFILE_NOT_FOUND', message: 'Profile not found.', request_id: req.requestId },
      });
      return;
    }
    res.json({ success: true, data: { profile }, request_id: req.requestId });
  } catch (err) { throw err; }
});

export default router;
