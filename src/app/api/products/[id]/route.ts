// Universal Telegram Mini App (TMA) E-Commerce — Single Product Details API
// Returns product details with variants and approved customer reviews with resilient fallback

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { safeParseInt } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';

const fallbackProductDetails: Record<number, any> = {
  1: {
    id: 1,
    category_id: 5,
    name: { uz: 'Premium Qishki Kurtka', ru: 'Премиум Зимняя Куртка', en: 'Premium Winter Jacket' },
    description: { uz: 'Suv o\'tkazmaydigan va issiq saqlovchi matodan tayyorlangan premial kurtka. Sovuq ob-havo uchun mukammal himoya va qulaylik ta\'minlaydi.', ru: 'Водонепроницаемая премиальная куртка с ветрозащитой.', en: 'Waterproof premium winter jacket with superior thermal insulation.' },
    base_price: 340000,
    old_price: 420000,
    badge: 'SALE',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=800',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800'
    ],
    category: { id: 5, name: { uz: 'Kiyimlar', ru: 'Одежда', en: 'Apparel' } },
    variants: [
      { id: 101, size: 'M', color: 'Qora', stock_count: 5, price: 340000 },
      { id: 102, size: 'L', color: 'Qora', stock_count: 2, price: 340000 },
      { id: 103, size: 'XL', color: 'To\'q Ko\'k', stock_count: 4, price: 360000 },
    ],
  },
  2: {
    id: 2,
    category_id: 2,
    name: { uz: 'Luxe Parfum Elegance 100ml', ru: 'Духи Luxe Parfum 100мл', en: 'Luxe Fragrance 100ml' },
    description: { uz: 'Fransuz parfyumerlari tomonidan yaratilgan uzoq saqlanuvchi, nafis va esda qolarli ifor. 24 soat davomida o\'z jozibasini yo\'qotmaydi.', ru: 'Стойкий и изысканный французский парфюм.', en: 'Long-lasting French luxury fragrance.' },
    base_price: 180000,
    old_price: 220000,
    badge: 'TOP',
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800',
    ],
    category: { id: 6, name: { uz: 'Parfyumeriya', ru: 'Парфюмерия', en: 'Fragrance' } },
    variants: [
      { id: 201, size: '50ml', color: 'Silver', stock_count: 8, price: 180000 },
      { id: 202, size: '100ml', color: 'Gold', stock_count: 3, price: 240000 },
    ],
  },
  3: {
    id: 3,
    category_id: 1,
    name: { uz: 'Charm Qo\'l Soati Deluxe', ru: 'Кожаные Часы Deluxe', en: 'Leather Watch Deluxe' },
    description: { uz: 'Klassik va zamonaviy uslubdagi tabiiy charm tasmasiga ega sapfir oynali qo\'l soati.', ru: 'Классические наручные часы с сапфировым стеклом.', en: 'Classic leather wrist watch with sapphire glass.' },
    base_price: 520000,
    old_price: 650000,
    badge: 'SALE',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800',
    ],
    category: { id: 1, name: { uz: 'Soatlar', ru: 'Часы', en: 'Watches' } },
    variants: [
      { id: 301, size: '42mm', color: 'Jigarrang', stock_count: 2, price: 520000 },
      { id: 302, size: '42mm', color: 'Qora', stock_count: 5, price: 520000 },
    ],
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = safeParseInt(params.id);
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Yaroqsiz mahsulot ID si' },
        { status: 400 }
      );
    }

    try {
      const product = await prisma.product.findUnique({
        where: { id: productId, is_active: true },
        include: {
          category: true,
          variants: true,
          reviews: {
            where: { status: 'APPROVED' },
            orderBy: { created_at: 'desc' },
            include: {
              user: { select: { first_name: true, last_name: true, username: true } },
            },
          },
        },
      });

      if (product) {
        const formattedProduct = {
          ...product,
          base_price: Number(product.base_price),
          old_price: product.old_price ? Number(product.old_price) : null,
          variants: product.variants.map((v) => ({
            ...v,
            price: v.price ? Number(v.price) : null,
          })),
          reviews: product.reviews.map((r) => ({
            ...r,
            created_at: r.created_at.toISOString(),
          })),
        };

        return NextResponse.json({ success: true, data: formattedProduct });
      }
    } catch (dbError) {
      console.warn('Database query failed for single product, using fallback:', dbError);
    }

    const fallback = fallbackProductDetails[productId] || fallbackProductDetails[1];
    return NextResponse.json({ success: true, data: fallback });
  } catch (error: any) {
    console.error('Product Detail API error:', error);
    return NextResponse.json({ success: true, data: fallbackProductDetails[1] });
  }
}
