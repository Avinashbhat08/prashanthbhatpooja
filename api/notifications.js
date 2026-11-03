import { setCorsHeaders, verifyToken } from './_lib/jwt.js';
import { liveNotifications } from './horoscope-requests.js';

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

  const { id } = req.query || {};

  if (req.method === 'GET') {
    const userNotifs = liveNotifications.filter((n) => n.userId === user.id);
    const unreadCount = userNotifs.filter((n) => !n.isRead).length;
    return res.status(200).json({
      success: true,
      data: userNotifs,
      unreadCount,
    });
  }

  if (req.method === 'PATCH') {
    if (id === 'read-all') {
      liveNotifications.forEach((n) => {
        if (n.userId === user.id) n.isRead = true;
      });
      return res.status(200).json({ success: true, message: 'All marked as read' });
    }

    const found = liveNotifications.find((n) => n.id === String(id) && n.userId === user.id);
    if (!found) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    found.isRead = true;
    return res.status(200).json({ success: true, data: found });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
