import { setCorsHeaders, verifyToken } from './_lib/jwt.js';
import { poojaItems } from './_lib/store.js';

let liveItems = [...poojaItems];

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id, categoryId, q } = req.query || {};

  if (req.method === 'GET') {
    if (id) {
      const item = liveItems.find((i) => i.id === String(id));
      if (!item) {
        return res.status(404).json({ success: false, message: 'Pooja item not found' });
      }
      return res.status(200).json({ success: true, data: item });
    }

    let results = liveItems.filter((i) => i.isActive !== false);

    if (categoryId && categoryId !== 'all') {
      results = results.filter((i) => i.categoryId === categoryId);
    }

    if (q && typeof q === 'string' && q.trim()) {
      const term = q.trim().toLowerCase();
      results = results.filter(
        (i) =>
          i.nameEnglish.toLowerCase().includes(term) ||
          i.nameKannada.toLowerCase().includes(term)
      );
    }

    return res.status(200).json({
      success: true,
      data: results,
    });
  }

  // Mutations require admin
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
    const newItem = {
      id: `item-${Date.now()}`,
      nameEnglish: body.nameEnglish,
      nameKannada: body.nameKannada,
      categoryId: body.categoryId,
      defaultQuantity: body.defaultQuantity || null,
      isActive: true,
    };
    liveItems.push(newItem);
    return res.status(201).json({ success: true, data: newItem });
  }

  if (req.method === 'PUT' && id) {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const idx = liveItems.findIndex((i) => i.id === String(id));
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Pooja item not found' });
    }
    liveItems[idx] = { ...liveItems[idx], ...body };
    return res.status(200).json({ success: true, data: liveItems[idx] });
  }

  if (req.method === 'DELETE' && id) {
    liveItems = liveItems.filter((i) => i.id !== String(id));
    return res.status(200).json({ success: true, message: 'Pooja item deleted successfully' });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
