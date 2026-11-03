import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding sacred database...');

  // 1. Seed Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@poojaservices.com' },
    update: {},
    create: {
      name: 'Shree Prashanth Bhat (Admin)',
      email: 'admin@poojaservices.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  const devotee = await prisma.user.upsert({
    where: { email: 'user@poojaservices.com' },
    update: {},
    create: {
      name: 'Ramesh Kumar',
      email: 'user@poojaservices.com',
      passwordHash: userPassword,
      role: 'USER',
    },
  });

  console.log(`Users seeded: Admin (${admin.email}), User (${devotee.email})`);

  // 2. Seed Categories
  const categoriesData = [
    { nameEnglish: 'Turmeric and Kumkum', nameKannada: 'ಅರಿಶಿನ ಮತ್ತು ಕುಂಕುಮ' },
    { nameEnglish: 'Pooja Essentials', nameKannada: 'ಪೂಜಾ ಅಗತ್ಯ ವಸ್ತುಗಳು' },
    { nameEnglish: 'Deepa and Lighting', nameKannada: 'ದೀಪ ಮತ್ತು ಬೆಳಕು' },
    { nameEnglish: 'Flowers and Garlands', nameKannada: 'ಹೂವುಗಳು ಮತ್ತು ಹಾರಗಳು' },
    { nameEnglish: 'Fruits', nameKannada: 'ಹಣ್ಣುಗಳು' },
    { nameEnglish: 'Kalasha Items', nameKannada: 'ಕಲಶದ ಸಾಮಗ್ರಿಗಳು' },
    { nameEnglish: 'Rice and Grains', nameKannada: 'ಅಕ್ಕಿ ಮತ್ತು ಧಾನ್ಯಗಳು' },
    { nameEnglish: 'Prasada Ingredients', nameKannada: 'ನೈವೇದ್ಯ ಮತ್ತು ಪ್ರಸಾದ ಸಾಮಗ್ರಿಗಳು' },
    { nameEnglish: 'Other Items', nameKannada: 'ಇತರೆ ಸಾಮಗ್ರಿಗಳು' },
  ];

  const categoryMap = new Map<string, string>();

  for (const cat of categoriesData) {
    const existing = await prisma.poojaCategory.findFirst({
      where: { nameEnglish: cat.nameEnglish },
    });
    if (existing) {
      categoryMap.set(cat.nameEnglish, existing.id);
    } else {
      const created = await prisma.poojaCategory.create({
        data: cat,
      });
      categoryMap.set(cat.nameEnglish, created.id);
    }
  }

  console.log(`Categories seeded: ${categoryMap.size}`);

  // 3. Seed Pooja Items
  const itemsData = [
    // Turmeric and Kumkum
    {
      nameEnglish: 'Turmeric Powder',
      nameKannada: 'ಅರಿಶಿನ ಪುಡಿ',
      category: 'Turmeric and Kumkum',
      defaultQuantity: '100g',
    },
    {
      nameEnglish: 'Kumkum',
      nameKannada: 'ಕುಂಕುಮ',
      category: 'Turmeric and Kumkum',
      defaultQuantity: '50g',
    },
    {
      nameEnglish: 'Sandalwood Paste',
      nameKannada: 'ಶ್ರೀಗಂಧದ ಪೇಸ್ಟ್',
      category: 'Turmeric and Kumkum',
      defaultQuantity: '1 box / 20g',
    },
    {
      nameEnglish: 'Akshate',
      nameKannada: 'ಅಕ್ಷತೆ',
      category: 'Turmeric and Kumkum',
      defaultQuantity: '100g',
    },

    // Pooja Essentials
    {
      nameEnglish: 'Incense Sticks',
      nameKannada: 'ಅಗರ್ಬತ್ತಿ',
      category: 'Pooja Essentials',
      defaultQuantity: '1 packet',
    },
    {
      nameEnglish: 'Camphor',
      nameKannada: 'ಕರ್ಪೂರ',
      category: 'Pooja Essentials',
      defaultQuantity: '1 box / 50g',
    },
    {
      nameEnglish: 'Betel Leaves',
      nameKannada: 'ವೀಳ್ಯದೆಲೆ',
      category: 'Pooja Essentials',
      defaultQuantity: '25 leaves',
    },
    {
      nameEnglish: 'Betel Nuts',
      nameKannada: 'ಅಡಿಕೆ',
      category: 'Pooja Essentials',
      defaultQuantity: '50g / 15-20 pcs',
    },
    {
      nameEnglish: 'Sacred Thread',
      nameKannada: 'ಪೂಜೆಯ ದಾರ',
      category: 'Pooja Essentials',
      defaultQuantity: '1 reel / Kankana',
    },
    {
      nameEnglish: 'Mango Leaves',
      nameKannada: 'ಮಾವಿನ ಎಲೆಗಳು',
      category: 'Pooja Essentials',
      defaultQuantity: '2 bunches',
    },

    // Deepa and Lighting
    {
      nameEnglish: 'Diya / Oil Lamp',
      nameKannada: 'ದೀಪ',
      category: 'Deepa and Lighting',
      defaultQuantity: '2 pcs / brass or clay',
    },
    {
      nameEnglish: 'Cotton Wicks',
      nameKannada: 'ಹತ್ತಿ ಬತ್ತಿ',
      category: 'Deepa and Lighting',
      defaultQuantity: '1 packet',
    },
    {
      nameEnglish: 'Oil for Lamp',
      nameKannada: 'ದೀಪದ ಎಣ್ಣೆ',
      category: 'Deepa and Lighting',
      defaultQuantity: '500 ml',
    },
    {
      nameEnglish: 'Matchbox',
      nameKannada: 'ಬೆಂಕಿಪೊಟ್ಟಣ',
      category: 'Deepa and Lighting',
      defaultQuantity: '1 box',
    },

    // Flowers and Garlands
    {
      nameEnglish: 'Flowers',
      nameKannada: 'ಹೂವುಗಳು',
      category: 'Flowers and Garlands',
      defaultQuantity: '500g mixed flowers',
    },
    {
      nameEnglish: 'Garland',
      nameKannada: 'ಹೂವಿನ ಹಾರ',
      category: 'Flowers and Garlands',
      defaultQuantity: '2 pcs',
    },
    {
      nameEnglish: 'Tulsi Leaves',
      nameKannada: 'ತುಳಸಿ ದಳ',
      category: 'Flowers and Garlands',
      defaultQuantity: '1 bunch',
    },

    // Fruits
    {
      nameEnglish: 'Bananas',
      nameKannada: 'ಬಾಳೆಹಣ್ಣು',
      category: 'Fruits',
      defaultQuantity: '1 dozen (12 pcs)',
    },
    {
      nameEnglish: 'Coconut',
      nameKannada: 'ತೆಂಗಿನಕಾಯಿ',
      category: 'Fruits',
      defaultQuantity: '3 pcs',
    },
    {
      nameEnglish: 'Fruits',
      nameKannada: 'ಹಣ್ಣುಗಳು',
      category: 'Fruits',
      defaultQuantity: '5 varieties (Apples, Oranges, Pomegranate, etc.)',
    },

    // Kalasha Items
    {
      nameEnglish: 'Kalasha',
      nameKannada: 'ಕಲಶ',
      category: 'Kalasha Items',
      defaultQuantity: '1 copper / brass pot',
    },
    {
      nameEnglish: 'Dry Coconut (Kobbari)',
      nameKannada: 'ಒಣ ಕೊಬ್ಬರಿ',
      category: 'Kalasha Items',
      defaultQuantity: '2 halves',
    },

    // Rice and Grains
    {
      nameEnglish: 'Rice',
      nameKannada: 'ಅಕ್ಕಿ',
      category: 'Rice and Grains',
      defaultQuantity: '1 kg raw rice',
    },
    {
      nameEnglish: 'Navadhanya',
      nameKannada: 'ನವಧಾನ್ಯ',
      category: 'Rice and Grains',
      defaultQuantity: '1 set',
    },

    // Prasada Ingredients
    {
      nameEnglish: 'Jaggery',
      nameKannada: 'ಬೆಲ್ಲ',
      category: 'Prasada Ingredients',
      defaultQuantity: '250g',
    },
    {
      nameEnglish: 'Ghee',
      nameKannada: 'ತುಪ್ಪ',
      category: 'Prasada Ingredients',
      defaultQuantity: '200g pure cow ghee',
    },
    {
      nameEnglish: 'Milk',
      nameKannada: 'ಹಾಲು',
      category: 'Prasada Ingredients',
      defaultQuantity: '500 ml cow milk',
    },
    {
      nameEnglish: 'Honey',
      nameKannada: 'ಜೇನುತುಪ್ಪ',
      category: 'Prasada Ingredients',
      defaultQuantity: '1 small bottle (50g)',
    },
    {
      nameEnglish: 'Panchamrita Ingredients',
      nameKannada: 'ಪಂಚಾಮೃತದ ಸಾಮಗ್ರಿಗಳು',
      category: 'Prasada Ingredients',
      defaultQuantity: 'Milk, Curd, Ghee, Honey, Sugar',
    },
    {
      nameEnglish: 'Cardamom & Clove',
      nameKannada: 'ಏಲಕ್ಕಿ ಮತ್ತು ಲವಂಗ',
      category: 'Prasada Ingredients',
      defaultQuantity: '10g each',
    },

    // Other Items
    {
      nameEnglish: 'White Towel / Pancha',
      nameKannada: 'ಶ್ವೇತ ವಸ್ತ್ರ / ಪಂಚೆ',
      category: 'Other Items',
      defaultQuantity: '1 pc',
    },
    {
      nameEnglish: 'Blouse Piece',
      nameKannada: 'ಕುಪ್ಪಸದ ವಸ್ತ್ರ',
      category: 'Other Items',
      defaultQuantity: '2 pcs (Green / Yellow / Red)',
    },
    {
      nameEnglish: 'Coins for Dakshina',
      nameKannada: 'ದಕ್ಷಿಣೆಯ ನಾಣ್ಯಗಳು',
      category: 'Other Items',
      defaultQuantity: '21 coins (₹1 / ₹2 / ₹5)',
    },
  ];

  for (const item of itemsData) {
    const categoryId = categoryMap.get(item.category);
    if (!categoryId) continue;

    const existing = await prisma.poojaItem.findFirst({
      where: { nameEnglish: item.nameEnglish },
    });

    if (!existing) {
      await prisma.poojaItem.create({
        data: {
          nameEnglish: item.nameEnglish,
          nameKannada: item.nameKannada,
          categoryId: categoryId,
          defaultQuantity: item.defaultQuantity,
        },
      });
    }
  }

  console.log(`Pooja items seeded: ${itemsData.length}`);

  // 4. Seed Gallery Images
  const galleryData = [
    {
      imageUrl: '/gallery/satyanarayana-pooja-1.jpg,/gallery/satyanarayana-pooja-2.jpg',
      captionEnglish: 'Sathyanarayana Pooja',
      captionKannada: 'ಸತ್ಯನಾರಾಯಣ ಪೂಜೆ',
      category: 'Sathyanarayana Pooja',
      sortOrder: 1,
    },
    {
      imageUrl: '/gallery/sashtiapthapoorthi-1.jpg,/gallery/sashtiapthapoorthi-2.jpg',
      captionEnglish: 'Sashtiapthapoorthi Shanti',
      captionKannada: 'ಷಷ್ಠ್ಯಬ್ದಪೂರ್ತಿ ಶಾಂತಿ',
      category: 'Sashtiapthapoorthi Shanti',
      sortOrder: 2,
    },
    {
      imageUrl: '/gallery/grihapravesha-1.jpg,/gallery/grihapravesha-2.jpg,/gallery/grihapravesha-3.jpg',
      captionEnglish: 'Grihapravesha',
      captionKannada: 'ಗೃಹಪ್ರವೇಶ',
      category: 'Grihapravesha',
      sortOrder: 3,
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1609358905581-e5382c448202?auto=format&fit=crop&w=1200&q=80',
      captionEnglish: 'Sacred Ganapathi Homam and invocation ceremony',
      captionKannada: 'ಮಹಾ ಗಣಪತಿ ಹೋಮ ಮತ್ತು ಸಂಕಲ್ಪ ಪೂಜೆ',
      category: 'Homam',
      sortOrder: 4,
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1545232979-fbf68fe9b1af?auto=format&fit=crop&w=1200&q=80',
      captionEnglish: 'Traditional Satyanarayana Swamy Pooja with sacred Kalasha',
      captionKannada: 'ಸಾಂಪ್ರದಾಯಿಕ ಶ್ರೀ ಸತ್ಯನಾರಾಯಣ ಸ್ವಾಮಿ ಪೂಜೆ',
      category: 'Pooja Ceremonies',
      sortOrder: 2,
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=1200&q=80',
      captionEnglish: 'Gruha Pravesha Vaastu Pooja & Navagraha Shanti',
      captionKannada: 'ಗೃಹಪ್ರವೇಶ ವಾಸ್ತು ಪೂಜೆ ಹಾಗೂ ನವಗ್ರಹ ಶಾಂತಿ',
      category: 'Pooja Ceremonies',
      sortOrder: 3,
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
      captionEnglish: 'Sacred Deepa Aaradhana during festive celebrations',
      captionKannada: 'ಹಬ್ಬದ ಶುಭ ಸಂದರ್ಭದಲ್ಲಿ ಮಹಾ ಮಂಗಳಾರತಿ',
      category: 'Festivals',
      sortOrder: 4,
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=1200&q=80',
      captionEnglish: 'Rigvedic Sandhyavandana & Traditional Samskaras',
      captionKannada: 'ವೈದಿಕ ಸಂಸ್ಕಾರಗಳು ಮತ್ತು ಸಂಧ್ಯಾವಂದನ ವಿಧಿ',
      category: 'Traditional Rituals',
      sortOrder: 5,
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1610088441520-4352457e7095?auto=format&fit=crop&w=1200&q=80',
      captionEnglish: 'Ayushya & Mrityunjaya Homam for health and prosperity',
      captionKannada: 'ಆಯುಷ್ಯ ಹಾಗೂ ಮೃತ್ಯುಂಜಯ ಹೋಮ',
      category: 'Homam',
      sortOrder: 6,
    },
  ];

  for (const img of galleryData) {
    const existing = await prisma.galleryImage.findFirst({
      where: { captionEnglish: img.captionEnglish },
    });
    if (!existing) {
      await prisma.galleryImage.create({ data: img });
    }
  }

  console.log(`Gallery images seeded: ${galleryData.length}`);

  // 5. System Settings (Purohit contact info)
  const settings = [
    {
      key: 'purohit_name',
      value: 'Shree Prashanth Bhat',
    },
    {
      key: 'purohit_name_kannada',
      value: 'ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್',
    },
    {
      key: 'purohit_phone',
      value: '9242359692',
    },
    {
      key: 'purohit_address',
      value: '#42, 5th Cross, Kempe Gowda Layout, N. Nagennahalli, R.K. Hegde Nagar, Bangalore North, Karnataka - 560077',
    },
    {
      key: 'purohit_address_kannada',
      value: '#೪೨, ೫ನೇ ಕ್ರಾಸ್, ಕೆಂಪೇಗೌಡ ಲೇಔಟ್, ಎನ್. ನಾಗೇನಹಳ್ಳಿ, ಆರ್.ಕೆ. ಹೆಗಡೆ ನಗರ, ಬೆಂಗಳೂರು ಉತ್ತರ, ಕರ್ನಾಟಕ - ೫೬೦೦೭೭',
    },
    {
      key: 'google_maps_url',
      value: 'https://maps.google.com/?q=N.+Nagennahalli,+R.K.+Hegde+Nagar,+Bangalore+560077',
    },
  ];

  for (const s of settings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

