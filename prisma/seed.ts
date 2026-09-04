import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database with Mock Data...');

  // 1. Clear existing data
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.banner.deleteMany();

  console.log('Cleared existing data.');

  // 2. Create Categories
  const catElectronics = await prisma.category.create({
    data: {
      name: { uz: 'Elektronika', ru: 'Электроника', en: 'Electronics' },
      slug: 'electronics',
      image_url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200',
    }
  });

  const catClothes = await prisma.category.create({
    data: {
      name: { uz: 'Kiyimlar', ru: 'Одежда', en: 'Clothes' },
      slug: 'clothes',
      image_url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=200',
    }
  });

  const catAccessories = await prisma.category.create({
    data: {
      name: { uz: 'Aksessuarlar', ru: 'Аксессуары', en: 'Accessories' },
      slug: 'accessories',
      image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200',
    }
  });

  console.log('Categories created.');

  // 3. Create Products
  const prod1 = await prisma.product.create({
    data: {
      category_id: catElectronics.id,
      name: { uz: 'iPhone 15 Pro Max', ru: 'iPhone 15 Pro Max', en: 'iPhone 15 Pro Max' },
      description: { uz: 'Yangi avlod', ru: 'Новое поколение', en: 'Next gen' },
      base_price: 15000000,
      badge: 'TOP',
      images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500'],
      variants: {
        create: [
          { size: '256GB', color: 'Natural Titanium', price: 15000000, stock_count: 50 },
          { size: '512GB', color: 'Blue Titanium', price: 17000000, stock_count: 20 },
        ]
      }
    }
  });

  const prod2 = await prisma.product.create({
    data: {
      category_id: catElectronics.id,
      name: { uz: 'AirPods Pro 2', ru: 'AirPods Pro 2', en: 'AirPods Pro 2' },
      description: { uz: 'Faol shovqinni pasaytirish', ru: 'Активное шумоподавление', en: 'Active noise cancellation' },
      base_price: 3200000,
      old_price: 3500000,
      badge: 'SALE',
      images: ['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500'],
      variants: {
        create: [
          { size: 'Standard', color: 'White', price: 3200000, stock_count: 100 },
        ]
      }
    }
  });

  const prod3 = await prisma.product.create({
    data: {
      category_id: catClothes.id,
      name: { uz: 'Premium Hoodie', ru: 'Премиум Худи', en: 'Premium Hoodie' },
      description: { uz: '100% paxta', ru: '100% хлопок', en: '100% cotton' },
      base_price: 450000,
      badge: 'NEW',
      images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500'],
      variants: {
        create: [
          { size: 'M', color: 'Black', price: 450000, stock_count: 10 },
          { size: 'L', color: 'Black', price: 450000, stock_count: 5 },
          { size: 'XL', color: 'Grey', price: 450000, stock_count: 0 },
        ]
      }
    }
  });

  console.log('Products created.');

  // 4. Create Banners
  await prisma.banner.create({
    data: {
      title: { uz: 'Bahorgi Chegirmalar', ru: 'Весенние скидки', en: 'Spring Sale' },
      image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
      sort_order: 1
    }
  });

  await prisma.banner.create({
    data: {
      title: { uz: 'Yangi To\'plam 2026', ru: 'Новая коллекция 2026', en: 'New Collection 2026' },
      image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
      sort_order: 2
    }
  });

  console.log('Banners created.');
  console.log('✅ DB Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
