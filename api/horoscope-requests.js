import { setCorsHeaders, verifyToken } from './_lib/jwt.js';
import { calculateHoroscope } from './_lib/astronomy.js';

let liveHoroscopeRequests = [];
let liveNotifications = [];

export { liveNotifications };

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const user = verifyToken(authHeader.split(' ')[1]);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }

  const { id, my, action, status, search } = req.query || {};

  // GET Requests
  if (req.method === 'GET') {
    // Single request details
    if (id) {
      const found = liveHoroscopeRequests.find((r) => r.id === String(id));
      if (!found) {
        return res.status(404).json({ success: false, message: 'Horoscope request not found' });
      }

      const isAdmin = user.role === 'ADMIN';
      const isOwner = found.userId === user.id;

      if (!isAdmin && !isOwner) {
        return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
      }

      if (!isAdmin && found.status !== 'APPROVED') {
        return res.status(200).json({
          success: true,
          data: {
            ...found,
            calculationData: null,
            doshaAnalysis: null,
            remedies: null,
            purohitComments: null,
          },
        });
      }

      return res.status(200).json({ success: true, data: found });
    }

    // Customer's own requests
    if (my === 'true' || user.role !== 'ADMIN') {
      const myRequests = liveHoroscopeRequests
        .filter((r) => r.userId === user.id)
        .map((r) => {
          if (r.status !== 'APPROVED') {
            return {
              ...r,
              calculationData: null,
              doshaAnalysis: null,
              remedies: null,
              purohitComments: null,
            };
          }
          return r;
        });

      return res.status(200).json({ success: true, data: myRequests });
    }

    // Admin listing with filters
    let list = [...liveHoroscopeRequests];
    if (status && status !== 'ALL') {
      list = list.filter((r) => r.status === status);
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(
        (r) =>
          r.personName.toLowerCase().includes(q) ||
          r.birthPlace.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({ success: true, data: list });
  }

  // POST: Create request or Trigger Admin Action
  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    // Action 1: Admin Ephemeris Calculation
    if (action === 'calculate' && id) {
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
      }
      const item = liveHoroscopeRequests.find((r) => r.id === String(id));
      if (!item) return res.status(404).json({ success: false, message: 'Request not found' });

      const calcResult = calculateHoroscope({
        personName: item.personName,
        dateOfBirth: item.dateOfBirth,
        timeOfBirth: item.timeOfBirth,
        birthPlace: item.birthPlace,
      });

      item.calculationData = calcResult;
      item.doshaAnalysis = calcResult.doshas;
      item.remedies = calcResult.remedies;
      item.status = 'CALCULATION_COMPLETED';
      item.assignedReviewer = user.name;
      item.updatedAt = new Date().toISOString();

      liveNotifications.unshift({
        id: `notif-${Date.now()}`,
        userId: item.userId,
        horoscopeRequestId: item.id,
        type: 'UNDER_REVIEW',
        titleEnglish: 'Horoscope Calculation Completed',
        titleKannada: 'ಗ್ರಹಗಳ ಗಣನೆ ಪೂರ್ಣಗೊಂಡಿದೆ',
        messageEnglish: `Astronomical planetary calculations completed for ${item.personName}. Purohit Prashanth Bhat is now conducting traditional Dosha review.`,
        messageKannada: `${item.personName} ಅವರ ಖಗೋಳ ಗ್ರಹಗಳ ಗಣನೆ ಪೂರ್ಣಗೊಂಡಿದ್ದು, ಪುರೋಹಿತರು ಸಾಂಪ್ರದಾಯಿಕ ದೋಷ ಪರಿಶೀಲನೆ ನಡೆಸುತ್ತಿದ್ದಾರೆ.`,
        isRead: false,
        createdAt: new Date().toISOString(),
      });

      return res.status(200).json({
        success: true,
        message: 'Astronomical calculation completed successfully',
        data: item,
      });
    }

    // Action 2: Admin Approve Horoscope
    if (action === 'approve' && id) {
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
      }
      const item = liveHoroscopeRequests.find((r) => r.id === String(id));
      if (!item) return res.status(404).json({ success: false, message: 'Request not found' });

      if (!item.calculationData) {
        return res.status(400).json({
          success: false,
          message: 'Cannot approve request before calculating astronomical positions',
        });
      }

      item.status = 'APPROVED';
      item.approvedBy = user.name;
      item.approvedAt = new Date().toISOString();
      if (body.purohitComments) item.purohitComments = body.purohitComments;
      item.updatedAt = new Date().toISOString();

      liveNotifications.unshift({
        id: `notif-${Date.now()}`,
        userId: item.userId,
        horoscopeRequestId: item.id,
        type: 'APPROVED',
        titleEnglish: 'Horoscope Approved & PDF Ready',
        titleKannada: 'ಜಾತಕ ಅನುಮೋದಿಸಲಾಗಿದೆ ಹಾಗೂ ಪಿಡಿಎಫ್ ಸಿದ್ಧವಾಗಿದೆ',
        messageEnglish: `Veda Brahma Shree Prashanth Bhat has approved the horoscope report for ${item.personName}. You can now view the full analysis and download your bilingual PDF.`,
        messageKannada: `ವೇದ ಬ್ರಹ್ಮ ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್ ಅವರು ${item.personName} ಅವರ ಜಾತಕ ವರದಿಯನ್ನು ಅನುಮೋದಿಸಿದ್ದಾರೆ. ನಿಮ್ಮ ಸಂಪೂರ್ಣ ವರದಿ ಹಾಗೂ ದ್ವಿಭಾಷಾ ಪಿಡಿಎಫ್ ಲಭ್ಯವಿದೆ.`,
        isRead: false,
        createdAt: new Date().toISOString(),
      });

      return res.status(200).json({
        success: true,
        message: 'Horoscope approved successfully',
        data: item,
      });
    }

    // Action 3: Admin Reject Request
    if (action === 'reject' && id) {
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
      }
      const item = liveHoroscopeRequests.find((r) => r.id === String(id));
      if (!item) return res.status(404).json({ success: false, message: 'Request not found' });

      item.status = 'REJECTED';
      item.rejectionReason = body.reason || 'Information requires clarification';
      item.assignedReviewer = user.name;
      item.updatedAt = new Date().toISOString();

      liveNotifications.unshift({
        id: `notif-${Date.now()}`,
        userId: item.userId,
        horoscopeRequestId: item.id,
        type: 'REJECTED',
        titleEnglish: 'Horoscope Request Needs Attention',
        titleKannada: 'ಜಾತಕ ವಿನಂತಿಯ ಕುರಿತು ಮಾಹಿತಿ',
        messageEnglish: `Your horoscope request for ${item.personName} could not be approved: ${item.rejectionReason}`,
        messageKannada: `${item.personName} ಅವರ ಜಾತಕ ವಿನಂತಿಯನ್ನು ಅನುಮೋದಿಸಲು ಸಾಧ್ಯವಾಗಿಲ್ಲ: ${item.rejectionReason}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      });

      return res.status(200).json({ success: true, data: item });
    }

    // Action 4: Customer Creates New Request
    if (!body.personName || !body.dateOfBirth || !body.timeOfBirth || !body.birthPlace || !body.contactNumber) {
      return res.status(400).json({ success: false, message: 'Missing required birth details' });
    }

    const newReq = {
      id: `hr-${Date.now()}`,
      userId: user.id,
      user: { id: user.id, name: user.name, email: user.email },
      personName: body.personName,
      dateOfBirth: body.dateOfBirth,
      timeOfBirth: body.timeOfBirth,
      birthPlace: body.birthPlace,
      gender: body.gender || null,
      contactNumber: body.contactNumber,
      preferredLanguage: body.preferredLanguage || 'en',
      notes: body.notes || null,
      status: 'SUBMITTED',
      assignedReviewer: null,
      calculationData: null,
      doshaAnalysis: null,
      remedies: null,
      purohitComments: null,
      approvedBy: null,
      approvedAt: null,
      rejectionReason: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    liveHoroscopeRequests.unshift(newReq);

    liveNotifications.unshift({
      id: `notif-${Date.now()}`,
      userId: user.id,
      horoscopeRequestId: newReq.id,
      type: 'SUBMITTED',
      titleEnglish: 'Horoscope Request Submitted',
      titleKannada: 'ಜಾತಕ ವಿನಂತಿ ಸಲ್ಲಿಕೆಯಾಗಿದೆ',
      messageEnglish: `Your horoscope request for ${newReq.personName} (ID: ${newReq.id}) has been received for Purohit review.`,
      messageKannada: `${newReq.personName} ಅವರ ಜಾತಕ ವಿನಂತಿಯನ್ನು ಪುರೋಹಿತರ ಪರಿಶೀಲನೆಗಾಗಿ ಯಶಸ್ವಿಯಾಗಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ.`,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({
      success: true,
      message: 'Horoscope request submitted successfully',
      data: newReq,
    });
  }

  // PUT: Admin Review (Doshas, Remedies, Comments)
  if (req.method === 'PUT') {
    if (user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
    }
    const item = liveHoroscopeRequests.find((r) => r.id === String(id));
    if (!item) return res.status(404).json({ success: false, message: 'Request not found' });

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    if (body.doshas) item.doshaAnalysis = body.doshas;
    if (body.remedies) item.remedies = body.remedies;
    if (body.purohitComments !== undefined) item.purohitComments = body.purohitComments;
    item.status = body.status || 'PENDING_APPROVAL';
    item.updatedAt = new Date().toISOString();

    return res.status(200).json({
      success: true,
      message: 'Review saved successfully',
      data: item,
    });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
