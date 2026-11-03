import { setCorsHeaders } from '../_lib/jwt.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
}

