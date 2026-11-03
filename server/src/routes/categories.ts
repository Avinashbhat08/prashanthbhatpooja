import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { authenticate, requireAdmin, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

const categorySchema = z.object({
  nameEnglish: z.string().min(2, 'English name is required'),
  nameKannada: z.string().min(2, 'Kannada name is required'),
  isActive: z.boolean().optional(),
});

// GET /api/categories
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.poojaCategory.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { items: true },
        },
      },
      orderBy: { nameEnglish: 'asc' },
    });
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

// POST /api/categories (Admin only)
router.post('/', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = categorySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
    }

    const category = await prisma.poojaCategory.create({
      data: parsed.data,
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create category' });
  }
});

// PUT /api/categories/:id (Admin only)
router.put('/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const parsed = categorySchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
    }

    const updated = await prisma.poojaCategory.update({
      where: { id },
      data: parsed.data,
    });

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update category' });
  }
});

// DELETE /api/categories/:id (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.poojaCategory.delete({
      where: { id },
    });

    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
});

export default router;
