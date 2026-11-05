import { Router, Request, Response } from 'express';
import { calculateDailyPanchanga } from '../utils/panchangaService.js';

const router = Router();

// GET /api/panchanga?date=YYYY-MM-DD&location=bengaluru
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const date = (req.query.date as string) || todayStr;
    const location = (req.query.location as string) || 'bengaluru';

    // Validate date format YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      res.status(400).json({ error: 'Invalid date format. Expected YYYY-MM-DD' });
      return;
    }

    const panchanga = calculateDailyPanchanga({ date, location });
    res.json(panchanga);
  } catch (error: any) {
    console.error('Panchanga calculation error:', error);
    res.status(500).json({ error: error.message || 'Failed to calculate Panchanga' });
  }
});

export default router;

