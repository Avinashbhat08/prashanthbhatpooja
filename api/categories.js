import { setCorsHeaders, verifyToken } from './_lib/jwt.js';
import { categories } from './_lib/store.js';

let liveCategories = [...categories];

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query || {};

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      data: liveCategories.filter((c) => c.isActive !== false),
    });
  }

  // Admin required for mutations
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const user = verifyToken(authHeader.split(' ')[1]);
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
  }

  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const newCategory = {
      id: `cat-${Date.now()}`,
      nameEnglish: body.nameEnglish,
      nameKannada: body.nameKannada,
      isActive: true,
    };
    liveCategories.push(newCategory);
    return res.status(201).json({ success: true, data: newCategory });
  }

  if (req.method === 'PUT' && id) {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const idx = liveCategories.findIndex((c) => c.id === String(id));
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    liveCategories[idx] = { ...liveCategories[idx], ...body };
    return res.status(200).json({ success: true, data: liveCategories[idx] });
  }

  if (req.method === 'DELETE' && id) {
    liveCategories = liveCategories.filter((c) => c.id !== String(id));
    return res.status(200).json({ success: true, message: 'Category deleted successfully' });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}

