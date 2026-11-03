import { setCorsHeaders, verifyToken } from '../_lib/jwt.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }

  return res.status(200).json({
    success: true,
    user: {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    },
  });
}
