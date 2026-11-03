import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { authenticate, requireAdmin, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `gallery-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|avif/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WEBP, AVIF) are allowed'));
    }
  },
});

const gallerySchema = z.object({
  imageUrl: z.string().min(1, 'Image URL or file is required'),
  captionEnglish: z.string().min(1, 'English caption is required'),
  captionKannada: z.string().min(1, 'Kannada caption is required'),
  category: z.string().default('Pooja Ceremonies'),
  sortOrder: z.coerce.number().default(0),
  isActive: z.coerce.boolean().default(true),
});

// GET /api/gallery (Public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const where: any = { isActive: true };

    if (category && typeof category === 'string' && category !== 'All') {
      if (category === 'Pooja Ceremonies') {
        where.OR = [
          { category: 'Pooja Ceremonies' },
          { category: 'Sathyanarayana Pooja' },
          { category: 'Sashtiapthapoorthi Shanti' },
          { category: 'Grihapravesha' },
          { category: 'Durga Namaskara' },
        ];
      } else {
        where.category = category;
      }
    }

    const images = await prisma.galleryImage.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    const formatted = images.map((img) => {
      let imageList: string[] = [];
      if (img.imageUrl.startsWith('[') && img.imageUrl.endsWith(']')) {
        try {
          imageList = JSON.parse(img.imageUrl);
        } catch (e) {
          imageList = [img.imageUrl];
        }
      } else if (img.imageUrl.includes(',')) {
        imageList = img.imageUrl.split(',').map((s) => s.trim());
      } else {
        imageList = [img.imageUrl];
      }

      return {
        ...img,
        images: imageList,
        imageUrl: imageList[0] || img.imageUrl,
      };
    });

    res.json({
      success: true,
      data: formatted,
    });
  } catch (error: any) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery images',
      error: error?.message,
    });
  }
});

// GET /api/gallery/:id (Public: Get single gallery image)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const img = await prisma.galleryImage.findUnique({
      where: { id },
    });

    if (!img) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found',
      });
    }

    let imageList: string[] = [];
    if (img.imageUrl.startsWith('[') && img.imageUrl.endsWith(']')) {
      try {
        imageList = JSON.parse(img.imageUrl);
      } catch (e) {
        imageList = [img.imageUrl];
      }
    } else if (img.imageUrl.includes(',')) {
      imageList = img.imageUrl.split(',').map((s) => s.trim());
    } else {
      imageList = [img.imageUrl];
    }

    const formatted = {
      ...img,
      images: imageList,
      imageUrl: imageList[0] || img.imageUrl,
    };

    res.json({
      success: true,
      data: formatted,
    });
  } catch (error: any) {
    console.error('Error fetching gallery image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery image',
      error: error?.message,
    });
  }
});

// POST /api/gallery (Admin only: support file upload OR direct image URL)
router.post(
  '/',
  authenticate,
  requireAdmin,
  upload.single('image'),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      let imageUrl = req.body.imageUrl;

      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
      }

      if (!imageUrl) {
        return res.status(400).json({
          success: false,
          message: 'Image file or image URL is required',
        });
      }

      const parsed = gallerySchema.safeParse({
        ...req.body,
        imageUrl,
      });

      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: parsed.error.errors[0].message,
        });
      }

      const created = await prisma.galleryImage.create({
        data: parsed.data,
      });

      res.status(201).json({
        success: true,
        data: created,
      });
    } catch (error: any) {
      console.error('Error creating gallery image:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to upload image',
      });
    }
  }
);

// PUT /api/gallery/:id (Admin only)
router.put('/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const parsed = gallerySchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.errors[0].message,
      });
    }

    const updated = await prisma.galleryImage.update({
      where: { id },
      data: parsed.data,
    });

    res.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating gallery image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update gallery image',
      error: error?.message,
    });
  }
});

// DELETE /api/gallery/:id (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.galleryImage.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Gallery image deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete gallery image',
      error: error?.message,
    });
  }
});

export default router;
