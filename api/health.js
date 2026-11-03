import { setCorsHeaders } from './_lib/jwt.js';

export default function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  return res.status(200).json({
    success: true,
    message: 'Pooja API is running',
    environment: 'production',
  });
}
