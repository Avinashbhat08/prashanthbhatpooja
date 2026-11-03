import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { authenticate, requireAdmin, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

const poojaItemSchema = z.object({
  nameEnglish: z.string().min(1, 'English name is required'),
  nameKannada: z.string().min(1, 'Kannada name is required'),
  categoryId: z.string().min(1, 'Category is required'),
  defaultQuantity: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

// GET /api/pooja-items (Protected: requires authentication)
router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { categoryId, q } = req.query;

    const where: any = {};

    // Non-admin users only see active items
    if (req.user?.role !== 'ADMIN') {
      where.isActive = true;
    }

    if (categoryId && typeof categoryId === 'string' && categoryId !== 'all') {
      where.categoryId = categoryId;
    }

    if (q && typeof q === 'string' && q.trim()) {
      const searchTerm = q.trim();
      where.OR = [
        { nameEnglish: { contains: searchTerm } },
        { nameKannada: { contains: searchTerm } },
      ];
    }

    const items = await prisma.poojaItem.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            nameEnglish: true,
            nameKannada: true,
          },
        },
      },
      orderBy: { nameEnglish: 'asc' },
    });

    res.json(items);
  } catch (error) {
    console.error('Error fetching pooja items:', error);
    res.status(500).json({ message: 'Failed to fetch pooja items' });
  }
});

// GET /api/pooja-items/:id (Protected)
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const item = await prisma.poojaItem.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!item) {
      return res.status(404).json({ message: 'Pooja item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch item' });
  }
});

// POST /api/pooja-items (Admin only)
router.post('/', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = poojaItemSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.errors[0].message });
    }

    const { nameEnglish, nameKannada, categoryId, defaultQuantity, isActive } = parsed.data;

    const newItem = await prisma.poojaItem.create({
      data: {
        nameEnglish,
        nameKannada,
        categoryId,
        defaultQuantity: defaultQuantity || null,
        isActive: isActive !== undefined ? isActive : true,
      },
      include: {
        category: true,
      },
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ message: 'Failed to create pooja item' });
  }
});

// PUT /api/pooja-items/:id (Admin only)
router.put('/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const parsed = poojaItemSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.errors[0].message });
    }

    const updated = await prisma.poojaItem.update({
      where: { id },
      data: parsed.data,
      include: {
        category: true,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Failed to update pooja item' });
  }
});

// DELETE /api/pooja-items/:id (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.poojaItem.delete({
      where: { id },
    });

    res.json({ message: 'Pooja item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete pooja item' });
  }
});

export default router;
