import { Router, Request, Response } from 'express';
import { prisma } from '../prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { findCandidateMuhurtas } from '../utils/muhurtaService.js';

const router = Router();

// POST /api/muhurta/find (Calculate candidate auspicious timings)
router.post('/find', async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventType, location, startDate, endDate, timeRangePreference } = req.body;

    if (!eventType || !startDate || !endDate) {
      res.status(400).json({ error: 'Event type, start date, and end date are required.' });
      return;
    }

    const result = findCandidateMuhurtas({
      eventType,
      location: location || 'bengaluru',
      startDate,
      endDate,
      timeRangePreference,
    });

    res.json(result);
  } catch (error: any) {
    console.error('Muhurta calculation error:', error);
    res.status(500).json({ error: error.message || 'Failed to calculate Muhurtas' });
  }
});

// POST /api/muhurta/requests (Submit customer request)
router.post('/requests', authenticate, async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const {
      eventType,
      preferredLocation,
      startDate,
      endDate,
      timeRangePreference,
      contactNumber,
      preferredLanguage = 'en',
      notes,
    } = req.body;

    if (!eventType || !preferredLocation || !startDate || !endDate || !contactNumber) {
      res.status(400).json({ error: 'Please provide all required fields.' });
      return;
    }

    // Automatically calculate candidate Muhurtas on submission
    const candidates = findCandidateMuhurtas({
      eventType,
      location: preferredLocation,
      startDate,
      endDate,
      timeRangePreference,
    });

    const record = await prisma.muhurtaRequest.create({
      data: {
        userId,
        eventType,
        preferredLocation,
        startDate,
        endDate,
        timeRangePreference: timeRangePreference || null,
        contactNumber,
        preferredLanguage,
        notes: notes || null,
        status: req.user.role === 'ADMIN' ? 'APPROVED' : 'SUBMITTED',
        candidateMuhurtas: JSON.stringify(candidates),
        purohitComments:
          preferredLanguage === 'kn'
            ? 'ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್‌ರ ಪರಿಶೀಲನೆಯ ನಂತರ ಅಂತಿಮ ಶುಭ ಮುಹೂರ್ತವನ್ನು ನಿಶ್ಚಯಿಸಲಾಗುವುದು.'
            : 'Candidate timings calculated based on Vedic Panchanga. Subject to Purohit verification.',
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json(record);
  } catch (error: any) {
    console.error('Create Muhurta request error:', error);
    res.status(500).json({ error: error.message || 'Failed to submit Muhurta request' });
  }
});

// GET /api/muhurta/my-requests (Customer tracking)
router.get('/my-requests', authenticate, async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const requests = await prisma.muhurtaRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    const formatted = requests.map((r) => ({
      ...r,
      candidateMuhurtas: r.candidateMuhurtas ? JSON.parse(r.candidateMuhurtas) : null,
    }));

    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch requests' });
  }
});

// GET /api/muhurta/all (Admin listing with filters)
router.get('/all', authenticate, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, search } = req.query;
    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status as string;
    }

    if (search) {
      where.OR = [
        { eventType: { contains: search as string } },
        { preferredLocation: { contains: search as string } },
        { contactNumber: { contains: search as string } },
        { user: { name: { contains: search as string } } },
      ];
    }

    const requests = await prisma.muhurtaRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    const formatted = requests.map((r) => ({
      ...r,
      candidateMuhurtas: r.candidateMuhurtas ? JSON.parse(r.candidateMuhurtas) : null,
    }));

    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch all requests' });
  }
});

// PATCH /api/muhurta/:id/review (Admin review & approval)
router.patch('/:id/review', authenticate, requireAdmin, async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, purohitComments, candidateMuhurtas, rejectionReason } = req.body;

    const existing = await prisma.muhurtaRequest.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Muhurta request not found' });
      return;
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (purohitComments !== undefined) updateData.purohitComments = purohitComments;
    if (rejectionReason !== undefined) updateData.rejectionReason = rejectionReason;
    if (candidateMuhurtas) updateData.candidateMuhurtas = JSON.stringify(candidateMuhurtas);

    if (status === 'APPROVED') {
      updateData.approvedBy = req.user.name || 'Shree Prashanth Bhat';
      updateData.approvedAt = new Date();
    }

    const updated = await prisma.muhurtaRequest.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    res.json({
      ...updated,
      candidateMuhurtas: updated.candidateMuhurtas ? JSON.parse(updated.candidateMuhurtas) : null,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update Muhurta review' });
  }
});

// DELETE /api/muhurta/:id
router.delete('/:id', authenticate, async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await prisma.muhurtaRequest.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Request not found' });
      return;
    }

    if (req.user.role !== 'ADMIN' && existing.userId !== req.user.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await prisma.muhurtaRequest.delete({ where: { id } });
    res.json({ message: 'Muhurta request deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete request' });
  }
});

export default router;
