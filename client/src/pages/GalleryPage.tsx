import React, { useEffect, useState } from 'react';
import { Sparkles, Flame, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext.js';
import { api } from '../services/api.js';
import { GalleryImage } from '../types/index.js';
import { Lightbox } from '../components/gallery/Lightbox.js';
import { GalleryCard } from '../components/gallery/GalleryCard.js';

export const GalleryPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
    let isCurrent = true;
    setLoading(true);
    setErrorMessage(null);

    api
      .getGallery(selectedCategory === 'All' ? undefined : selectedCategory)
      .then((data) => {
        if (isCurrent) {
          setImages(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => {
        if (isCurrent) {
          console.warn('Gallery load notice:', err?.message || err);
          setErrorMessage(err?.message || 'Unable to fetch gallery images');
        }
      })
      .finally(() => {
        if (isCurrent) {
          setLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
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

        {/* Gallery Content Area */}
        {loading ? (
          <div className="py-24 text-center">
            <Flame className="w-12 h-12 text-spiritual-saffron animate-bounce mx-auto mb-3" />
            <p className="text-spiritual-maroon font-serif font-semibold text-lg">
              {language === 'kn' ? 'ಚಿತ್ರಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...' : 'Loading Sacred Photographs...'}
            </p>
          </div>
        ) : errorMessage && images.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-spiritual-gold/30 max-w-md mx-auto shadow-sm space-y-4">
            <AlertCircle className="w-12 h-12 text-spiritual-gold mx-auto" />
            <div>
              <h3 className="text-lg font-serif font-bold text-spiritual-maroon">
                {language === 'kn' ? 'ಗ್ಯಾಲರಿ ಸಂಪರ್ಕಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ' : 'Unable to reach Gallery'}
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                {language === 'kn'
                  ? 'ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.'
                  : 'Please check your connection or try again in a few moments.'}
              </p>
            </div>
            <button
              onClick={() => setSelectedCategory(selectedCategory)}
              className="inline-flex items-center px-4 py-2 bg-spiritual-maroon text-white text-xs font-bold rounded-full hover:bg-spiritual-maroon-dark transition"
            >
              {language === 'kn' ? 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ' : 'Retry'}
            </button>
          </div>
        ) : images.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-spiritual-gold/30 max-w-md mx-auto shadow-sm">
            <AlertCircle className="w-12 h-12 text-spiritual-gold mx-auto mb-3" />
            <h3 className="text-lg font-serif font-bold text-spiritual-maroon mb-1">
              {language === 'kn' ? 'ಇನ್ನೂ ಯಾವುದೇ ಗ್ಯಾಲರಿ ಚಿತ್ರಗಳು ಲಭ್ಯವಿಲ್ಲ.' : 'No gallery images available yet.'}
            </h3>
            <p className="text-sm text-neutral-500">
              {language === 'kn'
                ? 'ಈ ವರ್ಗಕ್ಕೆ ಶೀಘ್ರದಲ್ಲೇ ಹೊಸ ಫೋಟೋಗಳನ್ನು ಸೇರಿಸಲಾಗುತ್ತದೆ.'
                : 'New photographs for this category will be uploaded shortly.'}
            </p>
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
