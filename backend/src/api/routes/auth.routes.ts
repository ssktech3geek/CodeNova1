import { Router, Request, Response } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import * as authService from '../../services/auth/auth.service';
import { validate } from '../../middleware/validation.middleware';
import { authenticateToken } from '../../middleware/auth.middleware';
import { authConfig } from '../../config';

const router = Router();

router.get('/dev-token', (_req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'production') {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found.' } });
    return;
  }

  const accessToken = jwt.sign(
    { userId: 'dev-traveler', email: 'dev@codenova.local', role: 'TRAVELER' },
    authConfig.jwt.secret,
    { expiresIn: '1h' }
  );
  res.json({ success: true, data: { accessToken }, request_id: res.req.requestId });
});

// ============================================
// Zod Schemas
// ============================================
const registerSchema = z.object({
  email: z.string().email('Valid email is required.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  full_name: z.string().min(2, 'Full name is required.'),
  phone_number: z.string().regex(/^\+?[1-9]\d{6,14}$/, 'Valid phone number required.'),
  role: z.enum(['TRAVELER', 'OPERATOR', 'VENDOR']),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required.'),
});

const refreshSchema = z.object({
  refresh_token: z.string().min(1, 'Refresh token is required.'),
});

// ============================================
// POST /auth/register
// ============================================
router.post('/register', validate(registerSchema), async (req: Request, res: Response) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      data: result,
      request_id: req.requestId,
    });
  } catch (err: any) {
    if (err.code === 'USER_EXISTS') {
      res.status(409).json({
        success: false,
        error: { code: 'USER_EXISTS', message: err.message, request_id: req.requestId },
      });
    } else {
      throw err;
    }
  }
});

// ============================================
// POST /auth/login
// ============================================
router.post('/login', validate(loginSchema), async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({
      success: true,
      data: result,
      request_id: req.requestId,
    });
  } catch (err: any) {
    if (err.code === 'INVALID_CREDENTIALS') {
      res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: err.message, request_id: req.requestId },
      });
    } else if (err.code === 'ACCOUNT_INACTIVE') {
      res.status(403).json({
        success: false,
        error: { code: 'ACCOUNT_INACTIVE', message: err.message, request_id: req.requestId },
      });
    } else {
      throw err;
    }
  }
});

// ============================================
// POST /auth/refresh
// ============================================
router.post('/refresh', validate(refreshSchema), async (req: Request, res: Response) => {
  try {
    const tokens = await authService.refreshTokens(req.body.refresh_token);
    res.status(200).json({
      success: true,
      data: { tokens },
      request_id: req.requestId,
    });
  } catch (err: any) {
    res.status(401).json({
      success: false,
      error: { code: 'INVALID_REFRESH_TOKEN', message: err.message, request_id: req.requestId },
    });
  }
});

// ============================================
// GET /auth/me — Get current user
// ============================================
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = await authService.getUserById(req.user!.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found.', request_id: req.requestId },
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: { user },
      request_id: req.requestId,
    });
  } catch (err) {
    throw err;
  }
});

export default router;
