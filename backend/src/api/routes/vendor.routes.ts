import { Router, Request, Response } from 'express';
import * as vendorService from '../../services/catalog/vendor.service';
import { VendorType } from '../../types';

const router = Router();

// ============================================
// GET /vendors — Vendor registry search
// ============================================
router.get('/', async (req: Request, res: Response) => {
  try {
    const { vendor_type, location } = req.query;
    const vendors = await vendorService.getVendors(
      vendor_type as VendorType,
      location as string
    );
    res.json({ success: true, data: { vendors }, request_id: req.requestId });
  } catch (err) {
    throw err;
  }
});

// ============================================
// GET /vendors/hotels — Hotel catalog search
// ============================================
router.get('/hotels', async (req: Request, res: Response) => {
  try {
    const { location, category, max_price, min_rating, limit } = req.query;
    const hotels = await vendorService.searchHotels({
      location: location as string,
      category: category as string,
      max_price: max_price ? parseFloat(max_price as string) : undefined,
      min_rating: min_rating ? parseFloat(min_rating as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.json({ success: true, data: { hotels }, request_id: req.requestId });
  } catch (err) {
    throw err;
  }
});

// ============================================
// GET /vendors/experiences — Experience catalog search
// ============================================
router.get('/experiences', async (req: Request, res: Response) => {
  try {
    const { location, category, max_price, weather_dependent, indoor_outdoor, limit } = req.query;
    const experiences = await vendorService.searchExperiences({
      location: location as string,
      category: category as string,
      max_price: max_price ? parseFloat(max_price as string) : undefined,
      weather_dependent: weather_dependent ? weather_dependent === 'true' : undefined,
      indoor_outdoor: indoor_outdoor as any,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.json({ success: true, data: { experiences }, request_id: req.requestId });
  } catch (err) {
    throw err;
  }
});

// ============================================
// GET /vendors/transports — Transport catalog search
// ============================================
router.get('/transports', async (req: Request, res: Response) => {
  try {
    const { transport_mode, vehicle_type, min_capacity, limit } = req.query;
    const transports = await vendorService.searchTransports({
      transport_mode: transport_mode as string,
      vehicle_type: vehicle_type as string,
      min_capacity: min_capacity ? parseInt(min_capacity as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.json({ success: true, data: { transports }, request_id: req.requestId });
  } catch (err) {
    throw err;
  }
});

export default router;
