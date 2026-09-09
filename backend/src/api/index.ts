import { Router, Request, Response } from 'express';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import itineraryRoutes from './routes/itinerary.routes';
import bookingRoutes from './routes/booking.routes';
import disruptionRoutes from './routes/disruption.routes';
import destinationRoutes from './routes/destination.routes';
import vendorRoutes from './routes/vendor.routes';
import mlRoutes from './routes/ml.routes';
import assistantRoutes from './routes/assistant.routes';

const router = Router();

// ============================================
// Health Check
// ============================================
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      service: 'CodeNova Backend API',
      version: process.env.npm_package_version || '1.0.0',
      timestamp: new Date().toISOString(),
    },
  });
});

// ============================================
// Mount Route Groups
// ============================================
router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);
router.use('/itineraries', itineraryRoutes);
router.use('/bookings', bookingRoutes);
router.use('/disruptions', disruptionRoutes);
router.use('/destinations', destinationRoutes);
router.use('/vendors', vendorRoutes);
router.use('/ml', mlRoutes);
router.use('/assistant', assistantRoutes);

export default router;
