import {
  GalleryImage,
  PoojaCategory,
  PoojaItem,
  WebsiteSettings,
} from '../types/index.js';

export const fallbackCategories: PoojaCategory[] = [
  { id: 'cat-1', nameEnglish: 'Turmeric and Kumkum', nameKannada: 'ಅರಿಶಿನ ಮತ್ತು ಕುಂಕುಮ', isActive: true },
  { id: 'cat-2', nameEnglish: 'Pooja Essentials', nameKannada: 'ಪೂಜಾ ಅಗತ್ಯ ವಸ್ತುಗಳು', isActive: true },
  { id: 'cat-3', nameEnglish: 'Deepa and Lighting', nameKannada: 'ದೀಪ ಮತ್ತು ಬೆಳಕು', isActive: true },
  { id: 'cat-4', nameEnglish: 'Flowers and Garlands', nameKannada: 'ಹೂವುಗಳು ಮತ್ತು ಹಾರಗಳು', isActive: true },
  { id: 'cat-5', nameEnglish: 'Fruits', nameKannada: 'ಹಣ್ಣುಗಳು', isActive: true },
  { id: 'cat-6', nameEnglish: 'Kalasha Items', nameKannada: 'ಕಲಶದ ಸಾಮಗ್ರಿಗಳು', isActive: true },
  { id: 'cat-7', nameEnglish: 'Rice and Grains', nameKannada: 'ಅಕ್ಕಿ ಮತ್ತು ಧಾನ್ಯಗಳು', isActive: true },
  { id: 'cat-8', nameEnglish: 'Prasada Ingredients', nameKannada: 'ನೈವೇದ್ಯ ಮತ್ತು ಪ್ರಸಾದ ಸಾಮಗ್ರಿಗಳು', isActive: true },
  { id: 'cat-9', nameEnglish: 'Other Items', nameKannada: 'ಇತರೆ ಸಾಮಗ್ರಿಗಳು', isActive: true },
];

export const fallbackGallery: GalleryImage[] = [
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
    captionEnglish: 'Sacred Ganapathi Homam and invocation ceremony',
    captionKannada: 'ಮಹಾ ಗಣಪತಿ ಹೋಮ ಮತ್ತು ಸಂಕಲ್ಪ ಪೂಜೆ',
    category: 'Homam',
    sortOrder: 5,
    isActive: true,
  },
  {
    id: 'gal-6',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    captionEnglish: 'Sacred Deepa Aaradhana during festive celebrations',
    captionKannada: 'ಹಬ್ಬದ ಶುಭ ಸಂದರ್ಭದಲ್ಲಿ ಮಹಾ ಮಂಗಳಾರತಿ',
    category: 'Festivals',
    sortOrder: 6,
    isActive: true,
  },
  {
    id: 'gal-7',
    imageUrl: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=1200&q=80',
    captionEnglish: 'Rigvedic Sandhyavandana & Traditional Samskaras',
    captionKannada: 'ವೈದಿಕ ಸಂಸ್ಕಾರಗಳು ಮತ್ತು ಸಂಧ್ಯಾವಂದನ ವಿಧಿ',
    category: 'Traditional Rituals',
    sortOrder: 7,
    isActive: true,
  },
  {
    id: 'gal-8',
    imageUrl: 'https://images.unsplash.com/photo-1610088441520-4352457e7095?auto=format&fit=crop&w=1200&q=80',
    captionEnglish: 'Ayushya & Mrityunjaya Homam for health and prosperity',
    captionKannada: 'ಆಯುಷ್ಯ ಹಾಗೂ ಮೃತ್ಯುಂಜಯ ಹೋಮ',
    category: 'Homam',
    sortOrder: 8,
    isActive: true,
  },
];

export const fallbackSettings: WebsiteSettings = {
  purohit_name: 'Shree Prashanth Bhat',
  purohit_name_kannada: 'ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್',
  purohit_phone: '9242359692',
  purohit_address: '#42, 5th Cross, Kempe Gowda Layout, N. Nagennahalli, R.K. Hegde Nagar, Bangalore North, Karnataka - 560077',
  purohit_address_kannada: '#೪೨, ೫ನೇ ಕ್ರಾಸ್, ಕೆಂಪೇಗೌಡ ಲೇಔಟ್, ಎನ್. ನಾಗೇನಹಳ್ಳಿ, ಆರ್.ಕೆ. ಹೆಗಡೆ ನಗರ, ಬೆಂಗಳೂರು ಉತ್ತರ, ಕರ್ನಾಟಕ - ೫೬೦೦೭೭',
  google_maps_url: 'https://maps.google.com/?q=N.+Nagennahalli,+R.K.+Hegde+Nagar,+Bangalore+560077',
};

export const fallbackPoojaItems: PoojaItem[] = [
  // Turmeric and Kumkum
  { id: 'item-1', nameEnglish: 'Turmeric Powder', nameKannada: 'ಅರಿಶಿನ ಪುಡಿ', categoryId: 'cat-1', defaultQuantity: '100g', isActive: true },
  { id: 'item-2', nameEnglish: 'Kumkum', nameKannada: 'ಕುಂಕುಮ', categoryId: 'cat-1', defaultQuantity: '50g', isActive: true },
  { id: 'item-3', nameEnglish: 'Sandalwood Paste', nameKannada: 'ಶ್ರೀಗಂಧದ ಪೇಸ್ಟ್', categoryId: 'cat-1', defaultQuantity: '1 box / 20g', isActive: true },
  { id: 'item-4', nameEnglish: 'Akshate', nameKannada: 'ಅಕ್ಷತೆ', categoryId: 'cat-1', defaultQuantity: '100g', isActive: true },

  // Pooja Essentials
  { id: 'item-5', nameEnglish: 'Incense Sticks', nameKannada: 'ಅಗರ್ಬತ್ತಿ', categoryId: 'cat-2', defaultQuantity: '1 packet', isActive: true },
  { id: 'item-6', nameEnglish: 'Camphor', nameKannada: 'ಕರ್ಪೂರ', categoryId: 'cat-2', defaultQuantity: '1 box / 50g', isActive: true },
  { id: 'item-7', nameEnglish: 'Betel Leaves', nameKannada: 'ವೀಳ್ಯದೆಲೆ', categoryId: 'cat-2', defaultQuantity: '25 leaves', isActive: true },
  { id: 'item-8', nameEnglish: 'Betel Nuts', nameKannada: 'ಅಡಿಕೆ', categoryId: 'cat-2', defaultQuantity: '50g / 15-20 pcs', isActive: true },
  { id: 'item-9', nameEnglish: 'Sacred Thread', nameKannada: 'ಪೂಜೆಯ ದಾರ', categoryId: 'cat-2', defaultQuantity: '1 reel / Kankana', isActive: true },
  { id: 'item-10', nameEnglish: 'Mango Leaves', nameKannada: 'ಮಾವಿನ ಎಲೆಗಳು', categoryId: 'cat-2', defaultQuantity: '2 bunches', isActive: true },

  // Deepa and Lighting
  { id: 'item-11', nameEnglish: 'Diya / Oil Lamp', nameKannada: 'ದೀಪ', categoryId: 'cat-3', defaultQuantity: '2 pcs / brass or clay', isActive: true },
  { id: 'item-12', nameEnglish: 'Cotton Wicks', nameKannada: 'ಹತ್ತಿ ಬತ್ತಿ', categoryId: 'cat-3', defaultQuantity: '1 packet', isActive: true },
  { id: 'item-13', nameEnglish: 'Oil for Lamp', nameKannada: 'ದೀಪದ ಎಣ್ಣೆ', categoryId: 'cat-3', defaultQuantity: '500 ml', isActive: true },
  { id: 'item-14', nameEnglish: 'Matchbox', nameKannada: 'ಬೆಂಕಿಪೊಟ್ಟಣ', categoryId: 'cat-3', defaultQuantity: '1 box', isActive: true },

  // Flowers and Garlands
  { id: 'item-15', nameEnglish: 'Flowers', nameKannada: 'ಹೂವುಗಳು', categoryId: 'cat-4', defaultQuantity: '500g mixed flowers', isActive: true },
  { id: 'item-16', nameEnglish: 'Garland', nameKannada: 'ಹೂವಿನ ಹಾರ', categoryId: 'cat-4', defaultQuantity: '2 pcs', isActive: true },
  { id: 'item-17', nameEnglish: 'Tulsi Leaves', nameKannada: 'ತುಳಸಿ ದಳ', categoryId: 'cat-4', defaultQuantity: '1 bunch', isActive: true },

  // Fruits
  { id: 'item-18', nameEnglish: 'Bananas', nameKannada: 'ಬಾಳೆಹಣ್ಣು', categoryId: 'cat-5', defaultQuantity: '1 dozen (12 pcs)', isActive: true },
  { id: 'item-19', nameEnglish: 'Coconut', nameKannada: 'ತೆಂಗಿನಕಾಯಿ', categoryId: 'cat-5', defaultQuantity: '3 pcs', isActive: true },
  { id: 'item-20', nameEnglish: 'Fruits', nameKannada: 'ಹಣ್ಣುಗಳು', categoryId: 'cat-5', defaultQuantity: '5 varieties', isActive: true },

  // Kalasha Items
  { id: 'item-21', nameEnglish: 'Kalasha', nameKannada: 'ಕಲಶ', categoryId: 'cat-6', defaultQuantity: '1 copper / brass pot', isActive: true },
  { id: 'item-22', nameEnglish: 'Dry Coconut (Kobbari)', nameKannada: 'ಒಣ ಕೊಬ್ಬರಿ', categoryId: 'cat-6', defaultQuantity: '2 halves', isActive: true },

  // Rice and Grains
  { id: 'item-23', nameEnglish: 'Rice', nameKannada: 'ಅಕ್ಕಿ', categoryId: 'cat-7', defaultQuantity: '1 kg raw rice', isActive: true },
  { id: 'item-24', nameEnglish: 'Navadhanya', nameKannada: 'ನವಧಾನ್ಯ', categoryId: 'cat-7', defaultQuantity: '1 set', isActive: true },

  // Prasada Ingredients
  { id: 'item-25', nameEnglish: 'Jaggery', nameKannada: 'ಬೆಲ್ಲ', categoryId: 'cat-8', defaultQuantity: '250g', isActive: true },
  { id: 'item-26', nameEnglish: 'Ghee', nameKannada: 'ತುಪ್ಪ', categoryId: 'cat-8', defaultQuantity: '200g pure cow ghee', isActive: true },
  { id: 'item-27', nameEnglish: 'Milk', nameKannada: 'ಹಾಲು', categoryId: 'cat-8', defaultQuantity: '500 ml cow milk', isActive: true },
  { id: 'item-28', nameEnglish: 'Honey', nameKannada: 'ಜೇನುತುಪ್ಪ', categoryId: 'cat-8', defaultQuantity: '1 small bottle (50g)', isActive: true },
  { id: 'item-29', nameEnglish: 'Panchamrita Ingredients', nameKannada: 'ಪಂಚಾಮೃತದ ಸಾಮಗ್ರಿಗಳು', categoryId: 'cat-8', defaultQuantity: 'Milk, Curd, Ghee, Honey, Sugar', isActive: true },
  { id: 'item-30', nameEnglish: 'Cardamom & Clove', nameKannada: 'ಏಲಕ್ಕಿ ಮತ್ತು ಲವಂಗ', categoryId: 'cat-8', defaultQuantity: '10g each', isActive: true },

  // Other Items
  { id: 'item-31', nameEnglish: 'White Towel / Pancha', nameKannada: 'ಶ್ವೇತ ವಸ್ತ್ರ / ಪಂಚೆ', categoryId: 'cat-9', defaultQuantity: '1 pc', isActive: true },
  { id: 'item-32', nameEnglish: 'Blouse Piece', nameKannada: 'ಕುಪ್ಪಸದ ವಸ್ತ್ರ', categoryId: 'cat-9', defaultQuantity: '2 pcs (Green / Yellow / Red)', isActive: true },
  { id: 'item-33', nameEnglish: 'Coins for Dakshina', nameKannada: 'ದಕ್ಷಿಣೆಯ ನಾಣ್ಯಗಳು', categoryId: 'cat-9', defaultQuantity: '21 coins', isActive: true },
];

