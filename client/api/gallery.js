import { setCorsHeaders, verifyToken } from './_lib/jwt.js';
import { galleryImages } from './_lib/store.js';

let liveImages = [...galleryImages];

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id, category } = req.query || {};

  // GET /api/gallery or /api/gallery?id=...
  if (req.method === 'GET') {
    if (id) {
      const found = liveImages.find((img) => img.id === String(id));
      if (!found) {
        return res.status(404).json({ success: false, message: 'Gallery image not found' });
      }
      return res.status(200).json({ success: true, data: found });
    }

    let results = liveImages.filter((img) => img.isActive !== false);

    if (category && typeof category === 'string' && category !== 'All') {
      if (category === 'Pooja Ceremonies') {
        const ceremonies = [
          'Pooja Ceremonies',
          'Sathyanarayana Pooja',
          'Sashtiapthapoorthi Shanti',
          'Grihapravesha',
          'Durga Namaskara',
        ];
        results = results.filter((img) => ceremonies.includes(img.category));
      } else {
        results = results.filter((img) => img.category === category);
      }
    }

    return res.status(200).json({
      success: true,
      data: results,
    });
  }

  // Admin auth for mutations
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
    const newImage = {
      id: `gal-${Date.now()}`,
      imageUrl: body.imageUrl,
      images: [body.imageUrl],
      captionEnglish: body.captionEnglish,
      captionKannada: body.captionKannada,
      category: body.category || 'Pooja Ceremonies',
      sortOrder: body.sortOrder || 0,
      isActive: true,
    };
    liveImages.unshift(newImage);
    return res.status(201).json({ success: true, data: newImage });
  }

  if (req.method === 'PUT' && id) {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const idx = liveImages.findIndex((img) => img.id === String(id));
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Gallery image not found' });
    }
    liveImages[idx] = { ...liveImages[idx], ...body };
    return res.status(200).json({ success: true, data: liveImages[idx] });
  }

  if (req.method === 'DELETE' && id) {
    liveImages = liveImages.filter((img) => img.id !== String(id));
    return res.status(200).json({ success: true, message: 'Gallery image deleted successfully' });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
