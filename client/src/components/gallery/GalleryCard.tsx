import React, { useState, useEffect } from 'react';
import { Tag, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { GalleryImage } from '../../types/index.js';
import { useLanguage } from '../../contexts/LanguageContext.js';

interface GalleryCardProps {
  image: GalleryImage;
  onOpen: (image: GalleryImage, initialSlide?: number) => void;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({ image, onOpen }) => {
  const { language } = useLanguage();
  const [slideIndex, setSlideIndex] = useState(0);

  const imagesList = image.images && image.images.length > 0 ? image.images : [image.imageUrl];
  const isMulti = imagesList.length > 1;
  const [currentSrc, setCurrentSrc] = useState(imagesList[0]);

  useEffect(() => {
    setCurrentSrc(imagesList[slideIndex] || imagesList[0]);
  }, [slideIndex, imagesList]);

  // Auto-play slideshow if multiple images
  useEffect(() => {
    if (!isMulti) return;
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % imagesList.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isMulti, imagesList.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideIndex((prev) => (prev + 1) % imagesList.length);
  };

  // Get clean tag label
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
    <div
      onClick={() => onOpen(image, slideIndex)}
      className="group relative rounded-2xl overflow-hidden shadow-md bg-white border border-spiritual-gold/30 cursor-pointer aspect-4/3 transition-all duration-300 hover:shadow-spiritual-lg hover:-translate-y-1 select-none"
    >
      {/* Active Slide Image */}
      <img
        src={currentSrc}
        alt={image.captionEnglish}
        loading="lazy"
        onError={() => {
          if (currentSrc !== '/gallery/satyanarayana-pooja-1.jpg') {
            setCurrentSrc('/gallery/satyanarayana-pooja-1.jpg');
          }
        }}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Multi-image slideshow badge */}
      {isMulti && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-sm text-[11px] font-semibold border border-white/20">
          <Layers className="w-3.5 h-3.5 text-spiritual-gold" />
          <span>
            {slideIndex + 1}/{imagesList.length} Slideshow
          </span>
        </div>
      )}

      {/* Slide Navigation Buttons (Visible on hover when multi-image) */}
      {isMulti && (
        <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={handlePrev}
            className="pointer-events-auto p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="pointer-events-auto p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Overlay gradient with tag only */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-95 transition-opacity p-4 sm:p-5 flex flex-col justify-end text-white pointer-events-none">
        {/* Slideshow progress dots */}
        {isMulti && (
          <div className="flex items-center gap-1.5 mb-2.5">
            {imagesList.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === slideIndex ? 'w-5 bg-spiritual-gold' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Tag Only - Clean and prominent */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-spiritual-saffron text-white rounded-full text-xs font-bold uppercase tracking-wider self-start shadow">
          <Tag className="w-3 h-3 text-spiritual-gold-light" />
          <span>{getTagLabel()}</span>
        </div>

        {/* If NOT one of the user-tagged items, show original caption */}
        {!isTagOnly && (
          <div className="mt-2">
            <h3 className="font-medium text-sm sm:text-base leading-snug line-clamp-1">
              {language === 'kn' ? image.captionKannada : image.captionEnglish}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};
