// Universal Telegram Mini App (TMA) E-Commerce — Database Seed Script
// Populates initial Store Settings, Demo Categories, Products with SKU Variants, Promocodes, and Admin User

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Database Seeding...');

  // 1. Initial Store Settings
  const storeSetting = await prisma.storeSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      store_name: { uz: 'Premium Cosmetics Store', ru: 'Премиум Косметика', en: 'Premium Cosmetics' },
      delivery_fee: 15000,
      free_delivery_threshold: 300000,
      terms_url: 'https://mydomain.com/terms',
    },
  });
  console.log('✅ Store Settings created:', storeSetting.id);

  // 2. Initial Categories
  const category1 = await prisma.category.upsert({
    where: { slug: 'terini-parvarish-qilish' },
    update: {},
    create: {
      name: { uz: 'Terini Parvarish Qilish', ru: 'Уход за кожей', en: 'Skin Care' },
      slug: 'terini-parvarish-qilish',
      is_active: true,
    },
  });

  const category2 = await prisma.category.upsert({
    where: { slug: 'parfyumeriya' },
    update: {},
    create: {
      name: { uz: 'Parfyumeriya', ru: 'Парфюмерия', en: 'Perfumes' },
      slug: 'parfyumeriya',
      is_active: true,
    },
  });

  console.log('✅ Categories created:', category1.slug, category2.slug);

  // 3. Initial Products & SKU Variants
  const product1 = await prisma.product.create({
    data: {
      category_id: category1.id,
      name: { uz: 'Gidratatsiyalovchi Yuz Kremi', ru: 'Увлажняющий крем для лица', en: 'Hydrating Face Cream' },
      description: {
        uz: 'Tabiiy moddalar va hialuron kislotasi bilan boyitilgan yuqori sifatli yuz kremi.',
        ru: 'Высококачественный крем для лица с гиалуроновой кислотой.',
        en: 'High quality face cream enriched with hyaluronic acid.',
      },
      base_price: 180000,
      old_price: 220000,
      badge: 'TOP',
      images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500'],
      is_active: true,
      variants: {
        create: [
          { sku: 'CREAM-50ML', size: '50ml', stock_count: 25, price: 180000 },
          { sku: 'CREAM-100ML', size: '100ml', stock_count: 15, price: 290000 },
        ],
      },
    },
  });

  const product2 = await prisma.product.create({
    data: {
      category_id: category2.id,
      name: { uz: 'French Rose Parfyumi', ru: 'Парфюм Французская Роза', en: 'French Rose Perfume' },
      description: {
        uz: 'Fransiya atirgulining nafis va uzoq saqlanuvchi ifori.',
        ru: 'Утонченный аромат французской розы.',
        en: 'Exquisite and long-lasting scent of French rose.',
      },
      base_price: 450000,
      old_price: 520000,
      badge: 'NEW',
      images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500'],
      is_active: true,
      variants: {
        create: [
          { sku: 'PERFUME-100ML', size: '100ml', stock_count: 10, price: 450000 },
        ],
      },
    },
  });

  console.log('✅ Products created:', product1.id, product2.id);

  // 4. Initial Promocodes
  const promo = await prisma.promocode.upsert({
    where: { code: 'PROMO2026' },
    update: {},
    create: {
      code: 'PROMO2026',
      discount_type: 'PERCENT',
      discount_value: 10,
      min_order_amount: 100000,
      max_uses: 100,
      is_active: true,
    },
  });
  console.log('✅ Promocode created:', promo.code);

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
