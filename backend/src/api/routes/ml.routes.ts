import { NextFunction, Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticateToken, requireRole } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import * as mlPipelineService from '../../services/ml/mlPipeline.service';
import * as vendorService from '../../services/catalog/vendor.service';

const router = Router();
router.use(authenticateToken);

router.get('/activities', requireRole('TRAVELER', 'OPERATOR', 'ADMIN'), async (req: Request, res: Response) => {
  const experiences = await vendorService.searchExperiences({
    category: req.query.category as string | undefined,
    location: req.query.location as string | undefined,
    max_price: req.query.max_price ? Number(req.query.max_price) : undefined,
    limit: 50,
  });

  const activities = experiences.map((experience) => {
    const openingHours = experience.opening_hours?.['default'] || experience.opening_hours?.['monday'];
    const toMinutes = (value: string | undefined, fallback: number) => {
      if (!value) return fallback;
      const [hours, minutes] = value.split(':').map(Number);
      return hours * 60 + (minutes || 0);
    };

    return {
      id: experience.id,
      name: experience.title,
      tag: experience.category,
      cost: Number(experience.price_per_person),
      duration_min: experience.duration_minutes,
      intensity: experience.indoor_outdoor === 'OUTDOOR' ? 4 : 2,
      open_min: toMinutes(openingHours?.open, 480),
      close_min: toMinutes(openingHours?.close, 1440),
      available: experience.capacity_per_slot > 0,
    };
  });

  res.json({ success: true, data: { activities }, request_id: req.requestId });
});

const activitySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  tag: z.string().min(1),
  cost: z.number().nonnegative(),
  duration_min: z.number().int().positive(),
  intensity: z.number().int().min(1).max(5),
  open_min: z.number().int().min(0).max(1440).optional(),
  close_min: z.number().int().min(0).max(1440).optional(),
  available: z.boolean().optional(),
});

const interactionSchema = z.object({
  user_id: z.string().min(1),
  activity_id: z.string().min(1),
  user_budget: z.number().positive(),
  interests: z.array(z.string()),
  pace: z.string().optional(),
  adventure_level: z.number().int().min(1).max(5).optional(),
  party_size: z.number().int().positive().optional(),
  act_tag: z.string().min(1),
  act_cost: z.number().nonnegative(),
  act_duration_min: z.number().int().positive(),
  act_intensity: z.number().int().min(1).max(5),
  action: z.string().min(1),
});

const optimizeSchema = z.object({
  traveler: z.object({
    budget: z.number().positive(),
    interests: z.array(z.string()),
    pace: z.string().optional(),
    adventure_level: z.number().int().min(1).max(5).optional(),
    travelers_count: z.number().int().positive().optional(),
  }),
  activities: z.array(activitySchema).min(1),
  historical_interactions: z.array(interactionSchema).optional(),
  max_budget: z.number().positive(),
  travel_time_gap: z.number().int().min(0).max(240).optional(),
  excluded_activity_ids: z.array(z.string()).optional(),
  locked_activity_ids: z.array(z.string()).optional(),
}).superRefine((value, context) => {
  const excluded = new Set(value.excluded_activity_ids || []);
  for (const activityId of value.locked_activity_ids || []) {
    if (excluded.has(activityId)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['locked_activity_ids'],
        message: `Activity ${activityId} cannot be both locked and excluded.`,
      });
    }
  }
});

router.post('/optimize', requireRole('TRAVELER', 'OPERATOR', 'ADMIN'), validate(optimizeSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await mlPipelineService.optimizePipeline(req.body as mlPipelineService.OptimizePipelineInput);
    res.json({ success: true, data: result, request_id: req.requestId });
  } catch (error) {
    next(error);
  }
});

export default router;