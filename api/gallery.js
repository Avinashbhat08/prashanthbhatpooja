// Vercel Serverless Function for /api/gallery
export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const galleryData = [
    {
      id: 'gal-1',
      imageUrl: '/gallery/satyanarayana-pooja-1.jpg',
      images: [
        '/gallery/satyanarayana-pooja-1.jpg',
        '/gallery/satyanarayana-pooja-2.jpg',
      ],
      captionEnglish: 'Sathyanarayana Pooja',
      captionKannada: 'ಸತ್ಯನಾರಾಯಣ ಪೂಜೆ',
      category: 'Sathyanarayana Pooja',
      sortOrder: 1,
      isActive: true,
    },
    {
      id: 'gal-2',
      imageUrl: '/gallery/sashtiapthapoorthi-1.jpg',
      images: [
        '/gallery/sashtiapthapoorthi-1.jpg',
        '/gallery/sashtiapthapoorthi-2.jpg',
      ],
      captionEnglish: 'Sashtiapthapoorthi Shanti',
      captionKannada: 'ಷಷ್ಠ್ಯಬ್ದಪೂರ್ತಿ ಶಾಂತಿ',
      category: 'Sashtiapthapoorthi Shanti',
      sortOrder: 2,
      isActive: true,
    },
    {
      id: 'gal-3',
      imageUrl: '/gallery/grihapravesha-1.jpg',
      images: [
        '/gallery/grihapravesha-1.jpg',
        '/gallery/grihapravesha-2.jpg',
        '/gallery/grihapravesha-3.jpg',
      ],
      captionEnglish: 'Grihapravesha',
      captionKannada: 'ಗೃಹಪ್ರವೇಶ',
      category: 'Grihapravesha',
      sortOrder: 3,
      isActive: true,
    },
    {
      id: 'gal-4',
      imageUrl: '/gallery/durganamaskara.jpg',
      images: ['/gallery/durganamaskara.jpg'],
      captionEnglish: 'Durga Namaskara',
      captionKannada: 'ದುರ್ಗಾ ನಮಸ್ಕಾರ',
      category: 'Durga Namaskara',
      sortOrder: 4,
      isActive: true,
    },
    {
      id: 'gal-5',
      imageUrl: 'https://images.unsplash.com/photo-1609358905581-e5382c448202?auto=format&fit=crop&w=1200&q=80',
      images: ['https://images.unsplash.com/photo-1609358905581-e5382c448202?auto=format&fit=crop&w=1200&q=80'],
      captionEnglish: 'Sacred Ganapathi Homam and invocation ceremony',
      captionKannada: 'ಮಹಾ ಗಣಪತಿ ಹೋಮ ಮತ್ತು ಸಂಕಲ್ಪ ಪೂಜೆ',
      category: 'Homam',
      sortOrder: 5,
      isActive: true,
    },
    {
      id: 'gal-6',
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
      images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80'],
      captionEnglish: 'Sacred Deepa Aaradhana during festive celebrations',
      captionKannada: 'ಹಬ್ಬದ ಶುಭ ಸಂದರ್ಭದಲ್ಲಿ ಮಹಾ ಮಂಗಳಾರತಿ',
      category: 'Festivals',
      sortOrder: 6,
      isActive: true,
    },
    {
      id: 'gal-7',
      imageUrl: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=1200&q=80',
      images: ['https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=1200&q=80'],
      captionEnglish: 'Rigvedic Sandhyavandana & Traditional Samskaras',
      captionKannada: 'ವೈದಿಕ ಸಂಸ್ಕಾರಗಳು ಮತ್ತು ಸಂಧ್ಯಾವಂದನ ವಿಧಿ',
      category: 'Traditional Rituals',
      sortOrder: 7,
      isActive: true,
    },
  ];

  if (req.method === 'GET') {
    const { id, category } = req.query;

    if (id) {
      const found = galleryData.find((item) => item.id === String(id));
      if (!found) {
        return res.status(404).json({ success: false, message: 'Gallery image not found' });
      }
      return res.status(200).json({ success: true, data: found });
    }

    let results = galleryData;
    if (category && category !== 'All') {
      if (category === 'Pooja Ceremonies') {
        const ceremonies = [
          'Pooja Ceremonies',
          'Sathyanarayana Pooja',
          'Sashtiapthapoorthi Shanti',
          'Grihapravesha',
          'Durga Namaskara',
        ];
        results = galleryData.filter((img) => ceremonies.includes(img.category));
      } else {
        results = galleryData.filter((img) => img.category === category);
      }
    }

    return res.status(200).json({
      success: true,
      data: results,
    });
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
