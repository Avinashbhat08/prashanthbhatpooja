import { setCorsHeaders } from './_lib/jwt.js';

let liveRequests = [];

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      data: liveRequests,
    });
  }

  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const record = {
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...body,
    };
    liveRequests.unshift(record);
    return res.status(201).json({
      success: true,
      data: record,
      ...record,
    });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
