import { setCorsHeaders, verifyToken } from './_lib/jwt.js';
import { websiteSettings } from './_lib/store.js';

let liveSettings = { ...websiteSettings };

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      data: liveSettings,
      ...liveSettings, // Backwards compatible with direct flat object
    });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const user = verifyToken(authHeader.split(' ')[1]);
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
  }

  if (req.method === 'PUT') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    liveSettings = { ...liveSettings, ...body };
    return res.status(200).json({ success: true, message: 'Settings updated successfully', data: liveSettings });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}

