// Universal Telegram Mini App (TMA) E-Commerce — Admin Products & Categories CRUD API
// Supports Multilingual JSONB (UZ, RU, EN), SKU Product Variants, Badges, and GIN Index Updating

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sanitizeInput, safeParseInt, safeParseFloat } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id') ? safeParseInt(searchParams.get('category_id')) : undefined;

    const where: any = {};
    if (categoryId && categoryId > 0) {
      where.category_id = categoryId;
    }

    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { created_at: 'desc' },
        include: {
          category: true,
          variants: true,
        },
      }),
      prisma.category.findMany({
        orderBy: { id: 'asc' },
      }),
    ]);

    const formattedProducts = products.map((p) => ({
      ...p,
      base_price: Number(p.base_price),
      old_price: p.old_price ? Number(p.old_price) : null,
      variants: p.variants.map((v) => ({
        ...v,
        price: v.price ? Number(v.price) : null,
      })),
    }));

    return NextResponse.json({
      success: true,
      data: {
        products: formattedProducts,
        categories,
      },
    });
  } catch (error: any) {
    console.error('Admin Products GET Error:', error);
    return NextResponse.json({ success: false, error: 'Server ichki xatosi' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const name = {
      uz: sanitizeInput(body.name?.uz),
      ru: sanitizeInput(body.name?.ru),
      en: sanitizeInput(body.name?.en),
    };
    const description = {
      uz: sanitizeInput(body.description?.uz),
      ru: sanitizeInput(body.description?.ru),
      en: sanitizeInput(body.description?.en),
    };

    const category_id = safeParseInt(body.category_id);
    const base_price = safeParseFloat(body.base_price);
    const old_price = body.old_price ? safeParseFloat(body.old_price) : null;
    const badge = body.badge ? sanitizeInput(body.badge) : 'NEW';
    const is_active = body.is_active !== false;
    const images = Array.isArray(body.images) ? body.images.map((img: string) => sanitizeInput(img)) : [];
    const variants = Array.isArray(body.variants) ? body.variants : [];

    if (!name.uz || !category_id || base_price <= 0) {
      return NextResponse.json(
        { success: false, error: 'Mahsulot nomi (UZ), kategoriya va narx majburiy' },
        { status: 400 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        category_id,
        name,
        description,
        base_price,
        old_price,
        badge: badge as any,
        is_active,
        images,
        variants: {
          create: variants.map((v: any) => ({
            sku: sanitizeInput(v.sku) || `SKU_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            size: v.size ? sanitizeInput(v.size) : null,
            color: v.color ? sanitizeInput(v.color) : null,
            stock_count: Math.max(0, safeParseInt(v.stock_count, 0)),
            price: v.price ? safeParseFloat(v.price) : null,
          })),
        },
      },
      include: { variants: true, category: true },
    });

    return NextResponse.json({ success: true, data: newProduct });
  } catch (error: any) {
    console.error('Admin Products POST Error:', error);
    return NextResponse.json({ success: false, error: 'Mahsulot yaratishda xatolik' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const id = safeParseInt(body.id);

    if (!id) {
      return NextResponse.json({ success: false, error: 'Mahsulot ID si majburiy' }, { status: 400 });
    }

    const name = {
      uz: sanitizeInput(body.name?.uz),
      ru: sanitizeInput(body.name?.ru),
      en: sanitizeInput(body.name?.en),
    };
    const description = {
      uz: sanitizeInput(body.description?.uz),
      ru: sanitizeInput(body.description?.ru),
      en: sanitizeInput(body.description?.en),
    };

    const category_id = safeParseInt(body.category_id);
    const base_price = safeParseFloat(body.base_price);
    const old_price = body.old_price ? safeParseFloat(body.old_price) : null;
    const badge = body.badge ? sanitizeInput(body.badge) : 'NEW';
    const is_active = body.is_active !== false;
    const images = Array.isArray(body.images) ? body.images.map((img: string) => sanitizeInput(img)) : [];

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        category_id,
        name,
        description,
        base_price,
        old_price,
        badge: badge as any,
        is_active,
        images,
      },
      include: { variants: true, category: true },
    });

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error: any) {
    console.error('Admin Products PUT Error:', error);
    return NextResponse.json({ success: false, error: 'Mahsulot yangilashda xatolik' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = safeParseInt(searchParams.get('id'));

    if (!id) {
      return NextResponse.json({ success: false, error: 'Mahsulot ID si majburiy' }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Mahsulot o\'chirildi' });
  } catch (error: any) {
    console.error('Admin Products DELETE Error:', error);
    return NextResponse.json({ success: false, error: 'Mahsulot o\'chirishda xatolik' }, { status: 500 });
  }
}
