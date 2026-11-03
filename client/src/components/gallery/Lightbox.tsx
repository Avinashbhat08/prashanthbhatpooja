import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Tag, Layers } from 'lucide-react';
import { GalleryImage } from '../../types/index.js';
import { useLanguage } from '../../contexts/LanguageContext.js';

interface LightboxProps {
  image: GalleryImage | null;
  images: GalleryImage[];
  initialSlide?: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  image,
  images,
  initialSlide = 0,
  onClose,
  onNavigate,
}) => {
  const { language } = useLanguage();
  const [internalSlide, setInternalSlide] = useState(initialSlide);

  const currentIndex = image ? images.findIndex((img) => img.id === image.id) : -1;

  const currentImageList =
    image?.images && image.images.length > 0 ? image.images : image ? [image.imageUrl] : [];

  const isMultiSlide = currentImageList.length > 1;

  useEffect(() => {
    setInternalSlide(initialSlide || 0);
  }, [image, initialSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        if (isMultiSlide && internalSlide < currentImageList.length - 1) {
          setInternalSlide((prev) => prev + 1);
        } else if (currentIndex < images.length - 1) {
          onNavigate(currentIndex + 1);
        }
      }
      if (e.key === 'ArrowLeft') {
        if (isMultiSlide && internalSlide > 0) {
          setInternalSlide((prev) => prev - 1);
        } else if (currentIndex > 0) {
          onNavigate(currentIndex - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images.length, isMultiSlide, internalSlide, currentImageList.length, onClose, onNavigate]);

  if (!image) return null;

  const getTagLabel = () => {
    const titleLower = image.captionEnglish.toLowerCase();
    const catLower = image.category.toLowerCase();

    if (titleLower.includes('sathyanarayana') || catLower.includes('sathyanarayana')) {
      return language === 'kn' ? 'ಸತ್ಯನಾರಾಯಣ ಪೂಜೆ' : 'Sathyanarayana Pooja';
    }
    if (titleLower.includes('sashtiapthapoorthi') || catLower.includes('sashtiapthapoorthi')) {
      return language === 'kn' ? 'ಷಷ್ಠ್ಯಬ್ದಪೂರ್ತಿ ಶಾಂತಿ' : 'Sashtiapthapoorthi Shanti';
    }
    if (titleLower.includes('griha') || catLower.includes('griha') || titleLower.includes('ghara')) {
      return language === 'kn' ? 'ಗೃಹಪ್ರವೇಶ' : 'Grihapravesha';
    }
    if (titleLower.includes('durga') || catLower.includes('durga')) {
      return language === 'kn' ? 'ದುರ್ಗಾ ನಮಸ್ಕಾರ' : 'Durga Namaskara';
    }
    return language === 'kn' ? image.captionKannada : image.captionEnglish;
  };

  const isTagOnly =
    image.captionEnglish.toLowerCase().includes('sathyanarayana') ||
    image.captionEnglish.toLowerCase().includes('sashtiapthapoorthi') ||
    image.captionEnglish.toLowerCase().includes('grihapravesha') ||
    image.captionEnglish.toLowerCase().includes('durga');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white/70 hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition z-50"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Item Prev button */}
      {currentIndex > 0 && (
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-black/50 hover:bg-black/70 transition z-50"
          title="Previous album"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {/* Main Item Next button */}
      {currentIndex < images.length - 1 && (
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-black/50 hover:bg-black/70 transition z-50"
          title="Next album"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* Main Image container */}
      <div className="max-w-4xl max-h-[88vh] flex flex-col items-center">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 max-h-[72vh] flex items-center justify-center bg-black/40">
          <img
            src={currentImageList[internalSlide] || image.imageUrl}
            alt={image.captionEnglish}
            className="w-full h-full object-contain max-h-[72vh] select-none"
          />

          {/* Inner slideshow controls if multiple photos in this item */}
          {isMultiSlide && (
            <>
              <button
                onClick={() =>
                  setInternalSlide(
                    (prev) => (prev - 1 + currentImageList.length) % currentImageList.length
                  )
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white transition z-20"
                aria-label="Previous photo in slideshow"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() =>
                  setInternalSlide((prev) => (prev + 1) % currentImageList.length)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white transition z-20"
                aria-label="Next photo in slideshow"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
                <Layers className="w-3.5 h-3.5 text-spiritual-gold" />
                <span>
                  {internalSlide + 1} of {currentImageList.length} Photos
                </span>
              </div>
            </>
          )}
        </div>

        {/* Slideshow dots */}
        {isMultiSlide && (
          <div className="flex items-center gap-2 mt-3">
            {currentImageList.map((_, i) => (
              <button
                key={i}
                onClick={() => setInternalSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === internalSlide ? 'w-6 bg-spiritual-gold' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Captions Section */}
        <div className="mt-3 text-center max-w-2xl px-4">
          {/* Tag Only - Clean & Bold */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-spiritual-saffron text-white rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider shadow">
            <Tag className="w-3.5 h-3.5 text-spiritual-gold-light" />
            <span>{getTagLabel()}</span>
          </div>

          {/* If NOT tag-only, show detailed captions. If it is tag-only, ONLY show the tag */}
          {!isTagOnly && (
            <div className="mt-2 space-y-0.5">
              <h4 className="text-white text-base sm:text-lg font-medium">
                {language === 'kn' ? image.captionKannada : image.captionEnglish}
              </h4>
              <p className="text-white/60 text-xs sm:text-sm font-kannada">
                {language === 'kn' ? image.captionEnglish : image.captionKannada}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
