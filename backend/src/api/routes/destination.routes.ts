import { Router, Request, Response } from 'express';
import * as destinationService from '../../services/catalog/destination.service';

const router = Router();

// ============================================
// GET /destinations
// Search and filter destinations
// ============================================
router.get('/', async (req: Request, res: Response) => {
  try {
    const { state, country, interest, search, page, limit } = req.query;

    const result = await destinationService.getDestinations({
      state: state as string,
      country: country as string,
      interest: interest as string,
      search: search as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });

    res.json({
      success: true,
      data: { destinations: result.destinations },
      meta: {
        total: result.total,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      },
      request_id: req.requestId,
    });
  } catch (err) {
    throw err;
  }
});

// ============================================
// GET /destinations/:id
// Get single destination details
// ============================================
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const destination = await destinationService.getDestinationById(req.params.id);
    if (!destination) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Destination not found.', request_id: req.requestId },
      });
      return;
    }
    res.json({
      success: true,
      data: { destination },
      request_id: req.requestId,
    });
  } catch (err) {
    throw err;
  }
});

export default router;
