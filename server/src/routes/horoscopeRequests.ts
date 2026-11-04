import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { authenticate, requireAdmin, AuthenticatedRequest } from '../middleware/auth.js';
import { calculateHoroscope } from '../utils/astronomy.js';

const router = Router();

// Validation schema for creating a request
const createHoroscopeSchema = z.object({
  personName: z.string().min(2, 'Person name is required'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Valid Date of Birth (YYYY-MM-DD) is required'),
  timeOfBirth: z.string().regex(/^\d{2}:\d{2}$/, 'Valid Time of Birth (HH:MM) is required'),
  birthPlace: z.string().min(2, 'Birth place is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  contactNumber: z.string().min(8, 'Contact number is required'),
  preferredLanguage: z.enum(['en', 'kn']).default('en'),
  notes: z.string().optional(),
});

/**
 * 1. POST /api/horoscope-requests
 * Authenticated customer submits a new horoscope request
 */
router.post('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedData = createHoroscopeSchema.parse(req.body);
    const userId = req.user!.id;

    const request = await prisma.horoscopeRequest.create({
      data: {
        userId,
        personName: validatedData.personName,
        dateOfBirth: validatedData.dateOfBirth,
        timeOfBirth: validatedData.timeOfBirth,
        birthPlace: validatedData.birthPlace,
        gender: validatedData.gender || null,
        contactNumber: validatedData.contactNumber,
        preferredLanguage: validatedData.preferredLanguage,
        notes: validatedData.notes || null,
        status: 'SUBMITTED',
      },
    });

    // Create a customer notification
    await prisma.notification.create({
      data: {
        userId,
        horoscopeRequestId: request.id,
        type: 'SUBMITTED',
        titleEnglish: 'Horoscope Request Submitted',
        titleKannada: 'ಜಾತಕ ವಿನಂತಿ ಸಲ್ಲಿಕೆಯಾಗಿದೆ',
        messageEnglish: `Your horoscope request for ${request.personName} (ID: ${request.id.slice(0, 8)}) has been received for Purohit review.`,
        messageKannada: `${request.personName} ಅವರ ಜಾತಕ ವಿನಂತಿಯನ್ನು ಪುರೋಹಿತರ ಪರಿಶೀಲನೆಗಾಗಿ ಯಶಸ್ವಿಯಾಗಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ.`,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Horoscope request submitted successfully',
      data: request,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

/**
 * 1b. POST /api/horoscope-requests/direct-generate
 * Admin directly generates an approved Vedic Kundali & Horoscope (with full Vimshottari Dasha)
 */
router.post('/direct-generate', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedData = createHoroscopeSchema.parse(req.body);
    const userId = req.user!.id;

    // Calculate full ephemeris, Kundali, Vimshottari Dasha, and Doshas
    const calcResult = calculateHoroscope({
      personName: validatedData.personName,
      dateOfBirth: validatedData.dateOfBirth,
      timeOfBirth: validatedData.timeOfBirth,
      birthPlace: validatedData.birthPlace,
    });

    // Save directly as APPROVED
    const request = await prisma.horoscopeRequest.create({
      data: {
        userId,
        personName: validatedData.personName,
        dateOfBirth: validatedData.dateOfBirth,
        timeOfBirth: validatedData.timeOfBirth,
        birthPlace: validatedData.birthPlace,
        gender: validatedData.gender || null,
        contactNumber: validatedData.contactNumber,
        preferredLanguage: validatedData.preferredLanguage,
        notes: validatedData.notes || null,
        status: 'APPROVED',
        assignedReviewer: req.user!.name,
        approvedBy: req.user!.name,
        approvedAt: new Date(),
        calculationData: JSON.stringify(calcResult),
        doshaAnalysis: JSON.stringify(calcResult.doshas),
        remedies: JSON.stringify(calcResult.remedies),
        purohitComments: 'ಸಕಲ ಗ್ರಹಾನುಗ್ರಹ ಸಿದ್ಧಿರಸ್ತು, ಶುಭಂ ಭವತು! ಧರ್ಮ, ಅರ್ಥ, ಕಾಮ, ಮೋಕ್ಷ ಚತುರ್ವಿಧ ಫಲಪ್ರಾಪ್ತಿರಸ್ತು.',
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Kundali and Vimshottari Dasha generated successfully',
      data: {
        ...request,
        calculationData: calcResult,
        doshaAnalysis: calcResult.doshas,
        remedies: calcResult.remedies,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    return res.status(500).json({ success: false, message: error.message || 'Generation error' });
  }
});

/**
 * 2. GET /api/horoscope-requests/my
 * Authenticated customer retrieves their own requests
 */
router.get('/my', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const requests = await prisma.horoscopeRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        personName: true,
        dateOfBirth: true,
        timeOfBirth: true,
        birthPlace: true,
        gender: true,
        contactNumber: true,
        preferredLanguage: true,
        notes: true,
        status: true,
        assignedReviewer: true,
        approvedBy: true,
        approvedAt: true,
        rejectionReason: true,
        createdAt: true,
        updatedAt: true,
        // Only expose full calculations & dosha review when approved
        calculationData: true,
        doshaAnalysis: true,
        remedies: true,
        purohitComments: true,
      },
    });

    // Sanitize: do not leak raw calculation / dosha analysis to customer before approval
    const sanitized = requests.map((r) => {
      if (r.status !== 'APPROVED') {
        return {
          ...r,
          calculationData: null,
          doshaAnalysis: null,
          remedies: null,
          purohitComments: null,
        };
      }
      return {
        ...r,
        calculationData: r.calculationData ? JSON.parse(r.calculationData) : null,
        doshaAnalysis: r.doshaAnalysis ? JSON.parse(r.doshaAnalysis) : null,
        remedies: r.remedies ? JSON.parse(r.remedies) : null,
      };
    });

    return res.json({ success: true, data: sanitized });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

/**
 * 3. GET /api/horoscope-requests
 * Admin retrieves all requests with optional status and search filters
 */
router.get('/', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, search } = req.query;

    const whereClause: any = {};
    if (status && status !== 'ALL') {
      whereClause.status = String(status);
    }
    if (search) {
      const q = String(search).trim();
      whereClause.OR = [
        { personName: { contains: q } },
        { birthPlace: { contains: q } },
        { contactNumber: { contains: q } },
        { id: { contains: q } },
      ];
    }

    const requests = await prisma.horoscopeRequest.findMany({
      where: whereClause,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const parsed = requests.map((r) => ({
      ...r,
      calculationData: r.calculationData ? JSON.parse(r.calculationData) : null,
      doshaAnalysis: r.doshaAnalysis ? JSON.parse(r.doshaAnalysis) : null,
      remedies: r.remedies ? JSON.parse(r.remedies) : null,
    }));

    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

/**
 * 4. GET /api/horoscope-requests/:id
 * Get single request details
 */
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const request = await prisma.horoscopeRequest.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!request) {
      return res.status(404).json({ success: false, message: 'Horoscope request not found' });
    }

    const isAdmin = req.user!.role === 'ADMIN';
    const isOwner = request.userId === req.user!.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
    }

    // If customer and not approved, do not expose draft calculation data
    if (!isAdmin && request.status !== 'APPROVED') {
      return res.json({
        success: true,
        data: {
          ...request,
          calculationData: null,
          doshaAnalysis: null,
          remedies: null,
          purohitComments: null,
        },
      });
    }

    return res.json({
      success: true,
      data: {
        ...request,
        calculationData: request.calculationData ? JSON.parse(request.calculationData) : null,
        doshaAnalysis: request.doshaAnalysis ? JSON.parse(request.doshaAnalysis) : null,
        remedies: request.remedies ? JSON.parse(request.remedies) : null,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

/**
 * 5. POST /api/horoscope-requests/:id/calculate
 * Admin triggers real astronomical ephemeris calculation
 */
router.post('/:id/calculate', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const request = await prisma.horoscopeRequest.findUnique({ where: { id } });

    if (!request) {
      return res.status(404).json({ success: false, message: 'Horoscope request not found' });
    }

    // Perform astronomical calculation
    const calcResult = calculateHoroscope({
      personName: request.personName,
      dateOfBirth: request.dateOfBirth,
      timeOfBirth: request.timeOfBirth,
      birthPlace: request.birthPlace,
    });

    // Update in database
    const updated = await prisma.horoscopeRequest.update({
      where: { id },
      data: {
        calculationData: JSON.stringify(calcResult),
        doshaAnalysis: JSON.stringify(calcResult.doshas),
        remedies: JSON.stringify(calcResult.remedies),
        status: 'CALCULATION_COMPLETED',
        assignedReviewer: req.user!.name,
      },
    });

    // Notify customer
    await prisma.notification.create({
      data: {
        userId: request.userId,
        horoscopeRequestId: id,
        type: 'UNDER_REVIEW',
        titleEnglish: 'Horoscope Calculation Completed',
        titleKannada: 'ಗ್ರಹಗಳ ಗಣನೆ ಪೂರ್ಣಗೊಂಡಿದೆ',
        messageEnglish: `Astronomical planetary calculations completed for ${request.personName}. Purohit Prashanth Bhat is now conducting traditional Dosha review.`,
        messageKannada: `${request.personName} ಅವರ ಖಗೋಳ ಗ್ರಹಗಳ ಗಣನೆ ಪೂರ್ಣಗೊಂಡಿದ್ದು, ಪುರೋಹಿತರು ಸಾಂಪ್ರದಾಯಿಕ ದೋಷ ಪರಿಶೀಲನೆ ನಡೆಸುತ್ತಿದ್ದಾರೆ.`,
      },
    });

    return res.json({
      success: true,
      message: 'Astronomical calculation completed successfully',
      data: {
        ...updated,
        calculationData: calcResult,
        doshaAnalysis: calcResult.doshas,
        remedies: calcResult.remedies,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Calculation error' });
  }
});

/**
 * 6. PUT /api/horoscope-requests/:id/review
 * Admin reviews and edits Doshas, Remedies, and Notes
 */
router.put('/:id/review', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { doshas, remedies, purohitComments, status } = req.body;

    const request = await prisma.horoscopeRequest.findUnique({ where: { id } });
    if (!request) {
      return res.status(404).json({ success: false, message: 'Horoscope request not found' });
    }

    const updateData: any = {};
    if (doshas !== undefined) updateData.doshaAnalysis = JSON.stringify(doshas);
    if (remedies !== undefined) updateData.remedies = JSON.stringify(remedies);
    if (purohitComments !== undefined) updateData.purohitComments = purohitComments;
    if (status && ['UNDER_REVIEW', 'CALCULATION_COMPLETED', 'PENDING_APPROVAL'].includes(status)) {
      updateData.status = status;
    } else {
      updateData.status = 'PENDING_APPROVAL';
    }

    const updated = await prisma.horoscopeRequest.update({
      where: { id },
      data: updateData,
    });

    return res.json({
      success: true,
      message: 'Dosha and remedies review saved',
      data: {
        ...updated,
        calculationData: updated.calculationData ? JSON.parse(updated.calculationData) : null,
        doshaAnalysis: updated.doshaAnalysis ? JSON.parse(updated.doshaAnalysis) : null,
        remedies: updated.remedies ? JSON.parse(updated.remedies) : null,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Review save error' });
  }
});

/**
 * 7. POST /api/horoscope-requests/:id/approve
 * Admin approves final horoscope and publishes report to customer
 */
router.post('/:id/approve', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { purohitComments } = req.body;

    const request = await prisma.horoscopeRequest.findUnique({ where: { id } });
    if (!request) {
      return res.status(404).json({ success: false, message: 'Horoscope request not found' });
    }

    if (!request.calculationData) {
      return res.status(400).json({
        success: false,
        message: 'Cannot approve request before calculating astronomical positions',
      });
    }

    const updated = await prisma.horoscopeRequest.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedBy: req.user!.name,
        approvedAt: new Date(),
        ...(purohitComments ? { purohitComments } : {}),
      },
    });

    // Notify customer that their approved horoscope is ready
    await prisma.notification.create({
      data: {
        userId: request.userId,
        horoscopeRequestId: id,
        type: 'APPROVED',
        titleEnglish: 'Horoscope Approved & PDF Ready',
        titleKannada: 'ಜಾತಕ ಅನುಮೋದಿಸಲಾಗಿದೆ ಹಾಗೂ ಪಿಡಿಎಫ್ ಸಿದ್ಧವಾಗಿದೆ',
        messageEnglish: `Veda Brahma Shree Prashanth Bhat has approved the horoscope report for ${request.personName}. You can now view the full analysis and download your bilingual PDF.`,
        messageKannada: `ವೇದ ಬ್ರಹ್ಮ ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್ ಅವರು ${request.personName} ಅವರ ಜಾತಕ ವರದಿಯನ್ನು ಅನುಮೋದಿಸಿದ್ದಾರೆ. ನಿಮ್ಮ ಸಂಪೂರ್ಣ ವರದಿ ಹಾಗೂ ದ್ವಿಭಾಷಾ ಪಿಡಿಎಫ್ ಲಭ್ಯವಿದೆ.`,
      },
    });

    return res.json({
      success: true,
      message: 'Horoscope approved successfully and released to customer',
      data: {
        ...updated,
        calculationData: updated.calculationData ? JSON.parse(updated.calculationData) : null,
        doshaAnalysis: updated.doshaAnalysis ? JSON.parse(updated.doshaAnalysis) : null,
        remedies: updated.remedies ? JSON.parse(updated.remedies) : null,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Approval error' });
  }
});

/**
 * 8. POST /api/horoscope-requests/:id/reject
 * Admin rejects horoscope request with explanation
 */
router.post('/:id/reject', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { reason } = req.body;

    if (!reason || reason.trim().length < 5) {
      return res.status(400).json({ success: false, message: 'A clear rejection reason is required' });
    }

    const request = await prisma.horoscopeRequest.findUnique({ where: { id } });
    if (!request) {
      return res.status(404).json({ success: false, message: 'Horoscope request not found' });
    }

    const updated = await prisma.horoscopeRequest.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectionReason: reason.trim(),
        assignedReviewer: req.user!.name,
      },
    });

    // Notify customer
    await prisma.notification.create({
      data: {
        userId: request.userId,
        horoscopeRequestId: id,
        type: 'REJECTED',
        titleEnglish: 'Horoscope Request Needs Attention',
        titleKannada: 'ಜಾತಕ ವಿನಂತಿಯ ಕುರಿತು ಮಾಹಿತಿ',
        messageEnglish: `Your horoscope request for ${request.personName} could not be approved: ${reason.trim()}. Please review and submit a fresh request if needed.`,
        messageKannada: `${request.personName} ಅವರ ಜಾತಕ ವಿನಂತಿಯನ್ನು ಅನುಮೋದಿಸಲು ಸಾಧ್ಯವಾಗಿಲ್ಲ: ${reason.trim()}`,
      },
    });

    return res.json({
      success: true,
      message: 'Horoscope request marked as rejected',
      data: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Reject error' });
  }
});

/**
 * 9. GET /api/horoscope-requests/:id/dasha
 * Retrieve full Vimshottari Dasha hierarchy
 */
router.get('/:id/dasha', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const request = await prisma.horoscopeRequest.findUnique({ where: { id } });
    if (!request) {
      return res.status(404).json({ success: false, message: 'Horoscope not found' });
    }

    const isAdmin = req.user!.role === 'ADMIN';
    const isOwner = request.userId === req.user!.id;
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (!isAdmin && request.status !== 'APPROVED') {
      return res.status(400).json({ success: false, message: 'Dasha calculations are under Purohit review' });
    }

    const calc = request.calculationData ? JSON.parse(request.calculationData) : null;
    if (!calc || !calc.vimshottari) {
      return res.status(404).json({ success: false, message: 'Vimshottari Dasha not yet calculated' });
    }

    return res.json({ success: true, data: calc.vimshottari });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 10. GET /api/horoscope-requests/:id/dasha/current
 * Retrieve current running Mahadasha, Antardasha, and Pratyantardasha as of reference date
 */
router.get('/:id/dasha/current', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const request = await prisma.horoscopeRequest.findUnique({ where: { id } });
    if (!request) {
      return res.status(404).json({ success: false, message: 'Horoscope not found' });
    }

    const isAdmin = req.user!.role === 'ADMIN';
    const isOwner = request.userId === req.user!.id;
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const calc = request.calculationData ? JSON.parse(request.calculationData) : null;
    if (!calc || !calc.vimshottari) {
      return res.status(404).json({ success: false, message: 'Vimshottari Dasha not available' });
    }

    return res.json({ success: true, data: calc.vimshottari.currentDasha });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
