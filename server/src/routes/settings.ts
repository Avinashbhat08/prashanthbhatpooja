import { Router, Request, Response } from 'express';
import { prisma } from '../prisma.js';
import { authenticate, requireAdmin, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/settings
router.get('/', async (req: Request, res: Response) => {
  try {
    const settings = await prisma.systemSetting.findMany();
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });
    res.json(settingsMap);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
});

// PUT /api/settings (Admin only)
router.put('/', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updates: Record<string, string> = req.body;

    for (const [key, value] of Object.entries(updates)) {
      if (typeof value === 'string') {
        await prisma.systemSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
      }
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update settings' });
  }
});

export default router;

