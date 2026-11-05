import { Router, Request, Response } from 'express';
import { prisma } from '../prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { performFullMarriageMatching } from '../utils/marriageMatchingServer.js';

const router = Router();

// POST /api/marriage-matching/calculate (Calculate compatibility without saving)
router.post('/calculate', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      brideName,
      brideDob,
      brideTob,
      bridePlace,
      groomName,
      groomDob,
      groomTob,
      groomPlace,
    } = req.body;

    if (!brideName || !groomName) {
      res.status(400).json({ error: 'Please provide names for both Bride and Groom.' });
      return;
    }

    const result = performFullMarriageMatching({
      brideName,
      brideDob: brideDob || '2000-05-15',
      brideTob: brideTob || '10:30',
      bridePlace: bridePlace || 'Bengaluru, Karnataka',
      groomName,
      groomDob: groomDob || '1998-08-20',
      groomTob: groomTob || '11:15',
      groomPlace: groomPlace || 'Bengaluru, Karnataka',
    });

    res.json(result);
  } catch (error: any) {
    console.error('Marriage matching calculation error:', error);
    res.status(500).json({ error: error.message || 'Failed to calculate Marriage Matching' });
  }
});

// POST /api/marriage-matching/requests (Submit matching request)
router.post('/requests', authenticate, async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const {
      brideName,
      brideDob,
      brideTob,
      bridePlace,
      groomName,
      groomDob,
      groomTob,
      groomPlace,
      contactNumber,
      preferredLanguage = 'en',
      notes,
    } = req.body;

    if (!brideName || !brideDob || !brideTob || !bridePlace || !groomName || !groomDob || !groomTob || !groomPlace || !contactNumber) {
      res.status(400).json({ error: 'Please provide all required fields.' });
      return;
    }

    // Automatically perform calculations
    const calculation = performFullMarriageMatching({
      brideName,
      brideDob,
      brideTob,
      bridePlace,
      groomName,
      groomDob,
      groomTob,
      groomPlace,
    });

    const record = await prisma.marriageMatchingRequest.create({
      data: {
        userId,
        brideName,
        brideDob,
        brideTob,
        bridePlace,
        brideGender: 'FEMALE',
        groomName,
        groomDob,
        groomTob,
        groomPlace,
        groomGender: 'MALE',
        contactNumber,
        preferredLanguage,
        notes: notes || null,
        status: req.user.role === 'ADMIN' ? 'APPROVED' : 'SUBMITTED',
        calculationData: JSON.stringify(calculation),
        purohitComments:
          preferredLanguage === 'kn'
            ? 'ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್‌ರ ಪರಿಶೀಲನೆ ಹಾಗೂ ಆಶೀರ್ವಾದದೊಂದಿಗೆ ವರದಿ ನೀಡಲಾಗುವುದು.'
            : 'Marriage matching calculated with Ashta Koota standards. Under Purohit review.',
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json(record);
  } catch (error: any) {
    console.error('Create Marriage Matching request error:', error);
    res.status(500).json({ error: error.message || 'Failed to submit Marriage Matching request' });
  }
});

// GET /api/marriage-matching/my-requests (Customer request tracking)
router.get('/my-requests', authenticate, async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const requests = await prisma.marriageMatchingRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    const formatted = requests.map((r) => ({
      ...r,
      calculationData: r.calculationData ? JSON.parse(r.calculationData) : null,
    }));

    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch Marriage requests' });
  }
});

// GET /api/marriage-matching/all (Admin request listing with filters)
router.get('/all', authenticate, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, search } = req.query;
    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status as string;
    }

    if (search) {
      where.OR = [
        { brideName: { contains: search as string } },
        { groomName: { contains: search as string } },
        { contactNumber: { contains: search as string } },
        { user: { name: { contains: search as string } } },
      ];
    }

    const requests = await prisma.marriageMatchingRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    const formatted = requests.map((r) => ({
      ...r,
      calculationData: r.calculationData ? JSON.parse(r.calculationData) : null,
    }));

    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch all Marriage requests' });
  }
});

// PATCH /api/marriage-matching/:id/review (Admin review & approval)
router.patch('/:id/review', authenticate, requireAdmin, async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, purohitComments, rejectionReason, calculationData } = req.body;

    const existing = await prisma.marriageMatchingRequest.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Marriage matching request not found' });
      return;
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (purohitComments !== undefined) updateData.purohitComments = purohitComments;
    if (rejectionReason !== undefined) updateData.rejectionReason = rejectionReason;
    if (calculationData) updateData.calculationData = JSON.stringify(calculationData);

    if (status === 'APPROVED') {
      updateData.approvedBy = req.user.name || 'Shree Prashanth Bhat';
      updateData.approvedAt = new Date();
    }

    const updated = await prisma.marriageMatchingRequest.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    res.json({
      ...updated,
      calculationData: updated.calculationData ? JSON.parse(updated.calculationData) : null,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update Marriage review' });
  }
});

// DELETE /api/marriage-matching/:id
router.delete('/:id', authenticate, async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await prisma.marriageMatchingRequest.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Request not found' });
      return;
    }

    if (req.user.role !== 'ADMIN' && existing.userId !== req.user.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await prisma.marriageMatchingRequest.delete({ where: { id } });
    res.json({ message: 'Marriage matching request deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete request' });
  }
});

export default router;
