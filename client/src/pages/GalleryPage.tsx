import React, { useEffect, useState } from 'react';
import { Sparkles, Flame, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext.js';
import { api } from '../services/api.js';
import { GalleryImage } from '../types/index.js';
import { Lightbox } from '../components/gallery/Lightbox.js';
import { GalleryCard } from '../components/gallery/GalleryCard.js';

export const GalleryPage: React.FC = () => {
  const { t } = useLanguage();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);
  const [initialSlide, setInitialSlide] = useState<number>(0);

  const categories = [
    'All',
    'Pooja Ceremonies',
    'Sathyanarayana Pooja',
    'Sashtiapthapoorthi Shanti',
    'Grihapravesha',
    'Durga Namaskara',
    'Homam',
    'Festivals',
    'Traditional Rituals',
  ];

  useEffect(() => {
    setLoading(true);
    api
      .getGallery(selectedCategory === 'All' ? undefined : selectedCategory)
      .then((data) => setImages(data))
      .catch((err) => console.error('Failed to load gallery:', err))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const handleOpenImage = (img: GalleryImage, slideIndex: number = 0) => {
    setActiveImage(img);
    setInitialSlide(slideIndex);
  };

  return (
    <div className="min-h-screen bg-spiritual-cream py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Gallery Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-spiritual-saffron-50 text-spiritual-saffron text-xs font-bold rounded-full border border-spiritual-saffron/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sacred Visual Darshana</span>
          </div>

          <h1 className="font-serif font-black text-3xl sm:text-5xl text-spiritual-maroon tracking-wide">
            {t('gallery_title')}
          </h1>

          <p className="text-sm sm:text-base text-neutral-600">
            {t('gallery_subtitle')}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-spiritual-maroon text-white shadow-md'
                  : 'bg-white text-neutral-700 hover:bg-spiritual-cream-100 border border-spiritual-gold/30'
              }`}
            >
              {cat === 'All' ? t('gallery_filter_all') : cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <Flame className="w-10 h-10 text-spiritual-saffron animate-bounce mx-auto mb-3" />
            <p className="text-spiritual-maroon font-serif font-semibold">
              Loading Sacred Photographs...
            </p>
          </div>
        ) : images.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-spiritual-gold/30 max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
            <p className="text-neutral-700 font-medium">No images found for this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img) => (
              <GalleryCard
                key={img.id}
                image={img}
                onOpen={(image, slide) => handleOpenImage(image, slide || 0)}
              />
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        <Lightbox
          image={activeImage}
          images={images}
          initialSlide={initialSlide}
          onClose={() => setActiveImage(null)}
          onNavigate={(idx) => {
            setActiveImage(images[idx]);
            setInitialSlide(0);
          }}
        />
      </div>
    </div>
  );
};
