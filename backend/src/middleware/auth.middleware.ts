import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config';
import { AuthPayload, Role } from '../types';
import { query } from '../lib/db';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
      requestId?: string;
    }
  }
}

// ============================================
// 1. authenticateToken — JWT Verification
// ============================================
export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_MISSING_TOKEN',
        message: 'Authorization token is required.',
        request_id: req.requestId,
      },
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, authConfig.jwt.secret) as AuthPayload;
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(403).json({
        success: false,
        error: {
          code: 'AUTH_TOKEN_EXPIRED',
          message: 'Access token has expired. Please refresh your token.',
          request_id: req.requestId,
        },
      });
    } else {
      res.status(403).json({
        success: false,
        error: {
          code: 'AUTH_TOKEN_INVALID',
          message: 'Invalid or malformed token.',
          request_id: req.requestId,
        },
      });
    }
  }
}

// ============================================
// 2. requireRole — RBAC Guard Factory
// ============================================
export function requireRole(...roles: Role[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_MISSING_USER',
          message: 'Authentication required.',
          request_id: req.requestId,
        },
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      // Log access violation
      try {
        await query(
          `INSERT INTO audit_logs (id, actor_user_id, actor_role, action, entity_type, entity_id, ip_address, request_id, occurred_at)
           VALUES (gen_random_uuid(), $1, $2, 'UNAUTHORIZED_ACCESS', 'ROUTE', $3, $4, $5, NOW())`,
          [req.user.userId, req.user.role, req.path, req.ip || 'unknown', req.requestId || 'unknown']
        );
      } catch {
        // Non-fatal — don't block response for audit log failure
      }

      res.status(403).json({
        success: false,
        error: {
          code: 'AUTH_INSUFFICIENT_ROLE',
          message: `Access requires one of: [${roles.join(', ')}]. Your role: ${req.user.role}`,
          request_id: req.requestId,
        },
      });
      return;
    }

    next();
  };
}

// ============================================
// 3. requireOwnership — Resource Ownership Check
// ============================================
export function requireOwnership(
  entityType: 'itinerary' | 'profile' | 'booking',
  paramKey: string = 'id'
) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ success: false, error: { code: 'AUTH_MISSING_USER', message: 'Authentication required.' } });
      return;
    }

    // ADMIN always bypasses ownership checks
    if (req.user.role === 'ADMIN') {
      next();
      return;
    }

    const resourceId = req.params[paramKey];
    if (!resourceId) {
      next(); // No param to check, proceed
      return;
    }

    try {
      let ownerQuery: string;
      let params: any[];

      switch (entityType) {
        case 'itinerary':
          ownerQuery = `
            SELECT i.id FROM itineraries i
            JOIN traveler_profiles tp ON tp.id = i.traveler_profile_id
            JOIN users u ON u.id = tp.user_id
            WHERE i.id = $1 AND u.id = $2
          `;
          params = [resourceId, req.user.userId];
          break;
        case 'profile':
          ownerQuery = `SELECT id FROM traveler_profiles WHERE id = $1 AND user_id = $2`;
          params = [resourceId, req.user.userId];
          break;
        case 'booking':
          ownerQuery = `
            SELECT b.id FROM bookings b
            JOIN itineraries i ON i.id = b.itinerary_id
            JOIN traveler_profiles tp ON tp.id = i.traveler_profile_id
            JOIN users u ON u.id = tp.user_id
            WHERE b.id = $1 AND u.id = $2
          `;
          params = [resourceId, req.user.userId];
          break;
        default:
          next();
          return;
      }

      const result = await query(ownerQuery, params);
      if (result.rowCount === 0) {
        res.status(403).json({
          success: false,
          error: {
            code: 'AUTH_OWNERSHIP_MISMATCH',
            message: 'You do not have permission to access this resource.',
            request_id: req.requestId,
          },
        });
        return;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
