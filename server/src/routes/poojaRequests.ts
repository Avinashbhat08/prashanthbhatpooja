import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

const poojaRequestItemSchema = z.object({
  poojaItemId: z.string().optional().nullable(),
  nameEnglish: z.string(),
  nameKannada: z.string(),
  quantity: z.string().optional().nullable(),
});

const poojaRequestSchema = z.object({
  poojaName: z.string().min(1, 'Pooja name is required'),
  poojaDate: z.string().min(1, 'Pooja date is required'),
  poojaTime: z.string().min(1, 'Pooja time is required'),
  personName: z.string().min(1, 'Person name is required'),
  gothra: z.string().optional().nullable(),
  nakshatra: z.string().optional().nullable(),
  contactNumber: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  items: z.array(poojaRequestItemSchema).min(1, 'At least one item must be selected'),
});

// POST /api/pooja-requests (Authenticated)
router.post('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = poojaRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.errors[0].message });
    }

    const {
      poojaName,
      poojaDate,
      poojaTime,
      personName,
      gothra,
      nakshatra,
      contactNumber,
      location,
      notes,
      items,
    } = parsed.data;

    const request = await prisma.poojaRequest.create({
      data: {
        userId: req.user?.id || null,
        poojaName,
        poojaDate,
        poojaTime,
        personName,
        gothra,
        nakshatra,
        contactNumber,
        location,
        notes,
        items: {
          create: items.map((item) => ({
            poojaItemId: item.poojaItemId || null,
            itemNameEnglishSnapshot: item.nameEnglish,
            itemNameKannadaSnapshot: item.nameKannada,
            quantity: item.quantity || null,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    res.status(201).json(request);
  } catch (error) {
    console.error('Error saving pooja request:', error);
    res.status(500).json({ message: 'Failed to record pooja request' });
  }
});

// GET /api/pooja-requests (Authenticated)
router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const where: any = {};
    // If not admin, only get current user's requests
    if (req.user?.role !== 'ADMIN') {
      where.userId = req.user?.id;
    }

    const requests = await prisma.poojaRequest.findMany({
      where,
      include: {
        items: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pooja requests' });
  }
});

// GET /api/pooja-requests/:id (Authenticated)
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const request = await prisma.poojaRequest.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!request) {
      return res.status(404).json({ message: 'Pooja request not found' });
    }

    // Security check: only creator or admin can view
    if (req.user?.role !== 'ADMIN' && request.userId !== req.user?.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pooja request' });
  }
});

export default router;
